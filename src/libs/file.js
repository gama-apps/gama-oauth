const Fs = require('fs');

const File = {
  createFolderIfNotExist(path) {
    if(!Fs.existsSync(path)){
      Fs.mkdirSync(path)
    }
  },

  readFileToString(path, fileName, encoding) {
    const filePath = `${path}/${fileName}`;
    if(Fs.existsSync(filePath)){
      const file = Fs.readFileSync(filePath);
      return file.toString(encoding)
    }
  },

  writeFileSync(path, fileName, data, encoding) {
    const option = {
      flag: 'w'
    };
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    Fs.writeFileSync(`${path}/${fileName}`,
      Buffer.from(data, encoding || 'binary'), option);
  },
  remove(path, fileName) {
    const filePath = `${path}/${fileName}`;
    if(Fs.existsSync(filePath)){
      Fs.unlinkSync(filePath)
    }
  }
};
module.exports = File;