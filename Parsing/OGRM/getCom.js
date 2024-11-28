import { ogrnParsing } from "./ogrnParsing.js";


export class getCom {
    // constructor (nameCompany, cityCompany) {
    //     this.nameCompany = nameCompany
    //     this.cityCompany = cityCompany
    //     this.trueNameCompany = ''
    // }

    getOGRNCompany () {
        ogrnParsing('ООО "ТАНУКИ"', 'Москва')
       // ogrnParsing()
    }
}