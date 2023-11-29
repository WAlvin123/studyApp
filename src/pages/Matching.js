import { useState, useEffect } from "react";
import { useCardsState } from "../components/useCardsState";
import { useDecksState } from "../components/useDecksState";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';


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
  const [studyAmount, setStudyAmount] = useState('')

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

  const onSubmit = (info) => {
    const smallerArray = []
    if (studyAmount === '') {
      return; // If input value is empty, return without submitting
    } else if (info.studyAmount - 1 < filteredCards.length) {
      while (smallerArray.length < info.studyAmount) {
        const randomIndex = Math.floor(Math.random() * filteredCards.length)
        if (!smallerArray.includes(filteredCards[randomIndex])) {
          smallerArray.push(filteredCards[randomIndex])
        }
      }
      setScore(0)
      setStudyAmount('')
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

  const handleFinish = () => {
    setScore(0)
    setTotalScore(0)
    setStudyAmount('')
    setSelectedOption('------')
    setModalState(false)
    setAnswerMessage('')
    setFirstColumn([])
    setSecondColumn([])
  }

  // RENDERED PAGE BELOW
  return (
    <div>
      {(modalState == true && firstColumn.length > 0) && (
        <div class='modalBackground'>
          <div class='modalContainer'>
            {firstColumn.length > 0 && (
              <div className="answer-checker">
                <div>
                  {firstColumn.length > 0 && (<h2>{answerMessage}</h2>)}
                  <h2>Score: {score}</h2>
                </div>
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
                <button onClick={handleCheckAnswer}>Check Answer</button>
              </div>)}
            <div class='column-container'>
              <div class='left-column'>
                {firstColumn.map((items) => {
                  return (
                    <div>
                      <button onClick={() => { handleChoice(items, items.column) }}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}>{items.front}</button>
                    </div>
                  )
                })}
              </div>
              <div class='right-column'>
                {secondColumn.map((items) => {
                  return (
                    <div>
                      <button onClick={() => { handleChoice(items, items.column) }}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >{items.back}</button>
                    </div>
                  )
                })}
              </div>
            </div>
            <button onClick={handleFinish} style={{ backgroundColor: "transparent", border: 'none', cursor: "pointer" }}>Finish studying</button>
          </div>
        </div>
      )}

      <div class='select-deck'>
        <h2>Select the deck you would like to study from</h2>
        <header>Guide: Match the front of the card with the back</header>
        <h2></h2>
        <select onChange={(event) => {
          onDeckSelect(event.target.value)
          setSelectedOption(event.target.value)
        }} value={selectedOption}>
          <option>------</option>
          <option>Uncategorized</option>
          {decks.map((deck) => { return <option>{deck.name}</option> })}
        </select>
      </div>

      <div class='input-amount'>
        <h2>Enter the amount of cards you would like to study below</h2>
        <h2> </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('studyAmount')} placeholder="Enter study session amount..." style={{ width: '200px' }} onChange={handleInputChange} value={studyAmount} />
          <input type='submit' />
          <p>{errors.studyAmount?.message}</p>
        </form>
      </div>
      <h2>Currently registered  cards: {firstColumn.length}</h2>
      <button onClick={() => { setModalState(true) }}>Confirm options</button>
      <h2></h2>

      {/*firstColumn.length == 0 && (
            <div>
              <h2>Results</h2>
              <h2>You scored {score} / {totalScore}</h2>
              <button onClick={() => {
                setModalState(0)
                setAnswerMessage('')
              }}>Return</button>
            </div>
            )*/}

      <div class='divider'>a</div>
    </div>
  )
}