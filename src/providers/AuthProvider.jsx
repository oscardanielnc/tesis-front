import React, {useState, createContext} from "react";

function getUserToken() {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if(!accessToken || accessToken==="null") return null;
    
    let user = null
    try {
        user = JSON.parse(accessToken)
    } catch(e) {
        console.log(e)
    }

    // return willExpireToken(accessToken)? null : accessToken;
    return user
}

function willExpireToken(accessToken) {
    const seconds = 60;
    const { expire } = accessToken;
    const now = (Date.now() + seconds)/1000;

    return now > expire;
}

function logout() {
    localStorage.removeItem("ACCESS_TOKEN")
}

let preUser = null
const userToken = getUserToken();
if(userToken) {
    preUser = userToken
} else {
    logout();
    preUser = null
}

export const AuthContext = createContext();
export default function AuthProvider({children}) {
    const [user, setUser] = useState(preUser);

    const updateUser = newUser => {
        localStorage.setItem("ACCESS_TOKEN", JSON.stringify(newUser));
        setUser(newUser);
    }

    return (
        <AuthContext.Provider value={{user, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}


