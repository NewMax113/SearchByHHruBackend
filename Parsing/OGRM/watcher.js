import { promises as fs } from 'fs';
import path from 'path';

// Функция для чтения файла и возврата массива
async function getArrayFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const array = JSON.parse(data);
    return array;
  } catch (err) {
    throw err;
  }
}

// Путь к файлу
const __dirname = path.resolve();
const filePath = path.join(__dirname, 'domHandler.json');

// Основная функция
(async () => {
  try {
    const array = await getArrayFromFile(filePath);
    // Печать массива в терминал
    process.stdout.write(JSON.stringify(array));
  } catch (error) {
    process.stderr.write(`Error reading file: ${error}\n`);
  }
})();
