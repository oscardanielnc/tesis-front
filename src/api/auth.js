import httpConsult from "../utils/httpConsult"

export function signInApi (attr, value) {
    const url = `sign-in/${attr}/${value}`
    return httpConsult(url, 'GET')
}