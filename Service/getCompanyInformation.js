
import { checkoPars } from '../Parsing/checkoPars.js'
import { dreamJobPars } from '../Parsing/dreamJobPars.js'
import { googleInnPars } from '../Parsing/googleInnPars.js'

import { getEmployer } from './getEmployer.js'


export class DreamJobWebInfo {
    async getInfo(name) {
        return await dreamJobPars(name)
    }
}

export class GoogleInnInfo {
    async getInfo(name, city) {
        return await googleInnPars(name, city)
    }
}

export class ChekoWebInfo {
    async getInfo(inn) {
        return await checkoPars(inn)
    }
}

export class ReliabilityCalculator {
    constructor(dreamJobInfo, chekoInfo) {
        dreamJobInfo = this.dreamJobInfo
        chekoInfo = this.chekoInfo
    }

    static async calculateReliability(dreamJobInfo, chekoInfo) {
        let reliabilityPercentage = 100

        if (dreamJobInfo?.recommendations > 39 && dreamJobInfo?.grade) {
            dreamJobInfo.grade < 4 && (reliabilityPercentage -= 10)
            dreamJobInfo.grade < 3.8 && (reliabilityPercentage -= 5)
            dreamJobInfo.grade < 3.6 && (reliabilityPercentage -= 10)

            dreamJobInfo.recommendations < 70 && (reliabilityPercentage -= 10)
            dreamJobInfo.recommendations < 65 && (reliabilityPercentage -= 5)
            dreamJobInfo.recommendations < 50 && (reliabilityPercentage -= 15)

        } else { reliabilityPercentage -= 30 }

        if (chekoInfo?.ratingBarObj) {
            if (!chekoInfo.ratingBarObj?.green) {
                reliabilityPercentage -= 35
            } else {
                chekoInfo.ratingBarObj?.green < 200 && (reliabilityPercentage -= 5)
                chekoInfo.ratingBarObj?.green < 100 && (reliabilityPercentage -= 5)
                chekoInfo.ratingBarObj?.yellow && (reliabilityPercentage -= 10)
                chekoInfo.ratingBarObj?.red && (reliabilityPercentage -= 20)
            }
        } else { reliabilityPercentage -= 35 }
        console.log(reliabilityPercentage)
        console.log({ dreamJobInfo, chekoInfo })

        return { reliabilityPercentage, revenueObj: chekoInfo?.revenueObj }
    }
}

export class ProcessorFacade {
    constructor() {
        this.googleWebInfo = new GoogleInnInfo()
        this.chekoWebInfo = new ChekoWebInfo()
        this.dreamWebJobInfo = new DreamJobWebInfo()
    }

    async processAll(name, city, remoteWork, employer_id, token) {
        const regex = /(ООО|ОАО|ЗАО|ПАО|ИП|НКО|ГБУ|ЧУП|ПТ|КТ|СП|АО|ГУП|МУП|ФГУП|КФХ|ТСН|ПБОЮЛ|АР|СРО|ТОС)/g;
        const result = name.replace(regex, '');
        let googleInfo
        let chekoInfo
        let dreamJobInfo = this.dreamWebJobInfo.getInfo(result)
        let employer_city = await getEmployer(employer_id, token)
 
        if (await employer_city) {
            googleInfo = this.googleWebInfo.getInfo(name, await employer_city)
        }

        if (await googleInfo) {
            console.log(`${name}-${city}: ${await googleInfo}`)
            chekoInfo = this.chekoWebInfo.getInfo(await googleInfo)

        } else {
            chekoInfo = null
        }

        return ReliabilityCalculator.calculateReliability(
            await dreamJobInfo,
            await chekoInfo
        )
    }
}
