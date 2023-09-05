import ProfileEmployed from "../../modules/auth/ProfileEmployed";
import ProfileEnterprise from "../../modules/auth/ProfileEnterprise";
import ProfileStudent from "../../modules/auth/ProfileStudent";

const ROUTE = "/profile"

export const routes = [ 
    {
        path: `${ROUTE}/student/:idUser`,
        exact: true,
        component: ProfileStudent,
    },
    {
        path: `${ROUTE}/enterprise/:idUser`,
        exact: true,
        component: ProfileEnterprise,
    },
    {
        path: `${ROUTE}/employed/:idUser`,
        exact: true,
        component: ProfileEmployed,
    },
]