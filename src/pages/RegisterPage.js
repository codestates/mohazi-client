/*global kakao*/ 
import { withRouter, Route, useHistory } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import axios from 'axios';
import dotenv from 'dotenv';

const { kakao } = window;

dotenv.config();

const KakaoMap = styled.div`
    width: 100vw;
    height: 500px;
    border-radius: 10px;
    position: relative;
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
    height: 430px;
    border-radius: 10px;
    position: absolute;
    padding: 40px;
    z-index: 9;
    color: ${oc.gray[8]};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ContentBox_Selections = styled.div`
    width: 270px;
    height: 400px;
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
    height: 400px;
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
    box-shadow: rgb(180 180 180) -1px 1px 8px;
    border-radius: 20px;
    width: 160px;
    height: 430px;
    border-radius: 10px;
    position: absolute;
    padding: 40px;
    z-index: 9;
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

const Place = styled.div`
    font-size: 0.7rem;
    width: 130px;
    height: 80px;
    border-radius: 10px;
    background: ${oc.gray[2]};
    margin: 5px;
    padding: 5px;
    box-shadow: rgb(180 180 180) -1px 1px 8px;
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

function RegisterPage() {
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
        console.log('dragged:', event.dataTransfer.getData('text'))
        //브라우저의 default handling 방지
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
    
    const [isCategorySearch, setisCategorySearch] = useState(false)
    const [isKeywordSearch, setisKeywordSearch] = useState(false);
    const [inputText, setInputText] = useState('이태원 맛집');
    const [keyword, setKeyword] = useState('');
    const categories = [["restaurant", "음식점", "FD6"], ["mall", "백화점", "MT1"], ["cafe", "카페", "CE7"], ["park", "공원", "AT4"], ["exhibition", "전시관", "CT1"]];
    const [category, setCategory] = useState(categories[0][2]);
    const options = categories.map(category => {
        return <option value={category[2]}>{category[1]}</option>;
    });

    const [places, setPlaces] = useState([{id:'1', place_name: '스타벅스'}, {id:'2', place_name: '현대백화점'}, {id:'3', place_name: 'Cafe Groovy'}, {id:'4', place_name: 'D Museum'}, {id:'5', place_name: '투썸플레이스'}])
    const showPlaces = places.map(place => {
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
        //     itemType: category
        // })
        // .then(res => {
        //     setPlaces(res.items)
        //     showPlaces = places.map(place => {
        //         return <Place>{place.name}</Place>
        //     })
        // })
        // .catch(err => console.log(err))
        setisCategorySearch(true);
        axios({
            method: 'GET',
            url: `https://dapi.kakao.com/v2/local/search/keyword.json?query='스타'&category_group_code=${category}`,
            headers: { Authorization: "KakaoAK 82b9784bc57ed9f20be79aa814814551" },
          })
        .then(res => {
            console.log('category:',res.data.documents[0].id)
            setPlaces(res.data.documents)
        })
    };

    // const handleEnterKey = (event) => {
    //     console.log('검색:', event.target.value)
    //     if(event.key === 'Enter') {
    //         //setInputText(event.target.value);
    //     }
    // }

    const onChange = (event) => {
        setInputText(event.target.value);
        setisKeywordSearch(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setKeyword(inputText);
        setisKeywordSearch(true);
    }

    //지도 관련
    useEffect(() => {
        var mapContainer = document.getElementById('map'),
            mapOptions = {
                center: new kakao.maps.LatLng(37.566826, 126.9786567),
                level: 3
            };  

        var map = new kakao.maps.Map(mapContainer, mapOptions); 
        
        var ps = new kakao.maps.services.Places();  
        
        var infowindow = new kakao.maps.InfoWindow({zIndex:1});
        
        if(isKeywordSearch) {
            var keyword = document.getElementById('keyword').value;
        
            if (!keyword.replace(/^\s+|\s+$/g, '')) {
                alert('키워드를 입력해주세요!');
                return false;
            }
        
            ps.keywordSearch(keyword, placesSearchCB);
        }

        if(isCategorySearch) {
            ps.categorySearch(category, placesSearchCB, { useMapBounds: true });
        }
        
        function placesSearchCB (data, status, pagination) {
            console.log(data)
            if (status === kakao.maps.services.Status.OK) {
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                var bounds = new kakao.maps.LatLngBounds();
        
                for (var i=0; i<data.length; i++) {
                    displayMarker(data[i]);    
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }       
        
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            } 
        }
        
        function displayMarker(place) {
            
            // 마커를 생성하고 지도에 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x) 
            });
        
            kakao.maps.event.addListener(marker, 'click', function() {
                // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
            });
        }
    })

    return (
        <>
            <SearchBar className="inputForm">
                <input
                    id='keyword'
                    type='text'
                    placeholder='지역을 검색하세요'
                    onChange={onChange}
                    value={inputText} />
                <button onClick={handleSubmit}>검색</button>
            </SearchBar>
            <KakaoMap id="map">
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
                </Selections>
                <SearchResults>
                    <SelectCategory onChange={(e) => handleCategory(e)}>
                        {options}
                    </SelectCategory>
                    <div style={{width: 130}}>{category}를 선택하셨어요!</div>
                    <ContentBox_Places>
                        {showPlaces}
                    </ContentBox_Places>
                </SearchResults>
            </KakaoMap>
        </>
    )
}

export default withRouter(RegisterPage);