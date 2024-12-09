const searchElement = async (page, city) => {
    try {
        let list = await page.$$eval('tr', elements => {
            return elements.map(element => {
                let nameElement = element.querySelector('.link');
                let descriptionSelect = Array.from(element.querySelectorAll('div'));  
                let descriptionArray = descriptionSelect.map(div => div.textContent.trim());
                return {
                    link: nameElement.href,
                    infoText: nameElement.textContent.trim(),
                    description: descriptionArray
                };
            })

        }, city)
        return list
    } catch (e) {
        let error = new Error('Список пуст')
        throw error
    }
}

export default searchElement