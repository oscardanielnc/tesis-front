import httpConsult from "../utils/httpConsult"

export function getJobsApi () {
    const url = `job`
    return httpConsult(url, 'GET')
}