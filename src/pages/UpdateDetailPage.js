import React, { useState } from 'react';
import axios from "axios";
import { login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const DetailBody = styled.div`
    box-sizing: border-box;
    width: 100%;
`;

const SelectionBox = styled.div`
    width: 80%;
    display: flex;
    border: 1px solid black;
    border-radius: 20px;
    margin: 50px auto;
    overflow-x: auto;
`;

const Selection = styled.div`
    margin: 5px auto;
    width: 250px;
    height: 400px;
    border-radius: 20px;
    position: relative;
    
    & > * {
        margin: auto;
        width: 250px;
        height: 400px;
        border-radius: 20px;
    }

    &:hover .SelectionImg {
        opacity: 0;
    }

    &:hover .SelectionHover {
        opacity: 1;
        transition: all 0.5s ease 0s;
        transform: translateX(${props => {
            if(props.index === props.length-1){
                return -10;
            }
            return 10;
        }}%) scaleX(1.2);
        background-color: white;
        z-index: 2;
    }

`;

const SelectionImg = styled.img`
    margin: 0;
`;

const SelectionHover = styled.div`
    position: absolute;
    top: 0px;
    width: 250px;
    height: 400px;
    border: 1px solid black;
    opacity: 0;
    & > * {
        transform: scaleX(0.9) translate(70%);
    }
`;

const SelectionName = styled.div`

`;

const SelectionMemo = styled.div`

`;

const SelectionPost = styled.div`

`;

const SecondBox = styled.div`
    width: 85%;
    height: 230px;
    display: flex;
    margin: 50px auto;
    flex-wrap: wrap;
`;

const PhotoBox = styled.div`
    display: flex;
    width: 70%;
    height: 100%;
    margin: auto;
    padding: 20px;
    border: 1px solid black;
    border-radius: 20px;
    overflow-x: auto;
`;

const Photo = styled.div`
    float: left;
`;

const PhotoImg = styled.img`
    margin: 5px;
    width: 180px;
    height: 180px;
`;

const FriendBox = styled.div`
    margin: auto;
    width: 20%;
    height: 100%;
    border: 1px solid black;
    border-radius: 20px;
    overflow-x: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
`;

const Friend = styled.div`
    margin: 5px;
    position: relative;
`;

const FriendPhoto = styled.div`
    width: 80px;
`;

const FriendPhotoImg = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 50%;
`;

const FriendName = styled.div`
    position: absolute;
    top: 68px;
`;

const Btn = styled.div`
    width: 80%;
    height: 50px;
    margin: 0 auto;
`;

const UpdateBtn = styled.button`
    float: right;
    margin: 0 0 30px 0;
`;

//---modal---
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
    const history = useHistory();
    const { dailyCard } = useSelector((state) => state)

    const GoUpdateDetail = () => {
        history.push('/showdetail')
    }

    function setThumbnail(event) { 
        var reader = new FileReader(); 
        reader.onload = function(event) { 
            var img = document.createElement("img"); 
            img.setAttribute("src", event.target.result); 
            document.getElementById("image_container").appendChild(img); 
            console.log('');
        }; 
        reader.readAsDataURL(event.target.files[0]); 
    }
  
  //---modal---
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
        axios.get(`${server}/usersearch`,
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
        <DetailBody>
            <SelectionBox>
            {dailyCard.selections.map((el, index) => {
                        return (
                            <Selection className="Selection" length={dailyCard.selections.length} index={index}>
                                <SelectionImg className="SelectionImg" src={el.photo}></SelectionImg>
                                <SelectionHover className="SelectionHover">
                                    <SelectionName>{el.type_id.name}</SelectionName>
                                    <SelectionMemo>{el.memo}</SelectionMemo>
                                    <SelectionPost>
                                    </SelectionPost>
                                </SelectionHover>
                            </Selection>
                        )
                    })}
            </SelectionBox>
            <SecondBox>
                <PhotoBox>
                    {dailyCard.photo.map((el, index) => {
                        return (
                            <Photo className="Photo" index={index}>
                                <PhotoImg src={el}/>
                            </Photo>
                        )
                    })}
                    <Photo>
                    <input type="file" id="image" accept="image/*" onchange="setThumbnail(event);"/> 
                    <div id="image_container"></div>


                    </Photo>
                </PhotoBox>
                <FriendBox>
                {dailyCard.friends.map((el, index) => {
                    console.log(el.photo)
                    return (
                        <Friend>
                            <FriendPhoto className="FriendsPhoto" index={index}>
                                <FriendPhotoImg src={el.photo}/>
                            </FriendPhoto>
                            <FriendName>
                                {el.username}
                            </FriendName>
                        </Friend>
                    )
                })}
                </FriendBox>
            </SecondBox>
            <Btn>
                <UpdateBtn onClick={GoUpdateDetail}>저장하기</UpdateBtn>
            </Btn>
        </DetailBody>
    )
}

export default withRouter(UpdateDetailPage);

// <div onClick={(e) => handleBgClick(e)}>
//             <button onClick={handleOpenModal}>Search User</button>
//             <Modal_bg className='black_bg'></Modal_bg>
//             <Modal_wrap className='modal_wrap'>
//                 <Modal_close onClick={handleCloseModal} src="https://img.icons8.com/windows/32/000000/delete-sign.png"></Modal_close>
//                 <Modal_content>
//                 <div>친구의 이메일을 입력하세요</div>
//                     <InputForm>
//                         <input type='text' onKeyDown={(e) => handleSearchUser(e)}></input>
//                         <button>검색</button>
//                     </InputForm>
//                     {showUsers? '': '일치하는 사용자가 없습니다'}
//                 </Modal_content>
//                 <SearchResults>{showUsers}</SearchResults>
//             </Modal_wrap>
//         </div>