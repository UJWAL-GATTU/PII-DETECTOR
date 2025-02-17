from flask import Flask, request, jsonify
import spacy
import re

app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# PII Detection function (Aadhaar, PAN, Email, Phone, etc.)
def detect_pii(text):
    aadhaar_pattern = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
    pan_pattern = re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b')
    email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
    phone_pattern = re.compile(r'\b\d{10}\b')

    doc = nlp(text)
    pii_entities = []

    # Detect general entities like PERSON, ORG, etc.
    for ent in doc.ents:
        if ent.label_ in ("PERSON", "ORG", "GPE", "LOC"):
            pii_entities.append(ent.text)

    # Detect Aadhaar, PAN, email, phone
    pii_entities += aadhaar_pattern.findall(text)
    pii_entities += pan_pattern.findall(text)
    pii_entities += email_pattern.findall(text)
    pii_entities += phone_pattern.findall(text)

    return pii_entities

# Route to handle PII detection
@app.route('/detect_pii', methods=['POST'])
def detect_pii_route():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Detect PII in the text
    pii_entities = detect_pii(text)
    
    return jsonify({"pii_entities": pii_entities})

if __name__ == '__main__':
    app.run(debug=True)

