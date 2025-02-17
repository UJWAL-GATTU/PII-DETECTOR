// Handle Google Login
function handleCredentialResponse(response) {
    console.log("User logged in:", response);
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
    const imageData = canvas.toDataURL(); // Get image data as base64 encoded string

    // Ensure image is processed after capturing from the camera
    processImageFromCamera(imageData);
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

// Process image captured from the camera and check for PII
function processImageFromCamera(dataURL) {
    Tesseract.recognize(
        dataURL,
        'eng',
        {
            logger: info => console.log(info)
        }
    ).then(({ data: { text } }) => {
        document.getElementById('text-preview').value = text;

        // Detect PII after text recognition from camera
        const maskedResult = detectAndMaskPII(text);

        // If PII is detected from the camera image, show alert
        if (maskedResult.piiDetected) {
            alert('PII Detected !!!');
        }

        // Allow the user to edit the text and generate files
        document.getElementById('confirm-edit').addEventListener('click', () => {
            const userEditedText = document.getElementById('text-preview').value;
            const finalMaskedText = detectAndMaskPII(userEditedText).text;  // Apply masking again if needed

            generateDownloadableFiles(finalMaskedText);
        });
    }).catch(error => {
        console.error("Error processing camera image:", error);
    });
}

// Process image from file upload and check for PII
function processImage(dataURL) {
    Tesseract.recognize(
        dataURL,
        'eng',
        {
            logger: info => console.log(info)
        }
    ).then(({ data: { text } }) => {
        document.getElementById('text-preview').value = text;

        // Detect PII after text recognition from file
        const maskedResult = detectAndMaskPII(text);

        // If PII is detected from the uploaded file, show alert
        if (maskedResult.piiDetected) {
            alert('PII Detected !!!');
        }

        // Allow the user to edit the text and generate files
        document.getElementById('confirm-edit').addEventListener('click', () => {
            const userEditedText = document.getElementById('text-preview').value;
            const finalMaskedText = detectAndMaskPII(userEditedText).text;  // Apply masking again if needed

            generateDownloadableFiles(finalMaskedText);
        });
    }).catch(error => {
        console.error("Error processing uploaded image:", error);
    });
}

// PII detection and masking function with Aadhaar mask update
function detectAndMaskPII(text) {
    const aadhaar_pattern = /\b(\d{4}\s?\d{4})\s?(\d{4})\b/;  // Capture first 8 digits and last 4 digits separately
    const pan_pattern = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/;
    const email_pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
    const phone_pattern = /\b\d{10}\b/;
    const voterID_pattern = /\b[A-Z]{3}[0-9]{7}\b/;
    const driving_license_pattern = /\b[A-Z]{2}\d{14}\b/;

    let piiDetected = false;

    if (aadhaar_pattern.test(text)) {
        text = mask_aadhaar(text, aadhaar_pattern);
        piiDetected = true;
    }
    if (pan_pattern.test(text)) {
        text = mask_entity(text, pan_pattern);
        piiDetected = true;
    }
    if (email_pattern.test(text)) {
        text = mask_entity(text, email_pattern);
        piiDetected = true;
    }
    if (phone_pattern.test(text)) {
        text = mask_entity(text, phone_pattern);
        piiDetected = true;
    }
    if (voterID_pattern.test(text)) {
        text = mask_entity(text, voterID_pattern);
        piiDetected = true;
    }
    if (driving_license_pattern.test(text)) {
        text = mask_entity(text, driving_license_pattern);
        piiDetected = true;
    }

    return { text, piiDetected };
}

function mask_aadhaar(text, pattern, mask_char = 'X') {
    return text.replace(pattern, (match, group1, group2) => {
        // Mask the first 8 digits (group1) and leave the last 4 digits (group2) unmasked
        return mask_char.repeat(group1.length) + ' ' + group2;
    });
}

function mask_entity(text, pattern, mask_char = 'X') {
    return text.replace(pattern, match => mask_char.repeat(match.length));
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
    const blob = new Blob([text], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.html';
    link.click();
}

