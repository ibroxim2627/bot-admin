import axios from "axios";
import {URL} from './api'

axios.defaults.baseURL = URL
axios.defaults.withCredentials = true;

export const getRequest = ({url, params}) => axios.get(url, {params }).then(res => res.data)


export const postRequest = (url, {arg}) => axios.post(url, arg.data, {params: arg.params}).then(res => res.data)


export const triggerAxios = (url, {arg}) => axios(arg?.url || url, {
    ...arg,
    method: arg.method || "GET",
    params: arg.params,
    data: arg.data,
}).then(res => res.data)

export const afterRequest = (
    trigger,
    data = {},
    success = () => null,
    error = () => null,
    final = () => null
) => {
    trigger(data).then(res => success(res)).catch(err => error(err)).finally(() => final())
}