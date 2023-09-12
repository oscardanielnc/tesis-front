import httpConsult from "../utils/httpConsult"

export function enterpriseDataApi (idUser) {
    const url = `enterprise-data/${idUser}`
    return httpConsult(url, 'GET')
}
export function enterpriseExistApi (code) {
    const url = `enterprise-exist/${code}`
    return httpConsult(url, 'GET')
}