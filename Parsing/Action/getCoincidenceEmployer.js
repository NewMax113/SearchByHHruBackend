const getCoincidenceEmployer = async (page) => {
    try {
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

    } catch {
        let error = new Error('Работодатель не найден')
        throw error
    }
}

export default getCoincidenceEmployer