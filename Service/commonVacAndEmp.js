import { getVacancy } from './getVacancy.js'
import { getEmployer } from './getEmployer.js'

export const commonVacAndEmp = async (vacancies, token) => {
    const start = Date.now();
    try {
        let vacanciesMap = await Promise.all(vacancies.items.map(async (vacancy, index) => {
            return {
                vacancy: await getVacancy(vacancy.id, token),
                //employer: await getEmployer(vacancy.employer.id)
            }
        }))
        const end = Date.now();
        console.log(`Время выполнения3: ${end - start} мс`)
        console.log(vacanciesMap[0].vacancy.name, 'common')
        return vacanciesMap
    } catch (error) {
        throw error
    }

}