import httpConsult from "../utils/httpConsult"

export function getAgreementsApi (body) {
    const url = `agreement`
    return httpConsult(url, 'POST', body)
}
export function getAgreementStateApi (code,iam) {
    const url = `agreement-state/${code}/${iam}`
    return httpConsult(url, 'GET')
}