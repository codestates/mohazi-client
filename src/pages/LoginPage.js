import React, { useState } from 'react';
import axios from "axios";
import { login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const LoginBody = styled.div`
      /*height: 500px;
      width: 500px;*/
      box-sizing: border-box;
      background-color: blue;
      border-radius: 20px;
      margin: 20px auto;
      display: flex;
      flex-direction: column;
      align-items: center;
  `;

const Title = styled.div`
    width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 4rem;
    background: white;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.yellow[4]};
`;

const LoginField = styled.div`
      margin: 20px auto;
      width: 80px;
      height: 100px;
  `;

const EmailBody = styled.input`
    border: 3px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    z-index: 1;
      
  `;

const PasswordBody = styled.input`
      z-index: 1;

  `;

const Text = styled.span`
      margin: 0 0 0 25px;
      float: left;
      z-index: 2;

  `;

const Alert = styled.div`

  `;

const Btn = styled.div`
  `;

const LoginBtn = styled.button`
    appearance: none;
    font-family: 'Big Shoulders Stencil Display', cursive;
    font-size: 1.0em;
    border: none;
    cursor: pointer;
    border-radius: 10px;
  `;

const SignUpBtn = styled.button`
  appearance: none;
  font-family: 'Big Shoulders Stencil Display', cursive;
  font-size: 1.0em;
  border: none;
  cursor: pointer;
  border-radius: 10px;
`;


function LoginPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [ErrorMessage, setErrorMessage] = useState('');
  const [inputs, setInputs] = useState({
    Email: '',
    Password: '',
  })
  const { Email, Password } = inputs;

  const onChange = (e) => {
    const { value, name } = e.currentTarget;
    //console.log(e.currentTarget)
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const handleLogin = () => {
    const isTrue = Email !== '' && Password !== '';
    if (!isTrue) {
      setErrorMessage('아이디와 비밀번호 모두 입력하세요');
    } else {
      setErrorMessage('');
      axios
        .put(`${server}/login`,
          {
            email: Email,
            password: Password
          },
          {
            headers: {
              'Content-Type': 'application/json',
              WithCredentials: true,
            }
          })
        .then((res) => {
          //console.log('login', res.data)
          dispatch(login(res.data.userinfo));
        })
        .then(res => {
          //console.log('로그인에 성공했습니다');
          history.push('/')
        })
        .catch((e) => {
          setErrorMessage('유효한 이메일 또는 비밀번호가 아닙니다');
        })
    }
  }

  const goSignup = () => {
    history.push('/signup')
  }

  return (
    <LoginBody>
      <Title>Login</Title>
      <LoginField>
        <EmailBody type="text" name="Email" placeholder="이메일" onChange={onChange}></EmailBody>
        <PasswordBody type="password" name="Password" placeholder="비밀번호" onChange={onChange}></PasswordBody>
      </LoginField>
      <Route
        render={() => {
          if (ErrorMessage !== '') {
            return (
              <Alert>
                {ErrorMessage}
              </Alert>
            );
          }
        }}
      />
      <Btn>
        <span>
          <SignUpBtn onClick={goSignup}>회원가입</SignUpBtn>
          <LoginBtn onClick={handleLogin}>로그인</LoginBtn>
        </span>
      </Btn>
    </LoginBody>
  )
}

export default withRouter(LoginPage);