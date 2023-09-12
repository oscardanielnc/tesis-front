import httpConsult from "../utils/httpConsult"

export function getLocationsApi () {
    const url = `sys-data/location`
    return httpConsult(url, 'GET')
}
export function getLanguagesApi () {
    const url = `sys-data/language`
    return httpConsult(url, 'GET')
}
export function getEmailsSystemApi () {
    const url = `sys-data/emails`
    return httpConsult(url, 'GET')
}
export function setMyLenguageApi (body) {
    const url = `sys-data/my-language`
    return httpConsult(url, 'POST', body)
}
export function updateMyLenguageApi (body) {
    const url = `sys-data/my-language`
    return httpConsult(url, 'PUT', body)
}
export function deleteMyLenguageApi (body) {
    const url = `sys-data/my-language`
    return httpConsult(url, 'DELETE', body)
}
export function setMyCertificateApi (body) {
    const url = `sys-data/my-certificate`
    return httpConsult(url, 'POST', body)
}
export function updateMyCertificateApi (body) {
    const url = `sys-data/my-certificate`
    return httpConsult(url, 'PUT', body)
}
export function deleteMyCertificateApi (body) {
    const url = `sys-data/my-certificate`
    return httpConsult(url, 'DELETE', body)
}