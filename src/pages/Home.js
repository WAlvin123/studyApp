import { useEffect, useState } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useCardsState } from '../components/useCardsState';
import { useDecksState } from '../components/useDecksState';


export const Home = () => {
  const [isCreateDeckVisible, setIsCreateDeckVisible] = useState(false)
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isItemsVisible, setIsItemsVisible] = useState(false)
  const [isViewAllDecksVisible, setIsViewAllDecksVisible] = useState(false)
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [deckInput, setDeckInput] = useState([])

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
    front: yup.string().required(),
    back: yup.string().required(),
  })

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(cardSchema)
  })

  const onSubmit = (info) => { // add functionality checking for duplicates

    const cardExists = cards.some(card => card.front == info.front && card.back == card.back)

    if (cardExists) {
      console.log("Item already exists")
    } else {
      const newCard = {
        front: info.front,
        back: info.back,
        deck: info.deck,
        id: cards.length == 0 || cards[cards.length - 1].id + 1,
        selected1: false,
        selected2: false
      }

      const updatedCards = [...cards, newCard]

      setCards(updatedCards)
      localStorage.setItem('cards', JSON.stringify(updatedCards))
      console.log(cards)
    }

    console.log(cards)
  }

  // const removeItem = (id) => {
  //  setDeck(deck.filter((card) => {
  //    if (card.id == id) {
  //      return false
  //    } else return true
  //  }))
  //  localStorage.setItem('deck', JSON.stringify(deck))
  // } 

  const removeItem = (id) => {
    setCards(prevCards => {
      const updatedCards = prevCards.filter(card => card.id !== id);
      localStorage.setItem('cards', JSON.stringify(updatedCards));
      return updatedCards;
    });
  };

  const removeDeck = (id) => {
    setDecks(prevDecks => {
      const updatedDecks = prevDecks.filter(decks => decks.id !== id);
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      return updatedDecks;
    });
  };

  const createDeck = () => {
    decks.some(decks => decks.name == deckInput)

    if (decks.some(decks => decks.name == deckInput)) {
      console.log('error')
    }
    else {
      const deckObject = {
        name: deckInput,
        id: decks.length == 0 || decks[decks.length - 1].id + 1
      }

      const updatedDecks = [...decks, deckObject]
      localStorage.setItem('decks', JSON.stringify(updatedDecks))
      setDecks(updatedDecks)
    }


    console.log(decks)
  }

  return (
    <div>
      <h2>Register new cards you would like to study <br /> and view what you currently have here </h2>

      <button onClick={() => { setIsCreateDeckVisible(!isCreateDeckVisible) }}>CREATE DECK</button>
      <button onClick={() => { setIsViewAllDecksVisible(!isViewAllDecksVisible) }}>VIEW DECKS</button>
      <button onClick={() => { setIsRegisterVisible(!isRegisterVisible)}}>REGISTER CARD</button>
      <button onClick={() => { setIsItemsVisible(!isItemsVisible)}}>DISPLAY ITEMS</button>

      {isCreateDeckVisible && (
        <div>
          <h3>Enter the name of the deck you want to create below</h3>
          <input onChange={(event) => { setDeckInput(event.target.value) }} />
          <button onClick={createDeck}>Create</button>
        </div>
      )
      }

      {isViewAllDecksVisible && (
        <div>
          <h2>Decks</h2>
          {decks.map((deck) => {
            return (
              <div>
                {deck.name} <button onClick={() => { removeDeck(deck.id) }}>X</button>
              </div>
            )
          })
          }
        </div>
      )}

      {isRegisterVisible && (
        <div className='modal'>
          <div>
            <h3>Enter the front and back fields of your Card below</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input placeholder='Front' {...register('front')} />
              <input placeholder='Back' {...register('back')} />
              <select id="dropdown" {...register('deck')}>
                <option>Uncategorized</option>
                {decks.map((deck) => {
                  return (
                    <option>{deck.name}</option>
                  )
                })}
              </select>
              <input type='submit' value='SUBMIT' />
            </form>
          </div>
        </div>)}

      {isItemsVisible && (
        <div>
          <h2>Cards</h2>
          {cards.map((card) => {
            return (
              <div>
                Front: {card.front} | Back: {card.back} | Deck: {card.deck} <button onClick={() => { removeItem(card.id) }}>X</button>
              </div>
            )
          })}
        </div>
      )
      }
      <h1></h1>
      <div class='divider'>a</div>
      <h2>Total Cards: {cards.length}</h2>
      <h2>Total Decks: {decks.length}</h2>
    </div>
  )
}