import { commonVacAndEmp } from './commonVacAndEmp.js'

export const toDoApiObjectVacancies = async (req, res) => {
    return await fetch(`https://api.hh.ru/vacancies?text=""&area=113`, {
        method: 'GET',
        headers: {
            'HH-User-Agent': 'JobSearch (maxim0ruseev@gmail.com)'
        },
    })
        .then(response => response.json())
        .then(data => commonVacAndEmp(data))
}

//services/toDoApiService.js