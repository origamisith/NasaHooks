import './App.css';
import {useEffect, useRef, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {
    PrimaryButton,
    Heading,
    HEADING_LEVELS,
    HEADING_TYPES,
    Content,
    IconArrowForward,
    IconButton,
    IconArrowBack, Button, centerContent, IconPageFirst, IconPageLast, BUTTON_SIZES
} from "cdk-radial";
import styled from "styled-components";

const NASA=''; //See https://api.nasa.gov/

const LargerContent = styled(Content)`
  font-size: 50px;
`;
const MyIconButton = styled(IconButton)`
  width: 3.5em;
  height: 3.5em;
`;
const Date = styled(Content)`
  margin: auto 10px;
  font-size: 1em
`;


function App() {
    const [count, setCount] = useState(0);
    const [index, setIndex] = useState(0);
    const [day, setDay] = useState(23);
    const [playing, setPlaying] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const {loading, data, isLoading, isSuccess, isError, error, isFetching} = useQuery(['rover', day], () => {
        return fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos' +
            '?earth_date=2021-06-' + (day+1) +
            '&api_key=' + NASA).then(response => response.json())
    });

    useEffect(() => {
        const timer = window.setInterval(() => {
            if(count%50===0 && playing && imgLoaded) {
                setImgLoaded(false);
                setIndex((index + 1) % data?.photos?.length)
            }
            setCount(count+1);
        }, 1)
        return () => {
            window.clearInterval(timer);
        }
    })

    const changeDay = (increment) => {
        setDay ((day + increment+ 30)%30)
        setIndex(0);
        setPlaying(false);
    }

    const selectPhoto = (increment) => {
        setIndex(((index + increment + data?.photos?.length) ?? 0)%((data?.photos?.length) ?? 1))
    }
    return (
        <div id="App" >
        <div id="Day-Controls">
                {/*<LeftButton onClick ={() => changeDay(-1)} text="Previous Day"/>*/}
                <IconButton onClick={() => changeDay(-1)} icon={<IconPageFirst/>}/>
                <Date>06/{day+1}/21</Date>
                <IconButton onClick={() => changeDay(1)} icon={<IconPageLast/>}/>
            </div>
            <div id="Image-Controls">
                <MyIconButton onClick ={() => selectPhoto(-1)} icon={<IconArrowBack style={{width: '3em', height: '3em'}}/>} text="Previous"/>
                <LargerContent type="body-2">{(data?.photos?.length || isLoading) ? ((imgLoaded? index+1: index) ?? 0) : "None"}</LargerContent>
                <Content style={{marginBottom: "18px"}}> {(data?.photos?.length || isLoading) ? ("\xa0/\xa0" + (data?.photos?.length ?? "...")) : ""}</Content>
                <MyIconButton onClick ={() => selectPhoto(1)} icon={<IconArrowForward style={{width: '3em', height: '3em'}}/>} text="Next"/>
            </div>
            <div id="Image-View">
                <Heading headingType="display-1" level={1}>{(loading || isLoading ) && "Loading..."}</Heading>
                {(isSuccess && !isLoading) && <img src={data?.photos[index]?.img_src} alt="No Photos For This Day" onLoad={() => setImgLoaded(true)}/>}
                {isError && "" + error}
            </div>
            <div id="Play-Pause">
                <PrimaryButton onClick={() => setPlaying(!playing)}text={"Play/Pause"}></PrimaryButton>
            </div>
        </div>
    );
}
export default App;