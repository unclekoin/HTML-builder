const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const rl = readline.createInterface(stdin, stdout);
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Enter some text...\n');

rl.on('SIGINT', () => {
  stdout.write('Goodbye!\n');
  rl.close();
});

rl.on('line', (line) => {
  if (line.toString().trim() === 'exit') {
    stdout.write('Goodbye!\n');
    rl.close();
  } else {
    output.write(`${line.trim()}\n`);
  }
});
