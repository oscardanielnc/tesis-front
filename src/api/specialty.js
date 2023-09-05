import httpConsult from "../utils/httpConsult"

export function getSpecialtiesApi () {
    const url = `specialty`
    return httpConsult(url, 'GET')
}