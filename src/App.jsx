import { useRef, useState , useEffect , useCallback} from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';


const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map( id => AVAILABLE_PLACES.find((place) => place.id === id)); //use map to convert every ID to a complete place objectthat get by array AVALIBLE-PLACES which contains these place object
// will fetch our data and populate our box so if i saved that and i reload will see i'm starting with the places previously added her. 


//app component a create place to get the user's Location.
function App() {
  
  const selectedPlace = useRef();

  const[modalIsOpen , setModalIsOpen]= useState(false);

  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  //we need a state for manages the available places
  const[availablePlaces , setAvailablePlaces]= useState([]);

 
//navigator it's provided by the browser ...the user will be asked for permission to get their location

  useEffect(() => {
    navigator.geolocation.getCurrentPosition( (position) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES , position.coords.latitude , position.coords.longitude)
      setAvailablePlaces(sortedPlaces);
    });

  }, []); //React actually never re-executes this effect func Instead, it only executes it once after this app component func was executed for the first time.if i delete this emty array..this effect func would be executed after every app component render cycle.and therefore, we would still have an infinte loop But with empty dependencies array that will not be the case.

  //this code here in 2 lines is a side effect cause it's not directly related with that task 

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);

  }
//this code below "not create a infinite loop cause function handleSelectPlace "only execute when a user clicks on one of this items"places available" notttttttt when the app component func is re-executed
  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    //localStorage coming from browser and setItem to store some data in the browser's storage and still this data available when leave a website then come back to it later or if we reload the website.the second arrgument must be String ..the data must be converted to string first can do with the JSON.stringify method
   const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];  //we might not have any stored places yet so i put a empty array if this here should yield undefined.
   if (storedIds.indexOf(id) === -1) {
     localStorage.setItem('selectedPlaces' , JSON.stringify([id , ...storedIds]));
  } // -1 it means this id is not part of storedIds yet so in that case i wanna update the stored data
  
  }
  const  handleRemovePlace = useCallback(
    function handleRemovePlace() {
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );
      //setModalIsOpen(false);
  
  
      const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  
      localStorage.setItem('selectedPlaces' , JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)));//filter method allows us to produce a new array based on this array and some filtering condition.for that filter takes a func that will executed on every item in this array and will get every item as an input to this func here then we have to return true if wanna keep that item and false if wanna drop it
    } , []
  
  );
 
  return (
    <>
      <Modal  open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
