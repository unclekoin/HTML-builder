const path = require('path');
const { mkdir, readdir, copyFile, unlink } = require('fs/promises');

const copyDir = async () => {
  try {
    await mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    const files = await readdir(path.join(__dirname, 'files'));
    const filesCopy = await readdir(path.join(__dirname, 'files-copy'));
    for (const file of files) {
      if (!filesCopy.includes(file)) {
        await copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
        console.log(`${file} has been copied`);
      }
    }

    for (const file of filesCopy) {
      if (!files.includes(file)) {
        await unlink(path.join(__dirname, 'files-copy', file));
        console.log(`${file} has been deleted`);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

copyDir();
