import puppeteer from 'puppeteer-extra';
import pluginProxy from 'puppeteer-extra-plugin-proxy'
import getValueElement from './Action/getValueElement.js';
import proxies from './ProxyServ/proxies.js';


export let yandexNeuroPars = async (name, city) => {
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

        // const cookies = await page.cookies();
        // await page.deleteCookie(...cookies);

        try {
            await page.goto(`https://yandex.ru/search?text=инн+${name.toLowerCase()}+${city}&source=tabbar&promo=force_neuro`, { waitUntil: 'domcontentloaded' });

            const captch = await page.$('.CaptchaLinks-Links');

            if (captch) {
                console.log('КАПЧА')
                await browser.close()
                continue

            } else {
                const textSearch = '.FuturisSearchCardSkeleton-Text';

                await page.waitForSelector(textSearch, { visible: true })

                await page.waitForSelector(textSearch, { hidden: true });

                console.log('Элемент исчез!');

                await new Promise(resolve => setTimeout(resolve, 2000));

                const searchResult = await getValueElement(page)

                if (searchResult[0].toLowerCase().includes('инн')) {
                    const innNumber = searchResult[0].match(/\d{10,13}/g);
                    console.log(innNumber)
                    console.log('Конец')
                    await browser.close()
                    return innNumber

                } else if (searchResult[0].toLowerCase().includes('бин')) {
                    console.log('Не является организацией, относящиеся к РФ')
                    console.log('Конец')
                    await browser.close()
                    break

                } else {
                    console.log('ИНН не найден')
                    console.log('Конец')
                    await browser.close()
                    break
                }
            }

        } catch (e) {
            console.error(e)
            await browser.close()
            continue
        }
    }
}