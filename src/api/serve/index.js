import { Menu } from "../../data";

export const getMenu  = ()=>{
    return new Promise(res=>res(Menu))
}