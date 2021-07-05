/*global kakao*/ 
import { withRouter, Route, useHistory } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import oc from 'open-color';
import axios from 'axios';
import dotenv from 'dotenv';

const { kakao } = window;

dotenv.config();

const Map = styled.div`
    float: right;
    width: 60%;
    height: 650px;
    border-radius: 10px;
    position: relative;
    border: 10px solid ${oc.gray[4]};
`;

const SearchBar = styled.form`
    border-radius: 3px;
    position: absolute;
    z-index: 10;
    right: 20px;
    margin-top: 20px;
    display:inline-block;
`;

const Selections = styled.div`
    margin: 20px 50px 0 20px;
    background: white;
    box-shadow: rgb(180 180 180) -1px 1px 8px;
    border-radius: 20px;
    width: 300px;
    height: 530px;
    border-radius: 10px;
    position: absolute;
    padding: 20px;
    z-index: 9;
    color: ${oc.gray[8]};
    display: flex;
    flex-direction: column;
    align-items: center;
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
    width: 140px;
    height: 500px;
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
    margin: 20px 50px 0 340px;
    background: white;
    width: 160px;
    height: 530px;
    position: absolute;
    padding: 40px;
    z-index: 10;
    color: ${oc.gray[8]};
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
`;

const SelectCategory = styled.select`
    border-radius: 3px;
    position: absolute;
    z-index: 10;
    top: 0;
    margin-top: 20px;
`;

const SelectRegion = styled.select`
    border-radius: 3px;
    width: 80px;
    height: 30px;
    position: absolute;
    z-index: 10;
    right: 50px;
    margin-top: 600px;
    margin-bottom: 50px;
`;

const Place = styled.div`
    font-size: 0.7rem;
    width: 130px;
    height: 80px;
    border-radius: 10px;
    background: ${oc.gray[2]};
    margin: 5px;
    padding: 5px;
    box-shadow: rgb(180 180 180) -1px 1px 8px;
    cursor: pointer;
`;

const Selection = styled.div`
    width: 250px;
    height: 80px;
    border-radius: 10px;
    background: ${oc.gray[2]};
    margin: 5px;
    padding: 5px;
    box-shadow: rgb(180 180 180) -1px 1px 8px;
`;

const CreateCardButton = styled.button`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${oc.gray[8]};
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    transition: .2s all;

    &:hover {
        background: ${oc.gray[6]};
        color: white;
    }
`;

const Search_wrap = styled.div`
    width: 40%;
    height: 650px;
    background: white;
    float: left;
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
            event.target.style.border = `2px dashed ${oc.gray[3]}`;
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

    const bounds = new kakao.maps.LatLngBounds();
    const infowindow = new kakao.maps.InfoWindow({zIndex:1});
    const [map, setMap] = useState('')
    const [[lat, lng], setLatLng] = useState([37.566826, 126.9786567]); // y, x
    const [positionMarker, setPositionMarker] = useState('');
    const [placeMarkers, setPlaceMarkers] =useState([]);
    const [inputText, setInputText] = useState('');
    const [inputDate, setInputDate] = useState('');
    const categories = [["restaurant", "음식점", "FD6"], ["mall", "백화점", "MT1"], ["cafe", "카페", "CE7"], ["park", "관광명소", "AT4"], ["exhibition", "문화시설", "CT1"]];
    const [category, setCategory] = useState(categories[0][2]);
    const categoryOptions = categories.map(category => {
        return <option value={category[2]}>{category[1]}</option>;
    });
    const regions = ["강서구", "구로구", "양천구", "영등포구", "금천구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구", "마포구", "서대문구", "은평구", "종로구", "중구", "용산구", "성동구", "동대문구", "성북구", "강북구", "도봉구", "노원구", "중랑구", "광진구"]
    const regionOptions = regions.map(region => {
        return <option value={region}>{region}</option>;
    });

    const [places, setPlaces] = useState([{id:'1', place_name: '스타벅스'}, {id:'2', place_name: '현대백화점'}, {id:'3', place_name: 'Cafe Groovy'}, {id:'4', place_name: 'D Museum'}, {id:'5', place_name: '투썸플레이스'}])
    let showPlaces = places.map((place, index) => {
        return <Place
                id={place.id}
                draggable='true'
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={() => handleSelect(place)}>
                    {place.place_name}<br/>
                    {place.address_name}<br/>
                    {place.phone}
            </Place>
    });
    
    const [selections, setSelections] = useState([])
    const showSelections = selections.map(selection => {
        return <Selection onClick={() => handleRemoveSelection(selection)}>
                {selection.place_name}<br />
                {selection.address_name}<br />
                {selection.phone}
            </Selection>
    });

    const handleSelect = (place) => {
        const i = places.indexOf(place);
        setSelections([...selections, place]);
        setPlaces(places.filter((place, index) => index !== i));
    }

    const handleRemoveSelection = (selection) => {
        setPlaces([...places, selection]);
        setSelections(selections.filter(el => el.id !== selection.id))
    }

    const handleCategory = (event) => {
        setCategory(event.target.value);
        // axios.get(`https://localhost:4000/itemtype`,
        // {
        //     'Content-Type': 'application/json',
        //     withCredentials: true,
        // }, {
        //     itemType: category, // kakao catergory_code
        //     x: lng,
        //     y: lat,
        // })
        axios({
            method: 'GET',
            url: `https://dapi.kakao.com/v2/local/search/keyword.json?query='스타'&category_group_code=${category}`,
            headers: { Authorization: "KakaoAK 82b9784bc57ed9f20be79aa814814551" },
          })
        .then(res => {
            //setPlaces(res.items)
            setPlaces(res.data.documents)
            showPlaces = places.map(place => {
                return <Place>{place.name}</Place>
            })

            for(let marker of placeMarkers) {
                marker.setMap(null);
                console.log(placeMarkers)
            }

            let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
            let imageSize = new kakao.maps.Size(24, 35);   
            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);


            for(let place of places) {
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(place.y, place.x),
                    image: markerImage
                });
            
                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                    infowindow.open(map, marker);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
                    infowindow.close();
                });
        
                bounds.extend(new kakao.maps.LatLng(place.y, place.x));
                setPlaceMarkers([...placeMarkers, marker])
            }

            map.setBounds(bounds);
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

    const handleSearch = (event) => {
        event.preventDefault();
        const keyword = event.target.nodeName === "BUTTON"? document.getElementById('keyword').value: event.target.value;
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(keyword, function(result, status) {

            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                setLatLng([result[0].y, result[0].x]);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });
    }

    const handleCreateCard = () => {
        if(!isLogin) {
            if (confirm("로그인 후 이용가능합니다. 로그인하시겠습니까?") === true) {
                history.push('/login');
            }
        } else {
            axios.post(`https://localhost:4000/createcard`,
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

    const handleMakePositionMarker = (mouseEvent) => {
        if(positionMarker !== '') { 
            positionMarker.setMap(null)
        };
        
        let latlng = mouseEvent.latLng;
        setLatLng([latlng.getLat(), latlng.getLng()]);
    }

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
    }, [lat, lng])

    return (
        <>
            <SearchBar className="inputForm" onsubmit="return false">
                <input
                    id='keyword'
                    type='text'
                    placeholder='지역을 검색하세요'
                    onChange={onChangeKeyword}
                    value={inputText} />
                <button onClick={handleSearch}>검색</button>
            </SearchBar>
            <Search_wrap>
                <Selections>
                    <h3 style={{margin: 5}}>Selections</h3>
                    <ContentBox_Selections
                        id="dropzone"
                        onDragEnter={onDragEnter}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        >
                        {showSelections}
                    </ContentBox_Selections>
                    날짜를 선택하세요<input type="date" value={inputDate} onChange={onChangeDate}/><br/>
                    <CreateCardButton onClick={handleCreateCard}>일정을 등록하세요</CreateCardButton>
                </Selections>
                <SearchResults>
                    <SelectCategory onChange={(e) => handleCategory(e)}>
                        {categoryOptions}
                    </SelectCategory>
                    <div style={{width: 130}}>{category}를 선택하셨어요!</div>
                    <ContentBox_Places>
                        {showPlaces}
                    </ContentBox_Places>
                </SearchResults>
            </Search_wrap>
            <Map id="map" >
                <SelectRegion onChange={(e) => handleSearch(e)}>
                    {regionOptions}
                </SelectRegion>
            </Map>
        </>
    )
}

export default withRouter(RegisterPage);

/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */