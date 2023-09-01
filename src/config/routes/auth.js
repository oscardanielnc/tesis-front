import Login from "../../modules/auth/Login";
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
        component: Login,
    },
]