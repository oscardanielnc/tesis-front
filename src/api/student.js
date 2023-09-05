import httpConsult from "../utils/httpConsult"

export function studentDataApi (idUser) {
    const url = `student-data/${idUser}`
    return httpConsult(url, 'GET')
}