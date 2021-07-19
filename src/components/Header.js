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
    margin: 0 30px;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 1rem;
    padding-left: 1rem;
`;

const Space = styled.div`
    flex-grow: 1;
`;

const MypageButton = styled(Link)`
    font-size: 1.2rem;
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
    font-size: 1.2rem;
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

const LogoImg = styled.img`
    left:0;
    height: 70px;
    cursor: pointer;
    margin-top: 20px;
    
    &:hover {
        content: url('/img/logo2.png');
    }
`;

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    let { isLogin } = state;

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

    function handleLogo() {
        history.push('/landing');
    }
    
    return (
        <FixPosition>
                <HeaderContents>
                    <LogoImg onClick={handleLogo} src='/img/logo.png'/>
                    <Space/>
                    {isLogin ?
                        <div>
                            <MypageButton to='/mypage'>Mypage</MypageButton>   <LogoutButton onClick={() => handleLogout()}>Logout</LogoutButton>
                        </div>
                        :<LoginModal/>
                    }
                </HeaderContents>
        </FixPosition>
    )
}

export default withRouter(Header);

/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */
