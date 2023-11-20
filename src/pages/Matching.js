import { useState, useEffect } from "react";
import { useDeckState } from "../components/useDeckState";

export const Matching = () => {

  const [deck, setDeck] = useDeckState()
  const [studyNumber, setStudyNumber] = useState('')
  const [randomDeck, setRandomDeck] = useState([])
  const [shuffledDeck, setShuffledDeck] = useState([])


  useEffect(() => {
    const storedDeck = localStorage.getItem('deck');
    if (storedDeck) {
      setDeck(JSON.parse(storedDeck))
    }
  }, [])

  const handleChange = (event) => {
    setStudyNumber(event.target.value)
  }

  const createSmall = (input, array) => { // add functionality: error prompt when entering an input larger than study list
    const smallerArray = [];
    const arrayLength = array.length;

    if (input <= deck.length) {
      while (smallerArray.length < input) {
        const randomIndex = Math.floor(Math.random() * arrayLength)
        if (!smallerArray.includes(array[randomIndex])) {
          smallerArray.push(array[randomIndex])
        }
      }
      setRandomDeck(smallerArray)

      const newArray = [...smallerArray]

      let i = newArray.length - 1;
      for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
      }
      setShuffledDeck([...newArray])
    } else {
      console.log('invalid')
    }
  }

  const selectFirst = (id) => {
    setRandomDeck(
      randomDeck.map((items) => {
        if (items.id == id) {
          return { ...items, selected1: !items.selected1 }
        } else {
          return items
        }
      })
    )
  }

  const selectSecond = (id) => {
    setShuffledDeck(
      shuffledDeck.map((items) => {
        if (items.id == id) {
          return { ...items, selected2: !items.selected2 }
        } else {
          return items
        }
      })
    )
  }

  return (
    <div>
      <header>Input the amount of cards you would like to study (Less than or equal to the total in the deck)</header>
      <input onChange={handleChange} />

      <button onClick={() => { createSmall(studyNumber, deck); }}>
        BEGIN
      </button>

      <div class='card-container'>
        {randomDeck.map((items) => {
          return (
            <div class='card'>
              <button onClick={() => { selectFirst(items.id) }}>{items.front}</button> {items.selected1 && <text>✓</text>}
            </div>
          )
        })}

        {shuffledDeck.map((items) => {
          return (
            <div class='card'>
              <button onClick={()=> {selectSecond(items.id)}}>{items.back}</button> {items.selected2 && <text>✓</text>}
            </div>
          )
        })}
      </div>
    </div>)
}