// Handle Google Login
function handleCredentialResponse(response) {
    console.log("User logged in:", response);
    // You can send this response to MongoDB and handle user authentication.
}

// Access camera and stream video
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.getElementById('video');
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Camera access error:", error);
    });

document.getElementById('snap').addEventListener('click', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

document.getElementById('process-camera').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    processImage(canvas.toDataURL());
});

document.getElementById('process-upload').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileDataURL = event.target.result;
            processImage(fileDataURL);
        };
        reader.readAsDataURL(file);
    }
});

function processImage(dataURL) {
    Tesseract.recognize(
        dataURL,
        'eng',
        {
            logger: info => console.log(info)
        }
    ).then(({ data: { text } }) => {
        document.getElementById('text-preview').value = text;
        document.getElementById('confirm-edit').addEventListener('click', () => {
            const userEditedText = document.getElementById('text-preview').value;
            const maskedText = detectAndMaskPII(userEditedText);
            generateDownloadableFiles(maskedText);
        });
    });
}

// PII detection and masking function
function detectAndMaskPII(text) {
    const aadhaar_pattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    const pan_pattern = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/;
    const email_pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
    const phone_pattern = /\b\d{10}\b/;

    text = mask_entity(text, aadhaar_pattern);
    text = mask_entity(text, pan_pattern);
    text = mask_entity(text, email_pattern, 6);
    text = mask_entity(text, phone_pattern);

    return text;
}

function mask_entity(text, pattern, mask_length = 4, mask_char = '*') {
    return text.replace(pattern, match => match.slice(0, -mask_length) + mask_char.repeat(mask_length));
}

// Generate and download files in different formats
function generateDownloadableFiles(text) {
    const generatePDF = document.getElementById('format-pdf').checked;
    const generateDOC = document.getElementById('format-doc').checked;
    const generateHTML = document.getElementById('format-html').checked;

    if (generatePDF) generatePDFFile(text);
    if (generateDOC) generateDOCFile(text);
    if (generateHTML) generateHTMLFile(text);
}

// Generate PDF File
function generatePDFFile(text) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save('document.pdf');
}

// Generate DOC File
function generateDOCFile(text) {
    const blob = new Blob([text], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.doc';
    link.click();
}

// Generate HTML File
function generateHTMLFile(text) {
    const htmlBlob = new Blob([`<pre>${text}</pre>`], { type: 'text/html' });
    const htmlLink = document.createElement('a');
    htmlLink.href = URL.createObjectURL(htmlBlob);
    htmlLink.download = 'document.html';
    htmlLink.click();
}

