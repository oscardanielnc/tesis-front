import httpConsult from "../utils/httpConsult"

export function enterpriseDataApi (idUser) {
    const url = `enterprise-data/${idUser}`
    return httpConsult(url, 'GET')
}