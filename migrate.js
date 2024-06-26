const { exec } = require('child_process');
const path = require('path')
__dirname = path.resolve();

const runMigrations = async(cb) =>{
	return new Promise((resolve, reject) => {
		exec('npx sequelize-cli db:migrate', async (error, data, getter) => {
			if(error){
				reject('error');
			}
			console.log(data);
			console.log(getter);
			resolve(true);
		});
	})
}
module.exports = runMigrations;