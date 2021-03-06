import { GoogleLogout } from "react-google-login";
import { initialState } from "./initialState";
import { LOGIN, LOGOUT, SETCARDS, SETCARD, USERUPDATE, AREAUPDATE, SETCATEGORY, SETSELECTION } from '../actions/actions.js';

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
                    username: 'guest',
                    photo: '',
                    description: '',
                },
              });

        case SETCARDS:
            return Object.assign({}, state, {
                dailyCards: action.payload.dailyCards
            });

        case SETCARD:
            return Object.assign({}, state, {
                dailyCard: action.payload.dailyCard
            });

        case USERUPDATE:
            return Object.assign({}, state, {
                userInfo: action.payload.userInfo
            });;
        
        case AREAUPDATE:
            return Object.assign({}, state, {
                region: action.payload.region,
            });

        case SETCATEGORY:
            return Object.assign({}, state, {
                category: action.payload.category,
            });

        case SETSELECTION:
            return Object.assign({ ...state }, state.dailyCard.type = action.payload.type,
            );

        default:
            return state;
    }
}

export default reducer;