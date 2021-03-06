import React, { useState } from 'react';
import { areaUpdate } from '../actions/actions';
import { withRouter, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import oc from 'open-color'; //색상 참고: https://www.npmjs.com/package/open-color;


const Box = styled.div`
    width: 80%;
    margin: auto;
    background: white;
    display: flex;
`;

const SearchBody = styled.div`
    height: 500px;
    width: 610px;
    box-sizing: border-box;
    margin : 50px auto;
    border: 10px dashed ${oc.yellow[3]};  
`;

const Left = styled.img`
    margin: 70px 0 0 0;
    height: 500px;
    width: 480px;
    animation: target_image 3s; 
    animation-iteration-count: infinite;
    transform-origin: 60% 60%; 
`;

const Area = styled.area`
    cursor: pointer;
`;

function SearchPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    const regions = [
        ["구로구", { y: 37.4954330863648, x: 126.88750531451 }],
        ["양천구", { y: 37.5169884752609, x: 126.866501409661 }],
        ["영등포구", { y: 37.5263671784802, x: 126.896278443882 }],
        ["강서구", { y: 37.5509646154244, x: 126.849533759514 }],
        ["금천구", { y: 37.4568411485785, x: 126.895456780023 }],
        ["동작구", { y: 37.5124820423519, x: 126.93931505634 }],
        ["관악구", { y: 37.4783683761333, x: 126.951561853868 }],
        ["서초구", { y: 37.4835888228545, x: 127.032689317952 }],
        ["강남구", { y: 37.5173319258532, x: 127.047377408384 }],
        ['송파구', { y: 37.5145909234015, x: 127.105922243305 }],
        ["강동구", { y: 37.5301933196159, x: 127.123792501252 }],
        ["마포구", { y: 37.5662141900954, x: 126.901955141101 }],
        ["서대문구", { y: 37.579161863979, x: 126.9368156604 }],
        ["은평구", { y: 37.6028174370823, x: 126.928940981464 }],
        ["종로구", { y: 37.5735042429813, x: 126.978989954189 }],
        ["중구", { y: 37.5638077703601, x: 126.997555182293 }],
        ["용산구", { y: 37.5324310391314, x: 126.990582345331 }],
        ["성동구", { y: 37.563427205337, x: 127.036930141185 }],
        ["동대문구", { y: 37.5745229817122, x: 127.039657001091 }],
        ["성북구", { y: 37.5893588153919, x: 127.016702905651 }],
        ["강북구", { y: 37.6397513275882, x: 127.025538071854 }],
        ["도봉구", { y: 37.6686914100284, x: 127.04721049936 }],
        ["노원구", { y: 37.6543617567057, x: 127.056430475216 }],
        ["중랑구", { y: 37.6065432383919, x: 127.092820287004 }],
        ["광진구", { y: 37.5385583136667, x: 127.082385189457 }]
    ]    

    const goRegister = (e) => {
        const {alt} = e.currentTarget;
        const region = regions.filter(region => region[0] === alt);
        dispatch(areaUpdate(region[0][1]));
        history.push('/register');
    }

    console.log(window.innerWidth);
    const change = (e) => {
        console.log(e.target.id);
        const {id} = e.currentTarget;
        const seoulMap = document.getElementById('seoul-city-map')
       seoulMap.setAttribute('src',`../img/map/seoulMap_${id}.jpg`)
    }
    return (
        <Box>
            <Left id="SearchImg" src="../img/pablo-819.png"/>
        <SearchBody>
            <img src="../img/map/seoulMap_00.jpg" alt="서울시 지도" useMap="#city-map" id="seoul-city-map"/>
        <map name="city-map" id="city-map-link">
            <Area shape="poly" coords="350,9,368,8,375,21,387,15,402,23,394,46,394,64,408,101,404,107,397,94,390,121,363,94,350,93,353,54,342,37,339,21,349,9" id="01" alt="도봉구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="335,34,349,55,347,93,360,99,396,136,375,159,367,155,361,159,353,151,343,149,338,139,309,114,304,102,307,96,302,81,318,64,318,42,334,33" id="02" alt="강북구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="393,126,399,107,407,113,412,104,402,70,397,54,407,26,417,16,430,18,441,13,452,27,464,30,456,40,456,48,462,57,462,68,455,75,458,101,479,100,486,108,486,126,473,137,461,145,449,143,415,149,393,126" id="03" alt="노원구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="491,278,508,237,531,232,545,229,566,213,574,217,579,234,582,248,585,266,579,272,558,275,548,281,548,288,538,305,527,317,497,299,501,288,493,278" id="04" alt="강동구" onClick={goRegister} onMouseOver={change}></Area>
            <Area shape="poly" coords="193,214,209,198,216,204,231,185,247,169,259,160,259,136,288,122,256,81,218,102,203,99,193,195,172,196" id="05" alt="은평구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="197,219,209,204,219,208,241,183,249,174,259,169,269,184,269,207,264,216,281,237,273,246,236,250,232,238,211,231,197,219" id="06" alt="서대문구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="166,196,214,237,228,241,234,252,275,253,279,261,256,288,226,275,212,276,139,222,162,208,165,196" id="07" alt="마포구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="265,139,264,166,273,181,274,204,269,217,284,232,291,230,358,226,357,219,339,215,329,195,315,196,294,178,292,172,307,170,302,140,290,129,264,137" id="08" alt="종로구"onClick={goRegister} onMouseOver={change}></Area>		
			<Area shape="poly" coords="278,251,289,234,360,231,363,237,339,268,329,261,323,264,299,253,278,250" id="09" alt="중구" onClick={goRegister} onMouseOver={change}></Area>
            <Area shape="poly" coords="286,258,305,260,322,269,329,267,348,288,312,323,301,321,268,309,260,290,269,284,286,258" id="10" alt="용산구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="297,126,308,120,337,148,350,156,357,163,377,163,399,141,411,154,426,154,422,163,384,185,361,215,353,211,340,208,331,192,320,190,299,180,314,166,309,148,297,126" id="25" alt="성북구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="427,165,387,187,380,193,380,202,364,215,364,226,371,228,387,223,407,237,431,241,437,216,423,193,426,165" id="11" alt="동대문구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="366,232,387,228,404,241,430,245,411,290,365,275,352,285,342,273,359,252,365,249,366,234" id="12" alt="성동구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="430,152,434,172,427,193,440,207,440,225,456,229,471,220,469,211,492,187,486,178,497,172,491,163,489,152,481,142,465,149,450,149,430,152" id="13" alt="중랑구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="440,229,453,234,471,226,471,235,469,241,475,253,487,250,486,264,456,302,440,302,432,303,414,293,439,230" id="14" alt="광진구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="79,278,93,267,108,301,139,297,138,288,135,279,136,264,149,261,150,269,160,268,156,263,156,257,113,223,75,199,55,175,46,184,53,196,29,226,30,234,20,238,18,248,6,258,37,272,46,282,61,273,79,278" id="15" alt="강서구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="91,276,105,305,142,302,143,285,139,278,139,269,145,268,153,273,165,272,176,284,173,301,161,305,161,318,152,336,141,339,126,329,103,339,96,336,95,332,84,330,91,303,81,288,91,276" id="16" alt="양천구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="87,336,99,344,127,336,140,342,153,342,162,327,179,332,180,363,195,375,185,384,164,372,154,371,146,362,115,381,114,396,102,387,73,393,86,368,74,366,69,355,86,336" id="17" alt="구로구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="165,324,166,308,178,303,181,286,162,266,162,260,198,290,224,293,253,315,228,323,221,333,221,345,206,357,195,372,183,360,182,329,165,324" id="18" alt="영등포구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="201,370,223,348,224,333,231,327,254,318,296,339,307,348,301,387,290,387,278,377,275,360,258,359,241,363,230,359,224,366,202,370" id="19" alt="동작구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="199,378,204,374,224,372,232,364,244,366,259,363,271,363,274,377,287,390,295,393,299,393,310,409,312,420,266,453,255,453,244,453,235,441,226,419,214,420,208,394,213,390,199,378" id="20" alt="관악구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="157,375,179,387,198,384,206,389,201,396,212,423,222,424,229,435,209,453,209,456,187,458,190,447,173,423,177,413,168,408,159,394,157,375" id="21" alt="금천구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="303,339,312,351,305,392,315,414,325,415,325,404,335,404,346,426,359,423,374,407,384,441,382,449,390,458,428,458,432,449,449,446,453,432,463,419,448,400,446,393,423,405,403,408,396,404,398,393,386,377,374,375,355,333,354,318,348,311,313,339,303,338" id="22" alt="서초구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="352,309,360,324,358,333,376,372,388,372,403,393,401,402,407,404,445,389,464,411,494,417,502,408,470,362,446,357,442,351,425,348,423,318,403,303,369,290,352,309" id="23" alt="강남구" onClick={goRegister} onMouseOver={change}></Area>
			<Area shape="poly" coords="426,318,430,342,471,356,506,402,516,405,511,393,515,390,527,394,537,379,552,366,554,348,541,341,529,345,525,336,525,321,492,302,495,290,488,284,472,311,448,318,427,318" id="24" alt="송파구" onClick={goRegister} onMouseOver={change}></Area>
        </map> 
        </SearchBody>
        </Box>
    )
}

export default withRouter(SearchPage);