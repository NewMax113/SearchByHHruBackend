import puppeteer from "puppeteer-extra"


export let ogrnParsing = async (name='КРОК', city='Белгород') => {
    //ООО ХКМ Евразия Сейлз

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(`https://checko.ru/search?query=${name}`);

        let companyIndex = await page.evaluate(searchForCompanyByIndex, name, city);
        console.log(companyIndex)
        // await page.waitForSelector('.x-section')
        if (companyIndex) {
            await page.click(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${companyIndex}) > td:nth-child(2) > div:nth-child(1) > a`)
            await page.waitForSelector('.x-section');
            
        }

        let priseCompany = await page.evaluate(getPrise)

        console.log(priseCompany)
        await browser.close();
        return priseCompany

    } catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }
}

let searchForCompanyByIndex = (name, city) => {
    try {
        let list = document.querySelector("#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody");
        //попробовать избаваиться
        if (!list) {
            return 'не лист'
        }

        for (let index = 1; index < list.children.length; index++) {
            let nameClass = document.querySelector(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${index}) > td:nth-child(2) > div:nth-child(1) > a`)
            let cityClasss = document.querySelector(`#body > main > div.uk-container.uk-container-xlarge.pb-5 > table > tbody > tr:nth-child(${index}) > td:nth-child(2) > div:nth-child(3)`)
            let textNameClass = nameClass.innerText.replace(/"/g, '').toLowerCase();

            let newNameCompany = (name, textNameClass, index, cityClasss, city) => {
                let formCompany = ['', 'ооо', 'зао', 'ип', 'оао']

                let coincidenceCity = (cityClasss, city) => {
                    let mutationCityClass = cityClasss.innerText.toLowerCase().replace(city.toLowerCase(), null)
                    if (cityClasss.innerText.toLowerCase() !== mutationCityClass) {
                        return true
                    }
                    return false
                }
                
                for (let i = 0; i < formCompany.length; i++) {
                    let mutateName = `${formCompany[i]} ${name.toLowerCase()}`
                    if (mutateName == textNameClass && coincidenceCity(cityClasss, city)) {
                        return index
                    }
                }
                return 'Опа'
                 
            }

            let coincidenceCity = (cityClasss, city) => {
                let mutationCityClass = cityClasss.innerText.toLowerCase().replace(city.toLowerCase(), null)
                if (cityClasss.innerText.toLowerCase() !== mutationCityClass) {
                    return true
                }
                return false
            }

            if (newNameCompany(name, textNameClass, index, cityClasss, city) == textNameClass && coincidenceCity(cityClasss, city)) {
                return index;
            }
        }
        return null;

    } catch (e) {
        return null
    }

}

let getPrise = () => {
    let money = document.querySelector("#basic > div.uk-grid.uk-grid-divider.uk-grid-small > div.uk-width-1.uk-width-1-2\\@m.uk-first-column > div:nth-child(7) > div:nth-child(2)")
    if (!money) {
        return 'Ошибка getPrise'
    }
    return money.innerText
}