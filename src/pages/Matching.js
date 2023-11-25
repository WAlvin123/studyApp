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
  const [answerPair, setAnswerPair] = useState([])
  const [answerMessage, setAnswerMessage] = useState('')
  const [modalState, setModalState] = useState(0)
  const [selectedOption, setSelectedOption] = useState('------')
  const pair = []

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

    setFirstColumn(smallerArray)

    const newArray = [...smallerArray]

    let i = newArray.length - 1;
    for (; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    setSecondColumn([...newArray])
  }

  const onDeckSelect = (deck) => {
    setFilteredCards(cards.filter((cards) => cards.deck === deck))
  }

  const selectFirst = (id) => {
    setFirstColumn(
      firstColumn.map((items) => {
        if (items.id == id) {
          return { ...items, selected1: !items.selected1 }
        } else {
          return items
        }
      }))
  }

  const selectSecond = (id) => {
    setSecondColumn(
      secondColumn.map((items) => {
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
      {modalState == 0 && (
        <div>
          <h2>Select the deck you would like to study</h2>
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
        <div>
          <h2>Enter the amount of cards you would like to study below</h2>
          <h2> </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} />
            <input type='submit' />
          </form>
        </div>)
      }

      {modalState == 2 && (
        <div>
          <div class='card-container'>
            <div>
              {firstColumn.map((items) => {
                return (
                  <div class='card'>
                    <button onClick={() => {
                      selectFirst(items.id)
                    }}>{items.front}</button> {items.selected1 && <text>✓</text>}
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
                      selectSecond(items.id)
                    }}>{items.back}</button> {items.selected2 && <text>✓</text>}
                  </div>
                )
              })}
            </div>
          </div>
          {firstColumn.length == 0 && (<button onClick={() => {
            setModalState(0)
            setAnswerMessage('')
          }}>Return</button>)}
        </div>
      )
      }
    </div>
  )
}