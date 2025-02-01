import io
import os
from pyexpat import model
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import pytesseract
import json
from PIL import Image
from PIL import ImageOps
import google.generativeai as genai
from flask import send_file

app = Flask(__name__)
CORS(app)
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

# Configure the Generative AI API
genai.configure(api_key="AIzaSyBiJTlyJhXWSlLR9dPQ-IBkKB1yuUUOVy0")
model = genai.GenerativeModel("gemini-1.5-flash")

# MySQL Configuration
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="krishna666",
        database="rubix"
    )
except mysql.connector.Error as err:
    print(f"Error: {err}")
    exit(1)


cursor = db.cursor()

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/insert', methods=['POST'])
def insert_data():
    data = request.json
    name = data['name']
    email = data['email']
    mobile = data['mobile']
    location = data['location']

    try:
        query = "INSERT INTO info (name, email, mobile, location) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, email, mobile, location))
        db.commit()
        cursor.close()
        return jsonify({'message': 'Data inserted successfully'}), 200
    except Exception as e:
        print(f"Error inserting data: {e}")
        return jsonify({'error': str(e)}), 500

COLUMN_MAPPINGS = {
    'name': ['name', 'full name', 'employee name', 'candidate name'],
    'email': ['email', 'email address', 'contact email'],
    'location': ['location', 'city', 'place'],
    'mobile': ['mobile', 'phone', 'contact number', 'mobile number']
}

def standardize_columns(df):
    """
    Map column names in the DataFrame to standard column names.
    """
    column_mapping = {}
    for standard_col, possible_names in COLUMN_MAPPINGS.items():
        for possible_name in possible_names:
            for col in df.columns:
                if col.strip().lower() == possible_name.lower():
                    column_mapping[col] = standard_col
                    break  # Stop searching if a match is found
    
    # Rename columns using the mapping
    df.rename(columns=column_mapping, inplace=True)
    return df


@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            if filename.endswith('.csv'):
                # Process CSV file
                data = pd.read_csv(file_path)
            elif filename.endswith('.xlsx'):
                # Process Excel file
                data = pd.read_excel(file_path)
                print(data)

            # Standardize column names
            data = standardize_columns(data)
            # Insert data into the database
            for _, row in data.iterrows():
                name = row.get('name') if pd.notna(row.get('name')) else "name not found"
                email = row.get('email') if pd.notna(row.get('email')) else "email not found"
                mobile = row.get('mobile') if pd.notna(row.get('mobile')) else "NA"
                location = row.get('location') if pd.notna(row.get('location')) else "location not found"

                # Ensure all fields are present
                #if not all([name, email, mobile, location]):
                   # continue
                query = """
                INSERT INTO info (name, email, mobile, location) 
                VALUES (%s, %s, %s, %s)
                """
                cursor.execute(query, (name, email, mobile, location))
                db.commit()

            os.remove(file_path)  # Clean up the temporary file
            return jsonify({'message': 'Data successfully inserted'}), 200

        except Exception as e:
            print(f"Error inserting data: {e}")
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file type'}), 400

def extract_text_from_image(file):
    image = Image.open(file)
    gray_image = ImageOps.grayscale(image)
    return pytesseract.image_to_string(gray_image)

# Function to insert extracted data into the database
def insert_into_db(data):
    print("data", data)
    try:
        # Insert query
        cursor = db.cursor()
        insert_query = """
        INSERT INTO info (name, email, mobile, location)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (data["name"], data["email"], data["mobile"], data["location"]))

        # Commit changes
        db.commit()
        cursor.close()
    except Exception as e:
        print(f"Error inserting data: {e}")
        raise Exception(f"Database error: {str(e)}")

@app.route('/view', methods=['GET'])
def view_data():
    try:
        query = "SELECT * FROM info"
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        return jsonify(data), 200
    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['GET'])
def download_data():
    try:
        query = "SELECT * FROM info"
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(rows, columns=columns)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Info')
        output.seek(0)
        return send_file(output, download_name='info.xlsx', as_attachment=True)
    except Exception as e:
        print(f"Error downloading data: {e}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_data(id):
    try:
        query = "DELETE FROM info WHERE id = %s"
        cursor.execute(query, (id,))
        db.commit()
        return jsonify({'message': 'Record deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/uploadimage', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if file:
            # Process the image file
            text = extract_text_from_image(file)

            # Prepare prompt for Gemini API
            prompt = (
                "Extract details like name, email, phone, and location from the following text. without additional text. provide output as list of dictonaries"
                f"Text: {text}"
            )
            
            response = model.generate_content(prompt)
            raw_response = response.text.strip()  # Get raw response text
            #print("raw " ,raw_response)
            data=[raw_response]
            df = pd.DataFrame(data)
            json_output = df.to_json(orient="records", indent=4)
            parsed_data = json.loads(json_output)
            inner_json_str = parsed_data[0]["0"]
            cleaned_json_str = inner_json_str.replace("```json\n", "").replace("\n```", "").replace("'", '"')

            # Convert it into valid JSON
            final_json = json.loads(cleaned_json_str)
            print(final_json)
            for record in final_json:
                name = record.get("name")
                email = record.get("email")
                phone = record.get("phone")
                location = record.get("location")
                data = {
                    "name": name,
                    "email": email,
                    "mobile": phone,
                    "location": location
                }
                insert_into_db(data)
            '''try:
                # Parse the response as JSON
                start_index=raw_response.find("{")
                end_index=raw_response.rfind("}")
                json_response=raw_response[start_index:end_index+1]
                json_output = json.loads(json_response)
            except json.JSONDecodeError:
                print("Raw response:", raw_response)
                print(f"Error inserting data: {e}")
                return jsonify({"error": "Failed to parse API response", "raw_response": raw_response}), 500

            # Insert the extracted data into the database
            if 'names' in json_output and 'emails' in json_output and 'phones' in json_output and 'locations' in json_output:
                names = json_output['names']
                emails = json_output['emails']
                phones = json_output['phones']
                locations = json_output['locations']
    
                for i in range(len(names)):
                    data = {
                        "name": names[i] if i < len(names) else None,
                        "email": emails[i] if i < len(emails) else None,
                        "mobile": phones[i] if i < len(phones) else None,
                        "location": locations[i] if i < len(locations) else None
                    }
                    insert_into_db(data)
            else:
                    # Handle the case where the response is in the original format
                if 'contacts' in json_output:
                    contacts = json_output['contacts']
                    for contact in contacts:
                        data = {
                            "name": contact.get("name", None),
                            "email": contact.get("email", None),
                            "mobile": contact.get("phone", None),
                            "location": contact.get("location", None)
                        }
                        insert_into_db(data)
                else:
                    for name, details in json_output.items():
                        data = {
                            "name": name,
                            "email": details.get("email", None),
                            "mobile": details.get("phone", None),
                            "location": details.get("location", None)
                        }
                        insert_into_db(data)'''

            return jsonify({"message": "Data processed and inserted into database"}), 200
    except Exception as e:
        print(f"Error inserting data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

