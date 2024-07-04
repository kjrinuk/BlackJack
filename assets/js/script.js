// Blackjack Game
// On window load timer
window.onload = function () {
  let secondsSpent = 0;
  const display = document.getElementById("timeSpent");
  setInterval(() => {
    secondsSpent++;
    let minutes = Math.floor(secondsSpent / 60);
    let seconds = secondsSpent % 60;
    display.textContent = `Timer: ${minutes}:${seconds}`;
  }, 1000);
};

// 
// Handling of the Game Rules overlay
//

// Get the overlay element
let overlay = document.getElementById("overlay");

// Get the button that opens the overlay
let openBtn = document.getElementById("openOverlayBtn");

// Get the <span> element that closes the overlay
let closeBtn = document.getElementById("closeOverlayBtn");

// When the user clicks the button, open the overlay 
openBtn.onclick = function () {
  overlay.style.display = "block";
}

// When the user clicks on <span> (x), close the overlay
closeBtn.onclick = function () {
  overlay.style.display = "none";
}

// When the user clicks anywhere outside of the overlay, close it
window.onclick = function (event) {
  if (event.target == overlay) {
    overlay.style.display = "none";
  }
}

//
// End of code for handling Game Rules overlay
//



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
 *
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
      const randomCard =
        this.remaining[Math.floor(Math.random() * this.remaining.length)];
      selectedCards.push(randomCard);
      // Remove selected card from the remaining deck
      this.remaining = this.remaining.filter(
        (card) => !(card[0] === randomCard[0] && card[1] === randomCard[1])
      );
    }
    return selectedCards;
  },
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
      case "jack":
      case "queen":
      case "king":
        total += 10;
        break;
      case "ace":
        aces += 1; // total += 1 (if less than 10) || 11 (if more than 10)
        total += 11; //
        break;
      default:
        console.log("Something has gone wrong!");
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

const dealer = new Role("Dealer");
const player = new Role("Player");
player.splitHands = []; // Array to store split hands in player object ONLY
player.splitTotal = 0; // For player object ONLY
let currentSplitHand = 0; // Index of current split hand #
let gameStarted = false;
let playerTurn = true;

// Score functionality incrementing player and dealer scores
let playerScore = 0;
let dealerScore = 0;

function updateScore(winner) {
  if (winner === "player") {
    playerScore += 1;
    document.getElementById("player-score").textContent = playerScore;
  } else if (winner === "dealer") {
    dealerScore += 1;
    document.getElementById("dealer-score").textContent = dealerScore;
  }
}

// Checking for two values of ten when player gets first two tens in their hand
function checkForTen() {
  if(player.hand.length !== 0 && player.splitHands.length === 0){
    let cardOne = player.hand[0][0];
  let cardTwo = player.hand[1][0];
  switch (cardOne) {
    case 'jack':
    case 'queen':
    case 'king':
      cardOne = 10;
      break;
  }

    switch (cardTwo) {
      case 'jack':
      case 'queen':
      case 'king':
        cardTwo = 10;
        break;
    }
    
    if (cardOne === 10 && cardTwo === 10) {
      return true
    } else {
      return false
    }
  }
  }

// Drawn Cards defined and styled here
function updateUI() {
  const dealerCards = document.getElementById("dealer-cards");
  const playerCards = document.getElementById("player-cards");
  dealerCards.innerHTML = "";
  playerCards.innerHTML = "";

  let idIterator = 1;
  dealer.hand.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card-image";
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

  if (dealer.hand.length > 0) {
    document.getElementById(
      "dealer-card-1"
    ).style.background = `url('assets/images/Card-images/back-card.jpg') no-repeat center / cover`; //Override styling to hide dealer's first card
    dealerCards.innerHTML += `<div id="spacer"></div>`; // Required to provide sufficient space to display cardDiv with absolute positioning
  }

  for (let i = 1; i <= dealer.hand.length; i++) {
    document.getElementById(`dealer-card-${i}`).style.left = `${15 + 8 * i}%`;
    document.getElementById(`dealer-card-${i}`).style.transform = `rotate(-${
      5 * (dealer.hand.length - i)
    }deg)`;
  }
  //  Player Cards defined and styled here --------------------------------------------------Split button display
  if (player.hand.length === 2 && player.hand[0][0] === player.hand[1][0] || checkForTen()) {
    document.getElementById("split-button").style.display = "inline-block";
  } else {
    document.getElementById("split-button").style.display = "none";
  }

  idIterator = 1;
  player.hand.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card-image";
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

  if (player.hand.length > 0) {
    playerCards.innerHTML += `<div id="spacer"></div>`;
  }

  for (let i = 1; i <= player.hand.length; i++) {
    document.getElementById(`player-card-${i}`).style.left = `${15 + 8 * i}%`;
    document.getElementById(`player-card-${i}`).style.transform = `rotate(-${
      player.hand.length * (player.hand.length - i)
    }deg)`;
  }

  // splithands length will need container to display split hands
  if (player.splitHands.length > 0) {
    const splitHandsContainer = document.getElementById(
      "split-hands-container"
    );
    splitHandsContainer.innerHTML = "";
    splitHandsContainer.style.height = "90px";

    positionIterator = 1;
    player.splitHands.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card-image";
      cardDiv.style = `
        background: url('assets/images/Card-images/SVG-cards/${card[0]}_of_${
        card[1]
      }.svg') no-repeat center / cover;
        width: 60px;
        height: 90px;
        position: absolute; 
        left: ${15 + 8 * positionIterator}%;
        transform: rotate(-${
          5 * (player.splitHands.length - positionIterator)
        }deg);
        `;
      splitHandsContainer.appendChild(cardDiv);
      positionIterator += 1;
    });

    document.getElementById("player-hand-initial").style.display =
      "block";
    document.getElementById("player-hand-second").style.display =
      "block";;

    if(player.hand.length === 1){
      document.getElementById('player-cards-value').innerText = (player.total / 2);
    }

    document.getElementById("split-hand-value").innerHTML =
      player.splitTotal.toString();
    document.getElementById("split-hand-value").style.display = "block";

    // Start to play for second hand
    if ((document.getElementsByClassName('card').length) === 2) {
      document.getElementById("player-hand-initial").style.display = 'none';
    }
  }
}

// --------------------------------------------function to split cards if they are the same
function splitCards() {
  if (player.hand.length === 2 && player.splitHands.length === 0 && player.hand[0][0] === player.hand[1][0] || checkForTen()) {
    player.splitHands.push(player.hand[1]);
    player.splitTotal = totalValue(player.splitHands);
    player.hand.pop();
    updateUI();
  }
}
// changed code to determine winner with house always having advantage in tie situations
function determineWinner() {
  let result;
  if (player.total > 21) {
    result = "BUST";
    updateScore("dealer");
  } else if (dealer.total > 21 || player.total > dealer.total) {
    result = "WIN";
    updateScore("player");
  } else if (player.total === dealer.total) {
    result = "TIE";
    // updateScore('dealer');
  } else if (player.total <= dealer.total) {
    result = "LOSS";
    updateScore("dealer");
  } else {
    console.log("Something has gone wrong!"); //internal bug checking we should oped this out to a modal in the deployment.
  }

  // Reveal dealer's hidden card once result has been assigned a value
  document.getElementById(
    "dealer-card-1"
  ).style.background = `url('assets/images/Card-images/SVG-cards/${dealer.hand[0][0]}_of_${dealer.hand[0][1]}.svg') no-repeat center / cover`;

  // Result card creation styles defined in style sheet atm
  //  fixed cloneNode BUST bug
  const resultCard = document.createElement("div");
  resultCard.className = "card";
  resultCard.textContent = result;

  if (result !== undefined) {
    const playerResultCard = resultCard.cloneNode(true);
    const dealerResultCard = resultCard.cloneNode(true);

    if (result === "WIN") {
      playerResultCard.textContent = "WIN";
      dealerResultCard.textContent = "LOSS";
    } else if (result === "LOSS") {
      playerResultCard.textContent = "LOSS";
      dealerResultCard.textContent = "WIN";
    } else if (result === "BUST") {
      playerResultCard.textContent = "BUST";
      dealerResultCard.textContent = "WIN";
    } else if (result === "TIE") {
      playerResultCard.textContent = "PUSH";
      dealerResultCard.textContent = "PUSH";
    }

    document.getElementById("player-cards").appendChild(playerResultCard);
    document.getElementById("dealer-cards").appendChild(dealerResultCard);
  } else {
    document.getElementById("player-cards").appendChild(resultCard);

    // update and reveal dealer card value
    document.getElementById("dealer-cards-value").innerHTML =
      dealer.total.toString();
    document.getElementById("dealer-cards-value").style.display = "block";

    // document.getElementById('dealer-cards').appendChild(resultCard);

    document
      .getElementById("dealer-cards")
      .appendChild(resultCard.cloneNode(true));
  }

  gameStarted = false;
}

// Buttons for game play, hit, stand, deal, split
document.getElementById("deal-button").addEventListener("click", () => {
  if (!gameStarted) {
    resetDisplayedCards(); // Reset displayed cards
    deck.resetDeck();
    dealer.hand = deck.selectCardsFromDeck(2);
    player.hand = deck.selectCardsFromDeck(2);
    dealer.total = totalValue(dealer.hand);
    player.total = totalValue(player.hand);
    updateUI();
    gameStarted = true;
    playerTurn = true;

    // turn display of player card values to on
    document.getElementById("player-cards-value").innerHTML =
      player.total.toString();
    document.getElementById("player-cards-value").style.display = "block";

    // ensure dealer value is still hidden until player has finished his go
    document.getElementById("dealer-cards-value").style.display = "none";
  } else if (gameStarted && playerTurn && player.hand.length === 2 && player.total === 21) {
    alert("You Just Hit 21! Black Jack Baby! Stand or Hit to continue.");
    updateUI();
    determineWinner();
  } else if (gameStarted && playerTurn && player.total < 21) { 
    alert("You must finish the current game before starting a new one.");
  } 
});

document.getElementById("hit-button").addEventListener("click", () => {
  if (gameStarted && playerTurn) {
    player.addCard(deck.selectCardsFromDeck(1)[0]);
    //hide dealer card value again
    document.getElementById("dealer-cards-value").style.display = "none";
    // update player cards value
    document.getElementById("player-cards-value").innerHTML =
      player.total.toString();

    updateUI();
    if (player.hand.length === 2 && playerTurn && player.total === 21) {
      playerTurn = false;
      updateUI();
      determineWinner();
    } else if (player.total > 21) {
      determineWinner();
    }
  }

  if (player.total > 21) {
    // update and reveal dealer card value
    document.getElementById("dealer-cards-value").innerHTML = dealer.total.toString();
    document.getElementById("dealer-cards-value").style.display = "block";
  }

  /*if (document.getElementsByClassName('card').length === 2 && player.splitHands.length === 1) {
    player.splitHands.push(deck.selectCardsFromDeck(1)[0])
    // hide result cards
    document.getElementsByClassName("card")[0].style.display = "none";
    //hide dealer card value again
    document.getElementById("dealer-cards-value").style.display = "none";
    dealer.hand = [];
    if (!dealer.hand.length === 2) {
      dealer.hand.push(selectCardsFromDeck(2));
    } else {
      dealer.hand.push(selectCardsFromDeck(1));
    }
  }*/

});
// Game Mechanics Dealer hit until dealer.total < 17 or dealer.total more than or equal to player.total
document.getElementById("stand-button").addEventListener("click", () => {
  if (gameStarted && playerTurn) {
    playerTurn = false;

    while (dealer.total < 17 || dealer.total < player.total) {
      // Dealer hits until total is 17 or more
      dealer.addCard(deck.selectCardsFromDeck(1)[0]);
    }

    // update and reveal dealer card value
    document.getElementById("dealer-cards-value").innerHTML =
      dealer.total.toString();
    document.getElementById("dealer-cards-value").style.display = "block";

    updateUI();
    determineWinner();
  }
});

// split button functionality

document.getElementById('split-button').addEventListener('click', () => {
      if (gameStarted && playerTurn && player.hand.length === 2 && player.hand[0][0] === player.hand[1][0] || checkForTen()) {
        splitCards(); // split cards if they are the same
        updateUI(); // update UI to show split cards
      }});

if (playerTurn && player.total === 21) {
  playerTurn = false;
  console.log("we hit the if statement");
  updateUI();
  determineWinner();
  }

updateUI();
