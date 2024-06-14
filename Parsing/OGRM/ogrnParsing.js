import puppeteer from "puppeteer-extra"

//добавить удаление пустоты у строки
//добавить перелистывание
//больше проверок
class SearchCompanies {
    constructor(name, city, page) {
        this.name = name
        this.city = city
        this.page = page
    }

    async returnTrueName() {
        let listSelector = "div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr"
        let list = await this.page.$$(listSelector);
        let arr = [] //если массив (найти истину). Возвращать один элемент

        if (!list) {
            return 'не лист'
        }

        for (let indexList = 1; indexList < list.length; indexList++) {
            
            let nameClassSelector = `${listSelector}:nth-child(${indexList}) > td:nth-child(2) > div:nth-child(1) > a`
            let cityClassSelector = `${listSelector}:nth-child(${indexList}) > td:nth-child(2) > div:nth-child(3)`

            let nameClassDOM = await this.page.$(nameClassSelector)
            let cityClassDOM = await this.page.$(cityClassSelector)

            if (!nameClassDOM || !cityClassDOM) {
                return 'оишбка nameClassSelector, cityClassSelector'
            }

            let stringNameClass = (await this.page.evaluate((nameClassDOM) => nameClassDOM.innerText, nameClassDOM)).replace(/"/g, '').toLowerCase()
            let stringCityClass = (await this.page.evaluate((cityClassDOM) => cityClassDOM.innerText, cityClassDOM)).toLowerCase()

            //если массив (найти истину). Возвращать один элемент. *если один элемент, то вернуть null
            if (await this.validationNameCompany(stringNameClass, stringCityClass, indexList)) {
                arr.push(await this.validationNameCompany(stringNameClass, stringCityClass, indexList))
            }
        }
        return arr
    }

    async searchElement () {}
    
    async validationNameCompany(stringNameClass, stringCityClass, indexList) {
        let formCompany = ['', 'ооо', 'зао', 'ип', 'оао', 'пао', 'ао']

        for (let indexForm = 0; indexForm < formCompany.length; indexForm++) {
            let normalizeName = `${formCompany[indexForm]} ${this.name}`.replace(/"/g, '').toLowerCase()
            if (normalizeName === stringNameClass) {
                if (await this.comparisonCity(stringCityClass)) {
                    return {normalizeName, indexList}
                }
            }
        }
        return null
    }
    
    async comparisonCity(stringCityClass) {
        const normalizedCity = stringCityClass.toLowerCase();
        return normalizedCity.includes(this.city.toLowerCase());
    }
}


export let ogrnParsing = async (name = 'ФОРУС БАНК', city = 'Нижегородская область') => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(`https://checko.ru/search?query=${name}`);

        let trueCompany = new SearchCompanies(name, city, page)

        console.log(await trueCompany.returnTrueName())

        await browser.close();

    } catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }
}