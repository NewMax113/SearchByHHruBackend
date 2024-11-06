import { getVacancy } from './getVacancy.js'
import { getEmployer } from './getEmployer.js'

export const commonVacAndEmp = async (vacancies) => {
    const start = Date.now();
    
    let vacanciesMap = await Promise.all(vacancies.items.map(async (vacancy, index) => {

        return {
            vacancy: await getVacancy(vacancy.id),
            //employer: await getEmployer(vacancy.employer.id)
        }
    }))
const end = Date.now();
    console.log(`Время выполнения3: ${end - start} мс`)
    return vacanciesMap
}