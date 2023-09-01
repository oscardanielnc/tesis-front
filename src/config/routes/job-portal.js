import Login from "../../modules/auth/Login";

const ROUTE = "/job-portal"

export const routes = [ 
    {
        path: `${ROUTE}`,
        exact: true,
        component: Login,
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
    {
        path: `${ROUTE}/student`,
        exact: true,
        component: Login,
    },
    {
        path: `${ROUTE}/enterprise`,
        exact: true,
        component: Login,
    },
    {
        path: `${ROUTE}/members`,
        exact: true,
        component: Login,
    },
]
