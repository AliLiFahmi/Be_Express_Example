const { connection } = require('../conn');

module.exports = (roles) => {
  return async (req, res, next) => {
      try {
          const query = 'SELECT nama FROM roles WHERE id = ?';
          const roleId = req.user.role_id;

          connection.query(query, [roleId], (error, results) => {
              if (error) {
                  return res.status(500).json({
                      status: 500,
                      message: 'Database error!'
                  });
              }

              if (results.length === 0) {
                  return res.status(403).json({
                      status: 403,
                      message: 'Role not found!'
                  });
              }

              const roleName = results[0].nama;

              if (!roles.includes(roleName)) {
                  return res.status(403).json({
                      status: 403,
                      message: 'Anda tidak dapat mengakses fungsi ini!!!'
                  });
              }

              next();
          });
      } catch (error) {
          return res.status(500).json({
              status: 500,
              message: 'Tidak bisa!'
          });
      }
  };
};
