import httpConsult from "../utils/httpConsult"

export function getDocumentsCycleApi (cycle,specialty) {
    const url = `deliv/docs/${cycle}/${specialty}`
    return httpConsult(url, 'GET')
}
export function deleteDocumentCycleApi (body) {
    const url = `deliv/doc`
    return httpConsult(url, 'DELETE', body)
}
export function createAssessmentsCycleApi (body) {
    const url = `deliv/assessment`
    return httpConsult(url, 'POST', body)
}
export function insertCommentDelivApi (body) {
    const url = `deliv/comment`
    return httpConsult(url, 'POST', body)
}
export function getAssessmentDataApi (body) {
    const url = `deliv/assessment-data`
    return httpConsult(url, 'POST', body)
}
export function getAssessmentsCycleApi (cycle,specialty,student) {
    const url = `deliv/assessment/${cycle}/${specialty}/${student}`
    return httpConsult(url, 'GET')
}
