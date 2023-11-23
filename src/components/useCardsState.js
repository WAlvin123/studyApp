import { useState } from "react";

export const useCardsState = () => {
  const [cards, setCards] = useState([])
  return [cards,setCards];
}