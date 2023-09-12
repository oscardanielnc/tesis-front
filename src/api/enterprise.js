import httpConsult from "../utils/httpConsult"

export function enterpriseDataApi (idUser) {
    const url = `enterprise-data/${idUser}`
    return httpConsult(url, 'GET')
}
export function enterpriseExistApi (ruc) {
    const url = `enterprise-exist/${ruc}`
    return httpConsult(url, 'GET')
}