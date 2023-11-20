import { useState } from "react";

export const useDeckState = () => {
  const [deck, setDeck] = useState([]);
  return [deck, setDeck]
}