const puppeteer = require('puppeteer');

// Функция для сравнения городов
function compareCities(city1, city2) {
    return city1.toLowerCase() === city2.toLowerCase();
}

// Функция для поиска карточки компании и получения её цены
async function findCompanyCardPrice(page, companyName, cityName) {
    return await page.evaluate(
        (companyName, cityName, compareCities) => {
            const cards = Array.from(document.querySelectorAll('.company-card'));
            for (let card of cards) {
                const name = card.querySelector('.company-name').innerText.trim();
                const city = card.querySelector('.company-city').innerText.trim();
                if (name.toLowerCase() === companyName.toLowerCase() && compareCities(city, cityName)) {
                    // Кликаем по карточке
                    card.click();
                    return true; // Карточка найдена и клик выполнен
                }
            }
            return false; // Карточка не найдена
        },
        companyName,
        cityName,
        compareCities.toString()
    );
}

// Основная функция
const getCompanyCardPrice = async (companyName, cityName) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('URL_OF_THE_PAGE_WITH_COMPANIES');

    const cardFound = await findCompanyCardPrice(page, companyName, cityName);

    if (cardFound) {
        // Ожидание загрузки страницы с информацией о карточке
        await page.waitForNavigation();

        // Получение стоимости карточки на новой странице
        const cardPrice = await page.evaluate(() => {
            return document.querySelector('.company-price').innerText.trim();
        });

        console.log(`Цена карточки компании: ${cardPrice}`);
    } else {
        console.log('Карточка компании не найдена.');
    }

    await browser.close();
};

// Вызов функции с примером названия компании и города
getCompanyCardPrice('Example Company', 'Example City').catch(console.error);