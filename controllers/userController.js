const { connection } = require('../conn');

// mengambil semua data user
exports.getAllData = (req, res) => {
  connection.query('SELECT id, name, email FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users: ' + err.stack);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.json(results);
  });
};

// mengambil data user sesuai dengan id yang dikirim
exports.getDataById = (req, res) => {
  const { id } = req.params;

  connection.query('SELECT id, name, email FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching user: ' + err.stack);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0)
      return res.status(404).json({
        message: "User not found",
      });

    return res.json(results[0]);
  });
};

// memperbarui user sesuai dengan id yang dikirim
exports.updateData = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  connection.query('SELECT id FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching user: ' + err.stack);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0)
      return res.status(404).json({
        message: "User not found",
      });

    connection.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
      if (err) {
        console.error('Error updating user: ' + err.stack);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.json({
        id,
        name,
        email,
      });
    });
  });
};

// menghapus user sesuai dengan id yang dikirim
exports.deleteData = (req, res) => {
  const { id } = req.params;

  connection.query('SELECT id FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching user: ' + err.stack);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0)
      return res.status(404).json({
        message: "User not found",
      });

    connection.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error deleting user: ' + err.stack);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.json({
        message: "OK",
      });
    });
  });
};

// profile user -> data user sesuai user yang login
exports.profile = async (req, res) => {
  const id = req.user.id;

  try {
    // Mengambil data pengguna berdasarkan ID
    const query = `
    SELECT u.id, u.nama, u.email, u.role_id, r.nama AS role_nama, u.customer_id
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;

    conn.connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error during query execution:', err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Mengembalikan data pengguna
      const user = results[0];
      const data = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role_id: user.role_nama,
        customer_id: user.customer_id,
      };
      return res.json(data);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
