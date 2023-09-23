import httpConsult from "../utils/httpConsult"

export function addSignatoryApi (body) {
    const url = `signatory`
    return httpConsult(url, 'POST', body)
}
export function updateSignatoryApi (body) {
    const url = `signatory`
    return httpConsult(url, 'PUT', body)
}
export function getSignatoriesApi (body) {
    const url = `signatories`
    return httpConsult(url, 'POST', body)
}