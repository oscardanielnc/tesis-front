import httpConsult from "../utils/httpConsult"

export function getLocationsApi () {
    const url = `sys-data/location`
    return httpConsult(url, 'GET')
}
export function getLanguagesApi () {
    const url = `sys-data/language`
    return httpConsult(url, 'GET')
}