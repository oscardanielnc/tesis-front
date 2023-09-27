import httpConsult from "../utils/httpConsult"

export function getJobsApi (body) {
    const url = `jobs`
    return httpConsult(url, 'POST', body)
}
export function createJobApi (body) {
    const url = `job`
    return httpConsult(url, 'POST', body)
}
export function getJobByCodeApi (code,myId,iamStudent) {
    const url = `job/${code}/${myId}/${iamStudent?1:0}`
    return httpConsult(url, 'GET')
}
export function applyJobApi (body) {
    const url = `apply-job`
    return httpConsult(url, 'PUT',body)
}
export function noApplyJobApi (body) {
    const url = `no-apply-job`
    return httpConsult(url, 'PUT',body)
}
export function updateJobApi (body) {
    const url = `job`
    return httpConsult(url, 'PUT',body)
}