import React, { useState, useEffect } from 'react';
import axios from "axios";
import { login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const SignupBody = styled.div`
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

const SignupField = styled.div`
      margin: 20px auto;
      width: 40%;
      height: 50px;
      & > * {
        z-index: 1;
      }
  `;

const EmailBody = styled.input`
      
  `;

const PasswordBody = styled.input`

  `;

const ConfirmPasswordBody = styled.input`

  `;

const UsernameBody = styled.input`

  `;
const Text = styled.span`
      margin: 0 0 0 25px;
      float: left;
      z-index: 2;

  `;

const Alert = styled.div`

  `;

const Login = styled(Link)`
  `;

const Btn = styled.div`
  `;

const SignupBtn = styled.button`
  appearance: none;
  font-family: 'Big Shoulders Stencil Display', cursive;
  font-size: 1.0em;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  `;

function SignupPage() {

  const history = useHistory();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Username: '',
  })
  const { Email, Password, ConfirmPassword, Username } = inputs;
  const [errorInputs, setErrorInputs] = useState({
    ErrorAll: '',
    ErrorEmail: '',
    ErrorPassword: '',
    ErrorUsername: '',
  })
  const { ErrorAll, ErrorEmail, ErrorPassword, ErrorUsername } = errorInputs;

  const onChange = (e) => {
    const { value, name } = e.currentTarget;
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const handleError = (name, value) => {
    setErrorInputs({
      ...errorInputs,
      [name]: value,
    })
  }

  // 정규식
  const checkWord = /\W/;
  const checkEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  useEffect(() => {
    if (Password !== ConfirmPassword) {
      handleError('ErrorPassword', '비밀번호가 일치하지 않습니다.')
    } else {
      handleError('ErrorPassword', '');
    }
  }, [ConfirmPassword, Password])

  useEffect(() => {
    const checkedEmail = !checkEmail.exec(Email);
    if (checkedEmail) {
      handleError('ErrorEmail', '이메일 형식이 아닙니다.')
    } else {
      handleError('ErrorEmail', '')
    }
    if (Email === '') {
      handleError('ErrorEmail', '')
    }
  }, [Email])

  useEffect(() => {
    const checkUsername = checkWord.exec(Username);
    console.log(Username)
    if (checkUsername) {
      handleError('ErrorUsername', '이름 형식이 아닙니다.')
    } else {
      handleError('ErrorUsername', '')
    }
    if (Username === '') {
      handleError('ErrorUsername', '')
    }
  }, [Username])

  const handleSignup = () => {
    const isTrue = Email !== '' && Password !== '' &&
      ConfirmPassword !== '' && Username !== '';

    if (!isTrue) {
      handleError('ErrorAll', '모든 항목을 입력하지 않았습니다.')
    } else {
      handleError('ErrorAll', '')
      axios
        .put(`${server}/signup`,
          {
            email: Email,
            password: Password,
            username: Username,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              WithCredentials: true,
            }
          })
        .then((res) => {
          console.log(res.data)
        })
        .then((res) => {
          console.log('회원가입에 성공했습니다');
          history.push('/login')
        })
        .catch((e) => {
          console.log(e)
        })

    }
  }

  return (
    <SignupBody>
      <Logo>MOHAZI</Logo>
      <SignupField>
        <Text>Email:</Text>
        <EmailBody name="Email" onChange={onChange}></EmailBody>
        <Route
          render={() => {
            if (ErrorEmail !== '') {
              return (
                <Alert>{ErrorEmail}</Alert>
              );
            }
          }}
        />
      </SignupField>
      <SignupField>
        <Text>Username:</Text>
        <UsernameBody name="Username" onChange={onChange}></UsernameBody>
        <Route
          render={() => {
            if (ErrorUsername !== '') {
              return (
                <Alert>{ErrorUsername}</Alert>
              );
            }
          }}
        />
      </SignupField>
      <SignupField>
        <Text>Password:</Text>
        <PasswordBody name="Password" onChange={onChange}></PasswordBody>
      </SignupField>
      <SignupField>
        <Text>Confirm:</Text>
        <ConfirmPasswordBody name="ConfirmPassword" onChange={onChange}></ConfirmPasswordBody>
        <Route
          render={() => {
            if (ErrorPassword !== '') {
              return (
                <Alert>{ErrorPassword}</Alert>
              );
            }
          }}
        />
      </SignupField>
      <SignupField>
        <Login to='/login'>이미 회원이신가요?</Login>
        <Btn>
          <SignupBtn onClick={handleSignup}>회원가입</SignupBtn>
        </Btn>
        <Route
          render={() => {
            if (ErrorAll !== '') {
              return (
                <Alert>{ErrorAll}</Alert>
              );
            }
          }}
        />
      </SignupField>
    </SignupBody>
  )
}

export default withRouter(SignupPage);