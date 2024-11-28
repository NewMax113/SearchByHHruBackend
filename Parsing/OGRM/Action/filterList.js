const filterList = (listCompany, city) => {
    let arr = []; 

    for (let company of listCompany) {
 
        if (company.value.toLowerCase().includes(city.toLowerCase())) {
            arr.push(company); 
        }

        if (company.child && company.child.length > 0) {
            const found = filterList(company.child, city);
            if (found) {
                arr = arr.concat(found);
            }
        }
    }

    return arr.length > 0 ? arr : null; 
};

export default filterList