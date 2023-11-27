import { useEffect, useState } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useCardsState } from '../components/useCardsState';
import { useDecksState } from '../components/useDecksState';

// TODO: Add a sorting method when viewing all
// TODO: Let the same card be added to different decks

export const Cards = () => {
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isDeckOptionsVisible, setIsDeckOptionsVisible] = useState(false)
  const [isItemsVisible, setIsItemsVisible] = useState(false)
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])
  const [inputInvalid, setInputInvalid] = useState('')
  const [frontInput, setfrontInput] = useState('')
  const [backInput, setBackInput] = useState('')
  const [deckSelection, setDeckSelection] = useState('Uncategorized')

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

  const cardSchema = yup.object().shape({
    front: yup.string().required("Front of the card is empty"),
    back: yup.string().required('Back of the card is empty'),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(cardSchema)
  })

  const onSubmit = () => { // add functionality checking for duplicates

    const cardExists = cards.some(card => frontInput == card.front && backInput == card.back && deckSelection == card.deck)

    if (cardExists) {
      setInputInvalid("Input invalid: Card already exists, or fields are empty")
    } else if (frontInput == "" || backInput == "") {
      setInputInvalid("One of the required fields has not been filled out")
    } else {
      const newCard = {
        front: frontInput,
        back: backInput,
        deck: deckSelection,
        id: cards.length == 0 || cards[cards.length - 1].id + 1,
        column: 0,
        disabled: false
      }

      const updatedCards = [...cards, newCard]

      setCards(updatedCards)
      localStorage.setItem('cards', JSON.stringify(updatedCards))
      setInputInvalid('')
      setfrontInput('')
      setBackInput('')
    }
  }

  const removeItem = (id) => {
    setFilteredCards(prevCards => {
      const updatedCards = prevCards.filter(card => card.id !== id);
      return updatedCards;
    });

    setCards(prevCards => {
      const updatedCards = prevCards.filter(card => card.id !== id);
      localStorage.setItem('cards', JSON.stringify(updatedCards));
      return updatedCards;
    })
  };

  const onDeckSelect = (choice) => {
    if (choice == 'View all') {
      setFilteredCards(cards)
    } else {
      setFilteredCards(cards.filter((card) => {
        if (card.deck == choice) {
          return true
        } else {
          return false
        }
      }))
    }

  }

  return (
    <div>
      <h2>Create and view cards here</h2>

      <button onClick={() => {
        setIsRegisterVisible(!isRegisterVisible)
        setIsDeckOptionsVisible(false)
        setfrontInput('')
        setBackInput('')
        setDeckSelection('Uncategorized')
      }}>Create Card</button>

      <button onClick={() => {
        setIsDeckOptionsVisible(!isDeckOptionsVisible)
        setIsItemsVisible(false)
        setIsRegisterVisible(false)
        setfrontInput('')
        setBackInput('')
        setDeckSelection('Uncategorized')
      }}>View Cards</button>

      {isRegisterVisible && (
        <div className='modal'>
          <div>
            <h3>Enter the front and back fields of your Card below</h3>
            <div>
              <input value={frontInput} onChange={(event) => {
                setfrontInput(event.target.value)
              }} />
              <input value={backInput} onChange={(event) => {
                setBackInput(event.target.value)
              }} />
              <select id="dropdown" onChange={
                (event) => { setDeckSelection(event.target.value) }
              }>
                <option>Uncategorized</option>
                {decks.map((deck) => {
                  return (
                    <option>{deck.name}</option>
                  )
                })}
              </select>
              <button onClick={onSubmit}>Submit</button>
            </div>
            <p>{errors.front?.message}</p>
            <p>{errors.back?.message}</p>
          </div>
        </div>)}

      {isDeckOptionsVisible && (
        <div>
          <select onChange={(event) => {
            if (event.target.value !== '---------') {
              onDeckSelect(event.target.value)
              setIsItemsVisible(true)
            } else { setIsItemsVisible(false) }
          }}>
            <option>---------</option>
            <option>View all</option>
            {decks.map((deck) => {
              return (
                <option>{deck.name}</option>
              )
            })}
          </select>

          {isItemsVisible && (
            <div style={{display: 'flex', justifyContent: 'center', paddingTop:'10px'}}>
              <table style={{backgroundColor: 'black'}}>
                <th style={{ width: '200px', color:'white' }}>Front</th>
                <th style={{ width: '200px', color:'white'  }}>Back</th>
                <th style={{ width: '200px', color:'white'  }}>Deck</th>
                {filteredCards.map((card) => {
                  return (
                    <tr style={{backgroundColor:'white'}}>
                      <td>{card.front}</td>
                      <td>{card.back}</td>
                      <td>{card.deck}</td>
                      <button onClick={() => {removeItem(card.id)}} style={{ backgroundColor: 'black', color:'white'}}>Remove card</button>
                    </tr>
                  )
                })}
              </table>
            </div>
          )
          }

        </div>
      )
      }

      <h1></h1>
      <h3>{inputInvalid}</h3>
      <div class='divider'>a</div>
      <h2>Total Cards: {cards.length}</h2>
      <h2>Total Deck Categories: {decks.length}</h2>
    </div>
  )
}