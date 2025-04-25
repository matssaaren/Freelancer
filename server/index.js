const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'freelancehub',
});

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ✅ attach decoded user info to request
    next(); // move on to actual route
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phone, dob, role } = req.body;
  
    if (!firstName || !lastName || !email || !password || !phone || !dob || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await db.query(
        'INSERT INTO users (first_name, last_name, email, password, phone, dob, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, phone, dob, role]
      );
  
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: 'Invalid credentials' });

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: { id: user.id, name: `${user.first_name} ${user.last_name}`, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
