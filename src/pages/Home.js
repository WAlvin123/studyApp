import { useEffect, useState } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useDeckState } from '../components/useDeckState';


export const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpen2, setModalOpen2] = useState(false)
  const [deck, setDeck] = useDeckState([])

  const changeModal = () => {
    setModalOpen(!isModalOpen);
  }

  const changeModal2 = () => {
    setModalOpen2(!isModalOpen2);
  }

  useEffect(() => {
    const storedDeck = localStorage.getItem('deck');
    if (storedDeck) {
      setDeck(JSON.parse(storedDeck))
    }
  }, [])

  const cardSchema = yup.object().shape({
    front: yup.string().required(),
    back: yup.string().required()
  })

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(cardSchema)
  })

  const onSubmit = (info) => { // add functionality checking for duplicates

    const cardExists = deck.some(card => card.front == info.front && card.back == card.back)

    if (cardExists) {
      console.log("Item already exists")
    } else {
      const newCard = {
        front: info.front,
        back: info.back,
        id: deck.length == 0 || deck[deck.length - 1].id + 1,
        selected1: false,
        selected2: false
      }

      const updatedDeck = [...deck, newCard]

      setDeck(updatedDeck)
      localStorage.setItem('deck', JSON.stringify(updatedDeck))
      console.log(deck)
    }
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
    setDeck(prevDeck => {
      const updatedDeck = prevDeck.filter(card => card.id !== id);
      localStorage.setItem('deck', JSON.stringify(updatedDeck));
      return updatedDeck;
    });
  };

  return (
    { deck },
    <div>
      <button onClick={changeModal}>REGISTER CARD</button>
      {isModalOpen && (
        <div className='modal'>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input placeholder='front' {...register('front')} />
              <input placeholder='back' {...register('back')} />
              <input type='submit' value='SUBMIT' />
            </form>
          </div>
        </div>)}

      <button onClick={changeModal2}>DISPLAY ITEMS</button>
      {isModalOpen2 && (
        <div>
          {deck.map((card) => {
            return (
              <div>
                Front:{card.front} | Back:{card.back} <button onClick={() => { removeItem(card.id) }}>X</button>
              </div>
            )
          })}
        </div>
      )
      }
    </div>
  )
}