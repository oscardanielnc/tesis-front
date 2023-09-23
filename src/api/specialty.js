import httpConsult from "../utils/httpConsult"

export function getSpecialtiesApi (body) {
    const url = `specialties`
    return httpConsult(url, 'POST', body)
}
export function createSpecialtyApi (body) {
    const url = `specialty`
    return httpConsult(url, 'POST', body)
}
export function updateSpecialtyApi (body) {
    const url = `specialty`
    return httpConsult(url, 'PUT', body)
}