export const initialState = {
    isLogin: false,
    userInfo: {
        id: '',
        email: '',
        username: 'guest',
        photo: '',
        description: '',
    },
    selections: [],
    dailyCards: [
        {
            id: 1,
            date: '2021-07-02',
            userId: 3,
            photo: 'photo',
            selections: [
                { place_name: "스타벅스" },
                { place_name: "현대미술관" },
            ],
        },
        {
            id:2,
            date: '2021-07-03',
            userId: 4,
            photo: 'photo',
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id: 3,
            date: '2021-07-04',
            userId: 3,
            photo: 'photo',
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id:4,
            date: '2021-07-05',
            userId: 5,
            photo: 'photo',
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id: 5,
            date: '2021-07-06',
            userId: 3,
            photo: 'photo',
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id:6,
            date: '2021-07-07',
            userId: 3,
            photo: 'photo',
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
    ],
    dailyCard: {},
}