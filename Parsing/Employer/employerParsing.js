import puppeteer from "puppeteer";

export let employerParsing = async(name) => {

    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    await page.goto(`https://dreamjob.ru/site/search?query=${name}`);

    let employerInfo = await page.evaluate((name) => {
        let employerStatistics = {
            name: null,
            reviews: null,
            evaluation: null
        }
        let getClass = document.getElementsByClassName('search-results__list row justify-content-md-start justify-content-center')
        let iterationClasses = getClass[0].children

        for (let index = 1; iterationClasses.length > index; index++) {
            let employerName = document.querySelector(`body > main > section > div > div > div:nth-child(2) > div > div:nth-child(${index}) > a > div > div > div.industry-card__content > div.industry-card__name-wrap > div`)
            let employerReviews = document.querySelector(`body > main > section > div > div > div:nth-child(2) > div > div:nth-child(${index}) > a > div > div > div.industry-card__content > div.industry-card__review-link`)
            let employerEvaluation = document.querySelector(`body > main > section > div > div > div:nth-child(2) > div > div:nth-child(${index}) > a > div > div > div.industry-card__content > div.sb-rating > span`)

            if (name == employerName.innerText) {
                employerStatistics.name = employerName.innerHTML
                employerStatistics.evaluation = employerReviews.innerHTML
                employerStatistics.reviews = (employerEvaluation.innerText).slice(0, 3)
                break
            }
        }

        return employerStatistics
    }, name)

    console.log(employerInfo)

    await page.screenshot({ path: 'img.png' })

    await browser.close();
    return employerInfo
}