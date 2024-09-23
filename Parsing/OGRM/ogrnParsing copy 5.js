import puppeteer from "puppeteer-extra"


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

    async comparisonCity(stringCityClass, city) {
        if (stringCityClass) {
            const normalizedCity = stringCityClass.toLowerCase();
            return normalizedCity.includes(this.city.toLowerCase());
        }
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
            return undefined
        });
        if (list.length) {
            return this.search(list)
        }

        let list2 = await this.page.$$eval('div', els => {
            const iterationDOMElement = (el) => {
                let arr = [];
                for (let index = 0; index < el.length; index++) {

                    if (el[index].className.replace('item', '') !== el[index].className ) { //может быть не только item
                        arr.push(el[index]);
                    }

                }
                return arr;
            };
            //return iterationDOMElement(els)
            let iterationDOMElement2 = (el) => {
                let arr = []
                for (let index = 0; index < el.length; index++) {
                    arr.push({
                        value: el[index].innerText,
                        class: el[index].className,
                        href: el[index].href,
                        child: iterationDOMElement2(el[index].children)
                    });
                }
                return arr
            }
            return iterationDOMElement2(iterationDOMElement(els))
        });

        //return this.href([this.search(list2)])[0]

        if (list2.length) {
            return this.search(list2)
        }

        //return this.search(list2)
        //return this.search(list)
        return null
    }

    comparisonCity2(stringCityClass, city) {
        const normalizedCity = stringCityClass.toLowerCase();
        return normalizedCity.includes(city.toLowerCase());
    }

    iterationDOMElement(el) {
        let arr = []
        for (let index = 0; index < el.length; index++) {

            arr.push({
                value: el[index].innerHTML,
                class: el[index].className,
                href: el[index].href,
                child: this.iterationDOMElement(el[index].children)
            });
        }
        return arr
    }

    findProp(obj, prop) {
        let result = [];
        function recursivelyFindProp(o, keyToBeFound) {
            Object.keys(o).forEach(key => {
                if (typeof o[key] === 'object' && o[key] !== null) {
                    recursivelyFindProp(o[key], keyToBeFound);
                } else {
                    if (key === keyToBeFound) result.push(o[key]);
                }
            });
        }
        recursivelyFindProp(obj, prop);
        return result[0];
    }

    async search(list) {
        for (let index = 0; index < list.length; index++) {
            if (this.comparisonCity(list[index].value, this.city) && this.comparisonCity(list[index].value, this.name)) {
                let href = this.findProp(list[index], 'href');

                return href;

            }
            else return null
        }
        //return list[0]
        throw new Error("No matching link found");
    }

    href(arr) { 
        let url = []
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].href) {
                url.push(arr[index].href)
                break

            }
            if (arr[index].child) {
                url = url.concat(this.href(arr[index].child))
            }
        }
        return url
    }

    async clickLink(lin, name) {
        let s = await this.page.$$eval('a', (selectorA, lin, name) => {

            let clickFf = () => {
                let arr = []
                for (let index = 0; index < selectorA.length; index++) {
                    if (selectorA[index].href.includes(lin) && selectorA[index].innerText.includes(name)) {
                        //selectorA[index].click()
                        //return true
                        //let a = document.querySelectorAll("a")
                        arr.push(selectorA[index].innerText, (name))  
                    }
                }
                return arr
                return false
            }

            return clickFf()
        }, lin, name)
        return s
    }

    // async clickLink(lin, name) {
    //     let s = await this.page.$$eval('a', (selectorA, lin) => {
    //         let clickFf = () => {
    //             for (let index = 0; index < selectorA.length; index++) {
    //                 if (selectorA[index].href.includes(lin) && selectorA[index].innerText.includes(name)) {
    //                     selectorA[index].click()
    //                     return true
    //                 }
    //             }
    //             // return arr
    //             return false
    //         }
    //         return clickFf()
    //     }, lin, name)
    //     return s
    // }
}


export let ogrnParsing = async (name = 'ООО "ОТКРЫТЫЙ КОД"', city = 'Москва', link = 'https://checko.ru/') => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(link);
        let switchLinls2 = new SearchInput(link, page, name)
        await switchLinls2.clickInput()

        await page.waitForSelector('tr') //может modal вернуть //возможно нужно прописать tr
        console.log('сраб waitFor')


        let trueCompany = new SearchCompanies(name, city, page)

        let lin = await trueCompany.returnList()
        console.log(await trueCompany.returnList())

        if (lin) {
            await trueCompany.clickLink(lin, name);
        }
        console.log(await trueCompany.clickLink(lin, name))
        await page.waitForSelector('dsadassd')

        await browser.close();

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