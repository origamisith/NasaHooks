import './App.css';
import {useEffect, useRef, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import dotenv from "dotenv";

const NASA_KEY=''; //See https://api.nasa.gov/
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

    //Was going to use this way, but found a cooler way
    // useInterval(() => {
    //     if(playing && isSuccess && !isLoading && !isFetching && imgLoaded) {
    //         setImgLoaded(false);
    //         setIndex((index + 1) % data.photos.length)
    //     }
    // }, 100);

    //The cooler way
    useEffect(() => {
        const timer = window.setInterval(() => {
            if(playing && imgLoaded) {
                setImgLoaded(false);
                setIndex((index + 1) % data.photos.length)
            }
        }, 100)
        return () => {
            window.clearInterval(timer);
        }
    })


    return (
        <div className="App">
            <button onClick={() => setPlaying(!playing)}>Play/Pause</button>
            <button onClick ={() => setIndex((index-1 + data.photos.length)%data.photos.length)}>Previous</button>
            <button onClick ={() => setIndex((index+1)%data.photos.length)}>Next</button>
            <button onClick ={() => {
                setDay ((day-1 + 30)%30)
                setIndex(0);
            }}>Previous Day</button>
            <button onClick ={() =>  {
                setDay((day+1)%30)
                setIndex(0);
            }}>Next Day</button>
            <h2>{index}</h2>
            <h1>{(loading || isLoading ) && "Loading..."}</h1>
            {(isSuccess) && <img src={data?.photos[index]?.img_src} alt="Error" onLoad={() => setImgLoaded(true)}/>}
            {/*{(isSuccess) && <img src={data.photos[index]?.img_src} alt="Error" />}*/}
            {isError && "" + error}
        </div>
    );
}

//Was going to use this, but used a cooler way
//***** Stolen shamelessly from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// function useInterval(callback, delay) {
//     const savedCallback = useRef();
//
//     // Remember the latest callback.
//     useEffect(() => {
//         savedCallback.current = callback;
//     }, [callback]);
//
//     // Set up the interval.
//     useEffect(() => {
//         function tick() {
//             savedCallback.current();
//         }
//         if (delay !== null) {
//             let id = setInterval(tick, delay);
//             return () => clearInterval(id);
//         }
//     }, [delay]);
// }
//***** End of plagiarism

export default App;