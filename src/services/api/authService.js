import HttpService from "@/services/http/HttpService"

const authenticate  = async (data) => {
    return await HttpService.post("/auth", {
        username: data.username,
        password: data.password
    });
}

const checkValidToken  = (token) => {
    return HttpService.post("/check-token", {token})
}

export {
    authenticate,
    checkValidToken
}