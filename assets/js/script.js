// Blackjack Game
/**
 * 1. Create a deck of cards
 * 2. Shuffle the deck
 * 3. Ask the player to "hit" or "stand"
 * 4. If the player "hits", add a card to the player's hand
 * 5. If the player "stands", stop the game, allow dealers turn
 * 6. If the player's hand is over 21, the player loses
 * 7. If the player's hand is less than or equal to 21, the dealer must draw cards until their hand is greater than the player's
 * 8. If the dealer's hand is over 21, the player wins
 * 9. If the dealer's hand is greater than the player's, the dealer wins
 * 10. If the dealer's hand is less than the player's, the player wins
 * 11. If the dealer's hand is equal to the player's, the dealer wins
 * 12. The player's score is displayed
 * 13. The dealer's score is displayed
 * 14. The player's score is updated
 * 15. The dealer's score is updated
 * 16. The player's hand is displayed
 * 17. The dealer's hand is displayed
 * 18. The player's hand is updated
 * 19. The dealer's hand is updated
 * 20. The player's hand is evaluated
 * 21. The dealer's hand is evaluated
 * 22. The winner is determined
 * 23. The game is reset
 * 24. The game is started
 * 25. The game is stopped
 * 26. The game is continued
 * 27. The game is paused?
 * 28. The game is saved?
 */

// Defining or instantiating Card-Deck
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
      const randomCard = this.remaining[Math.floor(Math.random() * this.remaining.length)];
      selectedCards.push(randomCard);
      // Remove selected card from the remaining deck
      this.remaining = this.remaining.filter(card => !(card[0] === randomCard[0] && card[1] === randomCard[1]));
    }
    return selectedCards;
  }
};

deck.resetDeck();

function totalValue(hand) {
  let total = 0;
  let aces = 0;
  for (let i = 0; i < hand.length; i++) {
    switch (hand[i][0]) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        total += hand[i][0];
        break;
      case 10:
      case 'jack':
      case 'queen':
      case 'king':
        total += 10;
        break;
      case 'ace':
        aces += 1;
        total += 11;
        break;
      default:
        console.log('Something has gone wrong!');
    }
  }
  while (total > 21 && aces) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

class Role {
  constructor(name) {
    this.name = name;
    this.hand = [];
    this.total = 0;
  }

  addCard(card) {
    this.hand.push(card);
    this.total = totalValue(this.hand);
  }
}

const dealer = new Role('Dealer');
const player = new Role('Player');
let gameStarted = false;
let playerTurn = true;

// Score functionality
let playerScore = 0;
let dealerScore = 0;

function updateScore(winner) {
  if (winner === 'player') {
    playerScore += 1;
    document.getElementById('player-score').textContent = playerScore;
  } else if (winner === 'dealer') {
    dealerScore += 1;
    document.getElementById('dealer-score').textContent = dealerScore;
  }
}
// Drawn Cards defined and styled here
function updateUI() {
  const dealerCards = document.getElementById('dealer-cards');
  const playerCards = document.getElementById('player-cards');
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
  
  dealer.hand.forEach(card => {
    const cardDiv = document.createElement('div');
    // cardDiv.className = 'card';
    // cardDiv.textContent = card[0];
    cardDiv.style = `
    background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg') no-repeat center / cover;
    width: 60px;
    height: 90px;
    `
    dealerCards.appendChild(cardDiv);
  });

  player.hand.forEach(card => {
    const cardDiv = document.createElement('div');
    // cardDiv.className = 'card';
    // cardDiv.textContent = card[0];
    cardDiv.style = `
    background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg') no-repeat center / cover;
    width: 60px;
    height: 90px;
    `
    playerCards.appendChild(cardDiv);
  });
}

// changed code to determine winner with house always having advantage in tie situations
function determineWinner() {
  let result;
  if (player.total > 21) {
    result = 'BUST';
    updateScore('dealer');
  } else if (dealer.total > 21 || player.total > dealer.total) {
    result = 'WIN';
    updateScore('player');
  } else if (player.total < dealer.total) {
    result = 'LOSS';
    updateScore('dealer');
  } else if (player.total === dealer.total) {
    result = 'LOSS'; // Dealer wins in case of a tie
    updateScore('dealer');
  } else {
    console.log('Something has gone wrong!'); //internal bug checking we should oped this out to a modal in the deployment.
  }
// Result card creation styles defined in style sheet atm 
// maybe create background images for result cards? BUSTed, Player Wins, Dealer Wins, Dealer Loses and Player Loses cards
// rewrite code here maybe to fix cloneNode BUST bug
  const resultCard = document.createElement('div');
  resultCard.className = 'card';
  resultCard.textContent = result;

  if (result === 'WIN' || result === 'LOSS') {
    const playerResultCard = resultCard.cloneNode(true);
    const dealerResultCard = resultCard.cloneNode(true);

    if (result === 'WIN') {
      playerResultCard.textContent = 'WIN';
      dealerResultCard.textContent = 'LOSS';
    } else {
      playerResultCard.textContent = 'LOSS';
      dealerResultCard.textContent = 'WIN';
    }

    document.getElementById('player-cards').appendChild(playerResultCard);
    document.getElementById('dealer-cards').appendChild(dealerResultCard);
  } else {
    document.getElementById('player-cards').appendChild(resultCard);
    document.getElementById('dealer-cards').appendChild(resultCard.cloneNode(true));
  }

  gameStarted = false;
}
// Buttons for game play, maybe add functionality for a Split button if both cards in first draw are equal to eachother.
document.getElementById('deal-button').addEventListener('click', () => {
  if (!gameStarted) {
    deck.resetDeck();
    dealer.hand = deck.selectCardsFromDeck(2);
    player.hand = deck.selectCardsFromDeck(2);
    dealer.total = totalValue(dealer.hand);
    player.total = totalValue(player.hand);
    updateUI();
    gameStarted = true;
    playerTurn = true;
    
    // turn display of player card values to on
    document.getElementById("player-cards-value").innerHTML = player.total.toString();
    document.getElementById("player-cards-value").style.display = "block";
        
    // ensure dealer value is still hidden until player has finished his go
    document.getElementById("dealer-cards-value").style.display = "none";
  }

});

document.getElementById('hit-button').addEventListener('click', () => {
  if (gameStarted && playerTurn) {
    player.addCard(deck.selectCardsFromDeck(1)[0]);
    
    // update player cards value
    document.getElementById("player-cards-value").innerHTML = player.total.toString();
    
    updateUI();
    if (player.total > 21) {
      determineWinner();
    }
  }
});
// Think we could add rule here for dealer to stop hitting if his score >= players instead of hitting while less than 17
document.getElementById('stand-button').addEventListener('click', () => {
  if (gameStarted && playerTurn) {
    playerTurn = false;
    
    // reveal dealer card value
    document.getElementById("dealer-cards-value").style.display = "block";
    
    while (dealer.total < 17) {
      dealer.addCard(deck.selectCardsFromDeck(1)[0]);
    }
    updateUI();
    determineWinner();
  }
});

updateUI();
