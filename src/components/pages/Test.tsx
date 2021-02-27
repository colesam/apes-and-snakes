import React, { useEffect, useState } from "react";
import { Deck } from "../../core/card/Deck";
import { Flop } from "../../core/card/Flop";
import { FlopPreview } from "../../core/card/FlopPreview";
import FlopDisplay from "../render/FlopDisplay";

function Test() {
  const [deck, setDeck] = useState(new Deck());
  const [flop, setFlop] = useState<null | Flop | FlopPreview>(null);

  useEffect(() => {
    const [flop, newDeck] = deck.shuffle().drawFlop();
    setDeck(newDeck);
    setFlop(flop.preview);
  }, []);

  // Render
  return <FlopDisplay cards={flop ? flop.cards : []} />;
}

export default Test;
