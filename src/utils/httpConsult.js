import { API_VERSION, BASE_PATH } from "../config"

export default function httpConsult(url, method, body=null) {
    const params = {
        method: method,
        headers: {
            'Content-type': 'application/json'
        },
    }
    if(body)
        params.body = JSON.stringify(body)
    
    const completeUrl = `http://${BASE_PATH}/api/${API_VERSION}/${url}`

    return fetch(completeUrl, params)
        .then(response => {
            return response.json()
        })
        .then(response => {
            if(response) {
                return {
                    success: response.success,
                    result: response.result,
                    message: response.message
                }
            } else {
                return {
                    success: false,
                    message: response.message
                }
            }
        })
        .catch(err => {
            console.log("err", err)
            return {
                success: false,
                message: err.message
            }
        })
}

export function uploadDocs(files, url, body=null) {

    const formData = new FormData();

    for(const i in files) {
        formData.append(`file${i}`, files[i]);
    }

    if(body) {          
          const claves = Object.keys(body)
          for(let i=0; i< claves.length; i++) {
            const clave = claves[i];
            const valor = body[clave];
            formData.append(clave, valor);
          }
    }
    
    const params = {
        method: "PUT",
        body: formData
    }

    return fetch(url, params)
    .then(response => {
        return response.json()
    })
    .then(response => {
        if(response) {
            return {
                success: response.success,
                result: response.result,
                message: response.message
            }
        } else {
            return {
                success: false,
                message: response.message
            }
        }
    })
    .catch(err => {
        console.log("err", err)
        return {
            success: false,
            message: err.message
        }
    })
}