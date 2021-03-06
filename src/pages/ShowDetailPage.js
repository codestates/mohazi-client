import React, { useEffect, useState } from 'react';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import axios from 'axios';

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const s3ImageURl = process.env.REACT_APP_S3_IMAGE_URL;

const Body = styled.div`
    width: 100%;
    background-color: white;
`;

const DetailBody = styled.div`
    box-sizing: border-box;
    height: 100%;
    margin: 0 auto;
    border: 1px solid white;
    position: relative;
    background-image: url('img/bermuda-231.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
`;

const DetailTitle = styled.div`
    width: 80%;
    height: 80px;
    display: flex;
    font-family: 'Nanum Pen Script', cursive;
    margin: 240px auto 0px;
`;

const Title = styled.div`
    width:85%;
    padding: 10px;
    font-weight: 600;
    font-size: 3em;
    margin: 0;
`;

const Admin = styled.div`
    width: 80%;
    padding: 10px;
    font-weight: 600;
    font-size: 3em;
    margin: 0 0 0 450px;
`;

const Profile = styled.img`
    margin: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid black;
`;

const Box = styled.div`
    margin: 0 auto 100px auto;
    width: 80%;
    height: 80%;
    display: flex;
`;

const LeftBox = styled.div`
    margin: 10px;
    width: 65%;
    height: ${props => {
        return 85 * props.hei + 144 * props.hei + 330;
    }}px;
    position: relative;
`;


const SelectionBox = styled.div`
    margin: 0 auto;
    background: ${oc.yellow[0]};
    border-radius: 20px;
    
    position: absolute;
    width: 90%;
`;

const MemoBox = styled.div`
    margin: 0 auto;
    background: ${oc.yellow[0]};
    border-radius: 20px;
    
    position: absolute;
    top: ${props => {
        return 249 + 220 * (props.hei - 1) + 20;
    }}px;
    width: 90%;
    height: 300px;
    white-space: pre-line;
    
    & > * {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.7em;
    }
`;

const Selection = styled.div`
    margin: 25px;
`;

const PostIt = styled.div`
    display: flex;
`;

const PostItLeft = styled.div`
    width: 50px;
    height:50px;
    border: 1px solid black;
    background-color: ${props => {
        switch(props.index){
            case 0: return oc.red[5];
            case 1: return oc.orange[5];
            case 2: return oc.yellow[5];
            case 3: return oc.green[5];
            case 4: return oc.indigo[5];
            default: return oc.grape[5];
        }
    }};
    text-align: center;
    vertical-align: middle;
`;

const PostItNum = styled.h2`
    width: 40px;
    height: 40px;
    margin: 0 0 0 3px;
    font-size: 2em;

`;

const PostItRight = styled.div`
    width: 330px;
    height: 50px;
    border: 1px solid black;
    background-color: white;
    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 2px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }
`;

const PostItTitle = styled.div`
    float: left;
    margin: 5px;
    height: 50px;
    font-family: 'Nanum Pen Script', cursive;
    font-weight: 1000;
    font-size: 2.2em;
`;

const PostItBtn = styled.button`
    float:right;
    width: 20px;
    height: 50px;
    
    border-left-width: 2px;

    &: focus {
        outline:none;
    }
`;

const PostItInfo = styled.div`
    width: 80%;   
    margin: 20px 0 0 50px;   
`;

const InfoBox = styled.div`
    white-space: pre-line;
    
    & > * {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.7em;
    }

`;

const MemoTitle = styled.h4`
    margin: 10px 0 0 25px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2em;
`;

const MemoContent = styled.div`
    margin: 0 0 0 25px;
    height: 120px;
    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 5px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};

      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }
`;

const MemoText = styled.h5`
    margin: 5px;
`;

const HoverBox = styled.div`
    margin: 5px;
    width: 95%;
    height: 125px;
    display: block;

    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 0px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};

      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }

    & > * {
        margin: 5px;
    }
`;

const HoverTitle = styled.h5`

`;

const HoverAdd = styled.h5`

`;

const HoverPhone = styled.h5`

`;

const RightBox = styled.div`
    margin: 10px;
    width: 35%; 
    height: ${props => {
        return 85 * props.hei + 144 * props.hei + 300;
    }}px;
`;

const PhotoBox = styled.div`
    margin: 0px auto;
    background: ${oc.yellow[0]};
    
    border-radius: 20px;
    overflow-y: auto;
    width: 100%;
    height: 60%;

    &::-webkit-scrollbar{
        width: 5px;
        height: 100px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }

    &::-webkit-scrollbar-track-piece:end {
        background: transparent;
        margin-bottom: 15px;
    }

    &::-webkit-scrollbar-track-piece:start {
        background: transparent;
        margin-top: 15px;
    }
`;

const Photo = styled.div`
    width: 45%;
    float: left;
    margin: 2.5%;
    border-radius: 20px;
    position: relative;
    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }  
   
`;

const PhotoImg = styled.img`
    position: absolute;
    border-radius: 20px;
    width:100%;
    height: 100%;
    object-fit: cover;
`;


const FriendBox = styled.div`
    margin: 20px auto;
    background: ${oc.yellow[0]};
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 30%;
    
    border-radius: 20px;

    &::-webkit-scrollbar{
        width: 5px;
        height: 100px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }

    &::-webkit-scrollbar-track-piece:end {
        background: transparent;
        margin-bottom: 15px;
    }

    &::-webkit-scrollbar-track-piece:start {
        background: transparent;
        margin-top: 15px;
    }

`;

const Friend = styled.div`
    float: left;
    width: 30%;
    position: relative;
    margin: 10px 1.5%;
    position: relative;
    &:after {
        content: "";
        display: block;
        padding-bottom: 120%;
    }
`;

const FriendPhoto = styled.div`
    position: absolute;
    width: 100%;
    height: 80%;
`;

const FriendPhotoImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid black;
`;

const FriendName = styled.div`
    font-family: 'Nanum Pen Script', cursive;
    font-size: 30px;
    position: absolute;
    top: 77%;
    width: 100%;
    text-align: center;
`;

const Btn = styled.button`
    margin: 0 10px 0 0;
    width: 45%;
    height: 40px;
    border-radius: 20px;
    border: 0;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2em;
    background: ${oc.yellow[0]};
    &: focus {
        outline:none;
    }
    &: hover {
        background: ${oc.red[2]};
        transform: scale(1.01);
        cursor: pointer;
        border: 2px solid black;
    }
`;

const MyPageBtn = styled.button`
    margin: 0 0 0 10px;
    width: 45%;
    height: 40px;
    border-radius: 20px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 30px;
    background: ${oc.yellow[0]};
    border: 0;

    &: focus {
        outline:none;
    }
    &: hover {
        background: ${oc.red[2]};
        transform: scale(1.01);
        cursor: pointer;
        border: 2px solid black;
    }
`;

const Username = styled.div`
    width: 150px;
    font-size: 32px;
    font-weight: 600;
    text-align: right;
    padding: 20px 0 0 0;
`;

const Name = styled.div`
    width: 150px;
    font-size: 32px;
    font-weight: 600;
    padding: 20px 15px 0 10px;
`;

function ShowDetailPage() {

    const history = useHistory();
    const { dailyCard, userInfo, isLogin } = useSelector((state) => state)

    console.log(dailyCard)

    const GoUpdateDetail = () => {
        history.push('/updatedetail')
    }

    const ShowHoverEvent = (e, index) => {
        let Div = document.querySelector(`#HoverBox${index}`)
        let Btn = document.querySelector(`#PostItBtn${index}`)
        
        if(Div.style.display === 'none'){
            Div.style.display = 'block';
            Btn.innerText = '↾';
        } else {
            Div.style.display = 'none';
            Btn.innerText = '⇂';
        }

    }

    const isME = () => {
        console.log(dailyCard.admin, userInfo.id)
        if(dailyCard.admin === userInfo.id){
            return (
                <Btn onClick={GoUpdateDetail}>수정하기</Btn>
            )
        }
    }

    const goMypage = () => {
        history.push('/mypage');
    }

    useEffect(() => {
        if(!isLogin) {
            history.push('/pagenotfound');
        }
    },[]);
    
    return (
        <Body>
            <DetailBody id="DetailBody">
                <DetailTitle>
                    <Title>날짜: {dailyCard.date}</Title>
                    <Username>작성자:</Username>
                    <Name>{userInfo.username}</Name>
                    {dailyCard.friends.filter((el) => el.id === userInfo.id).map((el) => {
                        if (el.photo !== null) {
                            return (
                                <Profile src={s3ImageURl + '/' + el.photo} />
                            )
                        } else {
                            return (
                                <Profile src="/img/default_avatar.png" />
                            )
                        }
                    })}
                </DetailTitle>

            <Box>
                <LeftBox hei={dailyCard.type.length}>
                    <SelectionBox id="SelectionBox">
                        {dailyCard.type.map((el, index) => {
                            return (
                                <Selection>
                                    <PostIt>
                                        <PostItLeft index={index}>
                                            <PostItNum>{index + 1}</PostItNum>
                                        </PostItLeft>
                                        <PostItRight>
                                            <PostItTitle>{el.place_name}</PostItTitle>               
                                        </PostItRight>
                                        <PostItBtn id={`PostItBtn${index}`} onClick={(e) => ShowHoverEvent(e, index)}>↾</PostItBtn>
                                    </PostIt>
                                    <PostItInfo>
                                        <InfoBox>
                                            <HoverBox id={`HoverBox${index}`}>
                                                <h4>-Info-</h4>
                                                <HoverTitle>name: {el.place_name}</HoverTitle>
                                                <HoverPhone>phone: {el.phone}</HoverPhone>
                                                <HoverAdd>add: {el.address_name}</HoverAdd>
                                            </HoverBox>
                                        </InfoBox>
                                    </PostItInfo>
                                </Selection>
                            )
                        })}
                        </SelectionBox>
                        <MemoBox hei={dailyCard.type.length}> 
                                <MemoTitle>Memo: </MemoTitle>
                                <MemoContent id="MemoContent">
                                    <MemoText>{dailyCard.memo}</MemoText>
                                </MemoContent> 
                        </MemoBox>
                </LeftBox>
                <RightBox  hei={dailyCard.type.length}>
                    <PhotoBox id="PhotoBox">
                        {JSON.parse(dailyCard.photo).map((el, index) => {
                            return (
                                <Photo id="Photo" index={index}>
                                    <PhotoImg src={s3ImageURl + '/' + el} />
                                </Photo>
                            )
                        })}
                        </PhotoBox>
                        <FriendBox>
                            {dailyCard.friends.filter((el) => el.id !== userInfo.id).map((el, index) => {
                                console.log(el.photo)
                                if (el.photo !== null) {
                                    return (
                                        <Friend id="Friend">
                                            <FriendPhoto index={index}>
                                                <FriendPhotoImg src={s3ImageURl + '/' + el.photo} />
                                            </FriendPhoto>
                                            <FriendName>
                                                {el.username}
                                            </FriendName>
                                        </Friend>
                                    )
                                } else {
                                    return (
                                        <Friend id="Friend">
                                            <FriendPhoto index={index}>
                                                <FriendPhotoImg src="/img/default_avatar.png" />
                                            </FriendPhoto>
                                            <FriendName>
                                                {el.username}
                                            </FriendName>
                                        </Friend>
                                    )
                                }
                            })}
                    </FriendBox>
                    {isME()}
                    <MyPageBtn onClick={goMypage}>돌아가기</MyPageBtn>
                </RightBox>
            </Box>
        </DetailBody>
        </Body>
    )
}

export default withRouter(ShowDetailPage);