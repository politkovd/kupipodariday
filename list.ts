import puppeteer from 'puppeteer';
import * as fs from 'fs';
//#operations-default-post_if_288_edi_upd > div.no-margin > div > div.opblock-section > div.parameters-container > div > table > tbody > tr > td.parameters-col_description > input[type=text]
//#operations-default-post_if_288_edi_upd > div.no-margin > div > div.execute-wrapper > button
const numbersFilePath = 'list_num.txt'; // Путь к файлу с номерами
const targetUrl = 'https://bcrypt.online/'; // URL сайта

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Загрузка страницы
  await page.goto(targetUrl);

  // Поиск элемента поля для ввода номера
  const inputField = await page.$('#plain_text');

  // Поиск элемента кнопки "OK"
  const okButton = await page.$('#calculate_btn');

  // Чтение номеров из файла
  const numbers = await readFile(numbersFilePath);

  // Цикл для ввода номеров и нажатия на кнопку
  for (const number of numbers) {
    console.log(number);
    await inputField.type(number.trim());
    await okButton.click();

    // Очистка поля ввода
    await inputField.evaluate(() => {
      const inputElement = document.querySelector(
        '#plain_text',
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    });

    // Задержка с использованием setTimeout
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Ожидание 3 секунды
  }

  await browser.close();
}

// Функция для чтения файла с номерами
async function readFile(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.split('\n'));
      }
    });
  });
}

main();
