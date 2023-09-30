import { API_VERSION, BASE_PATH } from "../config";
import { uploadDocs } from "../utils/httpConsult";

export function uploadCVApi(files, id_student) {
    const url = `http://${BASE_PATH}/api/${API_VERSION}/doc/cv/${id_student}`;
    return uploadDocs(files,url)
}