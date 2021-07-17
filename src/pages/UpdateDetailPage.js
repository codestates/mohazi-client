import React, { useState, useEffect, useRef} from 'react';
import axios from "axios";
import { setFriend, login } from '../actions/actions';import { Link, withRouter, Route, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color
import SearchUserModal from '../components/Modals//SearchUser';
import { setCard } from '../actions/actions.js';
import imageCompression from "browser-image-compression";

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const s3ImageURl = process.env.REACT_APP_S3_IMAGE_URL;

const Body = styled.div`
    width: 100%;
    background-color: white;
`;

const DetailBody = styled.div`
    box-sizing: border-box;
    height: 100%;
    margin: 0 auto;
    border: 1px solid white;
    position: relative;
    background-image: url('img/Memo.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
`;



const DetailTitle = styled.div`
    font-family: 'Fjalla One', sans-serif;
    font-size: 4em;
    margin: 120px 0 20px 150px;
`;

const Box = styled.div`
    margin: 0 auto 100px auto;
    width: 80%;
    height: 80%;
    display: flex;
`;

const LeftBox = styled.div`
    margin: 10px;
    width: 65%;
    position: relative;
`;

const LeftTitle = styled.div`
    position: absolute;
    font-family: 'Fjalla One', sans-serif;
    font-size: 1.5em;
    top: -15px;
    left: 20px;
`;

const SelectionBox = styled.div`
    margin: 0 0 0 50px;
    border-radius: 20px;
    border: 2px solid black;
    position: relative;
`;

const Selection = styled.div`
    margin: 25px;
    & > * {
        
    }
`;

const PostIt = styled.div`
    display: flex;
`;

const PostIt1 = styled.div`
    width: 50px;
    height:50px;
    border: 1px solid black;
    background-color: ${props => {
        switch(props.index){
            case 0: return oc.red[5];
            case 1: return oc.orange[5];
            case 2: return oc.yellow[5];
            case 3: return oc.green[5];
            case 4: return oc.indigo[5];
            default: return oc.grape[5];
        }
    }};
    text-align: center;
    vertical-align: middle;
`;

const PostItNum = styled.h2`
    width: 40px;
    height: 40px;
    margin: 0 0 0 3px;
    font-size: 2em;

`;

const PostIt2 = styled.div`
    width: 40%;
    height: 50px;
    border: 1px solid black;
    background-color: ${oc.gray[3]};
    display: flex;
`;

const PostItTitle = styled.h2`
    margin: 5px;
    height: 50px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2.2em;
`;

const PostItBtn = styled.button`
    width: 20px;
    height: 20px;
    margin: 15px auto;
`;

const PostItBtn2 = styled.button`
    width: 20px;
    height: 20px;
    margin: 15px auto;
`;

const MemoBox = styled.div`
    width: 80%;   
    margin: 20px 0 0 50px;   
`;

const PostItMemo = styled.div`
    white-space: pre-line;
    
    & > * {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.7em;
    }
`;

const Memo1 = styled.h4`
    margin: 5px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2em;
`;

const Memo2Box = styled.textarea`
    height: 120px;
    overflow-y: auto;
    width: 90%;
    resize: none;

    &::-webkit-scrollbar{
        width: 5px;
        height: 100px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }
`;


const HoverBox = styled.div`
    margin: 5px;
    width: 95%;
    display: none;
    & > * {
        margin: 5px;
    }
`;

const HoverTitle = styled.h5`

`;

const HoverAdd = styled.h5`

`;

const HoverPhone = styled.h5`

`;

const RightBox = styled.div`
    position: relative;    
    margin: 10px;
    width: 35%; 
`;

const PhotoBox = styled.div`
    margin: 0px auto;
    border: 2px solid black;
    border-radius: 20px;
    overflow-y: auto;
    text-align: center;
    width: 100%;
    height: 600px;

    &::-webkit-scrollbar{
        width: 5px;
        height: 100px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }

    &::-webkit-scrollbar-track-piece:end {
        background: transparent;
        margin-bottom: 15px;
    }

    &::-webkit-scrollbar-track-piece:start {
        background: transparent;
        margin-top: 15px;
    }
`;

const Upload = styled.input`
    display: none;
`;

const UploadBox = styled.div`
    width: 90%;
    height: 150px;
    margin: 10px auto;
    border-radius: 20px;
    border : 1px solid black;
    font-size: 6em;
    test-align: center;
`;

const UploadLink = styled.label`

`;

const Photo = styled.div`
    width: 90%;
    height: 150px;
    margin: 10px auto;
    border-radius: 20px;
    position: relative;
`;

const PhotoImg = styled.img`
    border-radius: 20px;
    width: 100%;
    height: 150px;
    object-fit: cover;
`;

const PhotoBtn = styled.button`
    width: 21px;
    height: 21px;
    position:absolute;
    top: 0%;
    left: 90%;
`;

const FriendBox = styled.div`
    margin: 10px auto;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 320px;
    border: 2px solid black;
    border-radius: 20px;

    &::-webkit-scrollbar{
        width: 5px;
        height: 100px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }

    &::-webkit-scrollbar-track-piece:end {
        background: transparent;
        margin-bottom: 15px;
    }

    &::-webkit-scrollbar-track-piece:start {
        background: transparent;
        margin-top: 15px;
    }
`;

const Friend = styled.div`
    margin: 10px;
    position: relative;
`;

const AddFriendBtn = styled.div`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 1px solid black;
    font-size: 2em;
    padding: 12px;
`;

const FriendPhoto = styled.div`
    width: 90px;
`;

const FriendPhotoImg = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 1px solid black;
`;

const FriendName = styled.div`

`;

const FriendPhotoBtn = styled.button`
    width: 21px;
    height: 21px;
    position:absolute;
    top: 0%;
    left: 70%;
`;

const Btn = styled.button`

`;

const AddFriend = styled.div`
    width: 50px;
    font-weight: 500;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;

    > img {
        border-radius: 50%;
        width: 45px;
        height: 45px;
        margin: 5px;
    }
`;

function UpdateDetailPage() {

    const history = useHistory();
    const dispatch = useDispatch();
    const { dailyCard, userInfo } = useSelector((state) => state)
    console.log(dailyCard)

    const GoUpdateDetail = () => {
        //저장할 때 state의 friend를 초기화시켜줘야 합니다
        dispatch(setFriend({}));
        history.push('/showdetail');
    }

    const [ photo, setPhoto ] = useState(JSON.parse(dailyCard.photo));

    const [ friends, setFriend ] = useState(dailyCard.friends);
    
    const [imgBase64, setImgBase64] = useState("");

    const [imgFile, setImgFile] = useState(null);
    const [memo, setMemo] = useState(dailyCard.memo);
    const mount = useRef(false);

    useEffect(() => {
        
        if(!mount.current){
            mount.current = true;
        } else {
            PhotoUpload();
        }
    }, [imgFile])

    useEffect(() => {
        console.log(dailyCard.friends);
        setFriend(dailyCard.friends);
    },[dailyCard.friends]);
      
    const ShowHoverEvent = (e, index) => {
        console.log('a');
        let Div = document.querySelector(`#HoverBox${index}`)
        let Btn = document.querySelector(`#PostItBtn${index}`)

        if (Div.style.display === 'none') {
            Div.style.display = 'block';
            Btn.innerText = 'X';
        } else {
            Div.style.display = 'none';
            Btn.innerText = 'O';
        }
    }

    const onChange = (e, index) => {
        const { value, name } = e.currentTarget;
        console.log(value);
        //console.log(e.currentTarget)
        const set = value;
        setMemo(set);
      }

    const PhotoUpload = (event) => {

        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        imageCompression(imgFile, options)
            .then((res) => {
                const reader = new FileReader();
                reader.readAsDataURL(res);
                reader.onloadend = () => {
                    const base64data = reader.result;

                    axios
                        .put(`${server}/s3upload`,
                            handleDataForm(base64data),
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    withCredentials: true,
                                },
                            })
                        .then((res) => {
                            console.log('key', res.data.key)
                            // stateupdate
                            setPhoto([...photo, res.data.key])
                        })
                };
            })
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
        return formData;

    };

      const handleImage = (event) => {

        let reader = new FileReader();

        reader.onloadend = (e) => {
            const base64 = reader.result;
            if (base64) setImgBase64(base64.toString());
        }
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
            setImgFile(event.target.files[0]);
        }

    };

    const PhotoDelete = (e, index) => {
        let Div = document.querySelector(`#PhotoImg${index}`).src.split('/')[3];

        const set = photo.slice(0);
        set.splice(index, 1)

        console.log(Div);

        axios
            .put(`${server}/s3delete`, { key: Div },
                {
                    'Content-Type': 'application/json',
                    withCredentials: true,
                }
            )
            .then((res) => {
                console.log('delete')
                 setPhoto(set);
            })
    }


    const FriendPhotoDelete = (e, index, el) => {

        const set = friends.slice(0);
        set.splice(index, 1);

        axios
            .put(`${server}/deletefriend`, {
                userId: el.id,
                dailyCardId: dailyCard.dailyCards_id,

                headers: {
                    'Content-Type': 'application/json',
                    withCredentials: true,
                },
            })
            .then((res) => {
                setFriend(set);
            })
    }


    const handleUpdate = () => {

        const Div = document.querySelector('#inputDate').value;
        console.log(Div);

        console.log('최종 포토', photo)
        axios
            .put(`${server}/dailycardupdate`, {
                date: Div || dailyCard.date,
                photo: photo, // ["a.jpg","b.jpg"]
                memo: memo,
                dailycardId: dailyCard.dailyCards_id,
            })
            .then((res) => {
                console.log(res);
                axios
                    .put(`${server}/dailycardinfo`, {
                        dailyCardId: dailyCard.dailyCards_id,
                    }, {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    })
                    .then(response => {
                        console.log('friends', response.data.data)
                        dispatch(setCard(response.data.data));
                        alert('성공적으로 수정되었습니다. ');
                        history.push('/showdetail');
                    })
            })
            .catch(err => {
                alert("수정 권한이 없습니다.")
                history.push('/showdetail')
            })
    }

    const goUpdateSelection = () => {
        history.push('/updateselection');
    }

    function handleOpenModal() {
        document.querySelector('.search_user_modal').style.display ='block';
        document.querySelector('.search_user_bg').style.display ='block';
    }

    useEffect(() => {
       console.log('rendering') 
    },[friends])
    return (
        <Body>
        <DetailBody id="DetailBody">
          <SearchUserModal/>
            <DetailTitle>Daily Note: {dailyCard.date}</DetailTitle>
            <Box>
                <LeftBox>
                    <SelectionBox>
                        {dailyCard.type.map((el, index) => {
                            return (
                                <Selection>
                                    <PostIt>
                                        <PostIt1 index={index}>
                                            <PostItNum>{index + 1}</PostItNum>
                                        </PostIt1>
                                        <PostIt2>
                                            <PostItTitle>{el.place_name}</PostItTitle>
                                            <PostItBtn id={`PostItBtn${index}`} onClick={(e) => ShowHoverEvent(e, index)}>O</PostItBtn>
                                            <PostItBtn2 onClick={goUpdateSelection}>o</PostItBtn2>
                                        </PostIt2>
                                    </PostIt>
                                    <MemoBox>
                
                                      
                                        <PostItMemo>     
                                            <HoverBox id={`HoverBox${index}`}>
                                                <h4>-Info-</h4>
                                                <HoverTitle>name: {el.place_name}</HoverTitle>
                                                <HoverPhone>phone: {el.phone}</HoverPhone>
                                                <HoverAdd>add: {el.address_name}</HoverAdd>
                                            </HoverBox>
                                        </PostItMemo>
                                    </MemoBox>
                                </Selection>
                            )
                        })}
                                               <PostItMemo>
                                        <Memo1>Memo: </Memo1>
                                        <Memo2Box defaultValue={dailyCard.memo} onChange={onChange}>
                                                
                                                </Memo2Box>     
                                        </PostItMemo>
                    </SelectionBox>
                </LeftBox>
                <RightBox>
                    <PhotoBox id="PhotoBox">
                    <UploadLink htmlFor="imgFile"><UploadBox>⊕</UploadBox></UploadLink>
                    <Upload id="imgFile" type="file" name="image" accept="image/jpeg, image/jpg" onChange={(e) => handleImage(e)}></Upload>     
                        {photo.map((el, index) => {
                            return (         
                                <Photo  className="Photo" index={index}>
                                    <PhotoImg id={`PhotoImg${index}`} src={s3ImageURl + '/' + el} />
                                    <PhotoBtn onClick={(e) => PhotoDelete(e, index)}>X</PhotoBtn>
                                </Photo>
                            )
                        })}
                    </PhotoBox>
                    <FriendBox>
                        <Friend>
                        <AddFriendBtn onClick={handleOpenModal}>⊕</AddFriendBtn>
                        </Friend>
                        {friends.filter((el) => el.id !== userInfo.id).map((el, index) => {
                            return (
                                <Friend>
                                    <FriendPhoto className="FriendsPhoto" index={index}>
                                        <FriendPhotoImg id={`FriendPhotoImg${index}`} src={s3ImageURl + '/' + el.photo} />
                                    </FriendPhoto>
                                    <FriendName>
                                        {el.username}
                                    </FriendName>
                                    <FriendPhotoBtn onClick={(e) => FriendPhotoDelete(e, index, el)}>X</FriendPhotoBtn>
                                </Friend>
                            )
                        })}
                    </FriendBox>
                    <input id="inputDate" type="date"></input>
                    <Btn onClick={handleUpdate}>수정완료</Btn>
                </RightBox>
            </Box>
        </DetailBody>
        </Body>
    )
}

export default withRouter(UpdateDetailPage);