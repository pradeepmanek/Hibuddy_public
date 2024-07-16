import { Platform } from "react-native"

const base_url_local = Platform.OS === "ios" ? "http://localhost:8000" : "http://10.0.2.2:8000"
const base_url_dev = ""
const base_url_live = ""

const base_api_local = `${base_url_local}/local/api`
const base_api_dev = `${base_url_dev}/development/api`
const base_api_live = `${base_url_live}/live/api`

export const base_url = base_url_dev
export const base_api = base_api_dev
