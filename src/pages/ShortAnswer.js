import { useState, useEffect } from "react"
import { useCardsState } from "../components/useCardsState"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useDecksState } from "../components/useDecksState";

// Improve rendering. (Render step by step?)

export const ShortAnswer = () => {

  const [modalState, setModalState] = useState(0)
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])
  const [randomCards, setRandomCards] = useState([])
  const [inputValue, setInputValue] = useState('')

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


  const onDeckSelect = (choice) => {
    setFilteredCards(cards.filter((items) => {
      if (items.deck == choice) {
        return true
      } else {
        return false
      }
    }))
    console.log(filteredCards)
    setModalState(1)
  }

  const submissionSchema = yup.object().shape({
    studyAmount: yup.number().required()
  })

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(submissionSchema)
  })

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
          return false
        } else {
          return true
        }
      }))
    } else {
      setRandomCards(randomCards.filter((items) => {
        if (submission == items.back) {
          return false
        } else {
          return true
        }
      }))
    }

    if (randomCards.length == 1) {
      setModalState(0)
    }
  }

  return (
    <div>
      {modalState == 0 && (
        <div>
          <h2>Select the deck you would like to study</h2>
          <header>Guide: Enter the correct answer corresponding to the opposite side of the list of cards</header>
          <h1></h1>
          <select onChange={(event) => { onDeckSelect(event.target.value) }}>
          <option>-------</option>
          <option>Uncategorized</option>
            {decks.map((deck) => {
              return (
                <option>{deck.name}</option>
              )
            })}
          </select>
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
          <h2> </h2>
          <input placeholder="Enter answer..." value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} />
          <button onClick={() => { checkAnswer(inputValue) }}>SUBMIT</button>
          {randomCards.map((items) => {
            return (
              <h2>{items.back}</h2>
            )
          })}
          <button onClick={() => { setModalState(1) }}>FINISH STUDYING</button>
        </div>
      )
      }

      {modalState == 4 && (
        <div>
          <h2> </h2>
          <input placeholder="Enter answer..." value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} />
          <button onClick={() => { checkAnswer(inputValue) }}>SUBMIT</button>
          {randomCards.map((items) => {
            return (
              <h2>{items.front}</h2>
            )
          })}
          <button onClick={() => {
            setModalState(0)
          }}>FINISH STUDYING</button>
        </div>
      )
      }
    </div>
  )
}