import httpConsult from "../utils/httpConsult"

export function employedDataApi (idUser) {
    const url = `employed-data/${idUser}`
    return httpConsult(url, 'GET')
}

export function getEmployeesApi () {
    const url = `employed`
    return httpConsult(url, 'GET')
}