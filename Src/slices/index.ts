import { combineReducers } from "redux";



// Authentication
import LoginReducer from "./login/reducer";
import   Follow  from "./Leadfollow/reducer"
import SendData from "./lead details/reducer"
import AttendanceData from "./attendance/reducer"



const rootReducer = combineReducers({
    Login: LoginReducer,
    Follow:Follow,
    SendData:SendData,
     attendance:AttendanceData,
});

export default rootReducer;