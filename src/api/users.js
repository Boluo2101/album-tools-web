import axios from "./index.js"
import JSMD5 from "js-md5"

export const getUsernameByEmail = (email) => axios.get("/users/email/" + encodeURI(email), {})

export const registerUser = (data) => axios.post("/users", data, {})

export const loginByEmail = (email, password) => axios.get(`/users/login/${encodeURI(email)}/password/${JSMD5(password)}`, {})