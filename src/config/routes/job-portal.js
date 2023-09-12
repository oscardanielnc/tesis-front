import Login from "../../modules/auth/Login";
import SearchJob from "../../modules/job-portal/SearchJob";
import Members from "../../modules/job-portal/Members";
import Job from "../../modules/job-portal/Job";
import Applicants from "../../modules/job-portal/Applicants";
import CreateJob from "../../modules/job-portal/CreateJob";

const ROUTE = "/job-portal"

export const routes = [ 
    {
        path: `${ROUTE}/search`,
        exact: true,
        component: SearchJob,
    },
    {
        path: `${ROUTE}/members`,
        exact: true,
        component: Members,
    },
    {
        path: `${ROUTE}/job/:code`,
        exact: true,
        component: Job,
    },
    {
        path: `${ROUTE}/create`,
        exact: true,
        component: CreateJob,
    },
    {
        path: `${ROUTE}/applicants/:code`,
        exact: true,
        component: Applicants,
    },
    {
        path: `${ROUTE}/data`,
        exact: true,
        component: Login,
    },
    {
        path: `${ROUTE}/business-management`,
        exact: true,
        component: Login,
    },
]
