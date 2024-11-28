import puppeteer from "puppeteer";

let getRes = async (page) => {
    const result = await page.$$eval('.search-results__list.row.justify-content-md-start.justify-content-center > div',
        elements => elements.map(element => {
            let name = element.querySelector('.industry-card__name')
            let link = element.querySelector('a');
            let reviewsClass = element.querySelector('.industry-card__review-link')
            let reviewsString = reviewsClass.innerText.trim()
            let reviewsNumber = reviewsString.replace(/\D/g, "")

            return {
                name: name ? name.innerText.trim() : null,
                href: link ? link.href : null,
                reviewsNumber: reviewsNumber ? reviewsNumber : null
            }
        })
    );
    return result
}

let getEmployer = async (result, name) => {
    for (let index = 0; index < result.length; index++) {
        if (result[index].name.toLowerCase() === name.toLowerCase()) {
            if (result[index].reviewsNumber > 40) {
                return result[index]
            }
        }
    }
}

const getRecommendations = async (page) => {
    const result = await page.$$eval(
        '.company__indicator-number',
        element => element.map(el => el.innerText.trim().replace('%', '')) // Получаем текст первого найденного элемента
    );
    return { grade: result[0], recommendations: result[1] }
}

export let employerParsing = async (name) => {

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.goto(`https://dreamjob.ru/site/search?query=${name}`, { waitUntil: 'domcontentloaded' });

    try {
        let res = await getRes(page)

        let employer = await getEmployer(res, name)

        await page.goto(await employer.href);

        let recommendations = await getRecommendations(page)

       console.log(recommendations)

        await browser.close();

        return recommendations

    }
    catch (e) {
        console.log('Ошибка: ', e)
        await browser.close()
    }


}