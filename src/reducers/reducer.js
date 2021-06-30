import { GoogleLogout } from "react-google-login";
import { initialState } from "./initialState";
import { LOGIN, LOGOUT, CREATECARD } from '../actions/actions.js';

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN: 
            return Object.assign({}, state, {
                isLogin: true,
                userInfo: action.payload.userInfo,
            });
        case LOGOUT:
            return Object.assign({}, state, {
                isLogin: false,
                userInfo: {
                    id: '',
                    email: '',
                    username: 'guest', //default name (ex. guest)
                    photo: '', //default photo
                    description: '',
                },
              });
        case CREATECARD:
            return Object.assign({}, state, {
                dailyCard: action.payload.dailyCard,
              });

        default:
            return state;
    }
}

export default reducer;