import puppeteer from "puppeteer";
import getCoincidenceEmployer from "./Action/getCoincidenceEmployer.js";

// let getEmployer = async (result, name) => {
//     for (let index = 0; index < result.length; index++) {
//         if (result[index].name.toLowerCase() === name.toLowerCase()) {
//             if (result[index].reviewsNumber > 40) {
//                 return result[index]
//             }
//         }
//     }
// }

const getRecommendations = async (page) => {
    const result = await page.$$eval(
        '.company__indicator-number',
        element => element.map(el => el.innerText.trim().replace('%', '')) // Получаем текст первого найденного элемента
    );
    return { grade: parseFloat(result[0].replace(",", ".")), recommendations: result[1] }
}

export let dreamJobPars = async (name) => {

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.goto(`https://dreamjob.ru/site/search?query=${name}`, { waitUntil: 'domcontentloaded' });

    try {
        let res = await getCoincidenceEmployer(page)

        await page.goto(await res[0].href);

        let recommendations = await getRecommendations(page)

        await browser.close();

        return recommendations

    }
    catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }
}