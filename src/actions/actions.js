export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = (data) => {
    data = '';

    return {
        type: LOGIN,
        payload: {
            
        }
    }
}

export const logout = () => {
    return {
        type: LOGOUT,
    }
}
