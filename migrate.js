const { exec } = require('child_process');

const runMigrations = () => {
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:migrate', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running migrations: ${stderr}`);
        reject(err);
      } else {
        console.log(`Migrations output: ${stdout}`);
        resolve();
      }
    });
  });
};

module.exports = runMigrations;
