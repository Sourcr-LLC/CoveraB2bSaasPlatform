const fs = require('fs');

const filePath = '../supabase/functions/server/index.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const newContent = content.replaceAll('make-server-92f9f116', 'make-server-be7827e3');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Replacement complete!');
