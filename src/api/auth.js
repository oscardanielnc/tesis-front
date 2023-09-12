import httpConsult from "../utils/httpConsult"

export function signInApi (attr, value) {
    const url = `sign-in/${attr}/${value}`
    return httpConsult(url, 'GET')
}
export function signUpApi (body) {
    const url = `sign-up`
    return httpConsult(url, 'POST', body)
}
export function updateProfileApi (body) {
    const url = `profile`
    return httpConsult(url, 'PUT', body)
}