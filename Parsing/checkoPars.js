import puppeteer from "puppeteer"
import linkRedirect from "./Action/linkRedirect.js"
import getRatingBar from "./Action/getRatingBar.js";
import getRevenue from "./Action/getRevenue.js";



export let checkoPars = async (inn, city, link = 'https://checko.ru/') => {

    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    try {
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        
        const cookies = await page.cookies();
        await page.deleteCookie(...cookies);

        await page.goto(link, { waitUntil: 'domcontentloaded' });
        let links = await linkRedirect(page, inn)

        await page.waitForSelector('h1')

        let ratingBarObj = await getRatingBar(links)

        let revenueObj = await getRevenue(links)

        await browser.close();

        return { ratingBarObj, revenueObj }

    } catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
        //continue
    }
}
