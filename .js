export const getElementVacancy = async (id) => {
    try {
        let vacancy = await fetch(`https://api.hh.ru/vacancies/${id}`, {
            method: 'GET',
            headers: {
                'HH-User-Agent': 'JobSearch (maxim0ruseev@gmail.com)'
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => null)
        return {
            name: vacancy.name !== null ? vacancy.name : null,
            city: vacancy.area !== null ? vacancy.area.name : null,
            description: vacancy.description !== null ? vacancy.description : null,
            salary: vacancy.salary !== null 
            ? {
                from: vacancy.salary.from !== null  ? vacancy.salary.from : null,
                to: vacancy.salary.to !== null ? vacancy.salary.to : null,
                currency: vacancy.salary.currency !== null ? vacancy.salary.currency : null,
            }
            : null,
            schedule: vacancy.schedule.name !== null ? vacancy.schedule.name : null,
            experience: vacancy.experience.name !== null ? vacancy.experience.name : null,
            alternate_url: vacancy.alternate_url !== null ? vacancy.alternate_url : null
        }
        //добавить проверки
    } catch (e) {
        console.log('Ошибка:', e)
    }
}

