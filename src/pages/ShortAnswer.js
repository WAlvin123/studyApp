import { useState, useEffect } from "react"
import { useCardsState } from "../components/useCardsState"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useDecksState } from "../components/useDecksState";

// TODO: Improve rendering. (Render step by step?)

export const ShortAnswer = () => {

  const [modalState, setModalState] = useState(0)
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])
  const [randomCards, setRandomCards] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState('-------')
  const [showAnswer, setShowAnswer] = useState(false)

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
    studyAmount: yup.number().required()
  })

  const { register, handleSubmit } = useForm({
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
      setModalState(2)
    }
    setRandomCards(randomArray)
  }

  const checkAnswer = (submission) => {
    if (modalState == 3) {
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

  return (
    <div>
      {modalState == 0 && (
        <div>
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
          <button onClick={() => {
            if (selectedOption !== '-------') {
              setModalState(1)
            }
          }}>Confirm</button>
        </div>
      )}

      {modalState == 1 && (
        <div>
          <h2>Enter the amount of cards you would like to study below</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2></h2>
            <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} />
            <input type='submit' />
          </form>
        </div>
      )
      }

      {modalState == 2 && (
        <div>
          <h2></h2>
          <h2>Select the side you want to study</h2>
          <button onClick={() => { setModalState(3) }}>Front</button><button onClick={() => { setModalState(4) }}>Back</button>
        </div>
      )
      }

      {modalState == 3 && (
        <div>
          {randomCards.length > 0 && (<div>
            <h2> </h2>
            <input placeholder="Enter answer..." value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} />
            <button onClick={() => { checkAnswer(inputValue) }}>SUBMIT</button>
            <div>
              <h2>{randomCards[0].back} <button onClick={() => { setShowAnswer(!showAnswer) }}>Show answer
              </button></h2>
              {showAnswer && <h2>{randomCards[0].front}</h2>}
            </div>
            <h2>Cards remaining: {randomCards.length} </h2>
          </div>)}
          {randomCards.length == 0 && (<button onClick={() => { setModalState(1) }}>Return</button>)}
        </div>
      )
      }

      {modalState == 4 && (
        <div>
          <div>
            {randomCards.length > 0 && (<div>
              <h2> </h2>
              <input placeholder="Enter answer..." value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} />
              <button onClick={() => { checkAnswer(inputValue) }}>SUBMIT</button>
              <div>
                <h2>{randomCards[0].front} <button onClick={() => { setShowAnswer(!showAnswer) }}>Show answer
                </button></h2>
                {showAnswer && <h2>{randomCards[0].back}</h2>}
              </div>
              <h2>{randomCards.length} cards left</h2>
            </div>)}
          </div>

          <button onClick={() => {
            setModalState(0)
          }}>FINISH STUDYING</button>
        </div>
      )
      }
      <h2></h2>
      <div class='divider'>a</div>
    </div>
  )
}