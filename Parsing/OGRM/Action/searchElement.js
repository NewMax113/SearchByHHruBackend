const searchElement = async (page) => {
    try {
        const list = await page.$$eval('tr', (elements) => {
            const iterationDOMElement = (elements) => {
                return Array.from(elements).map((element) => {
                    return {
                        value: element.innerText || '',
                        class: element.className || '',
                        href: element.href || null,   
                        child: iterationDOMElement(element.children),
                    };
                });
            };

            return iterationDOMElement(elements); // Обработка всех переданных элементов
        });

        return list; 
    } catch (e) {
        let error = new Error('Список пуст')
        throw error
    }
}

export default searchElement