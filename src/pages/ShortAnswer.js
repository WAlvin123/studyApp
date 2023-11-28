import { useState, useEffect } from "react"
import { useCardsState } from "../components/useCardsState"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useDecksState } from "../components/useDecksState";
import "./Modal.css"

// TODO: Improve rendering. (Render step by step?)

export const ShortAnswer = () => {
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])
  const [randomCards, setRandomCards] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState('-------')
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyAmount, setStudyAmount] = useState('')
  const [studySide, setStudySide] = useState('')

  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards))
    }

    const storedDecks = localStorage.getItem('decks')
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks))
    }
  }, [])

  // Step 1: Filter cards
  const onDeckSelect = (choice) => {
    setFilteredCards(cards.filter((items) => items.deck == choice))
  }

  const submissionSchema = yup.object().shape({
    studyAmount: yup
      .number('Enter a valid amount of cards (>0, and a number)')
      .required("Enter a valid amount of cards (>0, and a number)")
      .typeError('Enter a valid amount of cards (>0, and a number)')
      .min(1, 'Enter a valid amount of cards (>0, and a number)')
      .max(filteredCards.length, 'You can not study an amount greater than the cards present in the deck')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(submissionSchema)
  })

  // Step 2: Make a random deck out of the filtered cards
  const onSubmit = (info) => {
    const randomArray = []
    const studyAmount = info.studyAmount - 1

    if (studyAmount < filteredCards.length) {
      while (randomArray.length <= studyAmount) {
        const randomIndex = Math.floor(Math.random() * filteredCards.length)
        if (!randomArray.includes(filteredCards[randomIndex])) {
          randomArray.push(filteredCards[randomIndex])
        }
      }
      setStudyAmount('')
      setStudySide('')
    }
    setRandomCards(randomArray)
  }

  const checkAnswer = (submission) => {
    if (studySide == 'back') {
      setRandomCards(randomCards.filter((items) => {
        if (submission == items.front) {
          setShowAnswer(false)
          return false
        } else {
          return true
        }
      }))
    } else {
      setRandomCards(randomCards.filter((items) => {
        if (submission == items.back) {
          setShowAnswer(false)
          return false
        } else {
          return true
        }
      }))
    }
  }

  const handleInputChange = (event) => {
    setStudyAmount(event.target.value)
  }

  return (
    <div>

      {(studySide == 'front' && randomCards.length >= 1) && (
        <div className="modalBackground">
          <div className="modalContainer">
            {randomCards.length > 0 && (
              <div>
                <h2> </h2>
                <input placeholder="Enter answer..." value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} />
                <button onClick={() => {
                   checkAnswer(inputValue) 
                   setInputValue('')
                   }}>SUBMIT</button>
                <div>
                  <h2>{randomCards[0].front} <button onClick={() => { setShowAnswer(!showAnswer) }}>Show answer
                  </button></h2>
                  {showAnswer && <h2>{randomCards[0].back}</h2>}
                </div>
                <h2>Cards remaining: {randomCards.length} </h2>
                <button onClick={() => {
                  setStudySide('')
                  setRandomCards([])
                  setInputValue('')
                }}>FINISH STUDYING</button>
              </div>
            )}
          </div>
        </div>
      )}

      {(studySide == 'back' && randomCards.length >= 1) && (
        <div className="modalBackground">
          <div className="modalContainer">
            <div>
              <h2> </h2>
              <input placeholder="Enter answer..." value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} />
              <button onClick={() => { 
                checkAnswer(inputValue) 
                setInputValue('')
                }}>SUBMIT</button>
              <div>
                <h2>{randomCards[0].back} <button onClick={() => { setShowAnswer(!showAnswer) }}>Show answer
                </button></h2>
                {showAnswer && <h2>{randomCards[0].front}</h2>}
              </div>
              <h2>Cards remaining: {randomCards.length} </h2>
              <button onClick={() => {
                setStudySide('')
                setRandomCards([])
                setInputValue('')
              }}>FINISH STUDYING</button>
            </div>
          </div>
        </div>
      )}

      <div className="option-select">
        <h2>Select the deck you would like to study from</h2>
        <header>Guide: Enter the correct answer corresponding to the opposite side of the list of cards</header>
        <h1></h1>
        <select onChange={(event) => {
          onDeckSelect(event.target.value)
          setSelectedOption(event.target.value)
        }}>
          <option>-------</option>
          <option>Uncategorized</option>
          {decks.map((deck) => {
            return (
              <option>{deck.name}</option>
            )
          })}
        </select>
        <button>Confirm</button>

        <h2>Enter the amount of cards you would like to study below</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2></h2>
          <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} onChange={handleInputChange} value={studyAmount} />
          <input type='submit' />
          <p>{errors.studyAmount?.message}</p>
        </form>
        <h2></h2>
        <h2>Currently registered  cards: {randomCards.length} <br />
          Select the side you want to study</h2>
        <button onClick={() => { if (randomCards.length >= 1) { setStudySide("front") } }}>Front</button>
        <button onClick={() => { if (randomCards.length >= 1) { setStudySide("back") } }}>Back</button>
      </div>
      <h2></h2>
      <div class='divider'>a</div>
    </div>
  )
}