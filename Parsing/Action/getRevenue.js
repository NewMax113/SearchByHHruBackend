const getRevenue = async (page) => {
    try {
        let data = await page.$$eval('#accounting-huge > div:nth-child(1)', elements =>
            elements ? elements.map(element => element ? element.textContent.trim() : null) : null
        );
        let year = await page.$eval('#ah', element => element ? element.textContent.trim() : null);
        let result = {};
        
        if (data.length > 0) {
            const cleanedText = data[0]
                .replace('Выручка', '')
                .replace('\n', '')
                .trim();

            const match = cleanedText.match(/([\d,.]+)\s(млн|млрд|трлн)\sруб.([+-][\d%]+)/);
            if (match) {
                result = {
                    year,
                    value: match[1],
                    scale: match[2],
                    growth: match[3],
                };
            }
        }

        console.log(result);
        return result;

    } catch (error) {
        console.error("Error:", error);
    }
}

export default getRevenue