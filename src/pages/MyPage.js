import { withRouter, useHistory } from "react-router-dom";
import styled from 'styled-components';
import oc from 'open-color';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCards, setCard } from '../actions/actions.js';

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
        border-bottom: 8px dashed ${oc.gray[6]};
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

const Card_Date = styled.div`
    font-weight: 600;
    text-align: center;
    margin: 5px 0;
    height: 20px;
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

    >img {
        width: 15px;
        margin: 0px 5px 0px 0px
    }

    > span {
        margin-right: 5px;
    }

    #admin {
        color: ${oc.blue[6]};
    }
    
    #tagged {
        color: ${oc.yellow[6]}
    }
`;

const User_Update_Btn = styled.img`
    width: 30px;
    cursor: pointer;

    &:hover {
        width: 35px;
        transition: 0.2s;
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
    const [visibleCards, setVisibleCards] = useState(dailyCards);

    let cardSort = "?????? ???";
    const cardSorts = ["?????? ???", "?????? ??? ???", "?????? ????????? ???"]
    const cardSortOptions = cardSorts.map(cardSort => {
        return <option value={cardSort}>{cardSort}</option>;
    });
    let showCards = visibleCards.map(
        card => {
            let selections = card.type.map(selection => {
                return <Selection>
                    <img alt="img" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMGMtMS4xMDQgMC0yLS44OTYtMi0ycy44OTYtMiAyLTIgMiAuODk2IDIgMi0uODk2IDItMiAybTAtNWMtMS42NTcgMC0zIDEuMzQzLTMgM3MxLjM0MyAzIDMgMyAzLTEuMzQzIDMtMy0xLjM0My0zLTMtM20tNyAyLjYwMmMwLTMuNTE3IDMuMjcxLTYuNjAyIDctNi42MDJzNyAzLjA4NSA3IDYuNjAyYzAgMy40NTUtMi41NjMgNy41NDMtNyAxNC41MjctNC40ODktNy4wNzMtNy0xMS4wNzItNy0xNC41MjdtNy03LjYwMmMtNC4xOTggMC04IDMuNDAzLTggNy42MDIgMCA0LjE5OCAzLjQ2OSA5LjIxIDggMTYuMzk4IDQuNTMxLTcuMTg4IDgtMTIuMiA4LTE2LjM5OCAwLTQuMTk5LTMuODAxLTcuNjAyLTgtNy42MDIiLz48L3N2Zz4="></img>
                    <span>{selection.place_name}</span>
                </Selection>
            });

            let photo = card.photo ? JSON.parse(card.photo) : '';

            return card.admin === userInfo.id ?
                <Card
                    id={card.dailyCards_id}
                    color={oc.grape[3]}
                    onClick={(e) => handleShowCardDetails(e)}>
                    <DeleteCardButton className='deleteBtn' id={card.dailyCards_id} onClick={(e) => handleDeleteCard(e)} src="https://img.icons8.com/windows/32/000000/delete-sign.png" />
                    <Card_Date id={card.dailyCards_id}>{card.date}</Card_Date>
                    <Card_Img id={card.dailyCards_id} src={photo.length ? s3ImageURl + '/' + photo[0] : defaultCardImg} />
                    <Card_Selections id={card.dailyCards_id}>
                        {selections}
                    </Card_Selections>
                    <Admin id={card.dailyCards_id}>
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmMyLjc1NyAwIDUgMi4yNDMgNSA1LjAwMSAwIDIuNzU2LTIuMjQzIDUtNSA1cy01LTIuMjQ0LTUtNWMwLTIuNzU4IDIuMjQzLTUuMDAxIDUtNS4wMDF6bTAtMmMtMy44NjYgMC03IDMuMTM0LTcgNy4wMDEgMCAzLjg2NSAzLjEzNCA3IDcgN3M3LTMuMTM1IDctN2MwLTMuODY3LTMuMTM0LTcuMDAxLTctNy4wMDF6bTYuMzY5IDEzLjM1M2MtLjQ5Ny40OTgtMS4wNTcuOTMxLTEuNjU4IDEuMzAyIDIuODcyIDEuODc0IDQuMzc4IDUuMDgzIDQuOTcyIDcuMzQ2aC0xOS4zODdjLjU3Mi0yLjI5IDIuMDU4LTUuNTAzIDQuOTczLTcuMzU4LS42MDMtLjM3NC0xLjE2Mi0uODExLTEuNjU4LTEuMzEyLTQuMjU4IDMuMDcyLTUuNjExIDguNTA2LTUuNjExIDEwLjY2OWgyNGMwLTIuMTQyLTEuNDQtNy41NTctNS42MzEtMTAuNjQ3eiIvPjwvc3ZnPg==" />
                        <span id="admin">?????? ????????? ???</span>
                    </Admin>
                </Card>
                : <Card
                    id={card.dailyCards_id}
                    color={oc.yellow[3]}
                    onClick={(e) => handleShowCardDetails(e)}>
                    <DeleteCardButton className='deleteBtn' id={card.dailyCards_id} onClick={(e) => handleUntag(e)} src="https://img.icons8.com/windows/32/000000/delete-sign.png" />
                    <Card_Date id={card.dailyCards_id}>{card.date}</Card_Date>
                    <Card_Img id={card.dailyCards_id} src={photo.length ? s3ImageURl + '/' + photo[0] : defaultCardImg} />
                    <Card_Selections id={card.dailyCards_id}>
                        {selections}
                    </Card_Selections>
                    <Admin id={card.dailyCards_id}>
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmMyLjc1NyAwIDUgMi4yNDMgNSA1LjAwMSAwIDIuNzU2LTIuMjQzIDUtNSA1cy01LTIuMjQ0LTUtNWMwLTIuNzU4IDIuMjQzLTUuMDAxIDUtNS4wMDF6bTAtMmMtMy44NjYgMC03IDMuMTM0LTcgNy4wMDEgMCAzLjg2NSAzLjEzNCA3IDcgN3M3LTMuMTM1IDctN2MwLTMuODY3LTMuMTM0LTcuMDAxLTctNy4wMDF6bTYuMzY5IDEzLjM1M2MtLjQ5Ny40OTgtMS4wNTcuOTMxLTEuNjU4IDEuMzAyIDIuODcyIDEuODc0IDQuMzc4IDUuMDgzIDQuOTcyIDcuMzQ2aC0xOS4zODdjLjU3Mi0yLjI5IDIuMDU4LTUuNTAzIDQuOTczLTcuMzU4LS42MDMtLjM3NC0xLjE2Mi0uODExLTEuNjU4LTEuMzEyLTQuMjU4IDMuMDcyLTUuNjExIDguNTA2LTUuNjExIDEwLjY2OWgyNGMwLTIuMTQyLTEuNDQtNy41NTctNS42MzEtMTAuNjQ3eiIvPjwvc3ZnPg==" />
                        <span id="tagged">?????? ????????? ???</span>
                    </Admin>
                </Card>
        });

    const handleSortCards = (event) => {
        cardSort = event.target.value;

        if (cardSort === "?????? ???") {
            setVisibleCards(dailyCards);
        } else if (cardSort === "?????? ??? ???") {
            setVisibleCards(dailyCards.filter(el => el.admin === userInfo.id));
        } else {
            setVisibleCards(dailyCards.filter(el => el.admin !== userInfo.id));
        }
    }

    const handleShowCardDetails = (event) => {
        const cardId = Number(event.target.id);

        axios
            .put(`${server}/dailycardinfo`, {
                dailyCardId: cardId,
            }, {
                'Content-Type': 'application/json',
                withCredentials: true,
            })
            .then(res => {
                dispatch(setCard(res.data.data));
            })
            .then(res => history.push('/showdetail'))
            .catch(err => console.log(err))
    }

    const handleDeleteCard = (event) => {
        event.stopPropagation();

        const cardId = Number(event.target.id);

        if (confirm("???????????? ????????? ????????? ??? ????????????. ?????????????????????????") === true) {
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
                    alert("????????? ?????????????????????");
                    setIsDeleteCard(cardId);
                })
                .catch(error => console.log(error));
        }
    }

    const handleUntag = (event) => {
        event.stopPropagation();
        const cardId = Number(event.target.id);

        if (confirm("????????? ?????????????????????????") === true) {
            axios
                .put(`${server}/deletefriend`,
                    {
                        dailyCardId: cardId,
                        userId: userInfo.id,
                    },
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    }
                )
                .then(res => {
                    alert("????????? ?????????????????????");
                    setIsDeleteCard(cardId);
                })
                .catch(error => console.log(error));
        }
    }

    const handleUpdateUser = () => {
        history.push('/updateuser');
    }

    useEffect(() => {
        if (!isLogin) {
            history.push('/pagenotfound');
        }
    }, []);

    useEffect(() => {
        axios
            .put(`${server}/mypage`, {
                userId: userInfo.id,
                headers: {
                    'Content-Type': 'application/json',
                    withCredentials: true,
                }
            })
            .then(res => {
                dispatch(setCards([...res.data.myCardsInfo, ...res.data.taggedCardsInfo]));
            })
    }, [isDeleteCard]);

    useEffect(() => {
        setVisibleCards(dailyCards);
    }, [dailyCards])

    useEffect(() => {

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
                    <User_ProfileImg src={userInfo.photo ? s3ImageURl + '/' + userInfo.photo : defaultProfileImg} />
                    <User_Name>{userInfo.username} ???</User_Name>
                    <User_Description>{userInfo.description}</User_Description>
                    <User_Update_Btn onClick={handleUpdateUser} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMTMuNjE2di0zLjIzMmMtMS42NTEtLjU4Ny0yLjY5NC0uNzUyLTMuMjE5LTIuMDE5di0uMDAxYy0uNTI3LTEuMjcxLjEtMi4xMzQuODQ3LTMuNzA3bC0yLjI4NS0yLjI4NWMtMS41NjEuNzQyLTIuNDMzIDEuMzc1LTMuNzA3Ljg0N2gtLjAwMWMtMS4yNjktLjUyNi0xLjQzNS0xLjU3Ni0yLjAxOS0zLjIxOWgtMy4yMzJjLS41ODIgMS42MzUtLjc0OSAyLjY5Mi0yLjAxOSAzLjIxOWgtLjAwMWMtMS4yNzEuNTI4LTIuMTMyLS4wOTgtMy43MDctLjg0N2wtMi4yODUgMi4yODVjLjc0NSAxLjU2OCAxLjM3NSAyLjQzNC44NDcgMy43MDctLjUyNyAxLjI3MS0xLjU4NCAxLjQzOC0zLjIxOSAyLjAydjMuMjMyYzEuNjMyLjU4IDIuNjkyLjc0OSAzLjIxOSAyLjAxOS41MyAxLjI4Mi0uMTE0IDIuMTY2LS44NDcgMy43MDdsMi4yODUgMi4yODZjMS41NjItLjc0MyAyLjQzNC0xLjM3NSAzLjcwNy0uODQ3aC4wMDFjMS4yNy41MjYgMS40MzYgMS41NzkgMi4wMTkgMy4yMTloMy4yMzJjLjU4Mi0xLjYzNi43NS0yLjY5IDIuMDI3LTMuMjIyaC4wMDFjMS4yNjItLjUyNCAyLjEyLjEwMSAzLjY5OC44NTFsMi4yODUtMi4yODZjLS43NDQtMS41NjMtMS4zNzUtMi40MzMtLjg0OC0zLjcwNi41MjctMS4yNzEgMS41ODgtMS40NCAzLjIyMS0yLjAyMXptLTEyIDIuMzg0Yy0yLjIwOSAwLTQtMS43OTEtNC00czEuNzkxLTQgNC00IDQgMS43OTEgNCA0LTEuNzkxIDQtNCA0eiIvPjwvc3ZnPg==" />
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