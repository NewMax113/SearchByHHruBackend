const findByName = (listCompany, name) => {
    for (let company of listCompany) {

        if (company.value.toLowerCase() === name.toLowerCase() ) {
            return company;
        }

        if (company.child && company.child.length > 0) {
            const found = findByName(company.child, name);
            if (found) {
                return found;
            }
        }
    }

    return null;
};

export default findByName