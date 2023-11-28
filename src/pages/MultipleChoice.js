import { useDecksState } from "../components/useDecksState";
import { useCardsState } from "../components/useCardsState";
import { useState, useEffect } from "react";

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
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [total, setTotal] = useState(0)
  const [deckAmountMessage, setDeckAmountMessage] = useState('')
  const [deckChoiceMessage, setDeckChoiceMessage] = useState('')

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

  const onSubmit = () => {
    const smallerArray = []

    if (userInput-1 < filteredCards.length && userInput > 0) {
      while (smallerArray.length < userInput) {
        const randomIndex = Math.floor(Math.random() * filteredCards.length)
        if (!smallerArray.includes(filteredCards[randomIndex])) {
          smallerArray.push(filteredCards[randomIndex])
        }
      }
      setRandomCards(smallerArray)
      setTotal(smallerArray.length)
      handleMultipleChoice(smallerArray[0])
      setModalState(2)
    } else if (userInput == 0 || isNaN(userInput)) {
      setDeckAmountMessage('Enter a valid amount of cards (>0, and a number)')
    } else {
      setDeckAmountMessage('You can not study an amount greater than the cards present in the deck')
    }
  }

  const checkAnswer = () => {
    if (modalState == 4) {
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
    } else if (modalState == 3) {
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

  return (
    <div>
      {modalState == 0 && (
        <div class='select-deck'>
          <h2></h2>
          <h2>Select the deck you would like to study from</h2>
          <header>Guide: Of the five options, choose the correct one. Options are taken from the deck <br /> so a minimum of 5 cards is required</header>
          <h2></h2>
          <select onChange={(event) => {
            handleSelect(event.target.value)
            setSelectedOption(event.target.value)
            setDeckChoiceMessage('')
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
            if (filteredCards.length > 5) {
              setModalState(1)
            } else {
              setDeckChoiceMessage('This deck does not contain enough cards')
            }
          }}>Confirm</button>
          <h2>{deckChoiceMessage}</h2>
        </div>
      )}

      {modalState == 1 && (
        <div class='input-amount'>
          <h2>Enter the amount of cards you would like to study below</h2>
          <div>
            <input onChange={(event) => {
              setUserInput(event.target.value)
            }} value={userInput} />
            <button onClick={onSubmit}>Submit</button>
            <h2>{deckAmountMessage}</h2>
          </div>
        </div>
      )}

      {modalState == 2 && (
        <div>
          <h2></h2>
          <h2>Select the side you want to be the choices</h2>
          <button onClick={() => { setModalState(3) }}>Front</button><button onClick={() => { setModalState(4) }}>Back</button>
        </div>
      )
      }

      {(modalState == 3 && randomCards.length > 0) && ( // Front = Multiple choices
        <div>
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
            <h2>Score: {score}</h2>
          </div>)}

          {(randomCards.length == 0 && modalState !== 0 && modalState !== 1) && (
            <div class='results-page'>
              <h2>These are your results</h2>
              <button onClick={() => {
                setModalState(0)
                setUserInput('')
                setScore(0)
              }}>Return</button>
            </div>
          )}
        </div>
      )}


      {(modalState == 4 && randomCards.length > 0) && ( // Back = multiple choices
        <div>
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
            <h2>Score: {score}</h2>
          </div>)}
        </div>
      )}
      {(randomCards.length == 0 && modalState !== 0 && modalState !== 1) && (
        <div class='results-page'>
          <h2>You scored {score} / {total}</h2>
          <button onClick={() => {
            setModalState(0)
            setUserInput('')
            setScore(0)
          }}>Return</button>
        </div>
      )}
      <h2></h2>
      <div class='divider'>a</div>
    </div>
  );
}