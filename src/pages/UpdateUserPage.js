import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import imageCompression from "browser-image-compression";

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const s3ImageURl = process.env.REACT_APP_S3_IMAGE_URL;

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
  
const Title = styled.div`
    width: 100%;
    text-align: center;
    margin: 15px 0;
    padding: 20px;
    font-size: 4rem;
    background: white;
    font-family: 'Fjalla One', sans-serif;
    color: ${oc.yellow[4]};
`;

const Field = styled.div`
    height: 450px;
    width:100%;
    display:flex;
    align-items: center;
    justify-content: center;
  `;

const LeftField = styled.div`
    height:80%;
    width:30%;
    position: relative;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileImg = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;

   > div {
    border-radius: 50%;
    background-color: gray;
    height:200px;
    width:200px;
    margin: 30px auto;
    border: ${oc.gray[4]}
   }
`;

const Upload = styled.input`
   display: none;
`;

const UploadLink = styled.label`
    position: absolute;
    cursor: pointer;

    > img {
      width: 80px;
      height: 80px;
    }
`;

const DesField = styled.input`
  border: none;
  width: 80%;
  height: 80px;
  background: gray;
`;

const RightField = styled.div`
    height:80%;
    width:50%;
    margin-left: 10px;
`;

const UpdateField = styled.div`
    margin: 15px auto;
    width: 80%;
    height: 50px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
      
    & > * {
      z-index: 1;
    }
`;

const EmailBody = styled.div`
    border-radius: 3px;
    width: 200px;
    margin-left: 10px;
    text-align: left;
`;

const Input = styled.input`
    border: 2px solid ${oc.gray[4]};
    border-radius: 3px;
    width: 200px;
    height: 40px;
    padding-left: 10px;
    margin-left: 10px;
`;

const Text = styled.span`
    font-weight: 600;
    color: ${oc.gray[7]};
    margin: 0 0 0 25px;
    float: left;
    width: 100px;
    text-align: left;
`;

const Alert = styled.div`
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
    color: ${oc.gray[8]}
  `;
  
const BtnField = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 15px
`;

const UpdateBtn = styled.button`
    width: 150px;
    height: 35px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    color: white;
    background: ${oc.indigo[4]};
    margin-right: 10px;

    &:hover {
        background: ${oc.gray[5]}
    }
  `;

const WithdrawalBtn = styled.button`
    width: 100px;
    height: 35px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    color: white;
    background: ${oc.red[5]};
    margin-left: 10px;

    &:hover {
        background: ${oc.gray[5]}
    }
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
  const [imgBase64, setImgBase64] = useState('');
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
    //console.log("압축 시작");

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    imageCompression(imgFile, options)
    .then(res => {
        //console.log('test=', res);
        const reader = new FileReader();
        
        reader.readAsDataURL(res);
        reader.onloadend = () => {
          const base64data = reader.result;
          //console.log('base64 = ', base64data);
          
          axios
            .put(`${server}/s3upload`,
              handleDataForm(base64data),
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
              })
            .then(res => {
              //alert(res.data.message);
              const photo = res.data.key;

              axios
                .put(`${server}/userupdate`, {
                  userId: state.id,
                  username: Username,
                  password: Password,
                  photo: photo,
                  description: Description
                })
              //history.push(`/mypage`)
            })
            .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err));
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
      console.log(pair[0] + ', ' + pair[1]);
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
      <Title>User Information</Title>
      <Field>
        <LeftField>
          <ProfileImg>
            <div src={imgBase64} />
            <UploadLink htmlFor="imgFile">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNSA0aC0zdi0xaDN2MXptOCA2Yy0xLjY1NCAwLTMgMS4zNDYtMyAzczEuMzQ2IDMgMyAzIDMtMS4zNDYgMy0zLTEuMzQ2LTMtMy0zem0xMS01djE3aC0yNHYtMTdoNS45M2MuNjY5IDAgMS4yOTMtLjMzNCAxLjY2NC0uODkxbDEuNDA2LTIuMTA5aDhsMS40MDYgMi4xMDljLjM3MS41NTcuOTk1Ljg5MSAxLjY2NC44OTFoMy45M3ptLTE5IDRjMC0uNTUyLS40NDctMS0xLTFzLTEgLjQ0OC0xIDEgLjQ0NyAxIDEgMSAxLS40NDggMS0xem0xMyA0YzAtMi43NjEtMi4yMzktNS01LTVzLTUgMi4yMzktNSA1IDIuMjM5IDUgNSA1IDUtMi4yMzkgNS01eiIvPjwvc3ZnPg=="/>
            </UploadLink>
          </ProfileImg>
          <Upload id="imgFile" type="file" name="image" accept="image/jpeg" onChange={handleImage}></Upload>
          <DesField name="Description" defaultValue={state.description} onChange={onChange}></DesField>
        </LeftField>
        <RightField>
          <UpdateField>
            <Text>Email</Text>
            <EmailBody>{state.email}</EmailBody>
          </UpdateField>
          <UpdateField>
            <Text>Username</Text>
            <Input name="Username" defaultValue={state.username} onChange={onChange}></Input>
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
            <Text>Password</Text>
            <Input name="Password" type="password" onChange={onChange}></Input>
          </UpdateField>
          <UpdateField>
            <Text>Confirm</Text>
            <Input name="ConfirmPassword" type="password" onChange={onChange}></Input>
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
          <BtnField>
            <UpdateBtn onClick={handleUpdate}>수정</UpdateBtn>
            <WithdrawalBtn>회원탈퇴</WithdrawalBtn>
          </BtnField>
        </RightField>
      </Field>
    </UpdateBody>
  )
}
export default withRouter(UpdateUserPage);