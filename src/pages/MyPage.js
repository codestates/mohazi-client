import { withRouter, Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import oc from 'open-color';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCards, setCard, userUpdate, setFriends } from '../actions/actions.js';
import { isValidElementType } from "react-is";

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const s3ImageURl = process.env.REACT_APP_S3_IMAGE_URL;

const Title = styled.div`
    width: 100%;
    padding: 10px;
    font-size: 4rem;
    background: white;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.yellow[4]};
    display: flex;
    flex-direction: column;
    align-items: center;
    
    div {
        text-align:center;
        border-bottom: 8px solid ${oc.indigo[1]};
        width: 85%;
        padding-bottom: 30px;
    }

    div > img {
        width: 100px;
        margin: 0 30px 0 25px;
    }
`;

const User = styled.div`
    width: 30%;
    height: 100vw;
    background: white;
    float: left;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Cards = styled.div`
    width: 70%;
    height: 100vw;
    float: right;
    background: white;

    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    }
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
}
`;

const SelectCardSort = styled.select`
    border-radius: 3px;
    margin-top: 60px;
    border: 3px solid ${oc.gray[7]};
    color: ${oc.gray[7]};
    font-weight: 600;
    width: 80px;
    height: 30px;
`;

const UserInfo = styled.div`
    height: 450px;
    width: 260px;
    margin-top: 20px;
    position: relative;
    /*border: 10px solid ${oc.indigo[2]};*/
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Card = styled.div`
    color: ${oc.gray[7]};
    height: 400px;
    width: 230px;
    margin-top: 60px;
    margin-left: 30px;
    position: relative;
    float: left;
    /*border: 4px solid ${props => props.color};*/
    box-shadow: rgb(180 180 180) -1px 1px 8px;
    border-radius: 20px;
    display:flex;
    flex-direction: column;
    align-items:center;
    
    &:hover {
	cursor:pointer;
    /*margin-top: 50px;*/

    > .deleteBtn {
        display: block;
    }
    }
`;

const DeleteCardButton = styled.img`
    display: none;
    position: absolute;
    width: 20px;
    margin: 10px;
    right: 3px;
    cursor: pointer;
`;

const User_ProfileImg = styled.img`
    width: 180px;
    height: 180px;
    margin: 30px 0 20px 0;
    border-radius: 50%;
`;

const User_Description = styled.div`
    width: 180px;
    height: 90px;
    margin: 10px;
    padding: 5px;
    font-size: 0.9rem;
`;

const User_Name = styled.div`
    font-weight: 600;
    font-size: 1.5rem;
    color: ${oc.gray[8]};
    width: 180px;
    text-align: center;
    margin-bottom: 10px
`;

const User_UpdateButton = styled.button`
    width: 80px;
    height: 30px;
    margin: 10px;
    font-size: 0.7rem;
    font-weight: 600;
    background: ${oc.indigo[4]};
    color: white;
    cursor: pointer;
    border: none;
    box-shadow: rgb(180 180 180) -1px 1px 5px;
    border-radius: 3px;
    transition: .2s all;

    &:hover {
        background: ${oc.gray[6]};
        color: white;
    }
`;

const Card_Date = styled.div`
    font-weight: 600;
    text-align: center;
    margin: 8px 0 5px 0;
`;

const Card_Img = styled.img`
    width: 100%;
    height: 180px;
    margin: 5px;
`;

const Selection = styled.div`
    background: white;
    margin: 15px;
    width: 180px;
    display: flex;
    flex-direction: row;
    align-items: center;

    > span {
        margin-left: 10px;
        font-size: 0.8rem;
    }
`

const Card_Selections = styled.div`
    margin-top: 10px;
    height: 140px;
    
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
`;

const Admin = styled.div`
    position: absolute;
    bottom: 15px;
    margin-top: 10px;
    font-size: 0.7rem;
    display: flex;
    font-weight: 500;
    color: ${oc.indigo[4]};

    >img {
        width: 15px;
        margin: 0px 5px 0px 0px
    }

    > span {
        margin-right: 5px;
    }
`;

function MyPage() {
    const state = useSelector(state => state);
    const { userInfo, dailyCards, dailyCard, isLogin } = state;
    const dispatch = useDispatch();
    const history = useHistory();
    
    const defaultProfileImg = '/img/default_avatar.png'
    const defaultCardImg = '/img/landscape.jpeg'

    const [isDeleteCard, setIsDeleteCard] = useState(-1);
    const [ visibleCards, setVisibleCards ] = useState(dailyCards);
    
    let cardSort = "전체 글";
    const cardSorts = ["전체 글", "내가 쓴 글", "태그 당한 글"]
    const cardSortOptions = cardSorts.map(cardSort => {
        return <option value={cardSort}>{cardSort}</option>;
    });
    //console.log('visible', visibleCards)
    //let showCards = '';
    let showCards = visibleCards.map(
        card => {
            let selections = card.type.map(selection => {
                return <Selection>
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMGMtMS4xMDQgMC0yLS44OTYtMi0ycy44OTYtMiAyLTIgMiAuODk2IDIgMi0uODk2IDItMiAybTAtNWMtMS42NTcgMC0zIDEuMzQzLTMgM3MxLjM0MyAzIDMgMyAzLTEuMzQzIDMtMy0xLjM0My0zLTMtM20tNyAyLjYwMmMwLTMuNTE3IDMuMjcxLTYuNjAyIDctNi42MDJzNyAzLjA4NSA3IDYuNjAyYzAgMy40NTUtMi41NjMgNy41NDMtNyAxNC41MjctNC40ODktNy4wNzMtNy0xMS4wNzItNy0xNC41MjdtNy03LjYwMmMtNC4xOTggMC04IDMuNDAzLTggNy42MDIgMCA0LjE5OCAzLjQ2OSA5LjIxIDggMTYuMzk4IDQuNTMxLTcuMTg4IDgtMTIuMiA4LTE2LjM5OCAwLTQuMTk5LTMuODAxLTcuNjAyLTgtNy42MDIiLz48L3N2Zz4="></img>
                    <span>{selection.place_name}</span>
                </Selection>
            });

            //console.log('photo', card.photo? 'true': 'false')
            let photo = card.photo? JSON.parse(card.photo): '';
        
            return card.admin === userInfo.id? 
            <Card
                id={card.dailyCards_id}
                color={oc.grape[3]}
                onClick={(e) => handleShowCardDetails(e)}>
                <DeleteCardButton className='deleteBtn' id={card.dailyCards_id} onClick={(e) => handleDeleteCard(e)} src="https://img.icons8.com/windows/32/000000/delete-sign.png"/>
                <Card_Date id={card.dailyCards_id}>{card.date}</Card_Date>
                <Card_Img id={card.dailyCards_id} src={photo.length? s3ImageURl + '/' + photo[0]: defaultCardImg}/>
                <Card_Selections id={card.dailyCards_id}>
                    {selections}
                </Card_Selections>
                <Admin id={card.dailyCards_id}>
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmMyLjc1NyAwIDUgMi4yNDMgNSA1LjAwMSAwIDIuNzU2LTIuMjQzIDUtNSA1cy01LTIuMjQ0LTUtNWMwLTIuNzU4IDIuMjQzLTUuMDAxIDUtNS4wMDF6bTAtMmMtMy44NjYgMC03IDMuMTM0LTcgNy4wMDEgMCAzLjg2NSAzLjEzNCA3IDcgN3M3LTMuMTM1IDctN2MwLTMuODY3LTMuMTM0LTcuMDAxLTctNy4wMDF6bTYuMzY5IDEzLjM1M2MtLjQ5Ny40OTgtMS4wNTcuOTMxLTEuNjU4IDEuMzAyIDIuODcyIDEuODc0IDQuMzc4IDUuMDgzIDQuOTcyIDcuMzQ2aC0xOS4zODdjLjU3Mi0yLjI5IDIuMDU4LTUuNTAzIDQuOTczLTcuMzU4LS42MDMtLjM3NC0xLjE2Mi0uODExLTEuNjU4LTEuMzEyLTQuMjU4IDMuMDcyLTUuNjExIDguNTA2LTUuNjExIDEwLjY2OWgyNGMwLTIuMTQyLTEuNDQtNy41NTctNS42MzEtMTAuNjQ3eiIvPjwvc3ZnPg=="/>
                    <span>내가 작성한 글</span>
                </Admin>
            </Card>
            : <Card
                id={card.dailyCards_id}
                color={oc.yellow[3]}
                onClick={(e) => handleShowCardDetails(e)}>
            <Card_Date id={card.dailyCards_id}>{card.date}</Card_Date>
            <Card_Img id={card.dailyCards_id} src={photo.length? s3ImageURl + '/' + photo[0]: defaultCardImg}/>
            <Card_Selections id={card.dailyCards_id}>
                {selections}
            </Card_Selections>
        </Card>
        });

    const handleSortCards = (event) => {
        cardSort = event.target.value;

        if(cardSort === "전체 글"){
            setVisibleCards(dailyCards);
        } else if(cardSort === "내가 쓴 글"){
            setVisibleCards(dailyCards.filter(el => el.admin === userInfo.id));
        } else {
            setVisibleCards(dailyCards.filter(el => el.admin !== userInfo.id));
        }
    }

    const handleShowCardDetails = (event) => {
        //console.log('target id', event.target)
        const cardId = Number(event.target.id);
        let card = dailyCards.filter(el => el.dailyCards_id === cardId);
        dispatch(setCard(...card));
        console.log('id',cardId)
        axios
            .put(`${server}/dailycardinfo`, {
                dailyCardId: cardId,
            },{
                'Content-Type': 'application/json',
                withCredentials: true,
            })
            .then(res => {
                console.log('friends', res.data)
                dispatch(setFriends(res.data.data.friends));
            })
            .then(res => history.push('/showdetail'))
            .catch(err => console.log(err))
    }

    const handleDeleteCard = (event) => {
        event.stopPropagation();
        
        console.log('delete card', event.target)
        const cardId = Number(event.target.id);

        if (confirm("삭제하면 내용을 복구할 수 없습니다. 삭제하시겠습니까?") === true) {
            axios
                .put(`${server}/dailycarddelete`,
                    {
                        dailycardId: cardId
                    },
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    }
                )
                .then(res => {
                    alert("일정이 삭제되었습니다");
                    setIsDeleteCard(cardId);
                })
                .catch(error => console.log(error));
        }
    }

    const handleUpdateUser = () => {
        history.push('/updateuser');
    }

    useEffect(() => {
        if(!isLogin) {
            history.push('/pagenotfound');
        }
    },[]);

    useEffect(() => {
        //삭제 할 때마다 카드정보 불러오기
        console.log('render after delete')
        axios
            .put(`${server}/mypage`, {
                    userId: userInfo.id,
                    headers: {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                      }
                    })
            .then(res => {
                console.log('mypage',res.data)
                dispatch(setCards([...res.data.myCardsInfo, ...res.data.taggedCardsInfo]));
            })
    },[isDeleteCard]);

    useEffect(() => {
        setVisibleCards(dailyCards);
    }, [dailyCards])

    useEffect(() => {
        console.log('2', dailyCard)
    }, [dailyCard])

    return (
        <div>
            <Title>
                <div>
                    <span>Mypage</span>
                </div>
            </Title>
            <User>
                <SelectCardSort onChange={(e) => handleSortCards(e)}>
                    {cardSortOptions}
                </SelectCardSort>
                <UserInfo>
                    <User_ProfileImg src={userInfo.photo? s3ImageURl + '/' + userInfo.photo: defaultProfileImg}/>
                    <User_Name>{userInfo.username} 님</User_Name>
                    <User_Description>{userInfo.description}</User_Description>
                    <User_UpdateButton onClick={handleUpdateUser}>나의 정보 수정</User_UpdateButton>
                </UserInfo>
            </User>
            <Cards>
                {showCards}
            </Cards>
        </div>
    )
}

export default withRouter(MyPage);

/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */