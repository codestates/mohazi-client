export const initialState = {
    isLogin: false,
    userInfo: {
        id: '',
        email: '',
        username: '',
        photo: '',
        description: '',
    },
    selections: [],
    dailiyCard: { //새로 생성한 카드
        id: '',
        user_id: '',
        photo: '', //default photo
        date: ''
    }
}