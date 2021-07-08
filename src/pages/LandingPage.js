import axios from 'axios';
import { withRouter, Route, useHistory } from "react-router-dom";
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
        position: relative;
        display: flex;
        justify-content: center;
    `;

const DescBox = styled.div`
        height: 250px;
        width: 150px;
        margin: 20px 20px 0 0;
        position: relative;
        flex-grow: 0;
        background: linear-gradient(0deg, ${oc.cyan[4]} 0%, ${oc.pink[4]} 100%);
        box-shadow: rgb(180 180 180) -1px 1px 8px;
        border-radius: 20px;
    `;

const DescBoxText = styled.div`
        margin-top: 150px;
        margin-bottom: 20px;
        font-family: 'Gugi', cursive;
    `;

const RecBox = styled.div`
        height: 300px;
        padding: 20px 0 0 0;
        display: flex;
        width: 1000px;
        float: left;
        position: relative;
        overflow-x: scroll;
    `;

const Rec = styled.div`
        height: 250px;
        width: 200px;
        padding: 5px;
        background-color: white;
        box-shadow: rgb(180 180 180) -1px 1px 8px;
        display: flex;
        flex-direction: column;
        z-index: ${(props) => props.index};
        clear: both;
        border-radius: 20px;
        border: 1px solid black;
        position: absolute;
        left: ${(props) => props.left}px;
        transition: all 0.5s linear;
        cursor: pointer;
        &:hover {
            transition: all 0.5s ease 0s;
            transform: translateY(-15px);
        }
        &:hover ~ .Rec {
            transition: all 0.5s ease 0s;
            transform: translateX(80px);
        }
    
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
        position:absolute;
        left:50%;
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

    // ------------------css------------------ //

function LandingPage() {
    const history = useHistory();
    const [selections, setSelections] = useState([1, 2, 3, 4, 5]);
    const [introes, setIntroes] = useState([1, 2, 3, 4, 5]);

    useEffect(() => {
        axios
            .get(`${server}/landing`,
                {
                    'Content-Type': 'application/json',
                    withCredentials: true,
                })
            .then((res) => {
                console.log(res.data.recommendations);
                res.data.recommendations.map((el) => {
                    console.log(el);
                })
                //setSelections(res.data.recommndations);
                console.log(selections);
            })
            .catch((e) => console.log(e))
    }, [])

    function goSearach() {
        history.push('/search')
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
            console.log(position.coords.latitude + ' ' + position.coords.longitude);
          }, function(error) {
            console.error(error);
          }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          });
        } else {
          alert('GPS를 지원하지 않습니다');
        }
      }
      getLocation();

    return (
        <Landing id="Landing">
            <Desc id="Desc">
                <DescBox>
                    <DescBoxText>
                        오늘<br />
                        추천장소
                    </DescBoxText>
                </DescBox>
                <RecBox>
                    {selections.map((el, index) => {
                        return (
                            <Rec className="Rec" left={(index)*120} index={index}>
                                <img src="img/cafe.jpg" />{el}
                            </Rec>
                        )
                    })}
                </RecBox>
            </Desc>
            <IntroBox id="introbox">
                {introes.map((el) => {
                    console.log(el)
                    return (
                        <Box className="box" onWheel={(e) => MouseWheelHandler(e)}>
                            <IntroBoxText>
                                뭐하고 놀까 고민이 있는 그대!<br />
                                MOHAZI와 하루를 함께해요!{el}
                            </IntroBoxText>                        
                            <Btn>
                                <LandingBtn id="landing-btn" onClick={() => goSearach()}>MOHAZI</LandingBtn>
                            </Btn>
                        </Box>
                    )
                })}

            </IntroBox>
        </Landing>
    )
}

export default withRouter(LandingPage);