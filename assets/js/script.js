// Blackjack Game
// On window load timer
window.onload = function () {
  let secondsSpent = 0;
  const display = document.getElementById('timeSpent');

  setInterval(() => {
    secondsSpent++;
    let minutes = Math.floor(secondsSpent / 60);
    let seconds = secondsSpent % 60;
    display.textContent = `Play Timer: ${minutes}:${seconds}`;
  }, 1000);
};

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
        aces += 1; // total += 1 (if less than 10) || 11 (if more than 10)
        total += 11; //
        break;
      default:
        console.log('Something has gone wrong!');
    }
  }
  while (total > 21 && aces) {
    total -= 10; // Change value of ace from 11 to 1 if total is over 21
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
let splitHands = []; // Array to store split hands #
let currentSplitHand = 0;// Index of current split hand #
let gameStarted = false;
let playerTurn = true;

// Score functionality incrementing player and dealer scores
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
  const playerSplitCards = document.getElementById('split-hands-container');
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';
  playerSplitCards.innerHTML = '';

  let idIterator = 1;
  dealer.hand.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-image';
    cardDiv.id = `dealer-card-${idIterator}`;
    cardDiv.style = `
    background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg') no-repeat center / cover;
    width: 60px;
    height: 90px;
    position: absolute;
    `;
    idIterator += 1;

    dealerCards.appendChild(cardDiv);
  });

  //Override styling to hide dealer's first card
  document.getElementById('dealer-card-1').style.background = `url('assets/images/Card-images/back-card.jpg') no-repeat center / cover`;

  if (dealer.hand.length > 0) dealerCards.innerHTML += `<div id="spacer"></div>`; // Required to provide sufficient space to display cardDiv with absolute positioning

  for (let i = 1; i <= dealer.hand.length; i++) {
    document.getElementById(`dealer-card-${i}`).style.left = `${15+(8*i)}%`;
    document.getElementById(`dealer-card-${i}`).style.transform = `rotate(-${5*(dealer.hand.length - i)}deg)`;
  }
  //  Player Cards defined and styled here --------------------------------------------------Split button display
  if (player.hand.length === 2 && player.hand[0][0] === player.hand[1][0]) {
    document.getElementById('split-button').style.display = 'inline-block';

  } else {
    document.getElementById('split-button').style.display = 'none';
  }

  idIterator = 1;
  player.hand.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-image';
    cardDiv.id = `player-card-${idIterator}`;
    cardDiv.style = `
    background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg') no-repeat center / cover;
    width: 60px;
    height: 90px;
    position: absolute; 
    `;
    idIterator += 1;

    playerCards.appendChild(cardDiv);
  });

  if (player.hand.length > 0) playerCards.innerHTML += `<div id="spacer"></div>`;

  for (let i = 1; i <= player.hand.length; i++) {
    document.getElementById(`player-card-${i}`).style.left = `${15+(8*i)}%`;
    document.getElementById(`player-card-${i}`).style.transform = `rotate(-${player.hand.length*(player.hand.length - i)}deg)`;
  }

  // splithands length will need container to display split hands
  // if (splitHands.length > 0) {
  //   const splitHandsContainer = document.getElementById('split-hands-container');
  //   splitHandsContainer.innerHTML = '';
  //   splitHands.forEach((hand, index) => {
  //     const splitHandDiv = document.createElement('div');
  //     splitHandDiv.className = 'split-hand';
  //     hand.hand.forEach(card => {
  //       const cardDiv = document.createElement('div');
  //       cardDiv.className = 'card-image';
  //       cardDiv.style = `
  //       background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg') no-repeat center / cover;
  //       width: 60px;
  //       height: 90px;
  //       position: absolute; 
  //       `;
  //       splitHandDiv.appendChild(cardDiv);
  //     });
  //     splitHandsContainer.appendChild(splitHandDiv);
  //   });
  // }
}

// --------------------------------------------function to split cards if they are the same
function splitCards() {
  if (player.hand.length === 2 && player.hand[0][0] === player.hand[1][0]) {
    const card1 = player.hand[0];
    const card2 = player.hand[1];
    player.hand = [card1];
    const newHand = [card2];
    player.total = totalValue(player.hand);
    const newTotal = totalValue(newHand);
    player.addCard(deck.selectCardsFromDeck(1)[0]);//this is a problem for issuing two new cards on first card
    player.addCard(deck.selectCardsFromDeck(1)[0]);
    updateUI();
  }
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
  } else if (player.total <= dealer.total) {
    result = 'LOSS';
    updateScore('dealer');
  } else if (player.total === dealer.total) {
    result = 'PUSH';
    // updateScore('dealer'); // House always wins in a tie normally but here we're not incrementing either player of dealer as a PUSH is a tie
  } else {
    console.log('Something has gone wrong!'); //internal bug checking we should oped this out to a modal in the deployment.
  }

  // Reveal dealer's hidden card once result has been assigned a value
  document.getElementById('dealer-card-1').style.background = `url('assets/images/Card-images/SVG-cards/${dealer.hand[0][0]}_of_${dealer.hand[0][1]}.svg') no-repeat center / cover`;

  // Result card creation styles defined in style sheet atm 
  //  fixed cloneNode BUST bug
  const resultCard = document.createElement('div');
  resultCard.className = 'card';
  resultCard.textContent = result;

  if (result !== undefined) {
    const playerResultCard = resultCard.cloneNode(true);
    const dealerResultCard = resultCard.cloneNode(true);

    if (result === 'WIN') {
      playerResultCard.textContent = 'WIN';
      if (dealer.total > 21) {
        dealerResultCard.textContent = 'BUST';
      } else {
        dealerResultCard.textContent = 'LOSS';
      }
    } else if (result === 'LOSS') {
      playerResultCard.textContent = 'LOSS';
      dealerResultCard.textContent = 'WIN';
    } else if (result === 'BUST') {
      playerResultCard.textContent = 'BUST';
      dealerResultCard.textContent = 'WIN';
    } else if (result === 'PUSH') {
      playerResultCard.textContent = 'TIE'; // Tie is a push
      dealerResultCard.textContent = 'TIE'; // Tie is a push
    }

    document.getElementById('player-cards').appendChild(playerResultCard);
    document.getElementById('dealer-cards').appendChild(dealerResultCard);
  } else {
    document.getElementById('player-cards').appendChild(resultCard);

    // update and reveal dealer card value
    document.getElementById("dealer-cards-value").innerHTML = dealer.total.toString();
    document.getElementById("dealer-cards-value").style.display = "block";

    // document.getElementById('dealer-cards').appendChild(resultCard);

    document.getElementById('dealer-cards').appendChild(resultCard.cloneNode(true));
  }

  gameStarted = false;
}

// ***************************************************************************
// *                           Menu Buttons                                  *
// ***************************************************************************
document.addEventListener("DOMContentLoaded", function () {

  document.getElementById('rules').addEventListener('click', () => {
    alert('You hit the Rule Button');
    let myWindow = window.open("", "MsgWindow", "width=600,height=300");
    myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
  });


  document.getElementById('ga').addEventListener('click', () => {
    alert('You hit the GA Button');
    window.open("https://www.gambleaware.org/");
  });
});

// Buttons for game play, hit, stand, deal, split
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
    //hide dealer card value again
    document.getElementById("dealer-cards-value").style.display = "none";
    // update player cards value
    document.getElementById("player-cards-value").innerHTML = player.total.toString();

    updateUI();
    if (player.total >= 21) {
      // rule for BlackJack on
      if (player.total === 21) {
        playerTurn = false;
        while (dealer.total < 17 || dealer.total < player.total) {
          dealer.addCard(deck.selectCardsFromDeck(1)[0]);
        }
        updateUI();
        determineWinner();
      }
    }  }
});
document.getElementById('hit-button').addEventListener('click', () => {
  if (gameStarted && playerTurn) {
    player.addCard(deck.selectCardsFromDeck(1)[0]);
    //hide dealer card value again
    document.getElementById("dealer-cards-value").style.display = "none";
    // update player cards value
    document.getElementById("player-cards-value").innerHTML = player.total.toString();

    updateUI();
    if (player.total > 21) {
      determineWinner();
    }
  }
});
// Game Mechanics Dealer hit until dealer.total < 17 or dealer.total more than or equal to player.total
document.getElementById('stand-button').addEventListener('click', () => {
  if (gameStarted && playerTurn) {
    playerTurn = false;


    while (dealer.total < 17 || dealer.total < player.total) { // Dealer hits until total is 17 or more
      dealer.addCard(deck.selectCardsFromDeck(1)[0]);
    }

    // update and reveal dealer card value
    document.getElementById("dealer-cards-value").innerHTML = dealer.total.toString();
    document.getElementById("dealer-cards-value").style.display = "block";
    

    updateUI();
    determineWinner();
  }
});

// split button functionality

document.getElementById('split-button').addEventListener('click', () => {
      if (gameStarted && playerTurn && player.hand.length === 2 && player.hand[0][0] === player.hand[1][0]) {
        splitCards(); // split cards if they are the same
        updateUI(); // update UI to show split cards
      }});

    updateUI();
