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

const linkRedirect = async(page, link, name) => {

    try {
        let switchLinls2 = new SearchInput(link, page, name)
        await switchLinls2.clickInput()
        await page.waitForNavigation()
        return page
    } catch (e) {
        console.log('Ошибка в linkRedirect')
        throw e
    }
}

export default linkRedirect