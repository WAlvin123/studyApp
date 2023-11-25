import { useEffect, useState } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useCardsState } from '../components/useCardsState';
import { useDecksState } from '../components/useDecksState';

// TODO: Add a sorting method when viewing all
// TODO: Let the same card be added to different decks

export const Home = () => {
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isDeckOptionsVisible, setIsDeckOptionsVisible] = useState(false)
  const [isItemsVisible, setIsItemsVisible] = useState(false)
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [filteredCards, setFilteredCards] = useState([])

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

  const onSubmit = (info) => { // add functionality checking for duplicates

    const cardExists = cards.some(card => card.front == info.front && card.back == info.back && info.deck == card.deck)

    if (cardExists) {
      console.log("Item already exists")
    } else {
      const newCard = {
        front: info.front,
        back: info.back,
        deck: info.deck,
        id: cards.length == 0 || cards[cards.length - 1].id + 1,
        selected1: false,
        selected2: false,
      }

      const updatedCards = [...cards, newCard]

      setCards(updatedCards)
      localStorage.setItem('cards', JSON.stringify(updatedCards))
      console.log(cards)
    }

    console.log(cards)
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
        if (isDeckOptionsVisible == false) {
          setIsRegisterVisible(!isRegisterVisible)
        }
      }}>Create Card</button>

      <button onClick={() => {
        if (isRegisterVisible == false) {
          setIsDeckOptionsVisible(!isDeckOptionsVisible)
        }
      }}>View Cards</button>

      {isRegisterVisible && (
        <div className='modal'>
          <div>
            <h3>Enter the front and back fields of your Card below</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input placeholder='Front'{...register('front')} />
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
              <p>{errors.front?.message}</p>
              <p>{errors.back?.message}</p>
            </form>
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
        </div>
      )
      }

      {isItemsVisible && (
        <div>
          <div>
            {filteredCards.map((card) => {
              return (
                <div>Front: {card.front} | Back: {card.back} | Deck: {card.deck} <button onClick={() => { removeItem(card.id) }}>Remove Card</button></div>
              )
            })}
          </div>
        </div>
      )

      }

      <h1></h1>
      <div class='divider'>a</div>
      <h2>Total Cards: {cards.length}</h2>
      <h2>Total Deck Categories: {decks.length}</h2>
    </div>
  )
}