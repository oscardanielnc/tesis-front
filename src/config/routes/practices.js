import EnterprisesOpinions from "../../modules/practices/EnterprisesOpinions"
import Opinions from "../../modules/practices/Opinions"
import Students from "../../modules/practices/Students"

const ROUTE = "/practices"

export const routes = [ 
    // General
    {
        path: `${ROUTE}/students`,
        exact: true,
        component: Students,
    },
    {
        path: `${ROUTE}/enterprises`,
        exact: true,
        component: EnterprisesOpinions,
    },
    {
        path: `${ROUTE}/opinions/:idEnterprise`,
        exact: true,
        component: Opinions,
    },
]