import puppeteer from "puppeteer-extra"
import pluginProxy from 'puppeteer-extra-plugin-proxy'
import linkRedirect from "./Action/linkRedirect.js"
import getRatingBar from "./Action/getRatingBar.js";
import getRevenue from "./Action/getRevenue.js";
import proxies from './ProxyServ/proxies.js';


export let checkoPars = async (inn, city, link = 'https://checko.ru/') => {
    for (let index = 0; index < proxies.length; index++) {
        console.log(proxies[index])
        puppeteer.use(
            pluginProxy({
                address: proxies[index].ip,
                port: proxies[index].port,
                type: proxies[index].type,
            })
        );

        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();

        await page.setViewport({
            width: 1920,
            height: 1080,
        });

        await page.goto(link, { waitUntil: 'domcontentloaded' });

        try {
            let links = await linkRedirect(page, inn)

            await page.waitForSelector('h1')

            let ratingBarObj = await getRatingBar(links)

            let revenueObj = await getRevenue(links)

            await browser.close();

            return { ratingBarObj, revenueObj }

        } catch (e) {
            console.log('Ошибка: ', e)
            await browser.close()
            continue
        }
    }
}
//добавить по div
//если добавить ссылку с листом, то он бесконечно вводит в input

//добавить удаление пустоты у строки
//добавить перелистывание
//больше проверок

//добавить остановку ипоиска элемаентов с ссылкой, если присутсвтует класс menu или nav
//добавить до проверку на город при отправке данных