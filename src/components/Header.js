import { withRouter, Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/actions.js';
import axios from 'axios';
import LoginModal from './Modals/Login';
import { useEffect } from "react";

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

console.log(document.documentElement)
const FixPosition = styled.div`
    display: flex;
    flex-direction: column;
    top: 0px;
    width: 100%;
`;

const Background = styled.div`
    background: white;
    display: flex;
    justify-content: center;
    height: auto;
`;

const HeaderContents = styled.div`
    width: 1200px;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 1rem;
    padding-left: 1rem;
`;

const Logo = styled(Link)`
    font-size: 1.7rem;
    letter-spacing: 2px;
    color: ${oc.cyan[7]};
    font-family: 'Big Shoulders Stencil Display', cursive;
    text-decoration: none;

    &:hover {
        color: ${oc.cyan[9]};
    }
`;

const Space = styled.div`
    flex-grow: 1;
`;

const MypageButton = styled(Link)`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${oc.blue[8]};
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    text-decoration: none;
    transition: .2s all;

    &:hover {
        background: ${oc.blue[8]};
        color: white;
    }
`;

const LogoutButton = styled(Link)`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${oc.blue[8]};
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
    text-decoration: none;
    transition: .2s all;
    outline: 'none';

    &:hover {
        background: ${oc.blue[8]};
        color: white;
    }
`;

const Day_Night_Toggle = styled.img`
    cursor: pointer;
    margin: 0 20px;
    width: 35px;
`

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    let { isLogin } = state;

    const dayToggleUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02IDE4aDEyYzMuMzExIDAgNi0yLjY4OSA2LTZzLTIuNjg5LTYtNi02aC0xMi4wMzljLTMuMjkzLjAyMS01Ljk2MSAyLjcwMS01Ljk2MSA2IDAgMy4zMTEgMi42ODggNiA2IDZ6bTEyLTEwYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0IDQtMS43OTIgNC00LTEuNzkyLTQtNC00eiIvPjwvc3ZnPg==";
    const nightToggleUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xOCAxOGgtMTJjLTMuMzExIDAtNi0yLjY4OS02LTZzMi42ODktNiA2LTZoMTIuMDM5YzMuMjkzLjAyMSA1Ljk2MSAyLjcwMSA1Ljk2MSA2IDAgMy4zMTEtMi42ODggNi02IDZ6bS0xMi0xMGMyLjIwOCAwIDQgMS43OTIgNCA0cy0xLjc5MiA0LTQgNC00LTEuNzkyLTQtNCAxLjc5Mi00IDQtNHoiLz48L3N2Zz4=";
    
    const date = new Date();
    const hour = date.getHours();
    let initialToggleUrl = '';
    if(hour >= 6 && hour < 18) {
        initialToggleUrl = dayToggleUrl;
    } else {
        initialToggleUrl = nightToggleUrl;
    }
    const [toggleUrl, setToggleUrl] = useState(initialToggleUrl);

    function handleLogout() {
        if(confirm("로그아웃 하시겠습니까?") === true) {
            dispatch(logout());
            axios
            .put(`${server}/logout`)
            .then(res => {
                alert("성공적으로 로그아웃 되었습니다");
                history.push('/landing');
            })
        }
    }

    // 글자색 바꾸기
    // function SetTextColor(color){
    //     document.documentElement.querySelector('.themed').style.color = color;
    // }

    // 배경색 바꾸기
    // function SetBackgroundColor(color){
    //     document.querySelector('.themed').style.background = color;
    // }

    // function handleToggle(event) {
    //     if(event.target.name === 'day') {
    //         setToggleUrl(nightToggleUrl);
    //         event.target.name = 'night'
    //     } else {
    //         setToggleUrl(dayToggleUrl);
    //         event.target.name = 'day'
    //     }
    // }

    // useEffect(() => {
    //     if(toggleUrl === nightToggleUrl){
    //         SetBackgroundColor('RGB(26,36,54)');
    //         SetTextColor('white');
    //     } else if(toggleUrl === dayToggleUrl) {
    //         SetBackgroundColor('white');
    //         SetTextColor('black');
    //     }
    // }, [toggleUrl])
    
    return (
        <FixPosition>
            <Background className="themed">
                <HeaderContents>
                    <Logo to='/landing'>MOHAZI</Logo>
                    <Space/>
                    {/* <Day_Night_Toggle className="check" name='day' src={toggleUrl} onClick={(e) => handleToggle(e)}/> */}
                    {isLogin ?
                        <div>
                            <MypageButton to='/mypage'>Mypage</MypageButton>   <LogoutButton onClick={() => handleLogout()}>Logout</LogoutButton>
                        </div>
                        :<LoginModal/>
                    }
                </HeaderContents>
            </Background>
        </FixPosition>
    )
}

export default withRouter(Header);

/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */
