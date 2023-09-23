import httpConsult from "../utils/httpConsult"

export function updateProfessorApi (body) {
    const url = `professor`
    return httpConsult(url, 'PUT', body)
}