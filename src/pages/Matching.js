import { useState, useEffect } from "react";
import { useCardsState } from "../components/useCardsState";
import { useDecksState } from "../components/useDecksState";

// TODO: Make second button not append endlessly

export const Matching = () => {

  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])
  const [firstColumn, setFirstColumn] = useState([])
  const [secondColumn, setSecondColumn] = useState([])
  const [answerMessage, setAnswerMessage] = useState('')
  const [modalState, setModalState] = useState(0)
  const [selectedOption, setSelectedOption] = useState('------')
  const [choiceOne, setChoiceOne] = useState('')
  const [choiceTwo, setChoiceTwo] = useState('')
  const [wrong, setWrong] = useState(false)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [deckAmountMessage, setDeckAmountMessage] = useState('')

  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards))
    }
  }, [])

  useEffect(() => {
    const storedDecks = localStorage.getItem('decks');
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks))
    }
  }, [])

  const onSubmit = () => {
    const smallerArray = []

    if (userInput - 1 < filteredCards.length && userInput > 0) {
      while (smallerArray.length < userInput) {
        const randomIndex = Math.floor(Math.random() * filteredCards.length)
        if (!smallerArray.includes(filteredCards[randomIndex])) {
          smallerArray.push(filteredCards[randomIndex])
        }
      }
      setScore(0)
      setModalState(2)
    } else if (userInput == 0) {
      setDeckAmountMessage('Enter a valid amount of cards (>0, and a number)')
    } else {
      setDeckAmountMessage('You can not study an amount greater than the cards present in the deck')
    }

    setFirstColumn([...smallerArray].map((item) => {
      return { ...item, column: 1 }
    }))

    const newArray = [...smallerArray]

    let i = newArray.length - 1;
    for (; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    setSecondColumn([...newArray].map((item) => {
      return { ...item, column: 2 }
    }))

    setTotalScore(smallerArray.length)
  }

  const onDeckSelect = (deck) => {
    setFilteredCards(cards.filter((cards) => cards.deck === deck))
  }

  const handleChoice = (card, column) => {
    if (choiceOne == '' && choiceTwo == '' && column == 1) { //No choice, column 1 first
      setChoiceOne(card)
    } else if (choiceOne == '' && choiceTwo == '' && column == 2) { //No choice, column 2 first
      setChoiceTwo(card)
    } else if (choiceOne !== '' && choiceTwo == '' && column == 2) {//Column 1, then column 2
      setChoiceTwo(card)
    } else if (choiceOne !== '' && choiceTwo == '' && column == 1) { //Column 1, then Column 1
      setChoiceOne(card)
    } else if (choiceOne == '' && choiceTwo !== '' && column == 2) {
      setChoiceTwo(card)
    } else if (choiceOne == '' && choiceTwo !== '' && column == 1) {
      setChoiceOne(card)
    } else if (choiceOne !== '' && choiceTwo !== '' && column == 1) {//Both choices filled, reselect C1
      setChoiceOne(card)
    } else if (choiceOne !== '' && choiceTwo !== '' && column == 2) {//Both choices filled, reselect C2
      setChoiceTwo(card)
    }
  }

  /* const handleChoice = (card, column) => {
  switch (column) {
    case 1:
      if (choiceOne === '') {
        setChoiceOne(card);
      } else if (choiceTwo === '') {
        setChoiceTwo(card);
      } else {
        setChoiceOne(card);
      }
      break;
    case 2:
      if (choiceTwo === '') {
        setChoiceTwo(card);
      } else if (choiceOne === '') {
        setChoiceOne(card);
      } else {
        setChoiceTwo(card);
      }
      break;
    default:
      break;
  }
}; 

GPT provided code for a switch statement to make my above code more precise and readable. Study and understand the purpose of switch statments and breaks, and then implement. 
*/

  const handleCheckAnswer = () => {
    if (choiceOne.id == choiceTwo.id && choiceOne !== '' && choiceTwo !== '') {
      setFirstColumn(firstColumn.filter((item) => item.id !== choiceOne.id))
      setSecondColumn(secondColumn.filter((item) => item.id !== choiceOne.id))
      setChoiceOne('')
      setChoiceTwo('')
      setAnswerMessage('Correct')
      if (wrong == false) {
        setScore(score + 1)
      } else {
        setWrong(false)
      }
    } else if (choiceOne == '' && choiceTwo == '') {
      setAnswerMessage('Select an item')
    } else if (choiceOne == '' && choiceTwo !== '' || choiceOne !== '' && choiceTwo == '') {
      setAnswerMessage('Complete your selection')
    } else {
      if (wrong == false && score == 0) {
        setWrong(true)
      } else if (wrong == false) {
        setWrong(true)
      } else if (wrong == true) {
        setScore(score)
      }
      setAnswerMessage('Incorrect')
    }
  }

  // RENDERED PAGE BELOW
  return (
    <div>
      {modalState == 0 && (
        <div class='select-deck'>
          <h2>Select the deck you would like to study from</h2>
          <header>Guide: Match the front of the card with the back</header>
          <h2></h2>
          <select onChange={(event) => {
            onDeckSelect(event.target.value)
            setSelectedOption(event.target.value)
          }}>
            <option>------</option>
            <option>Uncategorized</option>
            {decks.map((deck) => { return <option>{deck.name}</option> })}
          </select>
          <button onClick={() => {
            if (selectedOption !== '------') {
              setModalState(1)
              setUserInput('')
            }
          }}>Confirm</button>
        </div>
      )

      }

      {modalState == 1 && (
        <div class='input-amount'>
          <h2>Enter the amount of cards you would like to study below</h2>
          <h2> </h2>
          <div>
            <input placeholder="Enter study session amount..." style={{ width: '200px' }} value={userInput} onChange={(event) => {
              setUserInput(event.target.value)
            }} />
            <button onClick={onSubmit}>Submit</button>
            <h2>{deckAmountMessage}</h2>
          </div>
        </div>)
      }

      {modalState == 2 && (
        <div class='study-page'>
          <div class='card-container'>
            <div>
              {firstColumn.map((items) => {
                return (
                  <div class='card' style={{display:'flex', justifyContent:'right'}}>
                    <button onClick={()=>{handleChoice(items, items.column)}}
                    style={{width:'120px', height:'25px'}}>{items.front}</button> 
                  </div>
                )
              })}
            </div>
            <div>


              {firstColumn.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: "center" }}>
                    <table style={{ backgroundColor: "black", color: 'white' }}>
                      <th width='200px'>Front</th>
                      <th width='200px'>Back</th>
                      <tr style={{ backgroundColor: 'white' }}>
                        <td style={{ color: "black" }}>{choiceOne.front}</td>
                        <td style={{ color: "black" }}>{choiceTwo.back}</td>
                      </tr>
                    </table>
                  </div>
                  <div>
                    {firstColumn.length > 0 && (<h2>{answerMessage}</h2>)}
                    <h2>Score: {score}</h2>
                    <button onClick={handleCheckAnswer}>Check Answer</button>
                  </div>
                </div>)}


            </div>
            <div>
              {secondColumn.map((items) => {
                return (
                  <div class='card' style={{width:'120px', height:'25px', display:'flex', alignItems:'stretch'}}>
                    <button onClick={() => {handleChoice(items, items.column)}}
                    style={{flex: '1 1 auto'}}
                    >{items.back}</button> 
                  </div>
                )
              })}
            </div>
          </div>


          {firstColumn.length == 0 && (
            <div>
              <h2>Results</h2>
              <h2>You scored {score} / {totalScore}</h2>
              <button onClick={() => {
                setModalState(0)
                setAnswerMessage('')
              }}>Return</button>
            </div>
          )}
        </div>
      )
      }
      <h2></h2>
      <div class='divider'>a</div>
    </div>
  )
}