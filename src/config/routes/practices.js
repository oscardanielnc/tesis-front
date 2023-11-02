import BlackList from "../../modules/practices/BlackList"
import Deliverable from "../../modules/practices/Deliverable"
import DocsDeliverables from "../../modules/practices/DocsDeliverables"
import EnterpriseBlackList from "../../modules/practices/EnterpriseBlackList"
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
    {
        path: `${ROUTE}/deliverables`,
        exact: true,
        component: DocsDeliverables,
    },
    {
        path: `${ROUTE}/deliver/:assessment/:cycle`,
        exact: true,
        component: Deliverable,
    },
    {
        path: `${ROUTE}/black-list`,
        exact: true,
        component: BlackList,
    },
    {
        path: `${ROUTE}/black-list/enterprise/:id`,
        exact: true,
        component: EnterpriseBlackList,
    },
]