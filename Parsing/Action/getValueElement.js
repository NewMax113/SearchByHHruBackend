let getValueElement = async (page) => {
    try {
        const result = await page.$$eval(
        '.FuturisMarkdown-Paragraph',
        element => element.map(el => el.innerText.trim()) // Получаем текст первого найденного элемента
    );

    return result
    
    } catch (e) {
        console.error('нету тела ответа:', e)
    }
}

export default getValueElement