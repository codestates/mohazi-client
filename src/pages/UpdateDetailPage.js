import React, { useState } from 'react';
import axios from "axios";
import { setFriend, login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import SearchUserModal from '../components/Modals//SearchUser';

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const s3ImageURl = process.env.REACT_APP_S3_IMAGE_URL;

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

const Upload = styled.div`
    display: flex;
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

const AddFriend = styled.div`
    width: 50px;
    font-weight: 500;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;

    > img {
        border-radius: 50%;
        width: 45px;
        height: 45px;
        margin: 5px;
    }
`;

function UpdateDetailPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { dailyCard, friend } = useSelector((state) => state)

    const GoUpdateDetail = () => {
        //저장할 때 state의 friend를 초기화시켜줘야 합니다
        dispatch(setFriend({}));
        history.push('/showdetail');
    }

    function setThumbnail(event) { 
        var reader = new FileReader(); 
        reader.onload = function(event) { 
            var img = document.createElement("img"); 
            img.setAttribute("src", event.target.result); 
            img.width = 180;
            img.height = 180;
            document.getElementById("image_container").appendChild(img); 
            console.log('');
        }; 
        reader.readAsDataURL(event.target.files[0]); 
        console.log(reader);
    }

    function handleOpenModal() {
        document.querySelector('.search_user_modal').style.display ='block';
        document.querySelector('.search_user_bg').style.display ='block';
    }

    return (
        <DetailBody>
            <SearchUserModal/>
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
                    <input type="file" multiple id="image" accept="image/*" onChange={(e) => setThumbnail(e)}/> 
                    <Upload id="image_container"></Upload>
                    </Photo>
                </PhotoBox>
                <FriendBox onClick={handleOpenModal}>
                    <AddFriend>
                        <img src={s3ImageURl + '/' + friend.photo}/>
                        <div>{friend.username}</div>
                    </AddFriend>
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