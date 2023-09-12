import httpConsult from "../utils/httpConsult"

export function studentDataApi (idUser) {
    const url = `student-data/${idUser}`
    return httpConsult(url, 'GET')
}
export function getStudentsApi (body) {
    const url = `students`
    return httpConsult(url, 'POST', body)
}
export function contractStudentApi (body) {
    const url = `student-contract`
    return httpConsult(url, 'PUT', body)
}