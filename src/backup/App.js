import { useEffect, useState } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import './App.css';
import { useForm } from 'react-hook-form';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';

function backup() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpen2, setModalOpen2] = useState(false)
  const [isModalOpen3, setModalOpen3] = useState(false)

  const [studyNumber, setStudyNumber] = useState('')
  const [randomDeck, setRandomDeck] = useState([])
  const [shuffledDeck, setShuffledDeck] = useState([])
  const [deck, setDeck] = useState([])

  const changeModal = () => {
    setModalOpen(!isModalOpen);
  }

  const changeModal2 = () => {
    setModalOpen2(!isModalOpen2);
  }

  const changeModal3 = () => {
    setModalOpen3(!isModalOpen3);
  }

  const handleChange = (event) => {
    setStudyNumber(event.target.value)
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
        id: deck.length == 0 || deck[deck.length - 1].id + 1
      }

      const updatedDeck = [...deck, newCard]

      setDeck(updatedDeck)
      localStorage.setItem('deck', JSON.stringify(updatedDeck))
      console.log(deck)
    }
  }

  const removeItem = (id) => {
    setDeck(deck.filter((card) => {
      if (card.id == id) {
        return false
      } else return true
    }))
  }



  const createSmall = (input, array) => { // add functionality: error prompt when entering an input larger than study list
    const smallerArray = [];
    const arrayLength = array.length;

    if (input <= deck.length) {
      while (smallerArray.length < input) {
        const randomIndex = Math.floor(Math.random() * arrayLength)
        if (!smallerArray.includes(array[randomIndex])) {
          smallerArray.push(array[randomIndex])
        }
      }
      setRandomDeck(smallerArray)

      const newArray = [...smallerArray]

      let i = newArray.length - 1;
      for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
      }
      setShuffledDeck([...newArray])
    } else {
      console.log('invalid')
    }
  }


  return (
    <div className="App">
      <header>
        ALVINS STUDY APP
      </header>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </Router>
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

        <button onClick={changeModal3}>STUDY</button>
        {isModalOpen3 && (
          <div>
            <header>Input the amount of cards you would like to study (Less than or equal to the total in the deck)</header>
            <input onChange={handleChange} />

            <button onClick={() => { createSmall(studyNumber, deck); }}>
              BEGIN
            </button>

            <div class='card-container'>
              {randomDeck.map((items) => {
                return (
                  <div class='card'>
                    <button>{items.front}</button>
                  </div>
                )
              })}

              {shuffledDeck.map((items) => {
                return (
                  <div class='card'>
                    <button>{items.back}</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
