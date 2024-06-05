import puppeteer from "puppeteer";

export const employerParsing = async (name, url, selectors) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto(url);
        await page.waitForSelector('.search-results__list');

        const employerInfo = await page.evaluate(extractEmployerInfo, name, selectors);

        console.log(employerInfo);
        await page.screenshot({ path: 'img.png' });
        await browser.close();
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

const extractEmployerInfo = async (name, selectors) => {
    const employers = await page.$$('.search-results__list .industry-card');
    const employer = findEmployerByName(employers, name, selectors.name);

    if (!employer) return { name: null, reviews: null, evaluation: null };

    const employerName = extractTextFromSelector(employer, selectors.name);
    const employerReviews = extractTextFromSelector(employer, selectors.reviews);
    const employerEvaluation = extractTextFromSelector(employer, selectors.evaluation);

    return {
        name: employerName,
        reviews: employerReviews,
        evaluation: employerEvaluation.slice(0, 3)
    };
};

const findEmployerByName = (employers, name, nameSelector) => {
    return employers.find(employer => extractTextFromSelector(employer, nameSelector).trim() === name);
};

const extractTextFromSelector = (element, selector) => {
    return element ? element.querySelector(selector).innerText.trim() : null;
};