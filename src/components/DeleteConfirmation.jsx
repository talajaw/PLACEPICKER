import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";


const TIMER = 3000;
//this component is responsible for rendering the content of this modal here "message Are you sure to delete this place?" so i want to add a feature where this modal closes automatically after 3 secs and we automatically delete the place.so we need to set a timer this func built into the browser setTimer func take 2 arrgument 1: func will be executed once this duration expired. 2: duration in milliseconds....i want to use useEffect for stop this timer when this component disappears.
export default function DeleteConfirmation({ onConfirm, onCancel }) {


 


  useEffect(() => {
    console.log('TIMER SET');
    const timer = setTimeout( () => {
      onConfirm();//add a prop in a useEffect then you should add them as dependencies so put this prop in empty array...this prop recives a func as a value and when adding func as dependencies there is a danger of creating an infinite loop
    }, TIMER);
    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    };
  }, [onConfirm]); 
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          NO
        </button>
        <button onClick={onConfirm} className="button">
          YES
        </button>
      </div>
      <ProgressBar timer={TIMER}/>
    </div>
  );
}

//the timer & interval we mustttt stopped to make sure that once the modal is closed.
