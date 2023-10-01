import httpConsult from "../utils/httpConsult"

export function getAgreementsApi (body) {
    const url = `agreement`
    return httpConsult(url, 'POST', body)
}
export function getAgreementStateApi (code,iam) {
    const url = `agreement-state/${code}/${iam}`
    return httpConsult(url, 'GET')
}
export function signAgreementApi (body) {
    const url = `/agreement-sign`
    return httpConsult(url, 'PUT',body)
}
export function observationAgreementApi (body) {
    const url = `/agreement-observation`
    return httpConsult(url, 'PUT',body)
}