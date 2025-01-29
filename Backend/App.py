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

import nltk
nltk.download('punkt_tab')
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
import textwrap
from nltk.tokenize import sent_tokenize
import PyPDF2
import numpy as np



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

class ImprovedPDFRAGSystem:
    def __init__(self, pdf_path, chunk_size=8, chunk_overlap=4):
        """
        Initialize the RAG system with a PDF document

        Args:
            pdf_path (str): Path to the PDF file
            chunk_size (int): Number of sentences per chunk
            chunk_overlap (int): Number of sentences to overlap between chunks
        """
        self.pdf_path = pdf_path
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        # Initialize models
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.qa_model = pipeline(
            'question-answering',
            model='distilbert-base-cased-distilled-squad',
            device=-1,
            handle_long_input=True
        )

        # Load and process the PDF
        self.chunks = self._process_pdf()
        self.chunk_embeddings = self._generate_embeddings()

    def _clean_text(self, text):
        """Clean the extracted text"""
        text = " ".join(text.split())
        text = text.replace("  ", " ")
        text = text.replace(" .", ".")
        text = text.replace(" ,", ",")
        text = text.replace(" !", "!")
        text = text.replace(" ?", "?")
        return text

    def _process_pdf(self):
        """Extract text from PDF and split into overlapping chunks by sentences"""
        reader = PyPDF2.PdfReader(self.pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + " "

        text = self._clean_text(text)
        sentences = sent_tokenize(text)

        chunks = []
        for i in range(0, len(sentences), self.chunk_size - self.chunk_overlap):
            chunk = sentences[i:i + self.chunk_size]
            if chunk:
                chunk_text = " ".join(chunk).strip()
                chunks.append(chunk_text)

        return chunks

    def _generate_embeddings(self):
        """Generate embeddings for all chunks"""
        return self.embedding_model.encode(self.chunks)

    def _get_relevant_chunks(self, query, top_k=3):
        """Find the most relevant chunks for a given query"""
        if any(word in query.lower() for word in ['contrast', 'difference', 'compare', 'versus', 'vs']):
            terms = query.lower().split('between')[-1].split('and')
            if len(terms) >= 2:
                query_embedding1 = self.embedding_model.encode([terms[0]])[0]
                query_embedding2 = self.embedding_model.encode([terms[1]])[0]
                query_embedding = (query_embedding1 + query_embedding2) / 2
            else:
                query_embedding = self.embedding_model.encode([query])[0]
        else:
            query_embedding = self.embedding_model.encode([query])[0]

        similarities = cosine_similarity([query_embedding], self.chunk_embeddings)[0]

        top_indices = np.argsort(similarities)[-top_k:][::-1]
        top_similarities = similarities[top_indices]

        threshold = 0.25
        filtered_chunks = []

        for idx, sim in zip(top_indices, top_similarities):
            if sim >= threshold:
                filtered_chunks.append(self.chunks[idx])

        return filtered_chunks

    def answer_question(self, query):
        """Answer a question using the RAG system"""
        relevant_chunks = self._get_relevant_chunks(query)

        if not relevant_chunks:
            return {
                'answer': "I couldn't find relevant information to answer this question.",
                'confidence': 0.0,
                'context': "No relevant context found."
            }

        context = " ".join(relevant_chunks)

        if any(word in query.lower() for word in ['contrast', 'difference', 'compare', 'versus', 'vs']):
            try:
                response = self.qa_model(
                    question=query,
                    context=context,
                    max_answer_len=150,
                    handle_impossible_answer=True
                )
            except Exception as e:
                print(f"Error in QA model: {e}")
                response = {'answer': "Error processing the question", 'score': 0.0}
        else:
            response = self.qa_model(
                question=query,
                context=context,
                max_answer_len=100,
                handle_impossible_answer=True
            )

        return {
            'answer': response['answer'],
            'confidence': response['score'],
            'context': textwrap.fill(context, width=100)
        }

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
    
@app.route('/answer', methods=['POST'])
def answer_endpoint():
    """Endpoint to answer questions"""
    try:
        data = request.json
        question = data.get('question', '')
        pdf_path = data.get('pdf_path', 'ghost-riders-byrnes-obooko.pdf')

        if not question:
            return jsonify({'error': 'No question provided'}), 400

        rag_system = ImprovedPDFRAGSystem(pdf_path)
        result = rag_system.answer_question(question)
        print(f"Answer: {result['answer']}")
        print(f"Confidence: {result['confidence']:.2f}")
        print(f"Context: {result['context']}")

        #return jsonify(result)
        return result['context']
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
