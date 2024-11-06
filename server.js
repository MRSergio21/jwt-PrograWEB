const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = [];
const JWT_SECRET = 'clave_secreta';


app.post('/register', (req, res) => {
    const { email, password } = req.body;
    users.push({ email, password });
    console.log("usuario:" + email + " contraseña:" + password);
    res.json({ message: 'Registro exitoso' }).status(200);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });  
    try { 
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

app.get('/private', auth, (req, res) => {
    res.json({ message: 'Área privada', user: req.user });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
