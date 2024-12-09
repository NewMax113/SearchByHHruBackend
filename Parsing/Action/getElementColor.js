const getElementColor = async (page, selector) => {
    const elementHandle = await page.$(selector);

    if (elementHandle) {
        return await page.$eval(selector, element => element.textContent.trim() === '' ? '1' : element.textContent.trim());
    }

    return null;
};

export default getElementColor