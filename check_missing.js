const fs = require('fs');
const path = require('path');

let htmlContent = fs.readFileSync('index.html', 'utf8');

const regex = /"imagenes\/[^"]+"/gi;
let match;
let missingFiles = [];

while ((match = regex.exec(htmlContent)) !== null) {
    const rawPath = match[0].replace(/"/g, '');
    const absolutePath = path.join(__dirname, rawPath);
    
    // Check if it exactly exists
    if (!fs.existsSync(absolutePath)) {
        // Find if it exists case-insensitively
        const parts = rawPath.split('/');
        let currentPath = __dirname;
        let found = true;
        for (let part of parts) {
            if (!fs.existsSync(currentPath)) {
                found = false;
                break;
            }
            const items = fs.readdirSync(currentPath);
            const exactItem = items.find(i => i.toLowerCase() === part.toLowerCase());
            if (exactItem) {
                currentPath = path.join(currentPath, exactItem);
            } else {
                found = false;
                break;
            }
        }
        
        if (!found) {
            missingFiles.push(rawPath);
        }
    }
}

console.log("These paths are totally missing locally (not even case mismatch):");
missingFiles.forEach(f => console.log(f));
