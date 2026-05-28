const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync('index.html', 'utf8');

// Find all strings that look like "imagenes/..."
const regex = /"imagenes\/[^"]+"/g;
let match;
const missingFiles = [];

while ((match = regex.exec(htmlContent)) !== null) {
    const filePath = match[0].replace(/"/g, '');
    const absolutePath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(absolutePath)) {
        missingFiles.push(filePath);
    }
}

console.log("Archivos no encontrados:");
missingFiles.forEach(f => console.log(f));
