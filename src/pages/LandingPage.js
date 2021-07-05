import axios from 'axios';
import { withRouter, Route, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color

require("dotenv").config();

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
        z-index: ${props => props.index};
        clear: both;
        border-radius: 20px;
        border: 1px solid black;
        position: absolute;
        left: ${props => props.left}px;
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
    let currentScroll = 0;
    let tim;

    const testImage = "data:image/png;base64,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"

    useEffect(() => {
        axios
            .get('https://localhost:4000/landing',
                {
                    'Content-Type': 'application/json',
                    withCredentials: true,
                })
            .then((res) => {
                //setSelections(res.recommndations)
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
                        console.log(el)
                        return (
                            <Rec className="Rec" left={(el-1)*120} index={index}>
                                <img src={testImage} />{el}
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