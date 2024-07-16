import { createSlice } from "@reduxjs/toolkit";
import { ModelUser } from "../../models/Models";



const initial: ModelUser = {
    id: -1,
    name: "",
    image: "",
    created_at: "",
    username: "",
    token: "",
    is_online: false,
    last_seen: ""
};

const userSlice = createSlice({
    name: 'user',
    initialState:initial,
    reducers: {
       setUser(state,action){
        return state = action.payload
       },
       removeUser(state,action){
        return state = initial
       },
       updateUserToken(state,action){
        return state = { ...state,token:action.payload};
       }
    }
})


export default userSlice.reducer;
export const {setUser,removeUser,updateUserToken} = userSlice.actions