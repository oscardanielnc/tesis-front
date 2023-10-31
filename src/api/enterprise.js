import httpConsult from "../utils/httpConsult"

export function enterpriseDataApi (idUser) {
    const url = `enterprise-data/${idUser}`
    return httpConsult(url, 'GET')
}
export function enterpriseExistApi (ruc) {
    const url = `enterprise-exist/${ruc}`
    return httpConsult(url, 'GET')
}
export function getEnterpriseOpinionApi (id) {
    const url = `enterprise-opinion/${id}`
    return httpConsult(url, 'GET')
}
export function getAlredySignedApi (idEnterprise, idUser) {
    const url = `enterprise-signed/${idEnterprise}/${idUser}`
    return httpConsult(url, 'GET')
}
export function getEnterprisesOpinionsApi (body) {
    const url = `enterprises-opinions`
    return httpConsult(url, 'POST',body)
}
export function getEnterprisesApi (body) {
    const url = `enterprises`
    return httpConsult(url, 'POST',body)
}
export function updateEnterpriseApi (body) {
    const url = `enterprise`
    return httpConsult(url, 'PUT',body)
}