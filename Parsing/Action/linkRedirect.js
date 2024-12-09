class SearchInput {
    constructor(page, value) {
        this.page = page
        this.value = value
    }

    async clickInput() {
        const inputSelector = 'input[name="query"]';
        
        await this.page.waitForSelector(inputSelector); 
        await this.page.type(inputSelector, `${this.value}`);
        await this.page.keyboard.press('Enter')
    }
}

const linkRedirect = async (page, value) => {
    try {
        let switchLinls2 = new SearchInput(page, value)

        await switchLinls2.clickInput()

        return page
    } catch (e) {
        const screenshotPath = 'error-screenshot.png';

        await page.screenshot({ path: screenshotPath });

        console.log('Ошибка в linkRedirect')
        throw e
    }
}


export default linkRedirect