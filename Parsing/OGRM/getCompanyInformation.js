import { ogrnParsing } from './ogrnParsing.js'

// export const getCompanyInformation = async() => {
//   return await ogrnParsing('ПАО "РОСТВЕРТОЛ"', 'Ростовская область')
// }
export class getCompanyInformation {
    constructor (nameCompany, cityCompany) {
        this.nameCompany = nameCompany
        this.cityCompany = cityCompany
        this.trueNameCompany = ''
    }

    //добавить проверку по названию. Если есть совпадения при улсовиях, то возвращает название
    //затем ищем компанию по названию, кликаем и попроубем вернуть ссылку
    //

    getOGRNCompany () {
        // ogrnParsing('ПАО "РОСТВЕРТОЛ"', 'Ростовская область')
       // ogrnParsing()
    }
}
