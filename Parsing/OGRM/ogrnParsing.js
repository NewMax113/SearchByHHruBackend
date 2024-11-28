import puppeteer from "puppeteer-extra"
import linkRedirect from "./Action/linkRedirect.js"
import searchElement from "./Action/searchElement.js";
import filterList from "./Action/filterList.js";
import findByName from "./Action/findByName.js";


export const parseUrl = async (page) => {
    try {
        const parsedUrl = new URL(page.url());
        return parsedUrl;
    } catch (e) {
        console.log('Ошибка при парсинге URL:', e);
        throw e;
    }
};

const searchCompanyObj = async (listCompany, name, city) => {
    let filterListCompany = filterList(listCompany, city)
    let company = findByName(filterListCompany, name)
    return company
}

const getRatingBar = async(page) => {
    let green = await page.$eval('#rating-bar > div.green', element => element.textContent.trim());
    let yellow = await page.$eval('#rating-bar > div.yellow', element => element.textContent.trim());
    let red = await page.$eval('#rating-bar > div.red', element => element.textContent.trim());

    let a = {green, yellow, red}
    console.log(a);
}
const getRevenue = async(page) => {
    try {
        let data = await page.$$eval('#accounting-huge > div:nth-child(1)', elements =>
            elements.map(element => element.textContent.trim())
        );

        let result = {};
        if (data.length > 0) {
            const cleanedText = data[0]
                .replace('Выручка', '') 
                .replace('\n', '')  
                .trim();                

            const match = cleanedText.match(/([\d,.]+)\s(млн|млрд|трлн)\sруб.([+-][\d%]+)/);
            if (match) {
                result = {
                    value: match[1],    
                    scale: match[2],     
                    growth: match[3],   
                };
            }
        }

        console.log(result);
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}


export let ogrnParsing = async (name = 'ООО "ОТКРЫТЫЙ КОД"', city = 'Москва', link = 'https://checko.ru/') => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(link);

    try {
        let links = await linkRedirect(page, link, name)
        let urlRedirect = await parseUrl(links)

        let listCompany = await searchElement(links)
        let getCompanyObj = await searchCompanyObj(listCompany, name, city)
        console.log(getCompanyObj)
        //console.log(getCompanyObj)
        await page.goto(getCompanyObj.href);
        
        let ratingBarObj = await getRatingBar(page)
        let revenueObj = await getRevenue(page)

        

       // await page.waitForSelector('dsadassd')


        await browser.close();

        //}



        // await page.waitForSelector('tr') //может modal вернуть //возможно нужно прописать tr
        // console.log('сраб waitFor')


        // let trueCompany = new SearchCompanies(name, city, page)
        // if (page.url() !== link) {
        // await browser.close(); 
        // }

        // let lin = await trueCompany.returnList()
        // console.log(await trueCompany.returnList())

        // if (lin) {
        //     await trueCompany.clickLink(lin, name);
        // }
        // console.log(await trueCompany.clickLink(lin, name))
        // await page.waitForSelector('dsadassd')


    } catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }
}

//добавить по div
//если добавить ссылку с листом, то он бесконечно вводит в input

//добавить удаление пустоты у строки
//добавить перелистывание
//больше проверок

//добавить остановку ипоиска элемаентов с ссылкой, если присутсвтует класс menu или nav
//добавить до проверку на город при отправке данных