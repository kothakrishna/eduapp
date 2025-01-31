import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import random
import string
import mysql.connector
import ollama
import pyttsx3


app = Flask(__name__)
CORS(app)

# Configure Flask-Mail
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "krishnavamsikotha28@gmail.com"
app.config["MAIL_PASSWORD"] = "hvgl gark uhuw sorm"
mail = Mail(app)

# Configure MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="krishna666",
    database="rubix"
)

cursor = db.cursor()


@app.route("/create_account", methods=["POST"])
def create_account():
    data = request.json
    parent_first_name = data["parentFirstName"]
    parent_last_name = data["parentLastName"]
    email = data["email"]
    phone = data["phone"]
    student_name = data["studentName"]
    student_class = data["studentClass"]
    school_name = data["schoolName"]

    # Generate usernames
    cursor.execute("SELECT COUNT(*) FROM users WHERE role='parent'")
    parent_count = cursor.fetchone()[0]
    parent_username = f"Parubix{parent_count + 1:04}"

    cursor.execute("SELECT COUNT(*) FROM users WHERE role='student'")
    student_count = cursor.fetchone()[0]
    student_username = f"Strubix{student_count + 1:05}"

    # Generate random password
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=9))

    # Insert parent and student into the database
    cursor.execute(
        "INSERT INTO users (username, password, name, email, phone, role) VALUES (%s, %s, %s, %s, %s, 'parent')",
        (parent_username, password, f"{parent_first_name} {parent_last_name}", email, phone)
    )
    parent_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO users (username, password, name, role, parent_id, class, school) VALUES (%s, %s, %s, 'student', %s, %s, %s)",
        (student_username, password, student_name, parent_id, student_class, school_name)
    )
    db.commit()

    # Send email with credentials
    message = Message("Your Account Credentials", sender="your_email@gmail.com", recipients=[email])
    message.body = f"""
    Parent Username: {parent_username}
    Student Username: {student_username}
    Password: {password}
    """
    mail.send(message)

    return jsonify({"success": True, "message": "Account created successfully."})

@app.route("/login", methods=["POST"])
def login():
    data = request.json  # Parse incoming JSON payload
    username = data.get("username")  # Get 'username' field from JSON
    password = data.get("password")  # Get 'password' field from JSON

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required."})

    # Authenticate the user using username and password
    cursor.execute(
        "SELECT id, name, role, parent_id FROM users WHERE username=%s AND password=%s",
        (username, password)
    )
    user = cursor.fetchone()

    if not user:
        return jsonify({"success": False, "message": "Invalid username or password."})

    user_id, user_name, role, parent_id = user

    # Fetch related user based on role
    if role == "parent":
        cursor.execute("SELECT name FROM users WHERE parent_id=%s", (user_id,))
        child = cursor.fetchone()
        related_user = child[0] if child else "No child linked"
    elif role == "student":
        cursor.execute("SELECT name FROM users WHERE id=%s", (parent_id,))
        parent = cursor.fetchone()
        related_user = parent[0] if parent else "No parent linked"
    else:
        related_user = "N/A"

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "role": role,
        "user_name": user_name,
        "related_user": related_user
    })

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.json.get('content', '')
        response = ollama.chat(model='gemma2:2b', messages=[{'role': 'user', 'content': user_input}])
        message_content = response['message']['content']
        sanitized_message = ''.join(c for c in message_content if c.isalnum() or c.isspace())

        engine = pyttsx3.init()
        audio_stream = io.BytesIO()
        engine.save_to_file(sanitized_message, "temp.wav")
        engine.runAndWait()

        with open("temp.wav", "rb") as audio_file:
            audio_data = audio_file.read()

        audio_b64 = base64.b64encode(audio_data).decode('utf-8')

        # Insert chat into the studentchat table
        cursor.execute(
            "INSERT INTO studentchat (user_input, llama_response) VALUES (%s, %s)",
            (user_input, message_content)
        )
        db.commit()

        return jsonify({"message": message_content, "audio": audio_b64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
