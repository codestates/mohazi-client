import { withRouter, Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import oc from 'open-color';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCards, setCard } from '../actions/actions.js';

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const Title = styled.div`
    width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 5rem;
    background: white;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.yellow[4]};
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
    top: 0;
    margin-top: 20px;
    border: 3px solid black;
    font-weight: 600;
    width: 80px;
    height: 30px;
`;

const UserInfo = styled.div`
    height: 400px;
    width: 230px;
    margin-top: 60px;
    position: relative;
    background: black;
    border-radius: 10px;
    display:flex;
    flex-direction: column;
    align-items: center;
`;

const Card = styled.div`
    height: 400px;
    width: 230px;
    margin-top: 60px;
    margin-left: 30px;
    position: relative;
    float: left;
    background: linear-gradient(0deg, ${oc.gray[2]} 0%, ${props => props.color} 100%);
    box-shadow: rgb(180 180 180) -1px 1px 8px;
    border-radius: 20px;
    display:flex;
    flex-direction: column;
    align-items:center;

    -webkit-transition: margin 0.5s ease-out;
    -moz-transition: margin 0.5s ease-out;
    -o-transition: margin 0.5s ease-out;
    
    &:hover {
	cursor:pointer;
    margin-top: 5px;

    > .deleteBtn {
        display: block;
    }
    }
`;

const DeleteCardButton = styled.img`
    display: none;
    position: absolute;
    margin: 5px;
    right: 3px;
    cursor: pointer;
`;

const User_ProfileImg = styled.img`
    width: 180px;
    height: 180px;
    margin: 30px;
    border-radius: 50%;
`;

const User_Description = styled.div`
    width: 180px;
    height: 70px;
    margin: 10px;
    background: ${oc.gray[2]};
    border-radius: 5px;
    padding: 5px;
    font-size: 0.9rem;
`;

const User_Name = styled.div`
    font-weight: 600;
    font-size: 1.5rem;
    color: white;
    width: 180px;
    text-align: center;
`;

const User_UpdateButton = styled.button`
    width: 50px;
    height: 30px;
    margin: 10px;
    font-size: 0.7rem;
    font-weight: 600;
    background: ${oc.yellow[6]};
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
    margin: 10px 0 5px 0;
`;

const Card_Img = styled.img`
    width: 180px;
    height: 180px;
    margin: 5px;
    border-radius: 10px;
`;

const Selection = styled.div`
    background: white;
    margin: 10px;
    width: 180px;
    text-align: center;
`

function MyPage() {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    const { userInfo, dailyCards } = state;
    const [ visibleCards, setVisibleCards ] = useState([]);
    let cardSort = "전체 글";
    const cardSorts = ["전체 글", "내가 쓴 글", "태그 당한 글"]
    const cardSortOptions = cardSorts.map(cardSort => {
        return <option value={cardSort}>{cardSort}</option>;
    });
    let showCards = visibleCards.map(
        card => {
            let selections = card.selections.map(selection => {
                return <Selection>{selection.place_name}</Selection>
            });
        
            return card.userId === userInfo.id? 
            <Card
                id={card.id}
                color={oc.grape[3]}
                onClick={(e) => handleShowCardDetails(e)}>
                <DeleteCardButton className='deleteBtn' onClick={(e) => handleDeleteCard(e)} src="https://img.icons8.com/windows/32/000000/delete-sign.png"/>
                <Card_Date>{card.date}</Card_Date>
                <Card_Img src="img/default_daily3.jpeg"/>
                {selections}
            </Card>
            : <Card
            id={card.id}
            color={oc.yellow[3]}
            onClick={(e) => handleShowCardDetails(e)}>
            <Card_Date>{card.date}</Card_Date>
            <Card_Img src="img/default_daily3.jpeg"/>
            {selections}
        </Card>
        });
        console.log(visibleCards)

    const handleSortCards = (event) => {
        cardSort = event.target.value;

        if(cardSort === "전체 글"){
            setVisibleCards(dailyCards);
        } else if(cardSort === "내가 쓴 글"){
            setVisibleCards(dailyCards.filter(el => el.userId === userInfo.id));
        } else {
            setVisibleCards(dailyCards.filter(el => el.userId !== userInfo.id));
        }
    }

    const handleShowCardDetails = (event) => {
        const cardId = event.target.id;
        const card = dailyCards.filter(el => el.id === cardId);

        dispatch(setCard(card));
        history.push('/showdetail');
    }

    const handleDeleteCard = (event) => {
        event.stopPropagation();
        
        if (confirm("삭제하면 내용을 복구할 수 없습니다. 삭제하시겠습니까?") === true) {
            axios
                .put(`${server}/mypage`,
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    }, {
                    dailyCardId: event.target.id
                })
                .then(res => {
                    alert("일정이 삭제되었습니다")
                })
                .catch(error => console.log(error));
        }
    }

    const handleUpdateUser = () => {
        history.push('/updateuser');
    }

    useEffect(() => {
        //카드정보 불러오기
        // axios
        //     .get(`${server}/mypage`,
        //         {
        //             'Content-Type': 'application/json',
        //             withCredentials: true,
        //         }, {
        //         userId: userInfo.id
        //     })
        //     .then(res => {
        //         dispatch(setCards(res.data.dailyCards));
        //         setVisibleCards(dailyCards); //처음엔 전체 글이 보여집니다
        //     })
        //     .catch(error => console.log(error))
        
        dispatch(setCards(dailyCards));
        setVisibleCards(dailyCards);
    }, [dailyCards])

    function handleImageURL(image) {
        console.log(image);
        return `img/${image}`
      }

    return (
        <div>
            <Title>Mypage</Title>
            <User>
                <SelectCardSort onChange={(e) => handleSortCards(e)}>
                    {cardSortOptions}
                </SelectCardSort>
                <UserInfo>
                    <User_ProfileImg src={handleImageURL(userInfo.photo)}/>
                    <User_Name>{userInfo.username}</User_Name>
                    <User_Description>{userInfo.description}</User_Description>
                    <User_UpdateButton onClick={handleUpdateUser}>수정하기</User_UpdateButton>
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