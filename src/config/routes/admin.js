import EnterprisesAdmin from "../../modules/admin/EnterprisesAdmin"
import SysDataAdmin from "../../modules/admin/SysDataAdmin"
import SpecialtiesAdmin from "../../modules/admin/SpecialtiesAdmin"
import CyclesAdmin from "../../modules/admin/CyclesAdmin"
import SignatoriesAdmin from "../../modules/admin/SignatoriesAdmin"


const ROUTE = "/admin"

export const routes = [ 
    {
        path: `${ROUTE}/enterprises`,
        exact: true,
        component: EnterprisesAdmin,
    },
    {
        path: `${ROUTE}/sys-data`,
        exact: true,
        component: SysDataAdmin,
    },
    {
        path: `${ROUTE}/specialties`,
        exact: true,
        component: SpecialtiesAdmin,
    },
    {
        path: `${ROUTE}/cycles`,
        exact: true,
        component: CyclesAdmin,
    },
    {
        path: `${ROUTE}/committee`,
        exact: true,
        component: SignatoriesAdmin,
    },
]