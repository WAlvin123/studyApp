import { useState, useEffect } from "react";
import { useCardsState } from "../components/useCardsState";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useDecksState } from "../components/useDecksState";

// TODO: Make second button not append endlessly

export const Matching = () => {

  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])
  const [firstColumn, setFirstColumn] = useState([])
  const [secondColumn, setSecondColumn] = useState([])
  const [answerMessage, setAnswerMessage] = useState('Pick a card from the left, and pick a card from the right, and check your answer')
  const [modalState, setModalState] = useState(0)
  const [selectedOption, setSelectedOption] = useState('------')
  const [choiceOne, setChoiceOne] = useState('')
  const [choiceTwo, setChoiceTwo] = useState('')

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

  const submissionSchema = yup.object().shape({
    studyAmount: yup.number().required()
  })

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(submissionSchema)
  })

  const onSubmit = (info) => {
    const studyAmount = info.studyAmount - 1
    const smallerArray = []

    if (studyAmount < filteredCards.length) {
      while (smallerArray.length <= studyAmount) {
        const randomIndex = Math.floor(Math.random() * filteredCards.length)
        if (!smallerArray.includes(filteredCards[randomIndex])) {
          smallerArray.push(filteredCards[randomIndex])
        }
      }
      setModalState(2)
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
    console.log(secondColumn)
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
    } else if (choiceOne == '' && choiceTwo == '') {
      setAnswerMessage('Select an item')
    } else if (choiceOne == '' && choiceTwo !== '' || choiceOne !== '' && choiceTwo == '') {
      setAnswerMessage('Complete your selection')
    } else {
      console.log('wrong you fool')
      setAnswerMessage('Incorrect')
    }
  }

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
            }
          }}>Confirm</button>
        </div>
      )

      }

      {modalState == 1 && (
        <div class='input-amount'>
          <h2>Enter the amount of cards you would like to study below</h2>
          <h2> </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} />
            <input type='submit' />
          </form>
        </div>)
      }

      {modalState == 2 && (
        <div class='study-page'>
          <div class='card-container'>
            <div>
              {firstColumn.map((items) => {
                return (
                  <div class='card'>
                    <button onClick={() => {
                      handleChoice(items, items.column)
                    }}
                    >{items.front}</button> {items.selected1 && <text>✓</text>}
                  </div>
                )
              })}
            </div>

            {firstColumn.length > 0 && (<h2>{answerMessage}</h2>)}

            <div>
              {secondColumn.map((items) => {
                return (
                  <div class='card'>
                    <button onClick={() => {
                      handleChoice(items, items.column)
                    }}>{items.back}</button> {items.selected2 && <text>✓</text>}
                  </div>
                )
              })}
            </div>
          </div>
          {firstColumn.length > 0 && (<div class='answer-box'>
            <h2>{choiceOne.front}</h2>
            <h2>{choiceTwo.back}</h2>
            <button onClick={handleCheckAnswer}>Check Answer</button>
          </div>)}
          {firstColumn.length == 0 && (
            <div>
              <h2>Results</h2>
              <button onClick={() => {
                setModalState(0)
                setAnswerMessage('')
              }}>Return</button>
            </div>
          )}
        </div>
      )
      }
    </div>
  )
}