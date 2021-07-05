import { withRouter, Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import axios from 'axios';
import React, { useState } from 'react';

const Modal_wrap = styled.div`
    display: none;
    width: 500px;
    height: 500px;
    position: absolute;
    top:50%;
    left: 50%;
    margin: -250px 0 0 -250px;
    background: white;
    z-index: 2;
    border-radius: 5px;
`;

const Modal_bg = styled.div`
    display: none;
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0,0, 0.5);
    top:0;
    left: 0;
    z-index: 1;
`;

const Modal_close = styled.img`
    width: 26px;
    height: 26px;
    position: absolute;
    top: -30px;
    right: 0;
    cursor: pointer;
`;

const Modal_content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    border-radius: 5px;
`;

const User = styled.div`
    color: yellow;
`;

const InputForm = styled.div`
    margin: 10px;
`;

const SearchResults = styled.div`
    margin: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    }
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
`;

function UpdateDetailPage() {
    const [friends, setFriends] = useState([]);
    let showUsers = null;

    function handleOpenModal() {
        document.querySelector('.modal_wrap').style.display ='block';
        document.querySelector('.black_bg').style.display ='block';
    }   
    function handleCloseModal() {
        document.querySelector('.modal_wrap').style.display ='none';
        document.querySelector('.black_bg').style.display ='none';
    }

    function handleBgClick(event) {
        //console.log(event.target.classList)
        if(event.target.classList.contains("black_bg")) {
            document.querySelector('.modal_wrap').style.display ='none';
            document.querySelector('.black_bg').style.display ='none';
        }
    }

    function handleSelectUser(event) {
        setFriends([...friends, event.target.value]);
        document.querySelector('.modal_wrap').style.display ='none';
        document.querySelector('.black_bg').style.display ='none';
    }

    function handleSearchUser(event) {
        console.log(event.target.value)
        axios.get(`https://localhost:4000/usersearch`,
        {
            'Content-Type': 'application/json',
            withCredentials: true,
        }, {
            email: event.target.value
        })
        .then(res => {
            let users = res.data.userinfo;
            showUsers = users.map(user => <User value={user} onClick={handleSelectUser}>{user.username} | {user.email}</User>)
        })
    }

    return (
        <div onClick={(e) => handleBgClick(e)}>
            <button onClick={handleOpenModal}>Search User</button>
            <Modal_bg className='black_bg'></Modal_bg>
            <Modal_wrap className='modal_wrap'>
                <Modal_close onClick={handleCloseModal} src="https://img.icons8.com/windows/32/000000/delete-sign.png"></Modal_close>
                <Modal_content>
                <div>친구의 이메일을 입력하세요</div>
                    <InputForm>
                        <input type='text' onKeyDown={(e) => handleSearchUser(e)}></input>
                        <button>검색</button>
                    </InputForm>
                    {showUsers? '': '일치하는 사용자가 없습니다'}
                </Modal_content>
                <SearchResults>{showUsers}</SearchResults>
            </Modal_wrap>
        </div>
    )
}

export default withRouter(UpdateDetailPage);