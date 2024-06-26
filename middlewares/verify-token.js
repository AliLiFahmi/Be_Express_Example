const jwt = require('jsonwebtoken');
const { connection } = require('../conn'); // pastikan path sesuai dengan struktur proyek Anda

module.exports = async (req, res, next) => {
  // Get auth token
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      message: 'Token tidak ditemukan',
    });
  }

  const JWTToken = token.split(' ')[1];
  try {
    // Verify token
    const data = jwt.verify(JWTToken, '#develop#cah#kendal#');

    // Query untuk mendapatkan pengguna dari database menggunakan SQL
    connection.query('SELECT * FROM users WHERE id = ?', [data.data.id], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: 'User tidak ditemukan',
        });
      }

      req.user = results[0];
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: 'Token Sudah Hangus Tolong Login Ulang',
    });
  }
};
