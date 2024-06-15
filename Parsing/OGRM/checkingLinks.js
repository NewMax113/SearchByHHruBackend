import puppeteer from "puppeteer-extra"

//нету словия при отсутсвтия Enter
class SearchInput {
    constructor(link, page, name) {
        this.link = link
        this.page = page
        this.name = name
    }

    async clickInput() {
        let element = await this.page.$$('input')

        for (let index = 0; index < element.length; index++) {
            await element[index].type(this.name)
            let elementValue = await (await element[index].getProperty('value')).jsonValue() //*переписать на evaluate
            if (elementValue === this.name) {
                await this.page.keyboard.press('Enter')
                break
            }
        }
    }
}

export let chekingLinks = async (link = 'https://checko.ru/', name = 'открытый код') => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(link);
        let switchLinls2 = new SearchInput(link, page, name)
        await switchLinls2.clickInput()
        await page.waitForSelector('tr')
        await browser.close();

    } catch (e) {
        console.log('chekingLinks.js;', e)
        await browser.close()
    }
}