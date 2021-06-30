export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const USERUPDATE = 'USERUPDATE';
export const CREATECARD = 'CREATECARD';

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

export const createCard = (data) => {
    return {
        type: CREATECARD,
        payload: {
            dailyCard: data,
        }
    }
}

