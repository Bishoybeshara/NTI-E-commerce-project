const {exec} =require('child_process');
const path = require('path');
const fs = require('fs');

exports.createBackup =() =>{
  const date = new Date().toISOString().replace(/[:.]/g,'-');
  const backupDir = path.join(__dirname, `../backups/backup-${date}`);

  if(!fs.existsSync(path.join(__dirname, '../backups'))){
    fs.mkdirSync(path.join(__dirname, '../backups'));
  }


  const command = `mongodump --uri="${process.env.MONGO_URI}" --out="${backupDir}"`

  exec(command , (err)=>{
    if(err) {
      console.error('Backup failed :', err.message);
    } else {
      console.log(`Backup created :  ${backupDir}`);
    }
  });
};

