import React, { useState } from 'react';
import axios from "axios";
import { login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

const LoginBody = styled.div`
      height: 500px;
      width: 500px;
      box-sizing: border-box;
      text-align: center;
      background-color: white;  
      border: 1px solid black;
      border-radius: 20px;
      margin: 150px auto;
  `;

const Logo = styled(Link)`
      margin: 20px auto;
      width:200px;
      font-size: 3.0rem;
          letter-spacing: 2px;
          color: ${oc.cyan[7]};
          font-family: 'Big Shoulders Stencil Display', cursive;
          text-decoration: none;

          &:hover {
              color: ${oc.cyan[9]};
          }
  `;

const LoginField = styled.div`
      margin: 20px auto;
      width: 40%;
      height: 50px;
  `;

const EmailBody = styled.input`
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
    console.log(e.currentTarget.value)
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
        .post(`https://localhost:4000/login`,
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
          console.log('login', res.data)
          dispatch(login(res.data.userinfo))
        })
        .then(res => {
          console.log('로그인에 성공했습니다');
          history.push('/')
        })
        .catch((e) => {
          console.log(e);
        })
    }
  }

  const goSignup = () => {
    history.push('/signup')
  }




  return (
    <LoginBody>
      <Logo to='/landing'>MOHAZI</Logo>
      <LoginField>
        <Text>Email:</Text>
        <EmailBody type="text" name="Email" onChange={onChange}></EmailBody>
      </LoginField>
      <LoginField>
        <Text>Password:</Text>
        <PasswordBody type="password" name="Password" onChange={onChange}></PasswordBody>
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
          <LoginBtn onClick={goSignup}>회원가입</LoginBtn>
          <LoginBtn onClick={handleLogin}>로그인</LoginBtn>
        </span>
      </Btn>
    </LoginBody>
  )
}

export default withRouter(LoginPage);