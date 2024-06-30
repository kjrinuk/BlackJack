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
    console.log('Something has gone wrong!');
  }

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
  }
});

document.getElementById('hit-button').addEventListener('click', () => {
  if (gameStarted && playerTurn) {
    player.addCard(deck.selectCardsFromDeck(1)[0]);
    updateUI();
    if (player.total > 21) {
      determineWinner();
    }
  }
});

document.getElementById('stand-button').addEventListener('click', () => {
  if (gameStarted && playerTurn) {
    playerTurn = false;
    while (dealer.total < 17) {
      dealer.addCard(deck.selectCardsFromDeck(1)[0]);
    }
    updateUI();
    determineWinner();
  }
});

updateUI();

function displayChips(money) {
  let numOfVisibleChips = [0, 0, 0, 0, 0];
  let chips = [
    {
      colour: 'white',
      value: 5,
    },
    {
      colour: 'red',
      value: 10,
    },
    {
      colour: 'dark-green',
      value: 20,
    },
    {
      colour: 'dark-cyan',
      value: 50,
    },
    {
      colour: 'black',
      value: 100,
    },
  ];
  let chipsDivHTML = ``;
  if ((money % 5) === 0) { // money must be a multiple of 5
    numOfVisibleChips[0] = money / 5;
    numOfVisibleChips[1] = Math.floor(money / 10);
    numOfVisibleChips[2] = Math.floor(money / 20);
    numOfVisibleChips[3] = Math.floor(money / 50);
    numOfVisibleChips[4] = Math.floor(money / 100);
  };
  for (let i = 0; i < numOfVisibleChips.length; i++) {
    if (numOfVisibleChips[i] > 3) {
      numOfVisibleChips[i] = 3;
    }
    for(let j = 0; j < numOfVisibleChips[i]; j++) {
      chipsDivHTML += `<div style= "position: absolute; left = ${10*(i+2)*(j+2)}px;"class="chip ${chips[i].colour} d-flex justify-content-center align-items-center">$${chips[i].value}</div>`;
    }
  }
  console.log(chipsDivHTML);
  document.getElementById('bank-box').innerHTML = chipsDivHTML;
}

displayChips(1000);