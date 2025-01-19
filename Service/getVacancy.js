export const getVacancy = async (id, token) => {
    try {
        console.log(token)
        if (!id) {
            throw new Error('не получен ID')
        }
        console.log(id, token)
        let vacancy = await fetch(`https://api.hh.ru/vacancies/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Токен прямо в заголовке
                'User-Agent': 'JobSearch (maxim0ruseev@gmail.com)',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Превышен лимит запросов. Сброс через сутки')
                } else {
                    return response.json()
                }
            }
            )

        return {
            id: vacancy.id,
            name: vacancy.name,
            city: vacancy.area.name,
            description: vacancy.description,
            salary: vacancy.salary
                ? {
                    from: vacancy.salary.from,
                    to: vacancy.salary.to,
                    currency: vacancy.salary.currency,
                }
                : null,
            schedule: vacancy.schedule.name,
            experience: vacancy.experience.name,
            employer: vacancy.employer.name,
            employer_id: vacancy.employer.id,
            alternate_url: vacancy.alternate_url,
            accredited_it_employer: vacancy.employer.accredited_it_employer,
            trusted: vacancy.employer.trusted,
            img: vacancy.employer?.logo_urls?.original
        }
    } catch (error) {
        throw error
    }
}

