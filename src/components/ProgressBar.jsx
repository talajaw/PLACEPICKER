import { useEffect , useState } from "react";

export default function ProgressBar ({timer}) {

    const [remainingTime , setRemainingTime] = useState(timer);
    //we use useEffect here to avvoid infinite loop
      useEffect(() => {
        const interval =  setInterval(() => {
          console.log('INTERVAL');
          setRemainingTime(prevTime => prevTime - 10); //update the state based on prev state and the new remaining time is prev time minus 10.
        } , 10); //so that we excute it 100 times per second.
    
        return () => {
          clearInterval(interval);
        }; //we use a clean up func to avoid ongoing processes brhind the scences
      } , []);
      return <progress value={remainingTime} max={timer}/> ;
      

}

/* //so 3000 the 2990 then 2980 ..... */