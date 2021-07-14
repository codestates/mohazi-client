export const initialState = {
    isLogin: false,
    userInfo: {
        id: '',
        email: '',
        username: 'guest',
        photo: null,
        description: '',
    },
    region : { 'x': null, 'y': null},
    category: null,
    friend: {
        id: '',
        email: '',
        username: '',
        photo: '',
        description: '',
    },
    dailyCards: [
        {
            id: 1,
            date: '2021-07-02',
            userId: 3,
            photo: null,
            selections: [
                { place_name: "스타벅스" },
                { place_name: "현대미술관" },
            ],
        },
        {
            id:2,
            date: '2021-07-03',
            userId: 4,
            photo: null,
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id: 3,
            date: '2021-07-04',
            userId: 3,
            photo: null,
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id:4,
            date: '2021-07-05',
            userId: 5,
            photo: null,
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id: 5,
            date: '2021-07-06',
            userId: 3,
            photo: null,
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
            ],
        },
        {
            id:6,
            date: '2021-07-07',
            userId: 3,
            photo: null,
            selections: [
                { place_name: "MoMa" },
                { place_name: "Whitney Museum" },
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
                memo: '이제 맛집 리뷰의 메인이라 할 수 있는 주문한 메뉴에 대한 내용을 작성하는 부분인데요.이 부분은 그야말로 작성자의 글과 개인적인 생각이 가장 진하게 녹아지는 부분이라 생각됩니다.',
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