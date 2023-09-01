import Login from "../../modules/auth/Login";
import { routes as authRoutes } from './auth';
import { routes as jobPortalRoutes } from './job-portal';
import { routes as practicesRoutes } from './practices';
import { routes as digitalSignRoutes } from './digital-sign';
import Error404 from "../../pages/Error404";

const routes = [ 
    // General
    {
        path: "/",
        exact: true,
        component: Login,
    },
    // Modules
    ...authRoutes,
    ...jobPortalRoutes,
    ...practicesRoutes,
    ...digitalSignRoutes,
    //Error 404
    {
        path: "*", 
        component: Error404,
    }
]

export default routes;