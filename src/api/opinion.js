import httpConsult from "../utils/httpConsult"

export function setMyOpinionApi (body) {
    const url = `opinion`
    return httpConsult(url, 'POST', body)
}
export function updateMyOpinionApi (body) {
    const url = `opinion`
    return httpConsult(url, 'PUT', body)
}