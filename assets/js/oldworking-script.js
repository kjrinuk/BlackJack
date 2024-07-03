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
  let splitHands = [];
  let currentSplitHand = 0;
  let gameStarted = false;
  let playerTurn = true;
  
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
  
    document.getElementById('dealer-card-1').style.background = `url('assets/images/Card-images/back-card.jpg') no-repeat center / cover`;
  
    if (dealer.hand.length > 0) dealerCards.innerHTML += `<div id="spacer"></div>`;
  
    for (let i = 1; i <= dealer.hand.length; i++) {
      document.getElementById(`dealer-card-${i}`).style.left = `${15 + (8 * i)}%`;
      document.getElementById(`dealer-card-${i}`).style.transform = `rotate(-${5 * (dealer.hand.length - i)}deg)`;
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
      document.getElementById(`player-card-${i}`).style.left = `${15 + (8 * i)}%`;
      document.getElementById(`player-card-${i}`).style.transform = `rotate(-${player.hand.length * (player.hand.length - i)}deg)`;
    }
  
    if (splitHands.length > 0) {
      const splitHandsContainer = document.getElementById('split-hands-container');
      splitHandsContainer.innerHTML = '';
      splitHands.forEach((hand, index) => {
        const splitHandDiv = document.createElement('div');
        splitHandDiv.className = 'split-hand';
        hand.hand.forEach(card => {
          const cardDiv = document.createElement('div');
          cardDiv.className = 'card-image';
          cardDiv.style = `
          background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${card[1]}.svg') no-repeat center / cover;
          width: 60px;
          height: 90px;
          position: absolute; 
          `;
          splitHandDiv.appendChild(cardDiv);
        });
        splitHandsContainer.appendChild(splitHandDiv);
      });
    }
  }
  
  function splitCards() {
    if (player.hand.length === 2 && player.hand[0][0] === player.hand[1][0]) {
      const card1 = player.hand[0];
      const card2 = player.hand[1];
      splitHands.push(new Role('Player-Split1'));
      splitHands.push(new Role('Player-Split2'));
      splitHands[0].addCard(card1);
      splitHands[1].addCard(card2);
      player.hand = [];
      player.addCard(deck.selectCardsFromDeck(1)[0]);
      splitHands[0].addCard(deck.selectCardsFromDeck(1)[0]);
      splitHands[1].addCard(deck.selectCardsFromDeck(1)[0]);
      updateUI();
    }
  }
  
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
    } else {
      console.log('Something has gone wrong!');
    }
  
    document.getElementById('dealer-card-1').style.background = `url('assets/images/Card-images/SVG-cards/${dealer.hand[0][0]}_of_${dealer.hand[0][1]}.svg') no-repeat center / cover`;
  
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
      }
  
      document.getElementById('player-cards').appendChild(playerResultCard);
      document.getElementById('dealer-cards').appendChild(dealerResultCard);
    } else {
      document.getElementById('player-cards').appendChild(resultCard);
  
      document.getElementById("dealer-cards-value").innerHTML = dealer.total.toString();
      document.getElementById("dealer-cards-value").style.display = "block";
      document.getElementById('dealer-cards').appendChild(resultCard.cloneNode(true));
    }
  
    gameStarted = false;
  }
  
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
  
      document.getElementById("player-cards-value").innerHTML = player.total.toString();
      document.getElementById("player-cards-value").style.display = "block";
      document.getElementById("dealer-cards-value").style.display = "none";
    }
  });
  
  document.getElementById('hit-button').addEventListener('click', () => {
    if (gameStarted && playerTurn) {
      player.addCard(deck.selectCardsFromDeck(1)[0]);
      document.getElementById("dealer-cards-value").style.display = "none";
      document.getElementById("player-cards-value").innerHTML = player.total.toString();
  
      updateUI();
      if (player.total > 21) {
        determineWinner();
      }
    }
  });
  
  document.getElementById('stand-button').addEventListener('click', () => {
    if (gameStarted && playerTurn) {
      playerTurn = false;
  
      while (dealer.total < 17 || dealer.total < player.total) {
        dealer.addCard(deck.selectCardsFromDeck(1)[0]);
      }
  
      document.getElementById("dealer-cards-value").innerHTML = dealer.total.toString();
      document.getElementById("dealer-cards-value").style.display = "block";
  
      updateUI();
      determineWinner();
    }
  });
  
  document.getElementById('split-button').addEventListener('click', () => {
    if (gameStarted && playerTurn && player.hand.length === 2 && player.hand[0][0] === player.hand[1][0]) {
      splitCards();
      updateUI();
    }
  });
  
  updateUI();
  