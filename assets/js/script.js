// Blackjack Game

const deck = {
    rank: [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"], 
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
      return selectedCards
    }
  };
  
  deck.resetDeck(); // IMPORTANT!
  
  function totalValue(hand) {
    let total = 0;
    for (let i = 0; i < hand.length; i++) {
      switch (hand[i][0]) {
        case 2:
          total += 2;
          break
        case 3:
          total += 3;
          break
        case 4:
          total += 4;
          break
        case 5:
          total += 5;
          break
        case 6:
          total += 6;
          break
        case 7:
          total += 7;
          break
        case 8:
          total += 8;
          break
        case 9:
          total += 9;
          break
        case 10:
          total += 10;
          break
        case 'Jack':
          total += 10;
          break
        case 'Queen':
          total += 10;
          break
        case 'King':
          total +=10;
          break
        case 'Ace':
          if (total > 10) {
            total += 1;
            break
          } else {
            total += 11;
            break
          }
        default:
          return console.log('Something has gone wrong!')
      }
    }
    return total
  }
  
  class role {
    constructor(name) {
      this.name = name; // Used when role is specified
      this.hand = deck.selectCardsFromDeck(2);
      this.total = totalValue(this.hand);
    }
    
    // Functions below will change depending on how user interacts with browser!
    
    hit() {
      this.hand.push(deck.selectCardsFromDeck(1)[0]); // Not sure why additional index [0] was needed
      this.total = totalValue(this.hand);
      console.log(this.hand[2]);
      console.log(`${this.name}'s hand: ${this.hand}
  New total: ${this.total}
  `)
      if (this.total > 22) {
        console.log('BUST')
      } else if (this.total === 21) {
        console.log('BLACKJACK')
      } else {
        console.log('Hit or Stand?')
      }
    }
    
    stand() {
    console.log(`${this.name}'s final hand: ${this.hand};
  Final total: ${totalValue(this.hand)}
  `)
    }
    
    //split () {}
  } 
  
  const dealer = new role('Dealer');
  
  const player = new role('Player');
  
  console.log(dealer);
  console.log(player);
  console.log(deck.remaining.length);
  console.log(deck.remaining);