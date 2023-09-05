import Login from "../../modules/auth/Login";
import SearchJob from "../../modules/job-portal/SearchJob";
import Members from "../../modules/job-portal/Members";
import Job from "../../modules/job-portal/Job";

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
        path: `${ROUTE}/job/:idJob`,
        exact: true,
        component: Job,
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
