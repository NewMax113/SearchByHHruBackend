import { getCom } from './getCom.js'
import { ogrnParsing } from './ogrnParsing.js'

// export const getCompanyInformation = async() => {
//   return await ogrnParsing('ПАО "РОСТВЕРТОЛ"', 'Ростовская область')
// }
export class getCompanyInformation {
    constructor (nameCompany, cityCompany) {
        this.resI = {}
        this.nameCompany = nameCompany
        this.cityCompany = cityCompany
        this.trueNameCompany = ''
    }

    getresult () {
        let res = new getCom()
        let a = res.getOGRNCompany()
        this.resI = {...a}
    }
}


