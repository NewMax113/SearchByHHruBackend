export const getVacancy = async (id) => {
    try {
        if (!id) {
            return  null
        }
        let vacancy = await fetch(`https://api.hh.ru/vacancies/${id}`, {
            method: 'GET',
            headers: {
                'HH-User-Agent': 'JobSearch (maxim0ruseev@gmail.com)'
            },
        })
            .then(response => response.json())
 
        return {
            name: vacancy?.name || null,
            city: vacancy?.area?.name || null,
            description: vacancy?.description || null,
            salary: vacancy?.salary
                ? {
                    from: vacancy.salary?.from || null,
                    to: vacancy.salary?.to || null,
                    currency: vacancy.salary?.currency || null,
                }
                : null,
            schedule: vacancy?.schedule?.name || null,
            experience: vacancy?.experience?.name || null,
            employer: vacancy?.employer?.name || null,
            alternate_url: vacancy?.alternate_url || null,
        }
        //добавить проверки
    } catch (e) {
        console.log('Ошибка:', e)
    }
}

