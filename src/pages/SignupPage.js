import React, { useState, useEffect } from 'react';
import axios from "axios";
import { login } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const Wrap = styled.div`
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 30;

    #firstImg {
      object-fit: fill;
      width: 480px;
      margin-right: 300px
    }

    #secondImg {
      position: absolute;
      width: 200px;
      margin: 20px 0 0 130px;
    }
`;

const SignUpField = styled.div`
    width: 400px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 50;
    position: absolute;
`;

const Title = styled.div`
    width: 100%;
    text-align: center;
    margin: 20px 0;
    padding: 20px;
    font-size: 4rem;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.yellow[4]};
`;

const InputField = styled.div`
    margin: 0px 0px 20px 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

const EmailBody = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    margin: 10px 0px;
    padding-left: 10px;
`;

const PasswordBody = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    margin: 10px 0px;
    padding-left: 10px;
`;

const Alert = styled.div`
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
    color: ${oc.orange[7]}
`;

const ConfirmPasswordBody = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    margin: 10px 0px;
    padding-left: 10px;
  `;

const UsernameBody = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    margin: 10px 0px;
    z-index: 1;
    padding-left: 10px;
  `;

const LoginRedirect = styled(Link)`
    text-decoration: none;
    margin-bottom: 10px;

`;

const BtnField = styled.div`
    margin: 20px auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SignupBtn = styled.button`
    width: 200px;
    height: 35px;
    margin-bottom: 20px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    color: white;
    background: ${oc.indigo[4]};

    &:hover {
        background: ${oc.gray[5]}
    }
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

  function handleOpenModal() {
    document.querySelector('.modal_wrap').style.display = 'block';
    document.querySelector('.black_bg').style.display = 'block';
  }

  function handleCloseModal() {
    document.querySelector('.modal_wrap').style.display = 'none';
    document.querySelector('.black_bg').style.display = 'none';
  }

  function handleBgClick(event) {
    //console.log(event.target.classList)
    if (event.target.classList.contains("black_bg")) {
      document.querySelector('.modal_wrap').style.display = 'none';
      document.querySelector('.black_bg').style.display = 'none';
    }
  }

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
      handleError('ErrorEmail', '이메일 형식이 아닙니다')
    } else {
      handleError('ErrorEmail', '')
    }
    if (Email === '') {
      handleError('ErrorEmail', '')
    }
  }, [Email])

  useEffect(() => {
    const checkUsername = checkWord.exec(Username);
    //console.log(Username)
    if (checkUsername) {
      handleError('ErrorUsername', '이름 형식이 아닙니다')
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
      handleError('ErrorAll', '모든 항목을 입력하지 않았습니다')
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
          alert('회원가입이 완료되었습니다');
          history.push('/landing');
        })
        .catch((e) => {
          alert('이미 존재하는 이메일입니다');
          console.log(e)
        })

    }
  }

  return (
    <Wrap>
    <img id="firstImg" src="/img/pablo-193.png"/>
    <img id="secondImg" src="/img/pablo-168.png"/>
      <SignUpField>
        <Title>Sign Up</Title>
        <InputField>
          <EmailBody name="Email" placeholder="이메일" onChange={onChange}></EmailBody>
          <Route
            render={() => {
              if (ErrorEmail !== '') {
                return (
                  <Alert>{ErrorEmail}</Alert>
                );
              }
            }}
          />
          <UsernameBody name="Username" placeholder="아이디" onChange={onChange}></UsernameBody>
          <Route
            render={() => {
              if (ErrorUsername !== '') {
                return (
                  <Alert>{ErrorUsername}</Alert>
                );
              }
            }}
          />
          <PasswordBody name="Password" type="password" placeholder="비밀번호" onChange={onChange}></PasswordBody>
          <ConfirmPasswordBody name="ConfirmPassword" type="password" placeholder="비밀번호 확인" onChange={onChange}></ConfirmPasswordBody>
          <Route
            render={() => {
              if (ErrorPassword !== '') {
                return (
                  <Alert>{ErrorPassword}</Alert>
                );
              }
            }}
          />
        </InputField>
        <BtnField>
          <LoginRedirect to='/landing'>이미 회원이신가요?</LoginRedirect>
          <SignupBtn onClick={handleSignup}>회원가입</SignupBtn>
          <Route
            render={() => {
              if (ErrorAll !== '') {
                return (
                  <Alert>{ErrorAll}</Alert>
                );
              }
            }}
          />
        </BtnField>
      </SignUpField>
    </Wrap>
  )
}

export default withRouter(SignupPage);