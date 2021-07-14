import React, { useState } from 'react';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

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
    background-image: url('img/Memo.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
`;

const DetailTitle = styled.div`
    font-family: 'Fjalla One', sans-serif;
    font-size: 4em;
    margin: 120px 0 20px 150px;
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
    position: relative;
`;

const LeftTitle = styled.div`
    position: absolute;
    font-family: 'Fjalla One', sans-serif;
    font-size: 1.5em;
    top: -15px;
    left: 20px;
`;

const SelectionBox = styled.div`
    margin: 0 0 0 50px;
    border-radius: 20px;
    border: 2px solid black;
    position: relative;
`;

const Selection = styled.div`
    margin: 25px;
    & > * {
        
    }
`;

const PostIt = styled.div`
    display: flex;
`;

const PostIt1 = styled.div`
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

const PostIt2 = styled.div`
    width: 40%;
    height: 50px;
    border: 1px solid black;
    background-color: ${oc.gray[3]};
    display: flex;
`;

const PostItTitle = styled.h2`
    margin: 5px;
    height: 50px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2.2em;
`;

const PostItBtn = styled.button`
    width: 20px;
    height: 20px;
    margin: 15px auto;

`;

const MemoBox = styled.div`
    width: 80%;   
    margin: 20px 0 0 50px;   
`;

const PostItMemo = styled.div`
    white-space: pre-line;
    
    & > * {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.7em;
    }
`;

const Memo1 = styled.h4`
    margin: 5px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2em;
`;

const Memo2Box = styled.div`
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

const Memo2 = styled.h5`
    margin: 5px;
`;

const HoverBox = styled.div`
    margin: 5px;
    width: 95%;
    display: none;
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
    position: relative;    
    margin: 10px;
    width: 35%; 
`;

const RightTitle1 = styled.div`
    position: absoulte;
    top: 20px;
`;

const PhotoBox = styled.div`
    margin: 0px auto;
    border: 2px solid black;
    border-radius: 20px;
    overflow-y: auto;
    text-align: center;
    width: 100%;
    height: 800px;

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
    width: 90%;
    height: 150px;
    margin: 10px auto;
    border-radius: 20px;
`;

const PhotoImg = styled.img`
    border-radius: 20px;
    width: 100%;
    height: 150px;
    object-fit: cover;
`;


const FriendBox = styled.div`
    margin: 10px auto;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 500px;
    border: 2px solid black;
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
    margin: 10px;
    position: relative;
`;

const FriendPhoto = styled.div`
    width: 90px;
`;

const FriendPhotoImg = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 1px solid black;
`;

const FriendName = styled.div`

`;

const Btn = styled.button`
    position: absolute;
    top: 150px;
    left: 80%;
`;



function ShowDetailPage() {

    const history = useHistory();
    const { dailyCard } = useSelector((state) => state)

    console.log(dailyCard)

    const GoUpdateDetail = () => {
        history.push('/updatedetail')
    }

    const ShowHoverEvent = (e, index) => {
        console.log('a');
        let Div = document.querySelector(`#HoverBox${index}`)
        let Btn = document.querySelector(`#PostItBtn${index}`)

        if(Div.style.display === 'none'){
            Div.style.display = 'block';
            Btn.innerText = 'X';
        } else {
            Div.style.display = 'none';
            Btn.innerText = 'O';
        }
    }

    console.log(window.innerWidth)

    return (
        <Body>
        <DetailBody id="DetailBody">
            <DetailTitle>Daily Note: {dailyCard.date}</DetailTitle>
            <Btn onClick={GoUpdateDetail}>수정하기</Btn>
            <Box>
                <LeftBox>
                    <SelectionBox>
                        {dailyCard.selections.map((el, index) => {
                            return (
                                <Selection>
                                    <PostIt>
                                        <PostIt1 index={index}>
                                            <PostItNum>{index + 1}</PostItNum>
                                        </PostIt1>
                                        <PostIt2>
                                            <PostItTitle>{el.type.name}</PostItTitle>
                                            <PostItBtn id={`PostItBtn${index}`} onClick={(e) => ShowHoverEvent(e, index)}>O</PostItBtn>
                                        </PostIt2>
                                    </PostIt>
                                    <MemoBox>
                                        <Memo1>Memo: </Memo1>
                                        <PostItMemo>
                                            <Memo2Box id="Memo2Box">
                                                <Memo2>{el.memo}</Memo2>
                                            </Memo2Box>                
                                            <HoverBox id={`HoverBox${index}`}>
                                                <h4>-Info-</h4>
                                                <HoverTitle>name: {el.type.name}</HoverTitle>
                                                <HoverPhone>phone: {el.type.phone}</HoverPhone>
                                                <HoverAdd>add: {el.type.address}</HoverAdd>
                                            </HoverBox>
                                        </PostItMemo>
                                    </MemoBox>
                                </Selection>
                            )
                        })}
                    </SelectionBox>
                </LeftBox>
                <RightBox>
                    <PhotoBox>
                        {dailyCard.photo.map((el, index) => {
                            return (
                                <Photo className="Photo" index={index}>
                                    <PhotoImg src={el} />
                                </Photo>
                            )
                        })}
                    </PhotoBox>
                    <FriendBox>
                        {dailyCard.friends.map((el, index) => {
                            console.log(el.photo)
                            return (
                                <Friend>
                                    <FriendPhoto className="FriendsPhoto" index={index}>
                                        <FriendPhotoImg src={el.photo} />
                                    </FriendPhoto>
                                    <FriendName>
                                        {el.username}
                                    </FriendName>
                                </Friend>
                            )
                        })}
                    </FriendBox>
                </RightBox>
            </Box>
        </DetailBody>
        </Body>
    )
}

export default withRouter(ShowDetailPage);