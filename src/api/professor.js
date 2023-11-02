import httpConsult from "../utils/httpConsult"

export function updateProfessorApi (body) {
    const url = `professor`
    return httpConsult(url, 'PUT', body)
}
export function getStudentsProfessorApi (body) {
    const url = `coordinator/students`
    return httpConsult(url, 'POST', body)
}
export function getSupervisorsApi (specialty) {
    const url = `coordinator/supervisors/${specialty}`
    return httpConsult(url, 'GET')
}
export function getProfessorsApi (specialty) {
    const url = `coordinator/professors/${specialty}`
    return httpConsult(url, 'GET')
}
export function registrationApi (body) {
    const url = `coordinator/students/registration`
    return httpConsult(url, 'POST', body)
}
export function noRegistrationApi (body) {
    const url = `coordinator/students/registration`
    return httpConsult(url, 'DELETE', body)
}
export function assignSupervisorApi (body) {
    const url = `professor/assignSupervisor`
    return httpConsult(url, 'PUT', body)
}
export function assignScoreApi (body) {
    const url = `professor/assignScore`
    return httpConsult(url, 'PUT', body)
}