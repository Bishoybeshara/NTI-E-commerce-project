const {exec} = require('child_process');
const path = require('path');

exports.restoreBackup = (myBackupsFolder) =>{
  const backupDir = path.join(__dirname, `../backups/${myBackupsFolder}`);
  const command = `mongorestore --uri="${process.env.MONGO_URI}" "${backupDir}"`;

  exec(command, (err)=>{
    if(err) {
      console.error('Restore failed :', err.message);
    } else{
      console.log(`Restore completed from : ${backupDir}`);
    }
  });
};