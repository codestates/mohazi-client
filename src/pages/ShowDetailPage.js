import React, { useState } from 'react';
import axios from "axios";
import { login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

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
    opacity: 1;
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



function ShowDetailPage() {

    const history = useHistory();
    const { dailyCard } = useSelector((state) => state)

    const GoUpdateDetail = () => {
        history.push('/updatedetail')
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
                <UpdateBtn onClick={GoUpdateDetail}>수정하기</UpdateBtn>
            </Btn>
        </DetailBody>
    )
}

export default withRouter(ShowDetailPage);