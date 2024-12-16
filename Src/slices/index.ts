import { combineReducers } from "redux";



// Authentication
import LoginReducer from "./login/reducer";



const rootReducer = combineReducers({
    Login: LoginReducer,
   
});

export default rootReducer;