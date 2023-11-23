import { useState } from "react"

export const useDecksState = () => {
  const [decks, setDecks] = useState([])
  return [decks, setDecks];
}