import { useEffect, useState } from "react"
import { useCardsState } from '../components/useCardsState';
import { useDecksState } from '../components/useDecksState';

export const Deck = () => {
  const [cards, setCards] = useCardsState()
  const [decks, setDecks] = useDecksState()
  const [deckName, setDeckName] = useState('')
  const [isCreateDeckVisible, setIsCreateDeckVisible] = useState(false)
  const [isViewAllDecksVisible, setIsViewAllDecksVisible] = useState(false)

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

  const createDeck = () => {
    if (decks.some(decks => decks.name == deckName) || deckName == '') {
      console.log('error')
    }
    else {
      const deckObject = {
        name: deckName,
        id: decks.length == 0 || decks[decks.length - 1].id + 1,
      }

      const updatedDecks = [...decks, deckObject]
      localStorage.setItem('decks', JSON.stringify(updatedDecks))
      setDecks(updatedDecks)
    }
  }

  const removeDeck = (id) => {
    setDecks(prevDecks => {
      const updatedDecks = prevDecks.filter(decks => decks.id !== id);
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      return updatedDecks;
    });
  };

  const removeCardsFromDeck = (name) => {
    setCards(prevCards => {
      const updatedCards = prevCards.filter(card => card.deck !== name);
      localStorage.setItem('cards', JSON.stringify(updatedCards));
      return updatedCards;
    })
  }

  const getDeckAmount = (deck) => {
    const filteredAmount = (cards.filter((card) => card.deck === deck))
    return filteredAmount.length
  }

  return (
    <div>
      <h2></h2>
      <h2>Create and view decks here</h2>
      <button onClick={() => {
        if (isViewAllDecksVisible == false) {
          setIsCreateDeckVisible(!isCreateDeckVisible)
          setDeckName('')
        }
      }}>Create Deck</button>

      <button onClick={() => {
        if (isCreateDeckVisible == false ) {
          setIsViewAllDecksVisible(!isViewAllDecksVisible)
        }
      }}>View Decks</button>

      {isCreateDeckVisible && (
        <div>
          <h3>Enter the name of the deck you want to create below</h3>
          <input onChange={(event) => { setDeckName(event.target.value) }} />
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
                {deck.name} | {getDeckAmount(deck.name)} Cards  <button onClick={() => {
                  removeCardsFromDeck(deck.name)
                  removeDeck(deck.id)
                }}>Remove deck</button>
              </div>
            )
          })
          }
        </div>
      )}
      <h1></h1>
      <div class='divider'>a</div>
      <h2>Total Cards: {cards.length}</h2>
      <h2>Total Deck Categories: {decks.length}</h2>
    </div>
  )


}