const path = require('path');
const { mkdir, readdir, copyFile, access, rm } = require('fs/promises');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

const copyFiles = async (srcPath, destPath) => {
  try {
    const dir = await readdir(srcPath, {withFileTypes: true});
    for (const item of dir) {
      if (item.isFile()) {
        await copyFile(path.join(srcPath, item.name), path.join(destPath, item.name));
      } else {
        await mkdir(path.join(destPath, item.name), { recursive: true });
        copyFiles(path.join(srcPath, item.name), path.join(destPath, item.name));
      }
    }
  } catch (err) {
    console.error('copyFiles:', err);
  }
};

const copyDir = async () => {
  try {
    await access(destPath);
    await rm(destPath, { recursive: true, force: true });
    await mkdir(destPath, { recursive: true });
    copyFiles(srcPath, destPath);
  } catch {
    await mkdir(destPath, { recursive: true });
    copyFiles(srcPath, destPath);
  }
};

copyDir();
