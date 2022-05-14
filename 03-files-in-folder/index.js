const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

(async () => {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          const {name, ext} = path.parse(filePath);
          process.stdout.write(`${name} - ${ext.slice(1)} - ${stats.size * 0.001}kb\n`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
