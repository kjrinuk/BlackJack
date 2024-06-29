// Blackjack Game

const deck = {
    rank: [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"], 
    suit: ["clubs", "diamonds", "hearts", "spades"],
    remaining: [],
    resetDeck() {
      this.remaining = [];
      for (let i = 0; i < this.suit.length; i++) {
        for (let j = 0; j < this.rank.length; j++) {
          this.remaining.push([this.rank[j], this.suit[i]]);
        }
      }
    },
    selectCardsFromDeck(amount) {
      const selectedCards = [];
      for (let i = 1; i <= amount; i++) {
        const randomCard = this.remaining[Math.floor(Math.random()*this.remaining.length)];
        if (!selectedCards.includes(randomCard)) {
          selectedCards.push(randomCard);
          // Remove selected card from the remaining deck: find corresponding index; splice from array
          for (let i = 0; i < this.remaining.length; i++) {
            if (this.remaining[i][0] === randomCard[0] && this.remaining[i][1] === randomCard[1]) {
                this.remaining.splice(i, 1);
            }
          }
        }
      }
      return selectedCards;
    }
  };
  
  deck.resetDeck(); // IMPORTANT!
  
  function totalValue(hand) {
    let total = 0;
    let numOfAces = 0;

    for (let i = 0; i < hand.length; i++) {
      if (hand[i][0] !== 'ace'){
        switch (hand[i][0]) {
          case 'jack':
            total += 10;
            break;
          case 'queen':
            total += 10;
            break;
          case 'king':
            total +=10;
            break;  
          default:
            total += hand[i][0];
        }
      }
    }

    for (let i = 0; i < hand.length; i++) {
      if (hand[i][0] === 'ace'){
        numOfAces += 1;
      }
    }

    if (numOfAces > 0 && total < 11) {
      total += (11 + (numOfAces - 1));
    } else if (numOfAces > 0 && total > 10) {
      total += numOfAces;
    }
    return total;
  }
  
  class role {
    constructor(name) {
      this.name = name; // Used when role is specified
      this.hand = deck.selectCardsFromDeck(2);
      this.total = totalValue(this.hand);
    }
    
    // Functions below will change depending on how user interacts with browser!
    
    hit() {
      if (this.total < 21) {
        this.hand.push(deck.selectCardsFromDeck(1)[0]); // Not sure why additional index [0] was needed
        this.total = totalValue(this.hand);
        console.log(this.hand.length - 1);
        document.getElementById("test-div").innerHTML += `<img src="assets/images/Card-images/SVG-cards/${this.hand[this.hand.length -1][0]}_of_${this.hand[this.hand.length -1][1]}.svg" alt="...">`;
      } else {
        console.log("no");
      }
      // update total
      this.total = totalValue(this.hand);
      console.log(this.total);

      /*console.log(this.hand[2]);
      console.log(`${this.name}'s hand: ${this.hand}
  New total: ${this.total}
  `);
      if (this.total > 22) {
        console.log('BUST');
      } else if (this.total === 21) {
        console.log('BLACKJACK');
      } else {
        console.log('Hit or Stand?');
      }*/
    }
    
    /*stand() {
    console.log(`${this.name}'s final hand: ${this.hand};
  Final total: ${totalValue(this.hand)}
  `);
    }*/
    
    //split () {}
  } 
  
  const dealer = new role('Dealer');
  
  const player = new role('Player');
  
  console.log(dealer);
  console.log(player);
  console.log(deck.remaining.length);
  console.log(deck.remaining);

  // Show images in browser

  let divElement = document.getElementById("test-div");
  for (let card of player.hand) {
    divElement.innerHTML += `<img src="assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg" alt="${card[0]} of ${card[1]}">`
  }

  console.log(player.total);