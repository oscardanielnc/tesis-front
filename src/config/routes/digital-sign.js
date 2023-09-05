import Login from "../../modules/auth/Login";
import Agreements from "../../modules/digital-sign/Agreements";

const ROUTE = "/digital-sign"

export const routes = [ 
    {
        path: `${ROUTE}/agreements`,
        exact: true,
        component: Agreements,
    },
    {
        path: `${ROUTE}/draw`,
        exact: true,
        component: Login,
    },
]