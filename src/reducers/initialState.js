export const initialState = {
    isLogin: false,
    userInfo: {
        id: '',
        email: '',
        username: '',
        photo: '',
        description: '',
    },
    region : '',
    selections: [],
    dailyCards: [
        {
            id: 3,
            date: 'date',
            userId: 1,
            photo: 'photo',
            selections: [  
                        {dailycardId:1},
                        {dailycardId:1},
                        ],
        },
        {
            id: 4,
            date: 'date',
            userId: 2,
            photo: 'photo',
            selections: [  
                        {dailycardId:2},
                        {dailycardId:2},
                        ],
        },
    ],
    dailyCard: {
        id: 3,
        date: 'date',
        userId: 1,
        photo: ['Food.jpg', 'department.jpg', 'cafe.jpg'], // 사용자가 찍은 사진들
        selections: [
            {
                dailycardId: 1,
                memo: '안녕',
                photo: 'Food.jpg', // 가게 사진
                data: '',
                type: 'resturant',
                type_id: {
                    name: 'name',
                    phone: '000-1111-2222',
                    status: '영업 중',
                    address: '강남구',
                    address_number: '01738',
                    type: '한식',
                }
            },
            {  dailycardId: 2,
                memo: '안녕하세요',
                photo: 'department.jpg',
                data: '',
                type: 'resturant',
                type_id: {
                    name: 'name',
                    phone: '000-1111-2222',
                    status: '영업 중',
                    address: '중랑구',
                    address_number: '01738',
                    type: '중식',
                }
            },
            {
                dailycardId: 3,
                memo: '안녕?',
                photo: 'cafe.jpg',
                data: '',
                type: 'cafe',
                type_id: {
                    name: 'name',
                    phone: '000-1111-2222',
                    status: '영업 중',
                    address: '노원구',
                    address_number: '01738',
                    type: '대형',
                }
            },
            {
                dailycardId: 4,
                memo: '안녕?',
                photo: 'cafe.jpg',
                data: '',
                type: 'cafe',
                type_id: {
                    name: 'name',
                    phone: '000-1111-2222',
                    status: '영업 중',
                    address: '노원구',
                    address_number: '01738',
                    type: '대형',
                }
            },
            {
                dailycardId: 5,
                memo: '안녕?',
                photo: 'cafe.jpg',
                data: '',
                type: 'cafe',
                type_id: {
                    name: 'name',
                    phone: '000-1111-2222',
                    status: '영업 중',
                    address: '노원구',
                    address_number: '01738',
                    type: '대형',
                }
            },
            
        ],
        friends: [
            {
                id: 'id',
                email: 'email',
                username: 'username',
                photo: 'madmonstar2.jpg',
                description: 'description',
            },
            {
                id: 'id',
                email: 'email',
                username: 'username',
                photo: 'madmonstar2.jpg',
                description: 'description',
            },
            {
                id: 'id',
                email: 'email',
                username: 'username',
                photo: 'madmonstar2.jpg',
                description: 'description',
            },
            {
                id: 'id',
                email: 'email',
                username: 'username',
                photo: 'madmonstar2.jpg',
                description: 'description',
            },
            {
                id: 'id',
                email: 'email',
                username: 'username',
                photo: 'madmonstar2.jpg',
                description: 'description',
            }
        ],
    },
}