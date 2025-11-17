const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));


// POST endpoint for the contact form
app.post('/contact', (req, res) => {
const data = {
name: req.body.name || 'без име',
email: req.body.email || 'без email',
message: req.body.message || '',
time: new Date().toISOString()
};


// Simple logging to console
console.log('Получено съобщение:', data);


// Optionally append to a local file (messages.json)
const file = path.join(__dirname, 'messages.json');
let arr = [];
try {
if (fs.existsSync(file)){
const existing = fs.readFileSync(file, 'utf8');
arr = JSON.parse(existing || '[]');
}
} catch (err){ console.error('Грешка при четене на file:', err); }


arr.push(data);
try{
fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf8');
} catch(err){ console.error('Грешка при запис:', err); }


// Отговор към клиента
res.json({ status: 'ok', received: data });
});


app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

