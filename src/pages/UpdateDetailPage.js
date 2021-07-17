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
    margin: 120px auto 0px;
    display: flex;
    width: 80%;
    height: 70px;
    display: flex;
    font-family: 'Nanum Pen Script', cursive;
`;

const Cover = styled.div`
    width: 80%;
    display: flex;
`;

const Date = styled.input`
    height: 30px;
    margin: 22px;
`;

const Title = styled.div`
    padding: 10px;
    font-weight: 600;
    font-size: 3em;
    margin: 0 0 0 50px;
`;

const Profile = styled.img`
    margin: 0 0 0 20px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 1px solid black;
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
    height: ${props => {
        return 85 * props.hei + 144 * props.hei + 300;
    }}px;
    position: relative;
`;

const SelectionBox = styled.div`
    margin: 0 0 0 50px;
    background: ${oc.yellow[0]};
    border-radius: 20px;
    border: 2px solid black;
    position: absolute;
    width: 90%;
`;

const MemoBox = styled.div`
    margin: 0 0 0 50px;
    background: ${oc.yellow[0]};
    border-radius: 20px;
    border: 2px solid black;
    position: absolute;
    top: ${props => {
        return 249 + 220 * (props.hei - 1) + 20;
    }}px;
    width: 90%;
    height: 250px;
    white-space: pre-line;
    
    & > * {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.7em;
    }
`;

const Selection = styled.div`
    margin: 25px;
`;

const PostIt = styled.div`
    display: flex;
`;

const PostItLeft = styled.div`
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

const PostItRight = styled.div`
    width: 330px;
    height: 50px;
    border: 1px solid black;
    background-color: ${oc.gray[3]};
    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 2px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};
        border-radius: 30px;
      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }
`;

const PostItTitle = styled.div`
    float: left;
    margin: 5px;
    height: 50px;
    font-family: 'Nanum Pen Script', cursive;
    font-weight: 1000;
    font-size: 2.2em;
`;

const PostItBtn = styled.button`
    float:right;
    width: 20px;
    height: 50px;
    border: 1px solid black;
    font-size: 1.3em;

    &: focus {
        outline:none;
    }
`;

const GoSelection = styled.button`
    border: 1px solid black;
    width:50px;
    height:50px;
    font-size: 1.3em;
`;

const PostItInfo = styled.div`
    width: 80%;   
    margin: 20px 0 0 50px;   
`;

const InfoBox = styled.div`
    white-space: pre-line;
    
    & > * {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.7em;
    }

`;

const MemoTitle = styled.h4`
    margin: 5px;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 2em;
`;

const MemoContent = styled.div`
    height: 160px;

`;

const MemoText = styled.textarea`
    width: 95%;
    height: 160px;
    margin: 5px;
    resize: none;
    background: ${oc.yellow[1]};
    border: 2px solid black;

    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 5px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};

      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }
`;

const HoverBox = styled.div`
    margin: 5px;
    width: 95%;
    height: 125px;
    display: block;

    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 0px;
      }

    &::-webkit-scrollbar-thumb{
        background-color: ${oc.gray[7]};

      }

    &::-webkit-scrollbar-track{
        background: transparent;
      }

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
    margin: 10px;
    width: 35%; 
    height: ${props => {
        return 85 * props.hei + 144 * props.hei + 300;
    }}px;
`;

const PhotoBox = styled.div`
    margin: 0px auto;
    background: ${oc.yellow[0]};
    border: 2px solid black;
    border-radius: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 60%;

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

const Photo = styled.div`
    width: 45%;
    float: left;
    margin: 2.5%;
    border-radius: 20px;
    position: relative;
    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }  
   
`;

const PhotoImg = styled.img`
    position: absolute;
    border-radius: 20px;
    border: 4px solid black;
    width:100%;
    height: 100%;
    object-fit: cover;
`;

const PhotoBtn = styled.button`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    position:absolute;
    top: 0%;
    left: 87%;

    &: focus {
        outline:none;
    }
    &: hover {
        background: ${oc.red[2]};
        transform: scale(1.05);
    }
`;

const FriendBox = styled.div`
    margin: 20px auto;
    background: ${oc.yellow[0]};
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 30%;
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
    float: left;
    width: 30%;
    position: relative;
    margin: 10px 1.65%;
    position: relative;
    &:after {
        content: "";
        display: block;
        padding-bottom: 120%;
    }
`;

const FriendPhoto = styled.div`
    position: absolute;
    width: 100%;
    height: 80%;
`;

const FriendPhotoImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid black;
`;

const FriendName = styled.div`
    position: absolute;
    top: 77%;
    width: 100%;
    height: 20%;
    text-align: center;
`;

const UploadBox = styled.div`
    position: absolute;
    border-radius: 20px;
    border : 4px solid black;
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const UploadText = styled.div`
    font-size: 2em;
    position: absolute;
    top:50%;
    left:50%;
    margin-left: -16px;
    margin-top: -23px;
    
`;

const AddFriendBtn = styled.div`
    position: absolute;
    width: 100%;
    height: 80%;
    border-radius: 50%;
    border: 3px solid black;
`;

const UploadLink = styled.label`
`;

const Upload = styled.input`
    display: none;
`;

const FriendPhotoBtn = styled.button`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    position:absolute;
    top: 0%;
    left: 72%;
    &: focus {
        outline:none;
    }
    &: hover {
        background: ${oc.red[2]};
        transform: scale(1.05);
    }
`;

const Btn = styled.button`
    margin: 0 0 0 10px;
    width: 45%;
    height: 40px;

    border-radius: 20px;
    border: 2px solid black;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 30px;
    background: ${oc.yellow[0]};
    &: focus {
        outline:none;
    }
    &: hover {
        background: ${oc.red[2]};
        transform: scale(1.01);
        cursor: pointer;
    }
`;

const DeleteBtn = styled.button`
    margin: 0 10px 0 0;
    width: 45%;
    height: 40px;
    border-radius: 20px;
    border: 2px solid black;
    font-family: 'Nanum Pen Script', cursive;
    font-size: 30px;
    background: ${oc.yellow[0]};
    &: focus {
        outline:none;
    }
    &: hover {
        background: ${oc.red[2]};
        transform: scale(1.01);
        cursor: pointer;
    }
`;

const LoadingImg = styled.img`
    width: 80px;
    z-index: 1000;
`;

function UpdateDetailPage() {

    const history = useHistory();
    const dispatch = useDispatch();
    const { dailyCard, userInfo, isLogin } = useSelector((state) => state)
    console.log(dailyCard)

    const [isLoading, setIsLoading] = useState(false);

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
        let Div = document.querySelector(`#HoverBox${index}`)
        let Btn = document.querySelector(`#PostItBtn${index}`)

        if (Div.style.display === 'none') {
            Div.style.display = 'block';
            Btn.innerText = '↾';
        } else {
            Div.style.display = 'none';
            Btn.innerText = '⇂';
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
                            setPhoto([...photo, res.data.key]);
                            setIsLoading(false);
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

        setIsLoading(true);
    };

    const PhotoDelete = (e, index) => {
        let Div = document.querySelector(`#PhotoImg${index}`).src.split('/')[3];

        const set = photo.slice(0);
        set.splice(index, 1)

        console.log(Div);

        axios
            .put(`${server}/s3delete`, {
                key: Div
            },
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
                console.log('delete')
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

    const handleDelete = () => {
        if (window.confirm("삭제하면 내용을 복구할 수 없습니다. 삭제하시겠습니까?") === true) {
            axios
                .put(`${server}/dailycarddelete`,
                    {
                        dailycardId: dailyCard.dailyCards_id,
                    },
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    }
                )
                .then(res => {
                    alert("일정이 삭제되었습니다");
                    history.push('/mypage');
                })
                .catch(error => console.log(error));
        }
    }

    const goUpdateSelection = () => {
        console.log('a');
        history.push('/updateselection');
    }

    function handleOpenModal() {
        document.querySelector('.search_user_modal').style.display ='block';
        document.querySelector('.search_user_bg').style.display ='block';
    }

    useEffect(() => {
        console.log('rendering', friends)     
    }, [friends])

    useEffect(() => {
        if(!isLogin) {
            history.push('/pagenotfound');
        }
    },[]);

    return (
        <Body>
            <DetailBody id="DetailBody">
                <SearchUserModal />
                <DetailTitle>
                    <Cover>
                    <Title>Date: </Title>
                    <Date id="inputDate" type="date"></Date>
                    </Cover>
                    {dailyCard.friends.filter((el) => el.id === userInfo.id).map((el) => {
                        return (
                            <Profile src={s3ImageURl + '/' + el} />
                        )
                    })}
                </DetailTitle>
                <Box>
                    <LeftBox hei={dailyCard.type.length}>
                    <SelectionBox>
                        {dailyCard.type.map((el, index) => {
                            return (
                                <Selection>
                                    <PostIt>
                                        <PostItLeft index={index}>
                                            <PostItNum>{index + 1}</PostItNum>
                                        </PostItLeft>
                                        <PostItRight>
                                            <PostItTitle>{el.place_name}</PostItTitle>               
                                        </PostItRight>
                                        <GoSelection onClick={goUpdateSelection}>  ↻</GoSelection>
                                        <PostItBtn id={`PostItBtn${index}`} onClick={(e) => ShowHoverEvent(e, index)}> ↾</PostItBtn>                      
                                    </PostIt>
                                    <PostItInfo>
                                        <InfoBox>
                                            <HoverBox id={`HoverBox${index}`}>
                                                <h4>-Info-</h4>
                                                <HoverTitle>name: {el.place_name}</HoverTitle>
                                                <HoverPhone>phone: {el.phone}</HoverPhone>
                                                <HoverAdd>add: {el.address_name}</HoverAdd>
                                            </HoverBox>
                                        </InfoBox>
                                    </PostItInfo>
                                </Selection>
                            )
                        })}
                        </SelectionBox>
                        <MemoBox hei={dailyCard.type.length}> 
                                <MemoTitle>Memo: </MemoTitle>
                                <MemoContent id="MemoContent">
                                    <MemoText defaultValue={dailyCard.memo} onChange={onChange}></MemoText>
                                </MemoContent> 
                        </MemoBox>
                </LeftBox>
                <RightBox id="RightBox">
                        <PhotoBox id="PhotoBox">
                            <Photo id="Photo">
                                <UploadLink htmlFor="imgFile">
                                    <UploadBox>
                                        {isLoading? <LoadingImg id="loadingImg" src="/img/Spinner.gif" />: null}
                                        <UploadText>⊕</UploadText>
                                    </UploadBox>
                                </UploadLink>
                            </Photo>
                            <Upload id="imgFile" type="file" name="image" accept="image/jpeg, image/jpg" onChange={(e) => handleImage(e)}></Upload>
                            {photo.map((el, index) => {
                                return (
                                    <Photo id="Photo" index={index}>
                                        <PhotoImg id={`PhotoImg${index}`} src={s3ImageURl + '/' + el}/>
                                        <PhotoBtn onClick={(e) => PhotoDelete(e, index)}>X</PhotoBtn>
                                    </Photo>
                                )
                            })}
                        </PhotoBox>
                    <FriendBox>
                        <Friend id="Friend">
                            <AddFriendBtn onClick={handleOpenModal}>
                            <UploadText>⊕</UploadText>
                            </AddFriendBtn>
                        </Friend>
                        {console.log('div', friends)}
                        {friends.filter((el) => el.id !== userInfo.id).map((el, index) => {
                            return (
                                <Friend id="Friend">
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
                    <DeleteBtn onClick={handleDelete}>삭제하기</DeleteBtn>
                    <Btn onClick={handleUpdate}>수정완료</Btn>
                </RightBox>
            </Box>
        </DetailBody>
        </Body>
    )
}

export default withRouter(UpdateDetailPage);