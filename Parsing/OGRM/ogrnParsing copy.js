import puppeteer from "puppeteer-extra"

class validationName {
    constructor (name, city, page) {
        this.name = name
        this.city = city
        this.page = page
    }

    test () {
        return [this.name, this.city, this.page]
    }

    async ValidityName () {
        let formCompany = ['', 'ооо', 'зао', 'ип', 'оао', 'пао', 'ао']
        let list = await this.page.$$("#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr");
        let trueName = []

        if (!list) {
            return 'не лист'
        }

        for (let index = 1; index < list.length; index++) {
            let nameClass = await this.page.$(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${index}) > td:nth-child(2) > div:nth-child(1) > a`)
            let cityClasss = await this.page.$(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${index}) > td:nth-child(2) > div:nth-child(3)`)
            // let textNameClass = nameClass.innerText.replace(/"/g, '').toLowerCase();
            let textNameClass = (await this.page.evaluate((nameClass) => nameClass.innerText, nameClass)).replace(/"/g, '').toLowerCase()
            let copyCityClass = (await this.page.evaluate((cityClasss)=>cityClasss.innerText, cityClasss)).toLowerCase()

            for (let index2 = 0; index2 < formCompany.length; index2++) {
                if (`${formCompany[index2]} ${this.name}`.replace(/"/g, '').toLowerCase() == textNameClass) {
                    if (await this.coincidenceCity(cityClasss, copyCityClass)) {
                        trueName.push(`${formCompany[index2]} ${this.name}`)
                        trueName.push(index)
                        break
                    }
                }
            }
        }
        return trueName
    }

    async coincidenceCity (cityClasss, copyCityClass) {
        // let mutationCityClass = cityClasss.innerText.toLowerCase().replace(this.city.toLowerCase(), null)
        let mutationCityClass = (await this.page.evaluate((cityClasss)=>cityClasss.innerText, cityClasss)).toLowerCase().replace(this.city.toLowerCase(), null)
        if (copyCityClass !== mutationCityClass) {
            return true
        }
        return false
    }
}


export let ogrnParsing = async (name = 'открытый код', city = 'самара') => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {


        await page.goto(`https://checko.ru/search?query=${name}`);

        let cla = new validationName(name, city, page)  

        console.log( await cla.ValidityName())

        // let companyIndex = await page.evaluate(ValidityName, name, city);
        // console.log(companyIndex)

        // let companyIndex = await page.evaluate(searchForCompanyByIndex, name, city);
        // console.log(companyIndex)
        // // await page.waitForSelector('.x-section')
        // if (companyIndex) {
        //     await page.click(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${companyIndex}) > td:nth-child(2) > div:nth-child(1) > a`)
        //     await page.waitForSelector('.x-section');

        // }

        await browser.close();

    } catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }
}

// let ValidityName = async (name, city) => {
//     let formCompany = ['', 'ооо', 'зао', 'ип', 'оао', 'пао', 'ао']
//     let list = document.querySelector("#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody");
//     let trueName = []

//     let coincidenceCity = (cityClasss, city) => {
//         let mutationCityClass = cityClasss.innerText.toLowerCase().replace(city.toLowerCase(), null)
//         if (cityClasss.innerText.toLowerCase() !== mutationCityClass) {
//             return true
//         }
//         return false
//     }

//     if (!list) {
//         return 'не лист'
//     }

//     for (let index = 1; index < list.children.length; index++) {
//         let nameClass = document.querySelector(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${index}) > td:nth-child(2) > div:nth-child(1) > a`)
//         let cityClasss = document.querySelector(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${index}) > td:nth-child(2) > div:nth-child(3)`)
//         let textNameClass = nameClass.innerText.replace(/"/g, '').toLowerCase();

//         for (let index2 = 0; index2 < formCompany.length; index2++) {
//             if (`${formCompany[index2]} ${name}`.replace(/"/g, '').toLowerCase() == textNameClass) {
//                 if (coincidenceCity(cityClasss, city)) {
//                     trueName.push(`${formCompany[index2]} ${name}`)
//                     trueName.push(index)
//                     break
//                 }
//             }
//         }
//     }
//     return trueName
// }