import httpConsult from "../utils/httpConsult"

export function getJobsApi (body) {
    const url = `jobs`
    return httpConsult(url, 'POST', body)
}
export function createJobApi (body) {
    const url = `job`
    return httpConsult(url, 'POST', body)
}
export function getJobByCodeApi (code) {
    const url = `job/${code}`
    return httpConsult(url, 'GET')
}
export function applyJobApi (body) {
    const url = `apply-job`
    return httpConsult(url, 'PUT',body)
}
export function updateJobApi (body) {
    const url = `job`
    return httpConsult(url, 'PUT',body)
}