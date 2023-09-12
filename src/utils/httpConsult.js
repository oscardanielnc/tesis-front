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
        .then(result => {
            if(result) {
                return {
                    success: true,
                    result
                }
            } else {
                return {
                    success: false,
                    message: result.message
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