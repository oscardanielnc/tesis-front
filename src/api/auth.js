import httpConsult from "../utils/httpConsult"

export function signInApi (body) {
    const url = `sign-in`
    return httpConsult(url, 'PUT',body)
}
export function signUpApi (body) {
    const url = `sign-up`
    return httpConsult(url, 'POST', body)
}
export function updateProfileApi (body) {
    const url = `profile`
    return httpConsult(url, 'PUT', body)
}