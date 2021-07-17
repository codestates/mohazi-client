import { Link, withRouter, Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends, setCard } from '../../actions/actions.js';
import oc from 'open-color';

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const s3ImageURl = process.env.REACT_APP_S3_IMAGE_URL;

const Modal_wrap = styled.div`
    display: none;
    width: 400px;
    height: 500px;
    position: absolute;
    top:50%;
    left: 50%;
    margin: -250px 0 0 -250px;
    background: white;
    z-index: 2;
    border-radius: 10px;
`;

const Modal_bg = styled.div`
    display: none;
    position: absolute;
    content: "";
    width: 133%;
    height: 100%;
    background-color:rgba(0, 0,0, 0.5);
    top:0;
    left: -20%;
    z-index: 1;
`;

const Modal_close = styled.img`
    width: 26px;
    height: 26px;
    position: absolute;
    top: 0px;
    right: 0;
    cursor: pointer;
`;

const Modal_content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;

const Title = styled.div`
    width: 100%;
    text-align: center;
    margin: 20px 0;
    padding: 20px;
    font-size: 3rem;
    background: white;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.indigo[4]};
`;

const User = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    color: ${oc.gray[7]};
    font-weight: 600;
    border-radius: 10px;

    > img {
        border-radius: 50%;
        width: 45px;
        height: 45px;
        margin: 10px;
    }

    &:hover {
        cursor: pointer;
        background: ${oc.yellow[4]};
        color: white;
     }
`;

const ErrorMessage = styled.div`
    color: ${oc.gray[8]}
`;

const SearchField = styled.div`
    border-radius: 3px;
    border: 3px solid black;
    background: white;
    width: 270px;
    height: 40px;
    right: 20px;
    display: flex;

    > input {
        border: none;
        float: left;
        margin-left: 10px;
        width: 200px;
    }
    
    > img {
        margin-left: 20px;
        
     &:hover {
        cursor: pointer;
     }   
    }
`;

const ResultField = styled.div`
    margin: 10px;
    width: 270px;
    height: 250px;
    margin: 20px 0;

    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    }
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
`;

function SearchUserModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState([]);
    const [inputValue, setInputValue] = useState(null);
    const state = useSelector(state => state);
    const { dailyCard } = state; //친구를 추가하고 싶은 데일리 카드
    const defaultProfileImg = '/img/default_profile_img.png'

    function handleOpenModal() {
        document.querySelector('.search_user_modal').style.display ='block';
        document.querySelector('.search_user_bg').style.display ='block';
    } 

    function handleCloseModal() {
        document.querySelector('.search_user_modal').style.display ='none';
        document.querySelector('.search_user_bg').style.display ='none';
    }

    function handleBgClick(event) {
        //console.log(event.target.classList)
        if(event.target.classList.contains("search_user_bg")) {
            document.querySelector('.search_user_modal').style.display ='none';
            document.querySelector('.search_user_bg').style.display ='none';
        }
    }

    function handleSelectUser(event) {
        const friendId = event.target.id;
        console.log('friendId', friendId);
        
        axios
            .put(`${server}/addfriend`,
            {
                userId: friendId,
                dailyCardId: dailyCard.dailyCards_id,
            },
            {
                'Content-Type': 'application/json',
                withCredentials: true,
            })
            .then(res => {
              console.log(res.data);
                axios
                    .put(`${server}/dailycardinfo`,
                        {
                            dailyCardId: dailyCard.dailyCards_id, 
                        },
                        {
                            'Content-Type': 'application/json',
                            withCredentials: true,
                        })
                    .then(res => {
                        console.log('dailycard', res)
                        // dispatch(setCard({
                        //     date: res.data.date,
                        //     userId: 1,
                        //     photo: res.data.photo, // 사용자가 찍은 사진들
                        //     selections: res.data.selections,
                        //     friends: res.data.friends
                        // }))
                        dispatch(setCard(res.data.data))

                        document.querySelector('.search_user_modal').style.display = 'none';
                        document.querySelector('.search_user_bg').style.display = 'none';
                        })
            })
            .catch(err => console.log(err))
        // const friend = users.filter(user => user.id === Number(friendId));
        // console.log('친구추가',friend[0])
        // dispatch(setFriend(friend[0]));
    }

    function handleSearchUser() {
        axios
            .put(`${server}/usersearch`,
                {
                    email: inputValue,
                },{
                    'content-type': 'application/json',
                    withCredentials: true
                }
                )
            .then(res => {
                console.log(res.data)
                //let users = res.data.userInfo;
                setUsers([...res.data.userInfo]);
            })
            .catch(err => {
                setUsers([]);
            })
    }

    useEffect(() => {
        if(users) {
            setShowUsers(users.map(user => 
                <User id={user.id} onClick={handleSelectUser}>
                    <img src={user.photo? s3ImageURl + '/' + user.photo : defaultProfileImg}/>
                    <div>{user.username}</div>
                </User>));
        }
    }, [users])

    return (
        <div onClick={(e) => handleBgClick(e)}>
            <Modal_bg className='search_user_bg'></Modal_bg>
            <Modal_wrap className='search_user_modal'>
                <Modal_close onClick={handleCloseModal} src="https://img.icons8.com/windows/32/000000/delete-sign.png"></Modal_close>
                <Title>Find your friend</Title>
                <Modal_content>
                    <SearchField>
                        <input type='text' placeholder="친구 이메일 주소를 입력하세요" onChange={(e) => setInputValue(e.currentTarget.value)}></input>
                        <img onClick={handleSearchUser} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjMuMTExIDIwLjA1OGwtNC45NzctNC45NzdjLjk2NS0xLjUyIDEuNTIzLTMuMzIyIDEuNTIzLTUuMjUxIDAtNS40Mi00LjQwOS05LjgzLTkuODI5LTkuODMtNS40MiAwLTkuODI4IDQuNDEtOS44MjggOS44M3M0LjQwOCA5LjgzIDkuODI5IDkuODNjMS44MzQgMCAzLjU1Mi0uNTA1IDUuMDIyLTEuMzgzbDUuMDIxIDUuMDIxYzIuMTQ0IDIuMTQxIDUuMzg0LTEuMDk2IDMuMjM5LTMuMjR6bS0yMC4wNjQtMTAuMjI4YzAtMy43MzkgMy4wNDMtNi43ODIgNi43ODItNi43ODJzNi43ODIgMy4wNDIgNi43ODIgNi43ODItMy4wNDMgNi43ODItNi43ODIgNi43ODItNi43ODItMy4wNDMtNi43ODItNi43ODJ6bTIuMDEtMS43NjRjMS45ODQtNC41OTkgOC42NjQtNC4wNjYgOS45MjIuNzQ5LTIuNTM0LTIuOTc0LTYuOTkzLTMuMjk0LTkuOTIyLS43NDl6Ii8+PC9zdmc+" />
                    </SearchField>
                    <ResultField>
                        {users.length ? showUsers : <ErrorMessage>일치하는 사용자가 없습니다</ErrorMessage>}
                    </ResultField>
                </Modal_content>
            </Modal_wrap>
        </div>
    )
}

export default SearchUserModal;