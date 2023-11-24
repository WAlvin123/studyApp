import { useState, useEffect } from "react";
import { useCardsState } from "../components/useCardsState";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';

// Implement functionality

export const Matching = () => {

  const [cards, setCards] = useCardsState()
  const [randomCards, setRandomCards] = useState([])
  const [shuffledCards, setShuffledCards] = useState([])


  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards))
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

    if (studyAmount < cards.length) {
      while (smallerArray.length <= studyAmount) {
        const randomIndex = Math.floor(Math.random() * cards.length)
        if (!smallerArray.includes(cards[randomIndex])) {
          smallerArray.push(cards[randomIndex])
        }
      }
    }

    setRandomCards(smallerArray)

    const newArray = [...smallerArray]

    let i = newArray.length - 1;
    for (; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    setShuffledCards([...newArray])

    console.log(shuffledCards.length)
    console.log(randomCards.length)
  }

  const selectFirst = (id) => {
    setRandomCards(
      randomCards.map((items) => {
        if (items.id == id) {
          return { ...items, selected1: !items.selected1 }
        } else {
          return items
        }
      })
    )
  }

  const selectSecond = (id) => {
    setShuffledCards(
      shuffledCards.map((items) => {
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
      <h2>Enter the amount of cards you would like to study below</h2>
      <header>Guide: Match the front of the card with the back</header>
      <h2> </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} />
        <input type='submit' />
      </form>
      <div class='card-container'>
        <div>
          {randomCards.map((items) => {
            return (
              <div class='card'>
                <button onClick={() => { selectFirst(items.id) }}>{items.front}</button> {items.selected1 && <text>✓</text>}
              </div>
            )
          })}
        </div>

        <div>
          {shuffledCards.map((items) => {
            return (
              <div class='card'>
                <button onClick={() => { selectSecond(items.id) }}>{items.back}</button> {items.selected2 && <text>✓</text>}
              </div>
            )
          })}
        </div>
      </div>
    </div>)
}