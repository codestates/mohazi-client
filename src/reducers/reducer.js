import { GoogleLogout } from "react-google-login";
import { initialState } from "./initialState";
import { LOGOUT } from '../actions/actions.js';

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOGOUT:
            return Object.assign({}, state, {
                isLogin: false,
                userInfo: {
                    id: '',
                    email: '',
                    username: '', //default name (ex. guest)
                    photo: '', //default photo
                    description: '',
                },
              });

        default:
            return state;
    }
}

export default reducer;