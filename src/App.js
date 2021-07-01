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
    IconArrowBack, Button, centerContent
} from "cdk-radial";
import styled from "styled-components";

const NASA_KEY=''; //See https://api.nasa.gov/

const LeftButton = styled(Button)`float: left; margin: 5px`
const LargerContent = styled(Content)`font-size: 50px; display: inline`;
const MyIconButton = styled(IconButton)`margin-top: 0px; margin-outside: 200px; border-color: #000000; border-width: 4px`;

function App() {
    const [index, setIndex] = useState(0);
    const [day, setDay] = useState(22);
    const [playing, setPlaying] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const {loading, data, isLoading, isSuccess, isError, error,isFetching } = useQuery(['rover', day], () => {
        return fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos' +
            '?earth_date=2021-06-'+day+
            '&api_key=' + NASA_KEY).then(response => response.json())
    })

    useEffect(() => {
        const timer = window.setInterval(() => {
            if(playing && imgLoaded) {
                setImgLoaded(false);
                setIndex((index + 1) % data?.photos?.length)
            }
        }, 100)
        return () => {
            window.clearInterval(timer);
        }
    })

    return (
        <div className="App" style={{width: "100%"}}>
            <LeftButton onClick ={() => {
                setDay ((day-1 + 31)%31)
                setIndex(0);
            }} text="Previous Day"/>
            <div><Content style={{float: 'left', display: 'inline', lineHeight: '45px'}}>06/{day}/21</Content></div>
            <LeftButton onClick ={() =>  {
                setDay((day+1)%31)
                setIndex(0);
            }} text="Next Day"/>
            <div align={centerContent}>
                <PrimaryButton style={{center: '-10px'}} onClick={() => setPlaying(!playing)} text="Play/Pause"/>
                <MyIconButton onClick ={() => setIndex(((index-1 + data?.photos?.length) ?? 0)%((data?.photos?.length) ?? 1))} icon={<IconArrowBack/>} text="Previous"/>
                <LargerContent type="body-2">{index ?? 0}</LargerContent>
                /{data?.photos?.length ?? 0}
                <MyIconButton onClick ={() => setIndex((index+1)%data?.photos?.length)} icon={<IconArrowForward/>} text="Next"/>
            </div>
            <Heading headingType="display-1" level={1}>{(loading || isLoading ) && "Loading..."}</Heading>
            {(isSuccess && !isLoading) && <img src={data?.photos[index]?.img_src} alt="Error" onLoad={() => setImgLoaded(true)}/>}
            {isError && "" + error}
        </div>
    );
}
export default App;