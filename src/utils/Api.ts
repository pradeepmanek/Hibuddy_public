import { useDispatch } from "react-redux";
import { base_api } from "./constant";
import { updateUserToken } from "../redux/slice/userSlice";
import { Alert } from "react-native";


type RequestOptions = {
    method: string;
    headers: {
      Authorization?: string;
      'Content-Type'?: string;
      Accept?: string;
    };
    body?: any; // Make 'body' optional
    signal:AbortSignal;
  };

const callApiWith = async (strURL: string, method: string = 'GET',token:string | undefined  = undefined,param:object | undefined  = undefined,isShowError:boolean=true) => {
    try {
        let controller = new AbortController()
        setTimeout(() => controller.abort(), 5000); 
        let requestOptions:RequestOptions = {
            method: method,
            headers: {},
            signal: controller.signal
        }
        //headers
        if (token){
            requestOptions.headers.Authorization = token
        }
        if (strURL == "update_profile") {
            requestOptions.headers["Content-Type"] = 'multipart/form-data'
        }else{
            requestOptions.headers["Content-Type"] = 'application/json'
            requestOptions.headers.Accept = 'application/json'
        }
        //body
        if (method != "GET") {
            if (strURL == "update_profile") {
                requestOptions.body = param
            }else{
                requestOptions.body = JSON.stringify(param)
            }
        }
        console.log("api=>",`${base_api}/${strURL}`)
        console.log("requestOptions=>",requestOptions)
        const response = await fetch(`${base_api}/${strURL}`,requestOptions)
        const errorMsg = validateAPIResponse(response)
        if (errorMsg) {
            throw new Error(errorMsg);
        }
        const responseJson = await response.json()
        if (responseJson.statusCode == 200) {
            return responseJson.data
        } else {
            throw new Error(responseJson.msg);
        }
    } catch (error: any) {
        if (isShowError){
            showAlert(error.message)
        }
    }
}
const validateAPIResponse = (response: Response): string | void => {
    if (!response.ok) {
        if (response.status == 401) {
            return 'Unauthorized user';
        } else if (response.status == 200) {
            response.json()
                .then(responseJson => {
                    const dispatch = useDispatch()
                    dispatch(updateUserToken(responseJson.newToken))
                })
        }
    }
}

const showAlert = (msg: string) => {
    Alert.alert('Error', msg, [
        { text: 'OK' },
    ]);

}

export default callApiWith
