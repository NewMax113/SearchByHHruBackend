import puppeteer from 'puppeteer-extra';
import pluginProxy from 'puppeteer-extra-plugin-proxy'
import linkRedirect from "./Action/linkRedirect.js"
import getRatingBar from "./Action/getRatingBar.js";
import getRevenue from "./Action/getRevenue.js";



export let checkoPars = async (inn, city, link = 'https://checko.ru/') => {
    let data = await fetch(`https://proxy.house/api/open/v1/proxy/list?tariff_id=1`, {
        method: 'GET',
        headers: {
            'Auth-Token': `648764_1734681901_13d5556cf3f3247bf97596aac081091e4f911994`, // Токен прямо в заголовке
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            return { count: data.data.proxies_count, proxies: data.data.proxies };
        })
        .catch(err => null);

    for (const [key, value] of Object.entries(data?.proxies)) {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        puppeteer.use(
            pluginProxy({
                address: await value.ip,
                port: await value.http_port,
                credentials: {
                    username: await value.login,
                    password: await value.password
                }
            })
        );

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
            const textDanger = await page.$('.text-danger fw-700');
            if (textDanger) {
                return null
            } else {
                let ratingBarObj = await getRatingBar(links)

                let revenueObj = await getRevenue(links)

                await browser.close();

                return { ratingBarObj, revenueObj }
            }

        } catch (e) {
            console.log('Ошибка: ', e)
            await browser.close()
            //continue
        }
    }
}
