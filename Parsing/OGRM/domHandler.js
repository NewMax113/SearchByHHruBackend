class DOMHandler {
    static async getElementList(page, selector) {
        //         return await page.$$eval(selector, els => {
        //             const iterateElements = (el) => {
        //                 let arr = [];
        //                 for (let index = 0; index < el.length; index++) {
        //                     arr.push({
        //                         value: el[index].innerText,
        //                         class: el[index].className,
        //                         href: el[index].href,
        //                         children: iterateElements(el[index].children)
        //                     });
        //                 }
        //                 return arr;
        //             };
        //  //           console.log(iterateElements(els))
        //             return iterateElements(els);
        //         });


        if (selector === 'tr') {
            return await page.$$eval(selector, els => {
                const iterateElements = (el) => {
                    let arr = [];
                    for (let index = 0; index < el.length; index++) {
                        arr.push({
                            value: el[index].innerText,
                            class: el[index].className,
                            href: el[index].href,
                            children: iterateElements(el[index].children)
                        });
                    }
                    return arr;
                };
                return iterateElements(els);
            });
        }

        if (selector === 'div') {
            return await page.$$eval(selector, els => {
                const iterationDOMElement = (el) => {
                    let arr = [];
                    for (let index = 0; index < el.length; index++) {

                        if (el[index].className.replace('item', '') !== el[index].className) { //может быть не только item
                            arr.push(el[index]);
                        }

                    }
                    return arr;
                };
                let iterationDOMElement2 = (el) => {
                    let arr = []
                    for (let index = 0; index < el.length; index++) {
                        arr.push({
                            value: el[index].innerText,
                            class: el[index].className,
                            href: el[index].href,
                            child: iterationDOMElement2(el[index].children)
                        });
                    }
                    return arr
                }
                return iterationDOMElement2(iterationDOMElement(els))
            });
        }


    }
    static async getMatchingLink(list, city, name) {
        for (let index = 0; index < list.length; index++) {
            //console.log('1:', list[index].value, '2:', city, '3:', name)
            if (await this.comparisonCity(list[index].value, city) && await this.comparisonCity(list[index].value, name)) {
                return this.findProperty(list[index], 'href');
            }
        }
        throw new Error("No matching link found");
    }

    static async comparisonCity(stringCityClass, city) {
        if (stringCityClass) {
            const normalizedCity = stringCityClass.toLowerCase();
            return normalizedCity.includes(city.toLowerCase());
        }
    }

    static findProperty(obj, prop) {
        let result = [];
        function recursivelyFindProp(o, keyToBeFound) {
            Object.keys(o).forEach(key => {
                if (typeof o[key] === 'object' && o[key] !== null) {
                    recursivelyFindProp(o[key], keyToBeFound);
                } else {
                    if (key === keyToBeFound) result.push(o[key]);
                }
            });
        }
        recursivelyFindProp(obj, prop);
        return result[0];
    }
}

export { DOMHandler };
