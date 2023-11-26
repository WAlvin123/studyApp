import { useDecksState } from "../components/useDecksState";
import { useCardsState } from "../components/useCardsState";
import { useState, useEffect } from "react";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form";

// TODO: Let the user choose if they want to study front or back (Similar to short answer)

export const MultipleChoice = () => {

  const [cards, setCards] = useCardsState()
  const [filteredCards, setFilteredCards] = useState([])
  const [randomCards, setRandomCards] = useState([])
  const [decks, setDecks] = useDecksState()
  const [modalState, setModalState] = useState(0)
  const [selectedOption, setSelectedOption] = useState('------')
  const [multipleChoices, setMultipleChoices] = useState([])
  const [choice, setChoice] = useState('')

  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards))
    }

    const storedDecks = localStorage.getItem('decks');
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks))
    }
  }, [])

  const handleSelect = (deck) => {
    setFilteredCards(cards.filter((card) => card.deck === deck))
  }

  const handleMultipleChoice = (answer) => {
    const mcArray = [answer]
    while (mcArray.length < 5) {
      const randomIndex = Math.floor(Math.random() * filteredCards.length)
      if (!mcArray.includes(filteredCards[randomIndex])) { mcArray.push(filteredCards[randomIndex]) }
    }

    mcArray.sort(() => Math.random() - 0.5);
    setMultipleChoices(mcArray)
  }

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
      setRandomCards(smallerArray)
      handleMultipleChoice(smallerArray[0])
      setModalState(2)
    }
    else {
      console.log('Not enough cards')
    }
  }

  const checkAnswer = () => {
    if (randomCards[0].back == choice) {
      setRandomCards(randomCards.filter((card) => card.back !== choice))
      handleMultipleChoice(randomCards[1])
    } else {
      console.log('wrong answer')
    }
  }

  return (
    <div>
      {modalState == 0 && (
        <div class='select-deck'>
          <h2></h2>
          <h2>Select the deck you would like to study from</h2>
          <header>Guide: Of the five options, choose the correct one. Options are taken from the deck <br/> so a minimum of 5 cards is required</header>
          <h2></h2>
          <select onChange={(event) => {
            handleSelect(event.target.value)
            setSelectedOption(event.target.value)
          }}>
            <option>------</option>
            <option>Uncategorized</option>
            {decks.map((deck) => {
              return (
                <option>
                  {deck.name}
                </option>
              )
            })}
          </select>
          <button onClick={() => {
            if (selectedOption !== '------') {
              setModalState(1)
            }
          }}>Confirm</button>
        </div>
      )}

      {modalState == 1 && (
        <div class='input-amount'>
          <h2>Enter the amount of cards you would like to study below</h2>
          <h2> </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('studyAmount')} />
            <input type='submit' />
          </form>
        </div>
      )}

      {modalState == 2 && (
        <div>
          <h2>Select the right option which corresponds to the opposite side of the card <br /> [UNFINISHED]</h2>
          {randomCards.length > 0 && (<div>
            {randomCards[0].front}
            <div>
              {multipleChoices.map((choice) => {
                return (<button onClick={() => { 
                  setChoice(choice.back) 
                }}>{choice.back}</button>)
              })}
            </div>
            <button onClick={checkAnswer}>Check Answer</button>
            <h2>Cards Remaining: {randomCards.length}</h2>
          </div>)}
        </div>
      )

      }
    </div>
  );
}