import Login from "../../modules/auth/Login";
import Agreements from "../../modules/digital-sign/Agreements";
import DocuPDF from "../../modules/digital-sign/DocuPDF";
import DrawSign from "../../modules/digital-sign/DrawSign";

const ROUTE = "/digital-sign"

export const routes = [ 
    {
        path: `${ROUTE}/agreements`,
        exact: true,
        component: Agreements,
    },
    {
        path: `${ROUTE}/draw/:code`,
        exact: true,
        component: DrawSign,
    },
    {
        path: `${ROUTE}/pdf/:code`,
        exact: true,
        component: DocuPDF,
    },
]