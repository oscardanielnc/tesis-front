import httpConsult from "../utils/httpConsult"

export function employedDataApi (idUser) {
    const url = `employed-data/${idUser}`
    return httpConsult(url, 'GET')
}

export function getEmployeesApi (body) {
    const url = `employed`
    return httpConsult(url, 'POST',body)
}

export function changePrivToEmployedApi (body) {
    const url = `employed-priv`
    return httpConsult(url, 'PUT',body)
}