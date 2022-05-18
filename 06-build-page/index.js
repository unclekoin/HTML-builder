const path = require('path');
const fs = require('fs');
const { mkdir, readdir, access, copyFile, rm, appendFile } = require('fs/promises');

const destPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const assetsPath = path.join(__dirname, 'assets');
const destAssetsPath = path.join(destPath, 'assets');
const srcStylesPath = path.join(__dirname, 'styles');
const destStylesPath = path.join(path.join(destPath, 'style.css'));
const componentsMap = {};

const readComponents = async () => {
  try {
    const files = await readdir(componentsPath, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && path.parse(file.name).ext === '.html') {
        const input = await fs.createReadStream(path.join(componentsPath, file.name), 'utf-8');
        input.on('data', (chunk) => {
          const key = `{{${ path.parse(file.name).name }}}`;
          componentsMap[key] = componentsMap[key] ? componentsMap[key] += chunk : chunk;
        });
      }
    }
  } catch (err) {
    console.error('readComponents:', err);
  }
};

const writeTemplate = async () => {
  await readComponents();
  let result = '';
  const input = await fs.createReadStream(templatePath, 'utf-8');
  input.on('data', (chunk) => result += chunk);
  input.on('error', (err) => console.error(err));
  input.on('end', () => {
    for (const key in componentsMap) {
      result = result.split(key).join(componentsMap[key]);
    }
    const output = fs.createWriteStream(path.join(destPath, 'index.html'));
    output.write(result);
  });
};

const buildStyles = async () => {
  fs.createWriteStream(destStylesPath);
  try {
    const files = await readdir(srcStylesPath, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && path.parse(file.name).ext === '.css') {
        const input = await fs.createReadStream(path.join(srcStylesPath, file.name), 'utf-8');
        input.on('data', (chunk) => appendFile(destStylesPath, chunk));
      }
    }
  } catch (err) {
    console.error('buildStyles:', err);
  }
};

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

const copyAssets = async () => {
  try {
    await access(destAssetsPath);
    await rm(destAssetsPath, { recursive: true, force: true });
    await mkdir(destAssetsPath, { recursive: true });
    copyFiles(assetsPath, destAssetsPath);
  } catch {
    await mkdir(destAssetsPath, { recursive: true });
    copyFiles(assetsPath, destAssetsPath);
  }
};

(async () => {
  try {
    await mkdir(destPath, { recursive: true });
    writeTemplate();
    buildStyles();
    copyAssets();
    console.log('Project build has been created');
  } catch (err) {
    console.error('Main function:', err);
  }
})();


