const path = require('path');
const { readdir, appendFile } = require('fs/promises');
const fs = require('fs');

const dirSourcePath = path.join(__dirname, 'styles');
const dirDestPath = path.join(__dirname, 'project-dist', 'bundle.css');

(async () => {
  fs.createWriteStream(dirDestPath);
  try {
    const files = await readdir(dirSourcePath, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && path.parse(file.name).ext === '.css') {
        const input = await fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        input.on('data', (chunk) => appendFile(dirDestPath, chunk));
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
