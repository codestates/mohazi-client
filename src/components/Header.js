import { withRouter, Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import { Link } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { logout } from '../actions/actions.js';
import axios from 'axios';

//============== CSS - basics =================
const FixPosition = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
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
    height: 55px;
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

//============== CSS - buttons =================
const LoginButton = styled(Link)`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${oc.cyan[6]};
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    transition: .2s all;

    &:hover {
        background: ${oc.cyan[6]};
        color: white;
    }
`;

const MypageButton = styled(Link)`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${oc.cyan[6]};
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    transition: .2s all;

    &:hover {
        background: ${oc.cyan[6]};
        color: white;
    }
`;

const LogoutButton = styled(Link)`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${oc.cyan[6]};
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    transition: .2s all;
    outline: 'none';

    &:hover {
        background: ${oc.cyan[6]};
        color: white;
    }
`;

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    let { isLogin } = state;
    //isLogin = true;
    
    function handleLogout() {
        if(confirm("로그아웃 하시겠습니까?") === true) {
            dispatch(logout());
            // axios
            // .get('https://localhost:4000/logout')
            // .then(res => )
            alert("성공적으로 로그아웃 되었습니다");
            history.push('/landing');
        }
    }
    
    return (
        <FixPosition>
            <Background>
                <HeaderContents>
                    <Logo to='/landing'>MOHAZI</Logo>
                    <Space/>
                    {isLogin ?
                        <div>
                            <MypageButton to='/mypage'>Mypage</MypageButton>   <LogoutButton onClick={() => handleLogout()}>Logout</LogoutButton>
                        </div>
                        : <LoginButton to='/login'>Login</LoginButton>
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