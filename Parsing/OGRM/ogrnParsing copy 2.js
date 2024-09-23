import puppeteer from "puppeteer-extra"

//добавить удаление пустоты у строки
//добавить перелистывание
//больше проверок

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

    async searchElement() { }

    async validationNameCompany(stringNameClass, stringCityClass, indexList) {
        let formCompany = ['', 'ооо', 'зао', 'ип', 'оао', 'пао', 'ао']

        for (let indexForm = 0; indexForm < formCompany.length; indexForm++) {
            let normalizeName = `${formCompany[indexForm]} ${this.name}`.replace(/"/g, '').toLowerCase()
            if (normalizeName === stringNameClass) {
                if (await this.comparisonCity(stringCityClass)) {
                    return { normalizeName, indexList }
                }
            }
        }
        return null
    }

    async comparisonCity(stringCityClass, city) {
        const normalizedCity = stringCityClass.toLowerCase();
        return normalizedCity.includes(this.city.toLowerCase());
    }

    async returnList() {
        let list = await this.page.$$eval('tr', els => {
            let iterationDOMElement = (el) => {
                let arr = []
                for (let index = 0; index < el.length; index++) {
                        arr.push({
                            value: el[index].innerText,
                            class: el[index].className,
                            href: el[index].href,
                            child: iterationDOMElement(el[index].children)
                        });
                }
                return arr
            }
            return iterationDOMElement(els)
        });
        
        return this.href([this.search(list)])[0]
    }

    comparisonCity2 (stringCityClass, city) {
        const normalizedCity = stringCityClass.toLowerCase();
        return normalizedCity.includes(city.toLowerCase());
    }

    iterationDOMElement (el) {
        let arr = []
        for (let index = 0; index < el.length; index++) {
                arr.push({
                    value: el[index].innerText,
                    class: el[index].className,
                    href: el[index].href,
                    child: this.iterationDOMElement(el[index].children)
                });
        }
        return arr
    }

    search (list) {
        for (let index = 0; index < list.length; index ++) {
            if (this.comparisonCity(list[index].value, this.city) && this.comparisonCity(list[index].value, this.name) ) {
                return list[index] 
            }
        }
    }

    href (arr) {
        let url = [] 
        for (let index = 0; index < arr.length; index ++) {
            if (arr[index].href) {
                return arr[index].href 
                
            } 
            if (arr[index].child) {
                url = url.concat(this.href(arr[index].child))
            }
        }
        return url
    }


}
//document.querySelector("#form_container2 > div > div > div.modal-body > table > tbody > tr:nth-child(1) > td.listTableItem_td > p.listTableItemTitle.listTableItem_mobi_b")
//document.querySelector("#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(3) > td:nth-child(2) > div.mt-1")

export let ogrnParsing = async (name = 'МЕЖГОСУДАРСТВЕННЫЙ БАНК', city = 'Москва', link = 'https://checko.ru/') => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(link);
        let switchLinls2 = new SearchInput(link, page, name)
        await switchLinls2.clickInput()
        await page.waitForSelector('tr') //может modal вернуть

        let trueCompany = new SearchCompanies(name, city, page)

        console.log(await trueCompany.returnList())

        await browser.close();

    } catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }
}