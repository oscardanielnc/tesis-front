import { API_VERSION, BASE_PATH } from "../config";
import { uploadDocs } from "../utils/httpConsult";

export function uploadCVApi(files, id_student) {
    const url = `http://${BASE_PATH}/api/${API_VERSION}/doc/cv/${id_student}`;
    return uploadDocs(files,url)
}
export function uploadAgreementApi(files, id_agreement, id_employed) {
    const url = `http://${BASE_PATH}/api/${API_VERSION}/doc/agreement/${id_agreement}/${id_employed}`;
    return uploadDocs(files,url)
}