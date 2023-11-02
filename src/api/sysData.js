import httpConsult from "../utils/httpConsult"

export function getLocationsApi (body={}) {
    const url = `sys-data/location`
    return httpConsult(url, 'POST', body)
}
export function getLanguagesApi (body={}) {
    const url = `sys-data/language`
    return httpConsult(url, 'POST', body)
}
export function getEmailsSystemApi () {
    const url = `sys-data/emails`
    return httpConsult(url, 'GET')
}
export function updateEmailsSystemApi (body) {
    const url = `sys-data/emails`
    return httpConsult(url, 'PUT', body)
}
export function getSectorsApi (body={}) {
    const url = `sys-data/sectors`
    return httpConsult(url, 'POST', body)
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
export function maintenanceSysDataApi (body) {
    const url = `sys-data/maintenance`
    return httpConsult(url, 'POST', body)
}
export function createPeriodApi (body) {
    const url = `sys-data/period`
    return httpConsult(url, 'POST', body)
}
export function getPeriodsApi (id='x') {
    const url = `sys-data/periods/${id}`
    return httpConsult(url, 'GET')
}