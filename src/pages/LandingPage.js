import axios from 'axios';
import { withRouter, Route, useHistory } from "react-router-dom";
import { areaUpdate } from '../actions/actions';
import { useDispatch } from 'react-redux';
import { setCategory } from '../actions/actions';
import React, { useEffect, useState } from "react";
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;

// ------------------css------------------ //
const Landing = styled.div`
        box-sizing: border-box;
        background-color: white;
        text-align: center;
    `;

const Desc = styled.div`
        padding: 20px 0 0 0;
        margin: auto;
        width: 90%;
        position: relative;
        display: flex;
        justify-content: center;
        border: 10px dashed ${oc.yellow[3]};
    `;

const DescriptionImg = styled.img`
    height: 350px;
    margin: 25px;
    border-radius: 20px;
    z-index: 10;
    position: absolute;
    left: 10px;
`;

const DescBoxText = styled.div`
        margin-top: 150px;
        margin-bottom: 20px;
        font-family: 'Gugi', cursive;
    `;

const RecBox = styled.div`
        height: 400px;
        width: 1000px;
        margin-left: 270px;
        padding: 25px;
        display: flex;
        float: left;
        position: relative;
        overflow-x: auto;
    `;

const Rec = styled.div`
        height: 350px;
        width: 250px;
        background-color: white;
        box-shadow: rgb(180 180 180) -1px 1px 8px;
        display: flex;
        flex-direction: column;
        z-index: ${(props) => props.index};
        clear: both;
        border-radius: 20px;
        position: absolute;
        left: ${(props) => props.left}px;
        transition: all 0.5s linear;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        
        > img {
            width: 250px
        }
        &:hover {
            transition: all 0.5s ease 0s;
            transform: translateY(-15px);
        }
        &:hover ~ .Rec {
            transition: all 0.5s ease 0s;
            transform: translateX(100px);
        }
    
    `;

const RecImg = styled.img`
    height: 350px;
    width: 250px;
    border-radius: 20px;
`;

const IntroBox = styled(Landing)`
        height: 350px;
        width: 100%;
        position: relative;
        overflow-y: hidden;
    `;

const IntroBoxText = styled.div`
        padding: 200px 0 0 0;
        font-family: 'Big Shoulders Stencil Display', cursive;
    `;

const Btn = styled.div`
        position: absolute;
        left: 50%;
        top: 80%;
        margin-left: -40px;
        margin-top: -20px;
    `;

const LandingBtn = styled.button`
        width:90px;
        height:40px;
        appearance: none;
        font-family: 'Big Shoulders Stencil Display', cursive;
        font-size: 20px;
        border: none;
        cursor: pointer;
        border-radius: 10px;
    `;

const Box = styled.div`
        height: 350px;
    `;

const Introductions = styled.div`
    width: 100vw;
`;

const IntroPage = styled.div`
    width: 100vw;
    height: 700px;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: center;

    > img {
        width: 55vw;
        float: right;
    }
`;

const FirstText = styled.div`
    margin-left: 70px;

    > div {
        float: left;
        text-align: left;
        font-weight: 600;
        font-size: 4rem;
        color: black;
        width: 550px;
    }

    > .subT1 {
        font-weight: 500;
        font-size: 1.5rem;
        color: ${oc.gray[7]};
        margin-top: 20px;
    }
`;

const SecondText = styled.div`
    margin-left: 70px;

    > div {
        float: left;
        text-align: left;
        font-weight: 600;
        font-size: 4rem;
        color: black;
        width: 550px;
    }

    > .subT2 {
        font-weight: 500;
        font-size: 1.5rem;
        color: ${oc.gray[7]};
        margin-top: 20px;
    }
`;

const Category = styled.div`
    height: 350px;
    width: 250px;
    display: flex;
    flex-direction: column;
    z-index: ${(props) => props.index};
    clear: both;
    border-radius: 20px;
    position: absolute;
    left: ${(props) => props.left}px;
    transition: all 0.5s linear;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    color: white;
        
    > img {
        width: 230px;
        margin: 5px;
    }

    #first, #fourth {
        width: 140px;
    }
    
    > span {
        font-weight: 600;
        font-size: 2rem;
        position: absolute;
        margin: 0 0 310px 180px;

        &:hover {
            transition: .2s all;
        }
    }
    
    &:hover {
        color: black;
        transition: all 0.5s ease 0s;
        transform: translateY(-15px);
    }
    &:hover ~ .Rec {
        transition: all 0.5s ease 0s;
        transform: translateX(100px);
    }
`;

const SeoulMapBtn = styled.button `
    width: 120px;
    height: 50px;
    font-weight: 500;
    font-size: 1rem;
    margin: 50px 20px 0 0;
    background: ${oc.yellow[4]};
    border: 3px solid black;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
        background: black;
        color: white;
    }
`;

const RegisterBtn = styled.button `
    width: 120px;
    height: 50px;
    font-weight: 500;
    font-size: 1rem;
    margin: 50px 20px;
    background: ${oc.yellow[4]};
    border: 3px solid black;
    border-radius: 5px;

    &:hover {
        cursor:pointer;
        background: black;
        color: white;
    }
`;

const BtnField = styled.div `
    padding-left: 100px
`;

function LandingPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [selections, setSelections] = useState([1, 2, 3, 4, 5]);
    const [introes, setIntroes] = useState([1, 2, 3, 4, 5]);
    const region = {};
    const categories = [['관광', 'first', "AT4"], ['커피', 'second', "CE7"], ['음식', 'third', "FD6"], ['문화', 'fourth', "CT1"], ['쇼핑', 'fifth', "MT1"]]

    useEffect(() => {
        axios
            .get(`${server}/landing`,
                {
                    'Content-Type': 'application/json',
                    withCredentials: true,
                })
            .then((res) => {
                console.log(res.data.recommendations);
                setSelections(res.data.recommendations);
            })
            .catch((e) => console.log(e))
    }, [])

    function goSearach() {
        history.push('/search')
    }

    function goRegister(categoryCode) {
        //const {x,y} = el;
        //console.log(el)
        //console.log(x,y)

        //사용자 위치
        dispatch(areaUpdate(region));
        //선택한 카테고리
        dispatch(setCategory(categoryCode));
        history.push('/register');
    }

    function directRegister() {
        dispatch(setCategory(null))
        history.push('/register');
    }

    function MouseWheelHandler(e) {
        e.preventDefault();
        // 휠값처리
        let delta = 0;
        delta = -e.deltaY / 53;
        console.log(delta);
        
    }

    function getLocation() {
        if (navigator.geolocation) { // GPS를 지원하면
          navigator.geolocation.getCurrentPosition(function(position) {
           region.y = position.coords.latitude;
           region.x = position.coords.longitude;
           console.log(region)

          }, function(error) {
            console.error(error);
          }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          });
        } else {
          console.log('GPS를 지원하지 않습니다');
        }
      }

      getLocation();

    return (
        <Landing id="Landing">
            <Desc id="Desc" className="themed">
                <DescriptionImg src='/img/pablo-212.png'/>
                <RecBox>
                    {categories.map((category, index) => <Category className="Rec" left={index * 150} index={index} onClick={() => goRegister(category[2])}>
                        <span>{category[0]}</span>
                        <img id={category[1]} src={'/img/pablo-' + index + '.png'}/>
                    </Category> )}
                </RecBox>
            </Desc>
            <Introductions>
                <IntroPage>
                    <FirstText>
                        <div>오늘도 뭘 해야할지 모르겠다면?</div>
                        <div className="subT1">당신이 있는 그곳에서 놀거리를 찾아보세요!</div>
                        <BtnField>
                            <SeoulMapBtn id="landing-btn" onClick={() => goSearach()}>서울 지도보기</SeoulMapBtn>
                            <RegisterBtn onClick={directRegister}>일정 만들기</RegisterBtn>
                        </BtnField>
                    </FirstText>
                    <img src='/img/pablo-isolation.png'></img>
                </IntroPage>
                <IntroPage>
                    <img src='/img/pablo-839.png'></img>
                    <SecondText>
                        <div>만나서 일정을 계획하기가 어렵다면?</div>
                        <div className="subT2">일정을 만들고 바로 친구들과 공유해요!</div>
                    </SecondText>
                </IntroPage>
            </Introductions>
        </Landing>
    )
}

export default withRouter(LandingPage);