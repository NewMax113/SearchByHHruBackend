import { commonVacAndEmp } from './commonVacAndEmp.js'

export const toDoApiObjectVacancies = async (urlParams, token) => {
    try {
        const start = Date.now();


        let vacancy = await fetch(`https://api.hh.ru/vacancies?${urlParams}bfgff`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Токен прямо в заголовке
                'User-Agent': 'JobSearch (maxim0ruseev@gmail.com)',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Вакансии не найдены')
            } else {
               return response.json() 
            }
        }
        )
            .then(data => data)
        const end = Date.now()
        console.log(`Время выполнения2: ${end - start} мс`)
        console.log(vacancy.items[0].name, 'todoApi')
        return {
            pages: {
                pages: vacancy.pages,
                page: vacancy.page,
                found: vacancy.found,
            },
            items: await commonVacAndEmp(vacancy, token)
        }
    }
    catch (error) {
        throw error
    }
}

//services/toDoApiService.js