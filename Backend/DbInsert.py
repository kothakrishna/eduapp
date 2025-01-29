'''from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import csv
import os

app = Flask(__name__)
CORS(app)

# Configure MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="krishna666",
    database="rubix"
)

cursor = db.cursor()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# API: Insert data manually
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

# API: Handle CSV uploads
@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'File must be a CSV'}), 400

    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        with open(file_path, mode='r') as csvfile:
            csv_reader = csv.DictReader(csvfile)
            query = "INSERT INTO info (name, email, mobile, location) VALUES (%s, %s, %s, %s)"
            for row in csv_reader:
                cursor.execute(query, (row['name'], row['email'], row['mobile'], row['location']))
            db.commit()
            cursor.close()

        os.remove(file_path)  # Delete the file after processing
        return jsonify({'message': 'CSV data inserted successfully'}), 200
    except Exception as e:
        print(f"Error inserting data: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)'''

import os
from pyexpat import model
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import pytesseract
import json
from PIL import Image
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

# Configure the Generative AI API
genai.configure(api_key="AIzaSyBiJTlyJhXWSlLR9dPQ-IBkKB1yuUUOVy0")
model = genai.GenerativeModel("gemini-1.5-flash")

# MySQL Configuration
try:
    db = mysql.connector.connect(
        host="https://test-databae.c96euqy6qkbe.eu-north-1.rds.amazonaws.com",
        port=3306,
        user="admin",
        password="admin1234*",
        database="test-databae"
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

            # Insert data into the database
            for _, row in data.iterrows():
                name = row.get('name')
                email = row.get('email')
                mobile = row.get('mobile')
                location = row.get('location')

                # Ensure all fields are present
                if not all([name, email, mobile, location]):
                    continue
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
    return pytesseract.image_to_string(image)

# Function to insert extracted data into the database
def insert_into_db(data):
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
                "Extract details like name, email, phone, and location from the following text. "
                "Return the values in key-value format as JSON without additional text.in the response dont mention json"
                f"Text: {text}"
            )
            
            response = model.generate_content(prompt)
            raw_response = response.text.strip()  # Get raw response text

            try:
                # Parse the response as JSON
                start_index=raw_response.find("{")
                end_index=raw_response.rfind("}")
                json_response=raw_response[start_index:end_index+1]
                extracted_data = json.loads(json_response)
            except json.JSONDecodeError:
                print("Raw response:", raw_response)
                print(f"Error inserting data: {e}")
                return jsonify({"error": "Failed to parse API response", "raw_response": raw_response}), 500

            # Insert the extracted data into the database
            for name,details in extracted_data.items():
                data={
                    "name":name,
                    "email":details.get("email",""),
                    "mobile":details.get("phone",""),
                    "location":details.get("location","")
                }
                insert_into_db(data)
            return jsonify({"message": "Data processed and inserted into database"}), 200
    except Exception as e:
        print(f"Error inserting data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

