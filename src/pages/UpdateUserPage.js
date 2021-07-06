import React, { useState, useEffect } from 'react';
import axios from "axios";
import { userUpdate } from '../actions/actions';
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import imageCompression from "browser-image-compression";

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

const UpdateBody = styled.div`
        height: 600px;
        width: 800px;
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
const Field = styled.div`
        height:500px;
        width:100%;
        display:flex;
  `;
const LeftField = styled.div`
    height:80%;
    width:30%;
    background-color: cyan;
    margin: auto;
    position: relative;
`;
const ImgField = styled.div`
   border-radius: 50%;
   background-color: white;
   height:200px;
   width:200px;
   margin: 30px auto;
   overflow: hidden;
`;

const Img = styled.img`
    width:100%;
    height:100%;
    object-fit: cover;
`;

const Upload = styled.input`
   display: none;
`;

const UploadLink = styled.label`
position: absolute;
top: 195px;
left: 170px;
width: 45px;
height: 35px;
`;

const DesField = styled.input`
`;

const RightField = styled.div`
    height:80%;
    width:50%;
    background-color: cyan;
    margin: auto;
`;

const UpdateField = styled.div`
      margin: 20px auto;
      width: 80%;
      height: 50px;
      background-color: white;
      & > * {
        z-index: 1;
      }
  `;

const EmailBody = styled.div`
      
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

const UpdateBtn = styled.button`
  appearance: none;
  font-family: 'Big Shoulders Stencil Display', cursive;
  font-size: 1.0em;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  `;

function UpdateUserPage() {

    const history = useHistory();
    const dispatch = useDispatch();
    const state = useSelector((state) => state.userInfo)
    const [inputs, setInputs] = useState({
        UserId: state.id,
        Email: state.email,
        Username: state.username,
        Password: '',
        ConfirmPassword: '',
        Description: '',
    })
    const { Email, Password, ConfirmPassword, Username, Description } = inputs;

    const [errorInputs, setErrorInputs] = useState({
        ErrorAll: '',
        ErrorUsername: '',
        ErrorPassword: '',
    })
    const { ErrorAll, ErrorUsername, ErrorPassword } = errorInputs;
    const [imgBase64, setImgBase64] = useState("");
    const [imgFile, setImgFile] = useState(null);

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


  const handleUpdate = () => {
    console.log('Email', Email, 'Username', Username, 'Password', Password, 'Description', Description);

    const isTrue = Username !== '' && Password !== '';


    if (!isTrue) {
      handleError('ErrorAll', '모든 항목을 입력하지 않았습니다.')

    } else {
      handleError('ErrorAll', '')
      handleSubmit();
    }
  }

    // 정규식
    const checkWord = /\W/;

    useEffect(() => {
        if (Password !== ConfirmPassword) {
            handleError('ErrorPassword', '비밀번호가 일치하지 않습니다.')
        } else {
            handleError('ErrorPassword', '');
        }
    }, [ConfirmPassword, Password])

    useEffect(() => {
        const checkUsername = checkWord.exec(Username);
        if (checkUsername) {
            handleError('ErrorUsername', '이름 형식이 아닙니다.')
        } else {
            handleError('ErrorUsername', '')
        }
        if (Username == '') {
            handleError('ErrorUsername', '')
        }
    }, [Username])

    const handleSubmit = () => {
        console.log("압축 시작");
      
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        
        
        imageCompression(imgFile, options)
        .then(res => {
          console.log('test=', res);
          const reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onloadend = () => {
            const base64data = reader.result;
            console.log('base64 = ' , base64data);
            axios
            .put(`${server}/userupdate`,
            handleDataForm(base64data),
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            })
            .then(res => {
              console.log(res.data);
              axios
              .get(`https://localhost:4000/usersearch`,
              {
                  params: {email: Email,}
              })
              .then(res => {
                console.log(res.data.userInfo);
                dispatch(userUpdate(res.data.userInfo))
                history.push(`/mypage`)
              })
            })
          }
        })
        .catch(e => console.log(e));
      }

    const handleDataForm = (dataURI) => {
        const byteString = atob(dataURI.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ia], { type: "image/jpeg" });
        const file = new File([blob], "image.jpg");
        console.log('file = ', file);
      
        const formData = new FormData();
        formData.append("image", file);
        for (const prop in inputs) {
          console.log('prop = ', prop, inputs[prop])
          formData.append(prop, inputs[prop]);
          
        }
        for (var pair of formData.entries()) { 
          console.log(pair[0]+ ', ' + pair[1]); 
        }

        return formData;
      };

    const handleImage = (event) => {
        let reader = new FileReader();
        console.log('e = ', event.target.files[0]);
        reader.onloadend = (e) => {
            const base64 = reader.result;
            if (base64) setImgBase64(base64.toString());
        }
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
            setImgFile(event.target.files[0]);
        }
    };


    return (
        <UpdateBody>
            <Logo to='landing'>MOHAZI</Logo>
            <Field>
                <LeftField>
                    <ImgField>
                        <img src={imgBase64} />
                        </ImgField>
                    <UploadLink htmlFor="imgFile">선택</UploadLink>
                    <Upload id="imgFile" type="file" name="image" accept="image/jpeg, image/jpg" onChange={handleImage}></Upload>
                    <DesField name="Description" onChange={onChange}></DesField>
                </LeftField>
                <RightField>
                    <UpdateField>
                        <Text>Email:</Text>
                        <EmailBody>{state.email}</EmailBody>
                    </UpdateField>
                    <UpdateField>
                        <Text>Username:</Text>
                        <UsernameBody name="Username" defaultValue={state.username} onChange={onChange}></UsernameBody>
                        <Route
                            render={() => {
                                if (ErrorUsername !== '') {
                                    return (
                                        <Alert>{ErrorUsername}</Alert>
                                    );
                                }
                            }}
                        />
                    </UpdateField>
                    <UpdateField>
                        <Text>Password:</Text>
                        <PasswordBody name="Password" onChange={onChange}></PasswordBody>
                    </UpdateField>
                    <UpdateField>
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
                    </UpdateField>
                    <Btn>
                        <UpdateBtn>회원탈퇴</UpdateBtn>
                        <UpdateBtn onClick={handleUpdate}>수정</UpdateBtn>
                    </Btn>
                </RightField>
            </Field>
        </UpdateBody>
    )
}

export default withRouter(UpdateUserPage);