import Login from "../../modules/auth/Login";

const ROUTE = "/digital-sign"

export const routes = [ 
    {
        path: `${ROUTE}/agreements`,
        exact: true,
        component: Login,
    },
    {
        path: `${ROUTE}/draw`,
        exact: true,
        component: Login,
    },
]