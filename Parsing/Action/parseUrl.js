const parseUrl = async (page) => {
    try {
        const parsedUrl = new URL(page.url());
        return parsedUrl;
    } catch (e) {
        console.log('Ошибка при парсинге URL:', e);
        throw e;
    }
};

export default parseUrl