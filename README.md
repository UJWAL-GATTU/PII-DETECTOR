# PII-DETECTOR

# 📌 PII Detection Web Application

The **PII Detection Web Application** is a privacy-focused tool designed to detect, mask, and manage **Personally Identifiable Information (PII)** in various document formats, including PDFs, Word documents, and images. It enables users to upload files, scan for PII, confirm or correct detections, and download the masked documents in different formats while ensuring data security and compliance.

---

## ✨ Features

### 🕵️‍♂️ **PII Detection**
- Automatically detects sensitive PII entities such as:
  - Names
  - Email addresses
  - Phone numbers
  - Government-issued IDs
  - Addresses
  - Credit card numbers
  - And more...
- Uses **AI/ML models, NLP, and regex-based techniques** for accurate detection.

### 🔒 **PII Masking**
- Redacts/masks detected PII to protect user data.
- Allows users to confirm and edit detected PII before masking.
- Provides an option to highlight false positives and correct unrecognized entities.

### 🖼️ **Document & Image Processing**
- Supports **text-based documents** (`.pdf`, `.docx`, `.txt`).
- Processes **image-based documents** (`.jpg`, `.png`) via OCR (Optical Character Recognition).

### 📝 **Document Preview & Editing**
- Provides a **real-time preview** of detected PII.
- Enables users to **approve or modify** detected entities before finalizing the masked document.

### 📂 **Download & Export Options**
- Users can download the processed document in **multiple formats**:
  - PDF
  - DOCX
  - HTML
  - TXT (if applicable)

### 🔐 **User Authentication (Optional)**
- Google OAuth integration for secure user authentication.
- Allows users to access their uploaded and processed files securely.

### 📊 **High-Quality UI/UX**
- **Modern and professional UI** with an intuitive layout.
- **Seamless user experience**, ensuring easy navigation and interaction.

---

## 🚀 Technologies Used

### 🌐 **Frontend**
- **React.js** (UI Framework)
- **JavaScript, HTML, CSS** (Bootstrap/Tailwind for styling)
- **Axios** (API integration for backend communication)

### ⚙️ **Backend**
- **Python (Flask/Django)** for handling requests and PII processing.
- **FastAPI (Optional)** for efficient API development.
- **Node.js/Express** (if using a JavaScript-based backend).

### 🛢 **Database (Optional)**
- **MongoDB** (for storing user data, uploaded files, and processing history).
- **PostgreSQL/MySQL** (if required for structured data storage).

### 🏗 **PII Detection & Processing**
- **spaCy, NLTK, RegEx** (for text-based PII detection).
- **TensorFlow/PyTorch (optional)** for ML-based entity recognition.
- **Tesseract OCR** (for extracting text from images).
- **pdfplumber, python-docx** (for PDF and Word document processing).

---

### Note : As this is my SIH project i haven't included the requirements file so male sure you download everything needed so that everything can run smoothly .

### The file with ppppp.html is the main file for the website in this website we will be having sections like Home,PII detected,Contact,etc As this project still needs many developments i assure that i will make necessary changes for my website and reshape it to it's best .
### To get Started click the START button and you can take a live photo or you can upload the document of which content you need to get maksed after uploading you will be given a text output file with important details getting masked in future i will develope this project where it can directly mask the content on the file itself .
### Note : Make sure you use a Camera of good quality while taking a real time photo as the regex patterns may throw errors for blurry images .

## 🛠 Installation & Setup

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/UJWAL-GATTU/PII-DETECTOR
cd PII-DETECTOR


