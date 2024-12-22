export const getEmployer = async (id, token) => {
        let selectedVacancies = await fetch(`https://api.hh.ru/employers/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Токен прямо в заголовке
                'User-Agent': 'JobSearch (maxim0ruseev@gmail.com)',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(err => null)

        return selectedVacancies.area.name
            // name: selectedVacancies.name,
            // logo_urls: selectedVacancies.logo_urls.original,
            // type: selectedVacancies.type,
            // trusted: selectedVacancies.trusted,
            // accredited_it_employer: selectedVacancies.accredited_it_employer,
            // site_url: selectedVacancies.site_url,
            // open_vacancies: selectedVacancies.open_vacancies,
        
        return selectedVacancies
}

