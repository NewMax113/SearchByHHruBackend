
import { checkoPars } from '../Parsing/checkoPars.js'
import { dreamJobPars } from '../Parsing/dreamJobPars.js'
import { yandexNeuroPars } from '../Parsing/yandexNeuroPars.js'


export class DreamJobWebInfo {
    async getInfo(name) {
        return await dreamJobPars(name)
    }
}

export class YandexNeuroWebInfo {
    async getInfo(name, city) {
        return await yandexNeuroPars(name, city)
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
        return { dreamJobInfo, chekoInfo }
    }
}

export class ProcessorFacade {
    constructor() {
        this.yandexNeuroWebInfo = new YandexNeuroWebInfo()
        this.chekoWebInfo = new ChekoWebInfo()
        this.dreamWebJobInfo = new DreamJobWebInfo()
    }

    async processAll(name, city) {
        const regex = /(ООО|ОАО|ЗАО|ПАО|ИП|НКО|ГБУ|ЧУП|ПТ|КТ|СП|АО|ГУП|МУП|ФГУП|КФХ|ТСН|ПБОЮЛ|АР|СРО|ТОС)/g;
        const result = name.replace(regex, '');
        let yandexNeuroInn = this.yandexNeuroWebInfo.getInfo(name, city)
        let chekoInfo
        let dreamJobInfo = this.dreamWebJobInfo.getInfo(result)

        if (await yandexNeuroInn) {
            chekoInfo = this.chekoWebInfo.getInfo(await yandexNeuroInn)

        } else {
            chekoInfo = null
        }

        return ReliabilityCalculator.calculateReliability(
            await dreamJobInfo,
            await chekoInfo
        )
    }
}
