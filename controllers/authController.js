const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connection } = require('../conn');

// Fungsi untuk menghash password
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
};

// Fungsi untuk memeriksa password
const verifyPassword = (password, hash, salt) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === hashVerify;
};

exports.login = async (req, res) => {
  const { body } = req;

  if (!body.email || !body.password)
    return res.status(400).json({
      message: "Email and password tidak boleh kosong",
    });

  try {
    // Check email
    connection.query('SELECT * FROM users WHERE email = ?', [body.email], (err, results) => {
      if (err) {
        console.error('Error fetching user: ' + err.stack);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0)
        return res.status(404).json({
          message: "Email tidak ditemukan",
        });

      const user = results[0];

      // Check password
      const isPasswordCorrect = verifyPassword(body.password, user.password_hash, user.password_salt);

      if (!isPasswordCorrect)
        return res.status(400).json({
          message: "Password tidak sesuai",
        });

      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign({ data }, "#develop#cah#kendal#", {
        expiresIn: "10s",
      });

      return res.json({ token });
    });
  } catch (error) {
    console.error('Connection error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  const { body } = req;

  if (!body.name || !body.email || !body.password)
    return res.status(400).json({
      message: "Name, email, dan password tidak boleh kosong",
    });

  try {
    // Check if email is already used
    connection.query('SELECT * FROM users WHERE email = ?', [body.email], (err, results) => {
      if (err) {
        console.error('Error checking email: ' + err.stack);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length > 0)
        return res.status(400).json({
          message: "Email sudah digunakan",
        });

      // Hash the password
      const { salt, hash } = hashPassword(body.password);

      // Insert new user
      connection.query('INSERT INTO users (name, email, password_hash, password_salt) VALUES (?, ?, ?, ?)', 
        [body.name, body.email, hash, salt], 
        (err, result) => {
          if (err) {
            console.error('Error inserting user: ' + err.stack);
            return res.status(500).json({ message: "Internal server error" });
          }

          return res.json({
            id: result.insertId,
            name: body.name,
            email: body.email,
          });
        }
      );
    });
  } catch (error) {
    console.error('Connection error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
