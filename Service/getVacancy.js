export const getVacancy = async (id, token) => {
    try {
        console.log(token)
        if (!id) {
            throw new Error('не получен ID')
        }
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
                    throw new Error('Вакансия не найдена')
                } else {
                   return response.json() 
                }
            }
        )
            return {
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
                alternate_url: vacancy.alternate_url,
            }
    } catch (error) {
        throw error
    }
}

