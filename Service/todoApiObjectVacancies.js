import { commonVacAndEmp } from './commonVacAndEmp.js'

export const toDoApiObjectVacancies = async (req, res) => {
    try {
        const start = Date.now();
        

        let vacancy = await fetch(`https://api.hh.ru/vacancies?${req}`)
            .then(response => response.json())
            .then(data => data)
        const end = Date.now()
        console.log(`Время выполнения2: ${end - start} мс`)
        return {
            pages: vacancy.pages,
            page: vacancy.page,
            found: vacancy.found,
            items: await commonVacAndEmp(vacancy)
        }
    }
    catch (e) {
        console.log(e)
    }
}

//services/toDoApiService.js