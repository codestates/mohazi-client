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
    width: 60%;
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
    margin: 100px 0 20px 150px;
`;

const Box = styled.div`
    margin: 0 auto 100px auto;
    width: 80%;
    height: 80%;
    display: flex;
    border: 1px solid black;
`;

const LeftBox = styled.div`
    margin: 10px;
    width: 65%;
    border: 1px solid black;
`;

const SelectionBox = styled.div`
    border: 1px solid black;
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
    width: 250px;
    height: 50px;
    border: 1px solid black;
    background-color: ${oc.gray[3]};
    display: flex;
`;

const PostItTitle = styled.h2`
    margin: 5px;
    height: 50px;
`;

const PostItBtn = styled.button`
    width: 20px;
    height: 20px;

`;

const HoverBox = styled.div`
    width: 80%;
    border: 1px solid black;
    margin: 20px 0 0 50px;
    border-radius: 20px;

`;

const HoverTitle = styled.div`

`;

const HoverAdd = styled.div`

`;

const HoverPhone = styled.div`

`;

const PostItMemo = styled.div`
    height: 120px;
    white-space: pre-line;
    overflow-y: auto;
`;

const Memo1 = styled.h4`
    margin: 5px;
`;

const Memo2 = styled.h5`
    margin: 5px;
`;

const RightBox = styled.div`
    margin: 10px;
    width: 35%;
    border: 1px solid black;
`;

const PhotoBox = styled.div`
    margin: auto;
    border: 1px solid black;
    border-radius: 20px;
    overflow-x: auto;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    width: 100%;

`;

const Photo = styled.div`
    width: 90%;
    margin: 5px auto;
    border: 1px solid black;
    heigth: 160px;
    padding: 5px;

`;

const PhotoImg = styled.img`
    width: 90%;
    heigth: 150px;
    object-fit: fill;
`;


const FriendBox = styled.div`
    margin: auto;
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


    return (
        <Body>
        <DetailBody>
            <DetailTitle>Daily Note</DetailTitle>
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
                                            <PostItTitle>{el.type_id.name}</PostItTitle>
                                            <PostItBtn id={`PostItBtn${index}`} onClick={(e) => ShowHoverEvent(e, index)}>O</PostItBtn>
                                        </PostIt2>
                                    </PostIt>
                                    <HoverBox id={`HoverBox${index}`}>
                                        <Memo1>Memo: </Memo1>
                                        <PostItMemo>
                                            <Memo2>{el.memo}</Memo2>
                                        </PostItMemo>
                                    </HoverBox>
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