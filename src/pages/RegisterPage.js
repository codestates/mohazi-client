/*global kakao*/ 
import { withRouter, Route, useHistory } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import oc from 'open-color';
import axios from 'axios';

const { kakao } = window;

require("dotenv").config();
const server = process.env.REACT_APP_SERVER_URL;
const KakaoRestAPIKey = process.env.REACT_APP_KAKAO_MAP_RESTAPI_KEY;

const Map = styled.div`
    float: right;
    width: 65%;
    height: 650px;
    border-radius: 10px;
    position: relative;
`;

const SearchBar = styled.div`
    border-radius: 3px;
    border: 3px solid black;
    background: white;
    width: 220px;
    height: 50px;
    position: absolute;
    z-index: 10;
    right: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    > input {
        margin-right: 10px;
        border: none;
    }
    
    > img {
     &:hover {
         cursor: pointer;
     }   
    }
`;

const Selections = styled.div`
    margin: 0px 50px 0 30px;
    background: white;
    box-shadow: rgb(180 180 180) -1px 1px 8px;
    border-radius: 20px;
    width: 320px;
    height: 650px;
    border-radius: 10px;
    position: absolute;
    padding: 20px;
    z-index: 9;
    color: ${oc.gray[8]};
    display: flex;
    flex-direction: column;
    align-items: center;

    > h2 {
        color: ${oc.yellow[6]}
    }

    > img {
        margin-top: 20px;
        width: 30px;
        cursor: pointer;
    }

    #location {
        color: black;
    }

    > input {
        border: none;
    }

    .miniTitle {
        font-size: 0.8rem;
        font-weight: 600;
        color: ${oc.gray[6]};
        align-self: flex-start;
        margin-left: 10px;
        margin-right: 20px;
    }
`;

const ContentBox_Selections = styled.div`
    width: 270px;
    height: 500px;
    margin: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    }
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
`;

const ContentBox_Places = styled.div`
    width: 180px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    }
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
`;

const SearchResults = styled.div`
    margin: 0px 0px 0 340px;
    background: ${oc.gray[7]};
    border-radius: 10px;
    width: 200px;
    height: 600px;
    position: relative;
    padding: 30px;
    z-index: 6;
    color: ${oc.gray[8]};
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SelectCategory = styled.select`
    border-radius: 3px;
    z-index: 10;
    top: 0;
`;

const SelectRegion = styled.select`
    border-radius: 3px;
    border: 3px solid black;
    font-weight: 600;
    width: 80px;
    height: 30px;
    position: absolute;
    z-index: 10;
    right: 260px;
    margin-top: 30px; 
`;

const Place = styled.div`
    font-size: 0.7rem;
    width: 145px;
    border-radius: 5px;
    background: white;
    margin: 5px 0px 10px 0px;
    padding: 5px;
    box-shadow: rgb(180 180 180) -1px 1px 5px;
    cursor: pointer;

    > h3 {
        color: ${oc.blue[9]}
    }

    > h4 {
        color: ${oc.gray[7]}
    }

    &:hover {
        > h3, h4 {
            color: white;
        }
        background: ${oc.yellow[4]};
    }

`;

const Selection = styled.div`
    width: 250px;
    height: 80px;
    border-radius: 4px;
    margin: 5px;
    padding: 5px;
    display:flex;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;

    > img {
        width: 50px;
        margin-right: 15px;
    }

    > div > h3 {
        color: black;
    }

    > div > h4 {
        color: ${oc.gray[7]}
    }

    .removeSelection {
        display: none;
    }

    &:hover {
        background: black;
        display: flex;
        justify-content:center;
        align-items: center;

        > div > h3, h4 {
            display: none;
        }

        > img {
            display: none;
        }

        .removeSelection {
            display: block;
            color: ${oc.gray[3]};
            font-size: 0.9rem;
        }
    }
`;

const CreateCardButton = styled.button`
    font-size: 0.9rem;
    font-weight: 600;
    background: ${oc.yellow[6]};
    color: white;
    padding: 0.8rem;
    cursor: pointer;
    border: none;
    box-shadow: rgb(180 180 180) -1px 1px 5px;
    border-radius: 3px;
    transition: .2s all;

    &:hover {
        background: ${oc.gray[6]};
        color: white;
    }
`;

const Search_wrap = styled.div`
    width: 35%;
    height: 650px;
    background: white;
    float: left;
    display: flex;
    flex-dirention: row;
    align-items:center;
`;

function RegisterPage() {
    const state = useSelector(state => state);
    const history = useHistory();
    const { isLogin, userInfo, region } = state;

    const onDragStart = (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.currentTarget.style.opacity = "0.5";
    }

    const onDragEnd = (event) => {
        event.currentTarget.style.opacity = "1";
    }

    const onDragEnter = (event) => {
        console.log('ondragenter:', event)    
    }

    const onDragOver = (event) => {
        event.preventDefault();
        if (event.target.id == "dropzone") {
            event.target.style.border = `2px dashed ${oc.yellow[3]}`;
            event.target.style.borderRadius = '10px';
        }
    }

    const onDragLeave = (event) => {
        event.target.style.border = 'none';
    }

    const onDrop = (event) => {
        event.preventDefault();
        event.target.style.border = 'none';
        
        const draggedDataId = event.dataTransfer.getData('text');
        for(let i=0; i<places.length; i++) {
            if (places[i].id === draggedDataId && !selections.includes(places[i])) {
                setSelections(selections => [...selections, places[i]]);
                setPlaces(places.filter((place, index) => index !== i));
            }
        }
        
        event.dataTransfer.clearData();
    }

    const infowindow = new kakao.maps.InfoWindow({zIndex:1});
    const geocoder = new kakao.maps.services.Geocoder();
    const [map, setMap] = useState('')
    const [[lat, lng], setLatLng] = useState([37.566826, 126.9786567]); // y, x
    const [positionMarker, setPositionMarker] = useState('');
    const [selectionMarkers, setSelectionMarkers] = useState([]);
    const [placeMarkers, setPlaceMarkers] =useState([]);
    const [inputText, setInputText] = useState('');
    const [inputDate, setInputDate] = useState('');
    const categories = [[null, '선택', null], ["restaurant", "음식점", "FD6"], ["mall", "백화점", "MT1"], ["cafe", "카페", "CE7"], ["park", "관광명소", "AT4"], ["exhibition", "문화시설", "CT1"]];
    const categoryOptions = categories.map(category => {
        return <option value={category[2]}>{category[1]}</option>;
    });
    const regions = ["선택", "강서구", "구로구", "양천구", "영등포구", "금천구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구", "마포구", "서대문구", "은평구", "종로구", "중구", "용산구", "성동구", "동대문구", "성북구", "강북구", "도봉구", "노원구", "중랑구", "광진구"]
    const regionOptions = regions.map(region => {
        return <option value={region}>{region}</option>;
    });

    const [places, setPlaces] = useState([])
    const showPlaces = places.map((place, index) => {
        return <Place
                id={place.id}
                draggable='true'
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={() => handleSelect(place)}>
                    <h3>{place.place_name}</h3>
                    <h4>{place.address_name}</h4>
                    <h4>{place.phone}</h4>
            </Place>
    });
    
    const [selections, setSelections] = useState([])
    const showSelections = selections.map(selection => {
        return <Selection onClick={() => handleRemoveSelection(selection)}>
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNC4xOTggMC04IDMuNDAzLTggNy42MDIgMCA2LjI0MyA2LjM3NyA2LjkwMyA4IDE2LjM5OCAxLjYyMy05LjQ5NSA4LTEwLjE1NSA4LTE2LjM5OCAwLTQuMTk5LTMuODAxLTcuNjAyLTgtNy42MDJ6bTAgMTFjLTEuNjU3IDAtMy0xLjM0My0zLTNzMS4zNDItMyAzLTMgMyAxLjM0MyAzIDMtMS4zNDMgMy0zIDN6Ii8+PC9zdmc+" />
                <div>
                    <div className="removeSelection">일정 삭제</div>
                    <h3>{selection.place_name}</h3>
                    <h4>{selection.address_name}</h4>
                    <h4>{selection.phone}</h4>
                </div>
            </Selection>
    });

    const handleSelect = (place) => {
        const i = places.indexOf(place);
        setSelections([...selections, place]);
        setPlaces(places.filter((place, index) => index !== i));
    }

    const handleRemoveSelection = (selection) => {
        setPlaces([...places, selection]);
        setSelections(selections.filter(el => el.id !== selection.id));
    }

    const handleCategory = (event) => {
        let mapBounds = map.getBounds();

        const category = event.target.value;
        axios.put(`${server}/itemtype`,
        {
            itemType: category, // kakao catergory_code
            rect: [mapBounds.ha, mapBounds.qa, mapBounds.oa, mapBounds.pa]
        }, {
            'Content-Type': 'application/json',
            withCredentials: true,
        })
        // axios({
        //     method: 'GET',
        //     url: `https://dapi.kakao.com/v2/local/search/keyword.json?query='스타'&category_group_code=${category}`,
        //     headers: { Authorization: `KakaoAK ${KakaoRestAPIKey}` },
        //   })
        .then(res => {
            setPlaces(res.data.items);
        })
        .catch(err => console.log(err))
    };

    const onChangeKeyword = (event) => {
        setInputText(event.target.value);
    }

    const onChangeDate = (event) => {
        setInputDate(event.target.value);
        console.log(inputDate)
    }

    const handleRefresh = () => {
        setPlaces([...places, ...selections]);
        setSelections([]);
    }

    const handleEnter = (event) => {
        if(event.keyCode == 13){
            handleSearchRegion(event);
       }
    }

    const handleSearchRegion = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const keyword = value? value: document.getElementById('keyword').value;

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(keyword, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                setLatLng([result[0].y, result[0].x]);

                console.log(keyword, `region: {y: ${result[0].y}, x: ${result[0].x}}`)

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });
    }

    const handleCreateCard = () => {
        if(confirm("일정을 등록하시겠습니까?")){
            if(!isLogin) {
                if (confirm("로그인 후 이용가능합니다. 로그인하시겠습니까?") === true) {
                    history.push('/login');
                }
            } else {
                axios.put(`${server}/createcard`,
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    }, {
                    date: inputDate,
                    userId: userInfo.id,
                    selections: selections,
                })
                    .then(res => {
                        if (confirm("마이페이지로 이동하시겠습니까?") === true) {
                            history.push('/mypage');
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    const handleMakePositionMarker = (mouseEvent) => {
        let latlng = mouseEvent.latLng;
        setLatLng([latlng.getLat(), latlng.getLng()]); 
    };

    //지도 생성
    useEffect(() => {
        const mapContainer = document.getElementById('map'),
            mapOptions = {
                center: new kakao.maps.LatLng(37.566826, 126.9786567),
                level: 3
            };

        const map = new kakao.maps.Map(mapContainer, mapOptions); 
        setMap(map);

        kakao.maps.event.addListener(map, "click", handleMakePositionMarker);
        // if(region) {
        //     setLatLng({region.y, region.x})
        // }
    }, [])

    //위치 선택
    useEffect(() => {
        if(positionMarker !== '') { 
            positionMarker.setMap(null)
        };

        let coords = new kakao.maps.LatLng(lat, lng);
        let marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        setPositionMarker(marker);

        kakao.maps.event.addListener(marker, 'click', function () {
            marker.setMap(null)
        });

        geocoder.coord2Address(lng, lat, function(result, status){
            const location = document.getElementById('location')

            if (status === kakao.maps.services.Status.OK) {
                let detailAddr = !!result[0].road_address ? result[0].road_address.address_name: '';
                location.textContent = detailAddr;
            }
        });
    }, [lat, lng])

    //장소 마커 띄우기
    useEffect(() => {
        placeMarkers.map(el => el.setMap(null));
        let markers = [];

        let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
        let imageSize = new kakao.maps.Size(24, 35);
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        for (let place of places) {
            let coords = new kakao.maps.LatLng(place.y, place.x);
            let marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });

            kakao.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
                infowindow.close();
            });

            kakao.maps.event.addListener(marker, 'click', function () {
                infowindow.close();
                handleSelect(place);
            });

            markers = [...markers, marker];
        }

        setPlaceMarkers(markers);
        // map.setBounds(bounds);
    }, [places])

    //선택 항목 마커 띄우기
    useEffect(() => {
        selectionMarkers.map(el => el.setMap(null));
        let markers = [];

        let imageSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNC4xOTggMC04IDMuNDAzLTggNy42MDIgMCA2LjI0MyA2LjM3NyA2LjkwMyA4IDE2LjM5OCAxLjYyMy05LjQ5NSA4LTEwLjE1NSA4LTE2LjM5OCAwLTQuMTk5LTMuODAxLTcuNjAyLTgtNy42MDJ6bTAgMTFjLTEuNjU3IDAtMy0xLjM0My0zLTNzMS4zNDItMyAzLTMgMyAxLjM0MyAzIDMtMS4zNDMgMy0zIDN6Ii8+PC9zdmc+";
        let imageSize = new kakao.maps.Size(40, 62);   
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        for(let selection of selections) {
            let coords = new kakao.maps.LatLng(selection.y, selection.x);
            let marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });

            markers = [...markers, marker];
        }

        setSelectionMarkers(markers);
    }, [selections])

    return (
        <>
            <SelectRegion onChange={(e) => handleSearchRegion(e)}>
                    {regionOptions}
            </SelectRegion>
            <SearchBar className="inputForm">
                <input
                    id='keyword'
                    type='text'
                    placeholder='지역을 검색하세요'
                    onChange={onChangeKeyword}
                    onKeyDown={(e) => handleEnter(e)}
                    value={inputText} />
                <img onClick={handleSearchRegion} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjMuMTExIDIwLjA1OGwtNC45NzctNC45NzdjLjk2NS0xLjUyIDEuNTIzLTMuMzIyIDEuNTIzLTUuMjUxIDAtNS40Mi00LjQwOS05LjgzLTkuODI5LTkuODMtNS40MiAwLTkuODI4IDQuNDEtOS44MjggOS44M3M0LjQwOCA5LjgzIDkuODI5IDkuODNjMS44MzQgMCAzLjU1Mi0uNTA1IDUuMDIyLTEuMzgzbDUuMDIxIDUuMDIxYzIuMTQ0IDIuMTQxIDUuMzg0LTEuMDk2IDMuMjM5LTMuMjR6bS0yMC4wNjQtMTAuMjI4YzAtMy43MzkgMy4wNDMtNi43ODIgNi43ODItNi43ODJzNi43ODIgMy4wNDIgNi43ODIgNi43ODItMy4wNDMgNi43ODItNi43ODIgNi43ODItNi43ODItMy4wNDMtNi43ODItNi43ODJ6bTIuMDEtMS43NjRjMS45ODQtNC41OTkgOC42NjQtNC4wNjYgOS45MjIuNzQ5LTIuNTM0LTIuOTc0LTYuOTkzLTMuMjk0LTkuOTIyLS43NDl6Ii8+PC9zdmc+" />
            </SearchBar>
            <Search_wrap>
                <Selections>
                    <h2 style={{margin: 5}}>오늘 뭐하지?</h2><br/>
                    <div className='miniTitle'>
                        <span className='miniTitle'>날짜</span>
                        <input type="date" value={inputDate} onChange={onChangeDate}/>
                    </div><br/>
                    <div className='miniTitle'>
                        <span className='miniTitle'>위치</span>
                        <span id='location'></span>
                    </div><br/>
                    <ContentBox_Selections
                        id="dropzone"
                        onDragEnter={onDragEnter}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        >
                        {showSelections}
                    </ContentBox_Selections>
                    <CreateCardButton onClick={handleCreateCard}>일정을 등록하세요</CreateCardButton>
                    <img onClick={handleRefresh} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMuNSAyYy01LjYyMSAwLTEwLjIxMSA0LjQ0My0xMC40NzUgMTBoLTMuMDI1bDUgNi42MjUgNS02LjYyNWgtMi45NzVjLjI1Ny0zLjM1MSAzLjA2LTYgNi40NzUtNiAzLjU4NCAwIDYuNSAyLjkxNiA2LjUgNi41cy0yLjkxNiA2LjUtNi41IDYuNWMtMS44NjMgMC0zLjU0Mi0uNzkzLTQuNzI4LTIuMDUzbC0yLjQyNyAzLjIxNmMxLjg3NyAxLjc1NCA0LjM4OSAyLjgzNyA3LjE1NSAyLjgzNyA1Ljc5IDAgMTAuNS00LjcxIDEwLjUtMTAuNXMtNC43MS0xMC41LTEwLjUtMTAuNXoiLz48L3N2Zz4="/>
                </Selections>
                <SearchResults>
                    <SelectCategory onChange={(e) => handleCategory(e)}>
                        {categoryOptions}
                    </SelectCategory><br/>
                    <ContentBox_Places>
                        {showPlaces}
                    </ContentBox_Places>
                </SearchResults>
            </Search_wrap>
            <Map id="map" >
            </Map>
        </>
    )
}

export default withRouter(RegisterPage);

/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */