import puppeteer from "puppeteer-extra";
import { SearchInputFactory } from "./searchInput.js";
import { DOMHandler } from "./domHandler.js";

let clickInput = async(link, page, name) => {
    //нужно сделать так, что бы если изначально текст введет в инпут, то проверить его на совпадение
    let element = await page.$$('input[type="text"]')
    for (let index = 0; index < element.length; index++) {
        await element[index].type(name)
        let elementValue = await (await element[index].getProperty('value')).jsonValue()
        console.log(elementValue,'eV') 
        //попробовать решить это через goto
        if (elementValue === name) {
            await page.keyboard.press('Enter') 
            break
        }
    } 
}

const clickLink = async (page, link, name) => {
  console.log(link)
    let s = await page.$$eval('a', (selectorA, link, name) => {
        let clickFf = () => {
            let arr = [];
            for (let index = 0; index < selectorA.length; index++) {
                if (selectorA[index].href.includes(link)) {
                  selectorA[index].click()
                }
            }
            return arr;
        };
        return clickFf();
    }, link, name);
    return s;
};

export let ogrnParsing = async (name = 'ООО "КРОК"', city = 'Белгородская', link = 'https://checko.ru') => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(link);
        // const searchInput = SearchInputFactory.createSearchInput(link, page, name);
        // await searchInput.clickInput();
        await clickInput(link, page, name)  

        await page.waitForSelector('div');
        console.log('сраб waitFor');

        let list = await DOMHandler.getElementList(page, 'tr');
        if (!list.length) {
            list = await DOMHandler.getElementList(page, 'div');
        }
        let matchingLink = await DOMHandler.getMatchingLink(list, city, name);
        //console.log(await matchingLink);

        let clickedLink = await clickLink(page, matchingLink, name);
        //console.log('lion', await clickedLink);

        await page.waitForSelector('апыаываы');

    } catch (e) {
        console.log('Ошибка: ', e);
    } finally {
        //await browser.close();
    }
}; 
