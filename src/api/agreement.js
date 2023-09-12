import httpConsult from "../utils/httpConsult"

export function getAgreementsApi (body) {
    const url = `agreement`
    return httpConsult(url, 'POST', body)
}
export function getAgreementStateApi (code) {
    const url = `agreement-state/${code}`
    return httpConsult(url, 'GET')
}