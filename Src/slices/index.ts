import { combineReducers } from "redux";



import LoginReducer from "./login/reducer";
import   Follow  from "./Leadfollow/reducer"
import SendData from "./lead details/reducer"
import AttendanceData from "./attendance/reducer"
import AttendanceLead from "./attendancslead/reducser"
import Assign from "./assignedlead/reducer"


const rootReducer = combineReducers({
    Login: LoginReducer,
    Follow:Follow,
    SendData:SendData,
     attendance:AttendanceData,
     AttendanceLead:AttendanceLead,
     Assign:Assign
});

export default rootReducer;