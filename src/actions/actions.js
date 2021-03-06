export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const USERUPDATE = 'USERUPDATE';
export const SETCARDS = 'SETCARDS';
export const SETCARD = 'SETCARD';
export const AREAUPDATE = 'AREAUPDATE';
export const SETCATEGORY = 'SETCATEGORY';
export const SETSELECTION = 'SETSELECTION';

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

export const setSelection = (data) => {
    return {
        type: SETSELECTION,
        payload: {
            type: data,
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

export const setCategory = (data) => {
    return {
        type: SETCATEGORY,
        payload: {
            category: data,
        }
    }
}