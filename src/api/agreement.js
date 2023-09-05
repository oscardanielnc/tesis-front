import httpConsult from "../utils/httpConsult"

export function getAgreementsApi () {
    const url = `agreement`
    return httpConsult(url, 'GET')
}