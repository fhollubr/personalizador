const fs = require('fs');
const path = require('path');

let htmlContent = fs.readFileSync('index.html', 'utf8');

// Find all image paths
const regex = /imagenes\/([^"'\s]+)/gi;
let match;
let replacements = 0;

function getExactCasing(targetPath) {
    const parts = targetPath.split('/');
    let currentPath = __dirname;
    let newParts = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!fs.existsSync(currentPath)) return null;

        const dirContents = fs.readdirSync(currentPath);
        const exactMatch = dirContents.find(item => item.toLowerCase() === part.toLowerCase());
        
        if (exactMatch) {
            newParts.push(exactMatch);
            currentPath = path.join(currentPath, exactMatch);
        } else {
            return null; // Not found even ignoring case
        }
    }
    return newParts.join('/');
}

// Replace in a new string
let newHtml = htmlContent.replace(regex, (match) => {
    // match is like "imagenes/iconos/poleraiconblanco.png"
    const exact = getExactCasing(match);
    if (exact && exact !== match) {
        console.log(`Fixing: ${match} -> ${exact}`);
        replacements++;
        return exact;
    }
    return match;
});

if (replacements > 0) {
    fs.writeFileSync('index.html', newHtml, 'utf8');
    console.log(`Replaced ${replacements} paths with exact casing.`);
} else {
    console.log("No casing issues found.");
}
