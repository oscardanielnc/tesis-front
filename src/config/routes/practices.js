import Login from "../../modules/auth/Login";

const ROUTE = "/practices"

export const routes = [ 
    // General
    {
        path: `${ROUTE}`,
        exact: true,
        component: Login,
    },
]