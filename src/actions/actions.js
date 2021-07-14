export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const USERUPDATE = 'USERUPDATE';
export const SETCARDS = 'SETCARDS';
export const SETCARD = 'SETCARDS';
export const AREAUPDATE = 'AREAUPDATE';
export const SETFRIEND = 'SETFRIEND';
export const SETCATEGORY = 'SETCATEGORY';

export const login = (data) => {
    return {
        type: LOGIN,
        payload: {
            isLogin: true,
            userInfo: data,
        }
    }
}

export const logout = () => {
    return {
        type: LOGOUT,
        payload: {
            isLogin: false,
        }
    }
}

export const userUpdate = (data) => {
    return {
        type: USERUPDATE,
        payload: {
            userInfo: data,
        }
    }
}

export const setCards = (data) => {
    return {
        type: SETCARDS,
        payload: {
            dailyCards: data,
        }
    }
}

export const areaUpdate = (data) => {
    return {
        type: AREAUPDATE,
        payload: {
            region: data,
        }
    }
}

export const setCard = (data) => {
    return {
        type: SETCARD,
        payload: {
            dailyCard: data,
        }
    }
}

export const setFriend = (data) => {
    return {
        type: SETFRIEND,
        payload: {
            friend: data,
        }
    }
}

export const setCategory = (data) => {
    return {
        type: SETCATEGORY,
        payload: {
            category: data,
        }
    }
}