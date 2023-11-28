import { useDecksState } from "../components/useDecksState";
import { useCardsState } from "../components/useCardsState";
import { useState, useEffect } from "react";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';

// TODO: Let the user choose if they want to study front or back (Similar to short answer)

export const MultipleChoice = () => {
  const [cards, setCards] = useCardsState()
  const [filteredCards, setFilteredCards] = useState([])
  const [randomCards, setRandomCards] = useState([])
  const [decks, setDecks] = useDecksState()
  const [studySide, setStudySide] = useState('')
  const [multipleChoices, setMultipleChoices] = useState([])
  const [choice, setChoice] = useState('')
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [studyAmount, setStudyAmount] = useState('')
  const [total, setTotal] = useState(0)
  const [selectedDeck, setSelecedDeck] = useState('-----')

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
    if (cards.filter((card) => card.deck === deck).length >= 5) {
      setFilteredCards(cards.filter((card) => card.deck === deck))
    } else {
      console.log('deck choice is invalid')
    }
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

  const handleInputChange = (event) => {
    setStudyAmount(event.target.value)
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

  const onSubmit = (info) => {
    const smallerArray = []

    if (info.studyAmount - 1 < filteredCards.length && info.studyAmount > 0) {
      while (smallerArray.length < info.studyAmount) {
        const randomIndex = Math.floor(Math.random() * filteredCards.length)
        if (!smallerArray.includes(filteredCards[randomIndex])) {
          smallerArray.push(filteredCards[randomIndex])
        }
      }
      setRandomCards(smallerArray)
      setTotal(smallerArray.length)
      handleMultipleChoice(smallerArray[0])
      setStudySide(2)
    }
  }

  const checkAnswer = () => {
    if (studySide == 'back') {
      if (randomCards[0].back == choice && wrong == false) {
        handleMultipleChoice(randomCards[1])
        setRandomCards(randomCards.filter((card) => card.back !== choice))
        setScore(score + 1)
      } else if (randomCards[0].back !== choice && wrong == false) {
        setWrong(true)
      } else if (randomCards[0].back == choice && wrong == true) {
        handleMultipleChoice(randomCards[1])
        setRandomCards(randomCards.filter((card) => card.back !== choice))
        setWrong(false)
      }
    } else if (studySide == 'front') {
      if (randomCards[0].front == choice && wrong == false) {
        handleMultipleChoice(randomCards[1])
        setRandomCards(randomCards.filter((card) => card.front !== choice))
        setScore(score + 1)
      } else if (randomCards[0].front !== choice && wrong == false) {
        setWrong(true)
      } else if (randomCards[0].front == choice && wrong == true) {
        handleMultipleChoice(randomCards[1])
        setRandomCards(randomCards.filter((card) => card.front !== choice))
        setWrong(false)
      }
    }
  }

  const handleFinishStudy = () => {
    setStudySide(0)
    setRandomCards([])
    setFilteredCards([])
    setMultipleChoices([])
    setScore(0)
    setTotal(0)
    setStudyAmount('')
    setSelecedDeck('-----')
  }

  return (
    <div>
      {(studySide == 'back' && randomCards.length > 0) && ( // Back = multiple choices
        <div className="modalBackground">
          <div className="modalContainer">
            <h2>Select the right option which corresponds to the opposite side of the card</h2>
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
              <h2>Score: {score} </h2>
              <button onClick={handleFinishStudy}>Finish studying</button>
            </div>)}
          </div>
        </div>
      )}

      {(studySide == 'front' && randomCards.length > 0) && ( // Front = Multiple choices
        <div className="modalBackground">
          <div className="modalContainer">
            <h2>Select the right option which corresponds to the opposite side of the card</h2>
            {randomCards.length > 0 && (<div>
              {randomCards[0].back}
              <div>
                {multipleChoices.map((choice) => {
                  return (<button onClick={() => {
                    setChoice(choice.front)
                  }}>{choice.front}</button>)
                })}
              </div>
              <button onClick={checkAnswer}>Check Answer</button>
              <h2>Cards Remaining: {randomCards.length}</h2>
              <h2>Score: {score} </h2>
              <button onClick={handleFinishStudy}>Finish studying</button>
            </div>)}
          </div>
        </div>
      )}

      <div class='study-options'>
        <div class='select-deck'>
          <h2></h2>
          <h2>Select the deck you would like to study from</h2>
          <header>Guide: Of the five options, choose the correct one. Options are taken from the deck <br /> so a minimum of 5 cards is required</header>
          <h2></h2>
          <select onChange={(event) => {
            setSelecedDeck(event.target.value)
            handleSelect(event.target.value)
            setRandomCards([])
            setStudyAmount('')
          }} value={selectedDeck}>
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
        </div>

        <div class='input-amount'>
          <h2>Enter the amount of cards you would like to study below</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} onChange={handleInputChange} value={studyAmount} />
            <input type='submit' />
            <p>{errors.studyAmount?.message}</p>
          </form>
        </div>

        <div className="side-select">
          <h2></h2>
          <h2>Currently registered cards: {randomCards.length} <br />
            Select the side you want to be the choices</h2>
          <button onClick={() => { setStudySide('front') }}>Front</button>
          <button onClick={() => { setStudySide('back') }}>Back</button>
        </div>
      </div>
      <h2></h2>
      <div class='divider'>a</div>
    </div>
  );
}