import httpConsult from "../utils/httpConsult"

export function signInApi (email) {
    const url = `sign-in/${email}`
    return httpConsult(url, 'GET')
}