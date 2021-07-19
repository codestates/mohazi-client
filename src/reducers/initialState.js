export const initialState = {
    isLogin: false,
    userInfo: {
        id: null,
        email: null,
        username: 'guest',
        photo: null,
        description: '',
    },
    region : { 'x': null, 'y': null},
    category: null,
    dailyCards: [],
    dailyCard: { friends: null },
}