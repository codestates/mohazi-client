import { Route, useHistory } from "react-router-dom";
import styled from 'styled-components';
import React, { useState } from 'react';
import axios from 'axios';
import { login } from '../../actions/actions';
import { useDispatch } from 'react-redux';
import oc from 'open-color';
import GoogleLogin from 'react-google-login';

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Modal_wrap = styled.div`
    display: none;
    width: 400px;
    height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -250px 0 0 -250px;
    background: white;
    z-index: 99;
    border-radius: 5px;
`;

const Modal_bg = styled.div`
    display: none;
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0,0, 0.5);
    top:0;
    left: 0;
    z-index: 98;
`;

const Modal_close = styled.img`
    width: 26px;
    height: 26px;
    position: absolute;
    top: -30px;
    right: 0;
    cursor: pointer;
`;

const Title = styled.div`
    width: 100%;
    text-align: center;
    margin: 20px 0;
    padding: 20px;
    font-size: 4rem;
    background: white;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.yellow[4]};
`;

const LoginField = styled.div`
    margin: 20px auto;
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const EmailBody = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    margin-bottom: 20px;
    z-index: 1;
    padding-left: 10px;
`;

const PasswordBody = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    margin-bottom: 20px;
    z-index: 1;
    padding-left: 10px;
`;

const Alert = styled.div`
    margin: 20px auto;
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
    color: ${oc.gray[8]}
`;

const BtnField = styled.div`
    margin: 20px auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const LoginBtn = styled.button`
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

const SignUpBtn = styled.button`
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

const LoginButton = styled.button`
    border: none;
    background: white;
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

function LoginModal({onSocial}) {
    const history = useHistory();
    const dispatch = useDispatch();
  
    const [ErrorMessage, setErrorMessage] = useState('');
    const [inputs, setInputs] = useState({
      Email: '',
      Password: '',
    })
    const { Email, Password } = inputs;

    function handleOpenModal() {
        document.querySelector('.modal_wrap').style.display ='block';
        document.querySelector('.black_bg').style.display ='block';
    }   
    function handleCloseModal() {
        document.querySelector('.modal_wrap').style.display ='none';
        document.querySelector('.black_bg').style.display ='none';
    }

    function handleBgClick(event) {
        //console.log(event.target.classList)
        if(event.target.classList.contains("black_bg")) {
            document.querySelector('.modal_wrap').style.display ='none';
            document.querySelector('.black_bg').style.display ='none';
        }
    }
  
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
        setErrorMessage('???????????? ???????????? ?????? ???????????????');
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
            console.log('login', res.data)
            dispatch(login(res.data.userinfo));
            alert(`${res.data.userinfo.username}???, ???????????????!`);
          })
          .then(res => {
            //history.push('/')
            handleCloseModal();
          })
          .catch((e) => {
            setErrorMessage('????????? ????????? ?????? ??????????????? ????????????');
          })
      }
    }
  
    const goSignup = () => {
      history.push('/signup');
    }

    const onSuccess = async(response) => {
    	console.log(response);
        const { profileObj : { email, name, googleId } } = response;

        await axios
          .put(`${server}/sociallogin`,
            {
              email: email,
              password: googleId,
              name: name,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                WithCredentials: true,
              }
            })
          .then((res) => {
            // console.log('login', res)
            dispatch(login(res.data.userInfo));
            alert(`${res.data.userInfo.username}???, ???????????????!`);
          })
          .then(res => {
            //history.push('/');
            handleCloseModal();
          })
          .catch((e) => {
            setErrorMessage('????????? ????????? ?????? ??????????????? ????????????');
          })
        
    }

    const onFailure = (error) => {
        console.log(error);
    }

    return (
        <div onClick={(e) => handleBgClick(e)}>
            <LoginButton onClick={handleOpenModal}>Login</LoginButton>
            <Modal_bg className='black_bg'></Modal_bg>
            <Modal_wrap className='modal_wrap'>
                <Modal_close onClick={handleCloseModal} src="https://img.icons8.com/windows/32/000000/delete-sign.png"></Modal_close>
                <Title>Login</Title>
                <LoginField>
                    <EmailBody type="text" name="Email" placeholder="?????????" onChange={onChange}></EmailBody>
                    <PasswordBody type="password" name="Password" placeholder="????????????" onChange={onChange}></PasswordBody>
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
                <BtnField>
                    <LoginBtn onClick={handleLogin}>?????????</LoginBtn>
                    <SignUpBtn onClick={goSignup}>????????????</SignUpBtn>
                    <GoogleLogin
                        clientId={clientId}
                        responseType={"id_token"}
                        onSuccess={onSuccess}
                        onFailure={onFailure} />
                </BtnField>
            </Modal_wrap>
        </div>
    )
}

export default LoginModal;