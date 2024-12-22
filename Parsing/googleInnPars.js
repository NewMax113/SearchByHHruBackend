import puppeteer from 'puppeteer-extra';
import pluginProxy from 'puppeteer-extra-plugin-proxy'
import getValueElement from './Action/getValueElement.js';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());


export let googleInnPars = async (name, city) => {
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

        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.setViewport({
            width: 1920,
            height: 1080,
        });

        try {
            await page.goto(`https://www.google.ru/search?q=ИНН+Компании+${name}+${city}`, { waitUntil: 'domcontentloaded' });
            await page.mouse.move(100, 100);
            const captch = await page.$('.rc-anchor-center-containers');

            if (captch) {
                console.log('КАПЧА')
                await browser.close()
                continue

            } else {
                const spans = await page.$$('span');

                for (const span of spans) {
                    const text = await page.evaluate(el => el.textContent, span);
                    console.log(text)

                    const match = text.match(/\b\d{10,13}\b/);

                    if (match) {
                        const regex = /БИН/i;
                        if (regex.test(text)) {
                            console.log('ПРИСУТСТВУЕТ БИН')
                            await browser.close()
                            return null
                        }
                        
                        console.log(`Найденное число '${name}'-${city} #2: ${match[0]}`);
                        await browser.close()
                        return match[0]
                    }
                }
                await browser.close()
                return null
            }

        } catch (e) {
            console.error(e)
            await browser.close()
            break
        }
    }
}