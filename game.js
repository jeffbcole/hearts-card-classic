var Game = function () {

    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    var handCardsMaxSpacing = 3;
    var computerCardsMaxSpacing = -50;
    var cribDiscardSpacing = 13;
    var peggingCardsOverlap = 21;
    var peggingCardsVerticalOffset = 10;
    var peggingDeadCardsOverlap = 12;
    var bubbleScoreVisibleDuration = 1200;
    var computerCountSpacingMin = 20;
    var currentComputerCardSpacing;

    // private variables
    var cardsAreVisible = false;
    var skillLevel = "";
    var currentMoveStage = "";
    var playerScore = 0;
    var computerScore = 0;
    var isPlayersCrib = false;
    var playersHand = [];
    var computersHand = [];
    var crib = [];

    var currentPeggingCards = [];
    var deadPeggingCards = [];
    var computerPlayedPeggingCards = [];
    var playerPlayedPeggingCards = [];
    var isPlayersTurnToPeg = false;
    var playerSaysGo = false;
    var computerSaysGo = false;

    var scoreboard = new Scoreboard();
    var visibleLowCardOptionsCount = 0;
    var playerSelectedLowCardView;
    var computerSelectedLowCardView;
    var currentDraggedCardView;
    var currentPreCribDraggedCardWasLastInTheCrib = false;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    var computerPlayer = new ComputerPlayer();

    var computerPeggingPointsTotal = 0;
    var playerPeggingPointsTotal = 0;

    var recordPlayerPeggingStartingScore = 0;
    var recordComputerPeggingStartingScore = 0;
    var topCard;

    var peggingCountText;
    var currentPeggingCount = 0;

    var computerHandPointsTotal = 0;
    var playerHandPointsTotal = 0;
    var computerCribPointsTotal = 0;
    var playerCribPointsTotal = 0;

    var suboptimalPlays = [];

    var mostRecentHandCards = [];
    var mostRecentIsPlayersCrib = false;

    var deckTopIndex = 0;
    var cards = [
        { id: 'AS', rank: 1, value: 1, suit: 'S', image: "url('images/Card_Spade_Ace.jpg')" },
        { id: '2S', rank: 2, value: 2, suit: 'S', image: "url('images/Card_Spade_2.jpg')" },
        { id: '3S', rank: 3, value: 3, suit: 'S', image: "url('images/Card_Spade_3.jpg')" },
        { id: '4S', rank: 4, value: 4, suit: 'S', image: "url('images/Card_Spade_4.jpg')" },
        { id: '5S', rank: 5, value: 5, suit: 'S', image: "url('images/Card_Spade_5.jpg')" },
        { id: '6S', rank: 6, value: 6, suit: 'S', image: "url('images/Card_Spade_6.jpg')" },
        { id: '7S', rank: 7, value: 7, suit: 'S', image: "url('images/Card_Spade_7.jpg')" },
        { id: '8S', rank: 8, value: 8, suit: 'S', image: "url('images/Card_Spade_8.jpg')" },
        { id: '9S', rank: 9, value: 9, suit: 'S', image: "url('images/Card_Spade_9.jpg')" },
        { id: 'TS', rank: 10, value: 10, suit: 'S', image: "url('images/Card_Spade_10.jpg')" },
        { id: 'JS', rank: 11, value: 10, suit: 'S', image: "url('images/Card_Spade_Jack.jpg')" },
        { id: 'QS', rank: 12, value: 10, suit: 'S', image: "url('images/Card_Spade_Queen.jpg')" },
        { id: 'KS', rank: 13, value: 10, suit: 'S', image: "url('images/Card_Spade_King.jpg')" },
        { id: 'AD', rank: 1, value: 1, suit: 'D', image: "url('images/Card_Diamond_Ace.jpg')" },
        { id: '2D', rank: 2, value: 2, suit: 'D', image: "url('images/Card_Diamond_2.jpg')" },
        { id: '3D', rank: 3, value: 3, suit: 'D', image: "url('images/Card_Diamond_3.jpg')" },
        { id: '4D', rank: 4, value: 4, suit: 'D', image: "url('images/Card_Diamond_4.jpg')" },
        { id: '5D', rank: 5, value: 5, suit: 'D', image: "url('images/Card_Diamond_5.jpg')" },
        { id: '6D', rank: 6, value: 6, suit: 'D', image: "url('images/Card_Diamond_6.jpg')" },
        { id: '7D', rank: 7, value: 7, suit: 'D', image: "url('images/Card_Diamond_7.jpg')" },
        { id: '8D', rank: 8, value: 8, suit: 'D', image: "url('images/Card_Diamond_8.jpg')" },
        { id: '9D', rank: 9, value: 9, suit: 'D', image: "url('images/Card_Diamond_9.jpg')" },
        { id: 'TD', rank: 10, value: 10, suit: 'D', image: "url('images/Card_Diamond_10.jpg')" },
        { id: 'JD', rank: 11, value: 10, suit: 'D', image: "url('images/Card_Diamond_Jack.jpg')" },
        { id: 'QD', rank: 12, value: 10, suit: 'D', image: "url('images/Card_Diamond_Queen.jpg')" },
        { id: 'KD', rank: 13, value: 10, suit: 'D', image: "url('images/Card_Diamond_King.jpg')" },
        { id: 'AC', rank: 1, value: 1, suit: 'C', image: "url('images/Card_Club_Ace.jpg')" },
        { id: '2C', rank: 2, value: 2, suit: 'C', image: "url('images/Card_Club_2.jpg')" },
        { id: '3C', rank: 3, value: 3, suit: 'C', image: "url('images/Card_Club_3.jpg')" },
        { id: '4C', rank: 4, value: 4, suit: 'C', image: "url('images/Card_Club_4.jpg')" },
        { id: '5C', rank: 5, value: 5, suit: 'C', image: "url('images/Card_Club_5.jpg')" },
        { id: '6C', rank: 6, value: 6, suit: 'C', image: "url('images/Card_Club_6.jpg')" },
        { id: '7C', rank: 7, value: 7, suit: 'C', image: "url('images/Card_Club_7.jpg')" },
        { id: '8C', rank: 8, value: 8, suit: 'C', image: "url('images/Card_Club_8.jpg')" },
        { id: '9C', rank: 9, value: 9, suit: 'C', image: "url('images/Card_Club_9.jpg')" },
        { id: 'TC', rank: 10, value: 10, suit: 'C', image: "url('images/Card_Club_10.jpg')" },
        { id: 'JC', rank: 11, value: 10, suit: 'C', image: "url('images/Card_Club_Jack.jpg')" },
        { id: 'QC', rank: 12, value: 10, suit: 'C', image: "url('images/Card_Club_Queen.jpg')" },
        { id: 'KC', rank: 13, value: 10, suit: 'C', image: "url('images/Card_Club_King.jpg')" },
        { id: 'AH', rank: 1, value: 1, suit: 'H', image: "url('images/Card_Heart_Ace.jpg')" },
        { id: '2H', rank: 2, value: 2, suit: 'H', image: "url('images/Card_Heart_2.jpg')" },
        { id: '3H', rank: 3, value: 3, suit: 'H', image: "url('images/Card_Heart_3.jpg')" },
        { id: '4H', rank: 4, value: 4, suit: 'H', image: "url('images/Card_Heart_4.jpg')" },
        { id: '5H', rank: 5, value: 5, suit: 'H', image: "url('images/Card_Heart_5.jpg')" },
        { id: '6H', rank: 6, value: 6, suit: 'H', image: "url('images/Card_Heart_6.jpg')" },
        { id: '7H', rank: 7, value: 7, suit: 'H', image: "url('images/Card_Heart_7.jpg')" },
        { id: '8H', rank: 8, value: 8, suit: 'H', image: "url('images/Card_Heart_8.jpg')" },
        { id: '9H', rank: 9, value: 9, suit: 'H', image: "url('images/Card_Heart_9.jpg')" },
        { id: 'TH', rank: 10, value: 10, suit: 'H', image: "url('images/Card_Heart_10.jpg')" },
        { id: 'JH', rank: 11, value: 10, suit: 'H', image: "url('images/Card_Heart_Jack.jpg')" },
        { id: 'QH', rank: 12, value: 10, suit: 'H', image: "url('images/Card_Heart_Queen.jpg')" },
        { id: 'KH', rank: 13, value: 10, suit: 'H', image: "url('images/Card_Heart_King.jpg')" }
    ];

    this.GetCards = function () {
        return cards;
    }

    var cardsRegion = document.getElementById('cards_region');
    cardsRegion.onmousedown = dragMouseDown;

    // template for card
    var cardElement = document.createElement("div");
    cardElement.className = "card";
    var raiseContainer = document.createElement("div");
    raiseContainer.className = "raiseContainer";
    cardElement.appendChild(raiseContainer);
    var flipContainer = document.createElement("div");
    flipContainer.className = "cardFlipContainer";
    raiseContainer.appendChild(flipContainer);
    var shadow = document.createElement("div");
    shadow.className = "cardShadow";
    flipContainer.appendChild(shadow);
    var back = document.createElement("div");
    back.className = "cardBack";
    flipContainer.appendChild(back);
    var front = document.createElement("div");
    front.className = "cardFront";
    flipContainer.appendChild(front);

    var cardBackURI = "url('images/card_back_" + GetSetting('setting_card_color') + ".jpg')";

    for (var i = 0; i < cards.length; i++) {
        var newCard = cardElement.cloneNode(true);
        var card = cards[i];
        card.cardView = newCard;
        card.cardView.isSlidUp = false;
        newCard.id = card.id;
        newCard.card = card;
        newCard.positionIndex = i;
        newCard.getElementsByClassName('cardBack')[0].style.backgroundImage = cardBackURI;
        newCard.getElementsByClassName('cardFront')[0].style.backgroundImage = card.image;
        newCard.style.visibility = "hidden";
        cards_region.appendChild(newCard);
    }

    this.GetCardFromString = function (cardString) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].id == cardString) {
                return cards[i];
            }
        }
        return null;
    }

    this.FindOptimalCribDiscards = function (cards, isCribPositive) {
        return computerPlayer.FindOptimalCribDiscards(cards, isCribPositive);
    }

    this.GetScoreStatsForPossibleDiscards = function (trialCards, cribCards, isCribScorePositive) {
        return computerPlayer.GetScoreStatsForPossibleDiscards(trialCards, cribCards, isCribScorePositive);
    }

    this.GetScoreForCards = function (cards, topCard, isCrib) {
        return computerPlayer.GetScoreForCards(cards, topCard, isCrib);
    }

    function isGameOver() {
        return playerScore > 120 || computerScore > 120;
    }

    function isPlayerWon() {
        return playerScore > 120;
    }

    function isSkunkGame() {
        if (isPlayerWon()) {
            return computerScore < 91;
        } else {
            return playerScore < 91;
        }
    }

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragMouseDown(e) {
        e = e || window.event;

        if (!e.target.classList.contains('card')) {
            return;
        }

        if (currentMoveStage === 'WaitingForUserToSelectLowestCard') {
            var tappedCard = e.target.card;
            playerSelectedLowCardView = e.target;
            animateLowCardSelected(tappedCard.cardView);
            return;
        } else if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                currentDraggedCardView = tappedCardView;
                currentDraggedCardView.style.transition = "none";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                currentDraggedCardView.startTime = Date.now();
                currentDraggedCardView.startPosition = [e.clientX, e.clientY];
                preCribCardPointerPressed(currentDraggedCardView);
            }
        } else if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                currentDraggedCardView = tappedCardView;
                currentDraggedCardView.style.transition = "none";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                currentDraggedCardView.startTime = Date.now();
                currentDraggedCardView.startPosition = [e.clientX, e.clientY];
                peggingCardPointerPressed(currentDraggedCardView);
            }
        } else if (currentMoveStage === 'WaitingForUserToManuallyCount') {
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                if (tappedCardView.isSlidUp) {
                    slideDownCard(tappedCardView);
                } else {
                    slideUpCard(tappedCardView);
                }
                AnalyzeSelectedCardsForManualCounting();
            }
        } else {
            return;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        currentDraggedCardView.style.top = (currentDraggedCardView.offsetTop - pos2) + "px";
        currentDraggedCardView.style.left = (currentDraggedCardView.offsetLeft - pos1) + "px";

        if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            preCribCardPointerMoved();
        } else if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            peggingCardPointerMoved();
        }
    }

    function closeDragElement() {
        // stop moving when mouse released
        if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            preCribCardPointerFinished();
        } else if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            peggingCardPointerFinished();
        }
        document.onmouseup = null;
        document.onmousemove = null;
    }

    /**
    * detect IE
    * returns version of IE or false, if browser is not Internet Explorer
    */
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return true;
        }
    
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return true;
        }
    
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            //return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            return true;
        }
    
        // other browser
        return false;
    }

    var isIE = detectIE();
    
    function slideRaiseAndFlipUpCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        cardView.style.transition = "0.2s ease-in-out";
        cardView.style.transform = "translate(-155px, -81px)";
        setTimeout(function () {
            cardView.style.transform = "translate(-57px,-81px)";
            cardView.style.zIndex = 100;
        }, 250);
        setTimeout(function () {
            var ease = "0.7s ease-out";
            raiseContainer.style.transition = ease;
            flipContainer.style.transition = ease;
            cardBack.style.transition = ease;
            cardFront.style.transition = ease;
            cardShadow.style.transition = ease;
            raiseContainer.style.transform = "scale(1.15)";
            
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardBack.style.transform = "translate3d(0px,0px,-1px) perspective(500px) rotateY(-180deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
            }
        }, 310);
    }

    function flipUpCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.7s ease-out";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (isIE) {
            cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
            cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(-180deg)";
            cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
            }, 400);
        } else {
            flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
            cardShadow.style.transform = "translate3d(-20px,20px,0px)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }, 400);
        }
    }

    function flipDownCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.7s ease-out";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (isIE) {
            cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
            cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
            cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(180deg)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            }, 400);
        } else {
            flipContainer.style.transform = "perspective(500px) rotateY(0deg)";
            cardShadow.style.transform = "translate3d(-20px,20px,0px)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }, 400);
        }
        
    }

    function flipDownAndLowerCard(cardView, lowerDelay) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.7s ease-out";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;

        if (isIE) {
            cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
            cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
            cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            }, lowerDelay);
        } else {
            flipContainer.style.transform = "perspective(500px) rotateY(0deg)";    
            setTimeout(function () {
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }, lowerDelay);
        }

        
    }

    function raiseCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.1s linear";
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        cardShadow.style.transition = ease;
        if (isIE) {
            cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
        } else {
            cardShadow.style.transform = "translate3d(-20px,20px,0px)";
        }
    }

    function lowerCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.1s linear";
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1)";
        cardShadow.style.transition = ease;
        if (isIE) {
            cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
        } else {
            cardShadow.style.transform = "translate3d(0px,0px,0px)";
        }
    }

    function slideUpCard(cardView) {
        cardView.isSlidUp = true;
        cardView.style.transition = "0.2s ease-out";
        cardView.style.transform = "translate(-50%, -70%)";
    }

    function slideDownCard(cardView) {
        cardView.isSlidUp = false;
        cardView.style.transition = "0.2s ease-out";
        cardView.style.transform = "translate(-50%, -50%)";
    }

    function BumpCards(cards, delay) {
        setTimeout(function() {
            for (var i=0; i<cards.length; i++) {
                BumpCard(cards[i].cardView);
            }    
        }, delay);
    }

    function BumpCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('bump');
        });
        cardView.classList.add('bump');
    }

    function TwistCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('twist');
        });
        cardView.classList.add('twist');
    }

    function ShakeCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('shake');
        });
        cardView.classList.add('shake');
    }

    function ShakeMugginsView(mugginsView) {
        mugginsView.addEventListener("animationend", function() {
            mugginsView.classList.remove('mugshake');
        });
        mugginsView.classList.add('mugshake');    
    }

    function AnimateScoreBubble(position, points, description, isPlayersPoints, delay) {

        setTimeout(function () {
            var bubbleTemplate = document.getElementById('BubbleScorePlayerTemplate');
            var scoreBubble = bubbleTemplate.cloneNode(true);
            if (isPlayersPoints) {
                scoreBubble.style.background = "rgb(0, 0, 190)";
            } else {
                scoreBubble.style.background = "rgb(190, 0, 0)";
            }
            scoreBubble.getElementsByClassName('BubbleScoreDescription')[0].innerText = description + " for";
            scoreBubble.getElementsByClassName('BubbleScorePoints')[0].innerText = points;
            var pointsLabel = scoreBubble.getElementsByClassName('BubbleScorePointsLabel')[0];
            if (points == 1) {
                pointsLabel.innerText = 'point';
            } else {
                pointsLabel.innerText = 'points';
            }
            var posLeft = position[0] - 50;
            var posTop = position[1] - 50;
            scoreBubble.style.opacity = 1;
            scoreBubble.style.transition = "none";
            scoreBubble.style.transform = 'scale(0)';
            scoreBubble.style.left = posLeft + "px";
            scoreBubble.style.top = posTop + "px";
            scoreBubble.style.zIndex = 500;
            scoreBubble.style.visibility = 'visible';

            var cards_region = document.getElementById('cards_region');
            cards_region.appendChild(scoreBubble);
            setTimeout(function () {
                scoreBubble.style.transition = "0.3s ease-in";
                scoreBubble.style.transform = 'scale(1)';
                setTimeout(function () {
                    scoreBubble.style.transition = "1s ease-in";
                    scoreBubble.style.top = posTop - 30 + 'px';
                    scoreBubble.style.opacity = 0;
                    setTimeout(function () {
                        cards_region.removeChild(scoreBubble);
                    }, 1000);
                }, 800);
            }, 50);
        }, delay);
    }

    function GetDeckCardPosition() {
        if (scoreboard.IsCompactLayout()) {
            return [window.innerWidth * 0.15, 200];
        } else {
            return [window.innerWidth * 0.15, 315];
        }
    }

    function GetLeftLowCardPosition() {
        return [window.innerWidth * 0.5 - 110, GetDeckCardPosition()[1]];
    }

    function GetRightLowCardPosition() {
        return [window.innerWidth * 0.5 + 110, GetDeckCardPosition()[1]];
    }

    function GetDiscardRegionPosition() {
        return [window.innerWidth * 0.5, GetDeckCardPosition()[1]];
    }

    function GetCribWaitingPosition() {
        if (isPlayersCrib) {
            var handPos = GetHandCardPosition(true, false, 3);
            return [handPos[0] + cardLoweredWidth * 2, handPos[1]];
        } else {
            var handPos = GetHandCardPosition(false, false, 3);
            return [handPos[0] + cardLoweredWidth * 2, handPos[1]];
        }
    }

    function GetCribConfirmRegionPosition() {
        var position = GetDiscardRegionPosition();
        if (scoreboard.IsCompactLayout()) {
            return [position[0], position[1] + cardLoweredHeight * 0.5 + 10];
        } else {
            return [position[0] + cardLoweredWidth + 80, position[1]];
        }
    }

    function GetPeggingFirstCardPosition() {
        var deckPosition = GetDeckCardPosition();
        var left = window.innerWidth * 0.4;
        if (left < deckPosition[0] + 130) {
            left = deckPosition[0] + 130;
        }
        return [left, deckPosition[1]];
    }

    function GetPeggingPromptPosition() {
        var nextCardPosition = GetPeggingFirstCardPosition();
        var left = nextCardPosition[0] + currentPeggingCards.length * peggingCardsOverlap;
        if (currentPeggingCards.length > 0) {
            left = left + 120;
        }
        if (left + 100 > window.innerWidth) {
            return [nextCardPosition[0] + currentPeggingCards.length * peggingCardsOverlap + 40, nextCardPosition[1] + cardLoweredHeight * 0.5 + 35];
        } else {
            return [left, nextCardPosition[1]];
        }
    }

    function GetManualPromptPosition() {
        var pos1 = GetHandCardPosition(true, false, 0);
        var pos2 = GetHandCardPosition(true, false, 3);
        var middle = (pos1[0] + pos2[0])/2;
        return [middle, pos1[1] - cardLoweredHeight*0.5 - 20];
    }

    function GetPeggingDeadPileFirstCardLeftPosition() {
        var left = window.innerWidth * 0.75;
        var peggingSpaceLeft = GetPeggingFirstCardPosition()[0] + 8 * peggingCardsOverlap + cardLoweredWidth * 0.5;
        if (left < peggingSpaceLeft) {
            left = window.innerWidth - cardLoweredWidth * 0.22;
        }
        return left;
    }

    function GetHandCardPosition(isPlayersCard, isPreCrib, cardIndex) {
        if (isPlayersCard) {
            var cardCount = 4;
            if (isPreCrib) {
                cardCount = 6;
            }
            var left = (window.innerWidth - cardLoweredWidth * cardCount - handCardsMaxSpacing * (cardCount - 1)) * 0.5;
            if (left < 0) {
                // We will have to overlap
                var overlapSpacing = window.innerWidth / cardCount - cardLoweredWidth;
                left = cardIndex * (cardLoweredWidth + overlapSpacing);
                currentPlayerHandCardSpacing = overlapSpacing;
            } else {
                left = left + cardIndex * (cardLoweredWidth + handCardsMaxSpacing)
                currentPlayerHandCardSpacing = handCardsMaxSpacing;
            }
            return [left + cardLoweredWidth * 0.5, GetDeckCardPosition()[1] + cardLoweredHeight + 60];
        } else {
            var cardCount = 4;
            if (isPreCrib) {
                cardCount = 6;
            }
            var left = (window.innerWidth - cardLoweredWidth * cardCount - computerCardsMaxSpacing * (cardCount - 1)) * 0.5;
            var leftMin = 200;
            var rightMin = cardLoweredWidth + 50;
            if (left < leftMin) {
                // We will have to overlap
                var overlapSpacing = (window.innerWidth - leftMin - rightMin) / cardCount - cardLoweredWidth;
                if (overlapSpacing < -100) {
                    overlapSpacing = -100;
                }
                currentComputerCardSpacing = overlapSpacing;
                left = leftMin;
            } else {
                currentComputerCardSpacing = computerCardsMaxSpacing;
            }
            left = left + cardIndex * (cardLoweredWidth + currentComputerCardSpacing);
            return [left + cardLoweredWidth * 0.5, GetDeckCardPosition()[1] - cardLoweredHeight - 20];
        }
    }

    function GetComputerHandCountingPosition(index) {
        if (scoreboard.IsCompactLayout()) {
            var pos = GetHandCardPosition(false, false, index);
            return [pos[0], cardLoweredHeight * 0.75];
        } else {
            return GetHandCardPosition(false, false, index);
        }
    }

    function GetCardIndexFromPosition(isPreCrib, cardView) {
        var handLeft = GetHandCardPosition(true, isPreCrib, 0)[0];
        var index = Math.round((cardView.offsetLeft - handLeft) / (cardLoweredWidth + currentPlayerHandCardSpacing));
        if (isPreCrib) {
            if (index < 0) index = 0;
            if (index > 5) index = 5;
        } else {
            if (index < 0) index = 0;
            if (index > 3) index = 3;
        }

        return index;
    }

    function GetHandScoreViewPosition(isPlayersPoints) {
        if (isPlayersPoints) {
            if (scoreboard.IsCompactLayout()) {
                return [window.innerWidth * 0.5 - 100, 50];
            } else {
                return [window.innerWidth * 0.5 - 100, window.innerHeight * 0.2];
            }
        } else {
            return [window.innerWidth * 0.5 - 100, window.innerHeight * 0.3];
        }
    }

    function GetManualCountViewPosition() {
        if (scoreboard.IsCompactLayout()) {
            return [window.innerWidth * 0.5 - 100, 10];
        } else {
            return [window.innerWidth * 0.5 - 100, 100];
        }
    }

    function GetRecountButtonPosition(isPlayersPoints) {
        var deckPos = GetDeckCardPosition();
        if (isPlayersPoints) {
            if (scoreboard.IsCompactLayout()) {
                return [window.innerWidth * 0.5 + 120, deckPos[1] + 70];
            } else {
                return [window.innerWidth * 0.5 + 120, deckPos[1]];
            }
        } else {
            return [window.innerWidth * 0.5 + 120, deckPos[1] + 70];
        }
    }

    function GetHintButtonPosition() {
        var checkPos = GetHandCardPosition(true, false, 0);
        var checkTop = checkPos[1] + cardLoweredHeight * 0.5 + 10;
        if (checkTop + 25 > window.innerHeight - 90) {
            var pos = GetDeckCardPosition();
            return [pos[0] - 35, pos[1] + cardLoweredHeight * 0.5 + 10];
        } else {
            return [window.innerWidth * 0.5 - 35, checkTop];
        }
    }

    Game.GetPeggingPointsForCards = function (peggingCards) {
        var peggingPoints = [];
        if (peggingCards.length <= 1) {
            return peggingPoints;
        }

        // Look for pairs, three of a kind, four of a kind
        var curIdx = peggingCards.length - 1;
        if (curIdx > 0 && peggingCards[curIdx].rank === peggingCards[curIdx - 1].rank) {
            if (curIdx > 1 && peggingCards[curIdx].rank === peggingCards[curIdx - 2].rank) {
                if (curIdx > 2 && peggingCards[curIdx].rank === peggingCards[curIdx - 3].rank) {
                    var scoringPoints = {};
                    scoringPoints.points = 12;
                    scoringPoints.description = "4 of a kind";
                    peggingPoints.push(scoringPoints);
                } else {
                    var scoringPoints = {};
                    scoringPoints.points = 6;
                    scoringPoints.description = "3 of a kind";
                    peggingPoints.push(scoringPoints);
                }
            } else {
                var scoringPoints = {};
                scoringPoints.points = 2;
                scoringPoints.description = "Pair";
                peggingPoints.push(scoringPoints);

            }
        }

        // Look for sums to 15 (use it later to check for 31)
        var curSum = 0;
        for (var i = 0; i < peggingCards.length; i++) {
            curSum = curSum + peggingCards[i].value;
        }
        if (curSum == 15) {
            var scoringPoints = {};
            scoringPoints.points = 2;
            scoringPoints.description = "Fifteen";
            peggingPoints.push(scoringPoints);
        }

        // Look for runs of 3 or more
        for (var runLength = peggingCards.length; runLength >= 3; runLength--) {
            var trailingCards = peggingCards.slice(peggingCards.length - runLength, peggingCards.length);
            trailingCards.sort(function (a, b) {
                return a.rank - b.rank;
            });
            var runFound = true;
            for (var i = 0; i < trailingCards.length - 1; i++) {
                if (trailingCards[i].rank != trailingCards[i + 1].rank - 1) {
                    runFound = false;
                    break;
                }
            }
            if (runFound) {
                var scoringPoints = {};
                scoringPoints.points = runLength;
                scoringPoints.description = "Run of " + runLength;
                peggingPoints.push(scoringPoints);
                break;
            }
        }

        // Check for sum of 31
        if (curSum == 31) {
            var scoringPoints = {};
            scoringPoints.points = 2;
            scoringPoints.description = "Thirty One";
            peggingPoints.push(scoringPoints);
        }

        return peggingPoints;
    }

    Game.GetPointsForHand = function (handCards, topCard, isCrib) {
        var points = [];
        var allCards = handCards.concat(topCard);
        var subsets = [];
        subsets.push([allCards[0], allCards[1]]);
        subsets.push([allCards[0], allCards[2]]);
        subsets.push([allCards[0], allCards[3]]);
        subsets.push([allCards[0], allCards[4]]);
        subsets.push([allCards[1], allCards[2]]);
        subsets.push([allCards[1], allCards[3]]);
        subsets.push([allCards[1], allCards[4]]);
        subsets.push([allCards[2], allCards[3]]);
        subsets.push([allCards[2], allCards[4]]);
        subsets.push([allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[2]]);
        subsets.push([allCards[0], allCards[1], allCards[3]]);
        subsets.push([allCards[0], allCards[1], allCards[4]]);
        subsets.push([allCards[0], allCards[2], allCards[3]]);
        subsets.push([allCards[0], allCards[2], allCards[4]]);
        subsets.push([allCards[0], allCards[3], allCards[4]]);
        subsets.push([allCards[1], allCards[2], allCards[3]]);
        subsets.push([allCards[1], allCards[2], allCards[4]]);
        subsets.push([allCards[1], allCards[3], allCards[4]]);
        subsets.push([allCards[2], allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[2], allCards[3]]);
        subsets.push([allCards[0], allCards[1], allCards[2], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[2], allCards[3], allCards[4]]);
        subsets.push([allCards[1], allCards[2], allCards[3], allCards[4]]);
        subsets.push([allCards[0], allCards[1], allCards[2], allCards[3], allCards[4]]);

        for (var i = 0; i < subsets.length; i++) {
            var subsetPoints = Game.GetSubsetPoints(subsets[i]);
            points = points.concat(subsetPoints);
        }

        // Combine points that are subsets into their parent points
        var pointsToRemove = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.description === "4 of a kind") {
                for (var j = 0; j < points.length; j++) {
                    if (points[j].description === "Pair") {
                        if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                            point.cards.indexOf(points[j].cards[1]) !== -1) {
                            pointsToRemove.push(points[j]);
                        }
                    } else if (points[j].description === "3 of a kind") {
                        if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                            point.cards.indexOf(points[j].cards[1]) !== -1 &&
                            point.cards.indexOf(points[j].cards[2]) !== -1) {
                            pointsToRemove.push(points[j]);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < pointsToRemove.length; i++) {
            var index = points.indexOf(pointsToRemove[i]);
            if (index > -1) {
                points.splice(index, 1);
            }
        }
        
        pointsToRemove = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.description === "3 of a kind") {
                for (var j = 0; j < points.length; j++) {
                    if (points[j].description === "Pair") {
                        if (point.cards.indexOf(points[j].cards[0]) !== -1 &&
                            point.cards.indexOf(points[j].cards[1]) !== -1) {
                            pointsToRemove.push(points[j]);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < pointsToRemove.length; i++) {
            var index = points.indexOf(pointsToRemove[i]);
            if (index > -1) {
                points.splice(index, 1);
            }
        }

        // Remove redundant runs
        pointsToRemove = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.descriptionID === 4) {
                for (var j = 0; j < points.length; j++) {
                    if (points[j].descriptionID === 4) {
                        if (points[j].points < point.points) {
                            // All cards in points[j] must be found in point
                            var allIncluded = true;
                            for (var k = 0; k < points[j].cards.length; k++) {
                                if (point.cards.indexOf(points[j].cards[k]) === -1) {
                                    allIncluded = false;
                                    break;
                                }
                            }
                            if (allIncluded) {
                                pointsToRemove.push(points[j]);
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < pointsToRemove.length; i++) {
            var index = points.indexOf(pointsToRemove[i]);
            if (index > -1) {
                points.splice(index, 1);
            }
        }

        // Look for a flush
        var flushDetected = true;
        for (var i = 0; i < handCards.length - 1; i++) {
            if (handCards[i].suit !== handCards[i + 1].suit) {
                flushDetected = false;
                break;
            }
        }
        if (flushDetected) {
            if (isCrib) {
                if (topCard.suit === handCards[0].suit) {
                    var point = {};
                    point.points = 5;
                    point.description = "Flush";
                    point.descriptionID = 5;
                    point.cards = allCards;
                    points.push(point);
                }
            } else {
                if (topCard.suit === handCards[0].suit) {
                    var point = {};
                    point.points = 5;
                    point.description = "Flush";
                    point.descriptionID = 5;
                    point.cards = allCards;
                    points.push(point);
                } else {
                    var point = {};
                    point.points = 4;
                    point.description = "Flush";
                    point.descriptionID = 5;
                    point.cards = handCards;
                    points.push(point);
                }
            }
        }

        // Look for nobs
        for (var i = 0; i < handCards.length; i++) {
            if (handCards[i].rank === 11 && handCards[i].suit === topCard.suit) {
                var point = {};
                point.points = 1;
                point.description = "Nobs";
                point.descriptionID = 6;
                point.cards = [handCards[i]];
                points.push(point);
                break;
            }
        }

        // Sort the points in proper order based on description
        points.sort(function (a, b) { return a.descriptionID - b.descriptionID; });

        return points;
    }

    Game.GetSubsetPoints = function (subset) {
        var allPoints = [];

        // look for sum of 15
        var sum = 0;
        for (var i = 0; i < subset.length; i++) {
            sum = sum + subset[i].value;
        }
        if (sum === 15) {
            var point = {};
            point.points = 2;
            point.description = "Fifteen"
            point.descriptionID = 0;
            point.cards = subset;
            allPoints.push(point);
        }

        // Look for pairs, 3 of a kind, and 4 of a kind
        var allSame = true;
        var curNumber = subset[0].rank;
        for (var i = 1; i < subset.length; i++) {
            if (subset[i].rank != curNumber) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            var point = {};
            point.cards = subset;
            if (subset.length === 2) {
                point.points = 2;
                point.description = "Pair";
                point.descriptionID = 1;
            } else if (subset.length === 3) {
                point.points = 6;
                point.description = "3 of a kind";
                point.descriptionID = 2;
            } else if (subset.length === 4) {
                point.points = 12;
                point.description = "4 of a kind";
                point.descriptionID = 3;
            }
            allPoints.push(point);
        }

        // Look for runs
        if (subset.length > 2) {
            subset.sort(function (a, b) { return a.rank - b.rank; });
            var runFound = true;
            for (var i = 0; i < subset.length - 1; i++) {
                if (subset[i].rank + 1 !== subset[i + 1].rank) {
                    runFound = false;
                    break;
                }
            }
            if (runFound) {
                var point = {};
                point.cards = subset;
                point.points = subset.length;
                point.description = "Run of " + subset.length;
                point.descriptionID = 4;
                allPoints.push(point);
            }
        }
        return allPoints;
    }

    this.ReturnAllCardsToDeck = function() {
        // Clean up all cards and messages
        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].cardView;
            flipDownAndLowerCard(el, 0);
        }
        HideAllMessages();
        setTimeout(function() {
            for (var i = cards.length-1; i >= 0; i--) {
                var pos = GetDeckCardPosition();
                var cardView = cards[i].cardView;
                cardView.positionIndex = i;
                cardView.style.transition = "0.9s ease-in-out";
                cardView.style.transitionDelay = i*20 + "ms";
                with (cardView.style) {
                    left = pos[0] + "px";
                    top = pos[1] + "px";
                }
            }
        }, 200);
        
    }

    this.StartAGame = function (difficulty) {

        // Game properties
        skillLevel = difficulty;
        playerScore = 0;
        computerScore = 0;
        isPlayersCrib = false;
        playersHand = [];
        computersHand = [];
        crib = [];

        // Game stats
        computerPeggingPointsTotal = 0;
        playerPeggingPointsTotal = 0;
        computerHandPointsTotal = 0;
        playerHandPointsTotal = 0;
        computerCribPointsTotal = 0;
        playerCribPointsTotal = 0;
        suboptimalPlays = [];

        // Clean up all cards and messages
        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].cardView;
            flipDownAndLowerCard(el, 0);
            slideDownCard(el);
        }
        HideAllMessages();

        scoreboard.Hide();
        scoreboard.SetOpponentName(difficulty);
        scoreboard.InitializeScore();

        AnimateSelectLowestCard();
    }

    function AnimateSelectLowestCard() {
        this.currentMoveStage = 'AnimatingSelectLowestCard';

        shuffle(cards);
        for (var i = 0; i < cards.length; i++) {
            var pos = GetDeckCardPosition();
            var cardView = cards[i].cardView;
            cardView.positionIndex = i;
            if (cardsAreVisible) {
                cardView.style.transition = "0.5s ease-in-out";
            }
            with (cardView.style) {
                left = cardsAreVisible ? pos[0] + "px" : "-150px";
                top = pos[1] + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
        }

        cardsAreVisible = true;

        setTimeout(function () {
            currentMoveStage = 'WaitingForUserToSelectLowestCard';

            var cardSpacing = 25.0;
            var pos = GetDeckCardPosition();
            visibleLowCardOptionsCount = Math.floor((window.innerWidth - pos[0] - 144) / cardSpacing);
            if (visibleLowCardOptionsCount > 52) {
                visibleLowCardOptionsCount = 52;
            }
            if (visibleLowCardOptionsCount < 15) {
                visibleLowCardOptionsCount = 15;
            }
            var cnt = 0;
            for (var i = 0; i < cards.length; i++) {
                var cardView = cards[i].cardView;
                cardView.style.transition = "1s ease-out";
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + " + cnt + "*25 + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
                if (i >= (52 - visibleLowCardOptionsCount)) {
                    cnt = cnt + 1;
                }
            }

            setTimeout(function () {
                var selectCardMessage = document.getElementById('select_low_card_message');
                selectCardMessage.positionTopFunction = "GetDeckCardPosition()[1] + 140 + 'px'";
                selectCardMessage.positionLeftFunction = "'0px'";
                selectCardMessage.style.top = eval(selectCardMessage.positionTopFunction);
                selectCardMessage.style.left = eval(selectCardMessage.positionLeftFunction);
                selectCardMessage.style.visibility = "visible";
                selectCardMessage.style.transition = "1s ease-in";
                selectCardMessage.style.opacity = 1;
            }, 800);

        }, 700);
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }

    function animateLowCardSelected(cardView) {
        currentMoveStage = 'AnimatingComputerSelectingLowestCard';
        slideRaiseAndFlipUpCard(cardView);
        setTimeout(animateComputerSelectingLowCard, 1000);
    }

    function animateComputerSelectingLowCard() {

        var selectCardMessage = document.getElementById('select_low_card_message');
        selectCardMessage.style.opacity = 0;
        setTimeout(function () { selectCardMessage.style.visibility = 'hidden'; }, 600);

        var base = 52 - visibleLowCardOptionsCount;
        var playerSelectedOffset = playerSelectedLowCardView.positionIndex - base;
        var min = base + 1;
        var max = playerSelectedLowCardView.positionIndex - 3;
        if (playerSelectedOffset / visibleLowCardOptionsCount < 0.5) {
            min = playerSelectedLowCardView.positionIndex + 4;
            max = 51;
        }
        var suitableCardFound = false;
        while (!suitableCardFound) {
            var computerSelectedIndex = Math.floor(Math.random() * (max - min + 1)) + min;
            var computerSelectedCard = cards[computerSelectedIndex];
            if (computerSelectedCard.rank != playerSelectedLowCardView.card.rank) {
                suitableCardFound = true;
                isPlayersCrib = playerSelectedLowCardView.card.rank < computerSelectedCard.rank;
                computerSelectedLowCardView = computerSelectedCard.cardView;
                slideRaiseAndFlipUpCard(computerSelectedLowCardView);
                setTimeout(ShowLowCardResult, 500);
            }
        }
    }

    function ShowLowCardResult() {
        if (playerSelectedLowCardView.positionIndex < computerSelectedLowCardView.positionIndex) {
            playerSelectedLowCardView.positionLeftFunction = "GetLeftLowCardPosition()[0] + 'px'";
            playerSelectedLowCardView.style.transition = "1s ease-in-out";
            playerSelectedLowCardView.style.left = eval(playerSelectedLowCardView.positionLeftFunction);

            computerSelectedLowCardView.positionLeftFunction = "GetRightLowCardPosition()[0] + 'px'";
            computerSelectedLowCardView.style.transition = "1s ease-in-out";
            computerSelectedLowCardView.style.left = eval(computerSelectedLowCardView.positionLeftFunction);

        } else {
            computerSelectedLowCardView.positionLeftFunction = "GetLeftLowCardPosition()[0] + 'px'";
            computerSelectedLowCardView.style.transition = "1s ease-in-out";
            computerSelectedLowCardView.style.left = eval(computerSelectedLowCardView.positionLeftFunction);

            playerSelectedLowCardView.positionLeftFunction = "GetRightLowCardPosition()[0] + 'px'";
            playerSelectedLowCardView.style.transition = "1s ease-in-out";
            playerSelectedLowCardView.style.left = eval(playerSelectedLowCardView.positionLeftFunction);
        }

        var playerCardIsOnLeft = playerSelectedLowCardView.positionIndex < computerSelectedLowCardView.positionIndex;
        var youText = document.getElementById('low_card_you_text');
        youText.positionLeftFunction = playerCardIsOnLeft ? "GetLeftLowCardPosition()[0] + 'px'" : "GetRightLowCardPosition()[0] + 'px'";
        youText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
        youText.style.transition = "none";
        youText.style.top = eval(youText.positionTopFunction);
        youText.style.left = eval(youText.positionLeftFunction);

        var oppText = document.getElementById('low_card_computer_text');
        oppText.positionLeftFunction = playerCardIsOnLeft ? "GetRightLowCardPosition()[0] + 'px'" : "GetLeftLowCardPosition()[0] + 'px'";
        oppText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
        oppText.style.transition = "none";
        oppText.style.top = eval(oppText.positionTopFunction);
        oppText.style.left = eval(oppText.positionLeftFunction);

        setTimeout(function () {
            var resultText = document.getElementById('low_card_result_text');
            if (isPlayersCrib) {
                resultText.innerHTML = "You drew the lower card!<br>You get the first crib.";
            } else {
                resultText.innerHTML = "Opponent drew the lower card.<br>They get the first crib.";
            }
            var resultMessage = document.getElementById('low_card_result_message');
            resultMessage.positionTopFunction = "GetDeckCardPosition()[1] + 110 + 'px'";
            resultMessage.positionLeftFunction = "'0px'";
            resultMessage.style.top = eval(resultMessage.positionTopFunction);
            resultMessage.style.left = eval(resultMessage.positionLeftFunction);
            resultMessage.style.transition = "0.6s ease-in";
            resultMessage.style.visibility = "visible";
            resultMessage.style.opacity = 1;

            var playerCardIsOnLeft = playerSelectedLowCardView.positionIndex < computerSelectedLowCardView.positionIndex;
            var youText = document.getElementById('low_card_you_text');
            youText.positionLeftFunction = playerCardIsOnLeft ? "GetLeftLowCardPosition()[0] + 'px'" : "GetRightLowCardPosition()[0] + 'px'";
            youText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
            youText.style.transition = "none";
            youText.style.top = eval(youText.positionTopFunction);
            youText.style.left = eval(youText.positionLeftFunction);
            youText.style.visibility = "visible";
            youText.style.transition = "1s ease-in-out";
            youText.style.opacity = 1;

            var oppText = document.getElementById('low_card_computer_text');
            oppText.positionLeftFunction = playerCardIsOnLeft ? "GetRightLowCardPosition()[0] + 'px'" : "GetLeftLowCardPosition()[0] + 'px'";
            oppText.positionTopFunction = "GetLeftLowCardPosition()[1] - 140 + 'px'";
            oppText.style.transition = "none";
            oppText.style.top = eval(oppText.positionTopFunction);
            oppText.style.left = eval(oppText.positionLeftFunction);
            oppText.style.visibility = "visible";
            oppText.style.transition = "1s ease-in-out";
            oppText.style.opacity = 1;

        }, 800);

        setTimeout(function () {
            var pos = GetDeckCardPosition();
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].id == computerSelectedLowCardView.card.id || cards[i].id == playerSelectedLowCardView.card.id) {
                    continue;
                }
                var cardView = cards[i].cardView;
                cardView.style.transition = "0.4s ease-out";
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
            }
        }, 100);
    }

    this.lowCardAcceptClick = function lowCardAcceptClick() {

        // Hide all messages 
        var viewsToHide = [
            'low_card_result_message',
            'low_card_you_text',
            'low_card_computer_text'];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "0.4s ease-out";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }

        flipDownAndLowerCard(playerSelectedLowCardView, 500);
        playerSelectedLowCardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
        playerSelectedLowCardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        with (playerSelectedLowCardView.style) {
            transition = "1s ease-in-out";
            left = eval(playerSelectedLowCardView.positionLeftFunction);
            top = eval(playerSelectedLowCardView.positionTopFunction);
        }

        flipDownAndLowerCard(computerSelectedLowCardView, 500);
        computerSelectedLowCardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
        computerSelectedLowCardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        with (computerSelectedLowCardView.style) {
            transition = "1s ease-in-out";
            left = eval(computerSelectedLowCardView.positionLeftFunction);
            top = eval(computerSelectedLowCardView.positionTopFunction);
        }

        scoreboard.SetCribIndicator(isPlayersCrib);
        scoreboard.Show();

        setTimeout(AnimateDealingHands, 1000);
    }

    function AnimateDealingHands() {
        currentMoveStage = 'AnimatingDealingHands';

        shuffle(cards);
        for (var i = 0; i < cards.length; i++) {
            var pos = GetDeckCardPosition();
            var cardView = cards[i].cardView;
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                left = pos[0] + "px";
                top = pos[1] + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
        }

        deckTopIndex = cards.length - 1;
        playersHand = [];
        computersHand = [];
        crib = [];
        for (var i = 0; i < 6; i++) {
            playersHand.push(cards[deckTopIndex]);
            deckTopIndex = deckTopIndex - 1;
            computersHand.push(cards[deckTopIndex]);
            deckTopIndex = deckTopIndex - 1;
        }

        // Sort the players hand
        playersHand.sort(function (a, b) { return a.rank - b.rank; });

        // Deal the player cards
        mostRecentHandCards = [];
        mostRecentIsPlayersCrib = isPlayersCrib;
        for (var i = 0; i < 6; i++) {
            var cardView = playersHand[i].cardView;
            cardView.style.zIndex = i + 100;
            mostRecentHandCards.push(playersHand[i]);
        }
        
        setTimeout(function () {
            for (var i = 0; i < 6; i++) {
                var cardView = playersHand[i].cardView;
                cardView.positionLeftFunction = "GetHandCardPosition(true, true, " + i + ")[0] + 'px'";
                cardView.positionTopFunction = "GetHandCardPosition(true, true, " + i + ")[1] + 'px'";
                cardView.positionIndex = i;
                cardView.isClickable = true;
                cardView.style.zIndex = i + 100;
                with (cardView.style) {
                    transition = "0.5s ease-out";
                    transitionDelay = i * 150 + 'ms';
                    left = eval(cardView.positionLeftFunction);
                    top = eval(cardView.positionTopFunction);
                };
                setTimeout(flipUpCard, i * 60 + 800, cardView);
            }
        }, 50)

        // Deal the computer cards
        for (var i = 0; i < 6; i++) {
            var cardView = computersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(false, true, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(false, true, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "0.5s ease-out";
                transitionDelay = i * 150 + 'ms';
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i;
            };
        }

        // Show the crib discard region
        var discardRegion = document.getElementById('crib_region');
        discardRegion.style.transition = "none";
        discardRegion.positionLeftFunction = "GetDiscardRegionPosition()[0] + 'px'";
        discardRegion.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
        discardRegion.style.left = eval(discardRegion.positionLeftFunction);
        discardRegion.style.top = eval(discardRegion.positionTopFunction);
        var discardText = document.getElementById('crib_region_center_text');
        discardText.innerText = isPlayersCrib ? "Your Crib" : "Opponent's Crib";
        setTimeout(function () {
            var discardRegion = document.getElementById('crib_region');
            discardRegion.style.transition = "1s linear";
            discardRegion.style.visibility = "visible";
            discardRegion.style.opacity = 1;
        }, 1400);

        if (skillLevel === 'Easy' || GetSetting('setting_hints')) {
            setTimeout(function () {
                ShowHintButton();
            }, 1400);
        }

        currentMoveStage = 'WaitingForUserToDiscardToCrib';
    }

    function hideCribConfirmationButton() {
        var confirmCribRegion = document.getElementById('confirm_crib_region');
        with (confirmCribRegion.style) {
            transition = "0.5s linear";
            opacity = 0;
            pointerEvents = "none";
        }
    }

    function preCribCardPointerPressed(cardView) {

        // Find the autoplay line for dropped cards
        autoPlayBoundaryY = GetHandCardPosition(true, true, currentDraggedCardView.positionIndex)[1] - cardLoweredHeight * 0.4;

        var cribPositionIndex = crib.indexOf(cardView.card);
        if (cribPositionIndex > -1) {
            currentPreCribDraggedCardWasLastInTheCrib = true;

            cardView.style.zIndex = 200;

            if (playersHand[cardView.positionIndex] != null) {
                var newIndex = 0;
                while (playersHand[newIndex] != null) {
                    newIndex++;
                }
                cardView.positionIndex = newIndex;
            }
            crib.splice(cribPositionIndex, 1);
            playersHand[cardView.positionIndex] = cardView.card;

            if (crib.length == 1) {
                var remainingCardView = crib[0].cardView;
                remainingCardView.positionLeftFunction = "GetDiscardRegionPosition()[0] - " + cribDiscardSpacing + " + 'px'";
                remainingCardView.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
                with (remainingCardView.style) {
                    transition = "0.1s ease-out";
                    left = eval(remainingCardView.positionLeftFunction);
                    top = eval(remainingCardView.positionTopFunction);
                    zIndex = crib.length;
                }
            }

            if (crib.length != 2) {
                hideCribConfirmationButton();
            }

        } else {
            currentPreCribDraggedCardWasLastInTheCrib = false;

            if (currentPlayerHandCardSpacing >= 0) {
                cardView.style.zIndex = 200;
            }
        }

        raiseCard(currentDraggedCardView);
    }

    function preCribCardPointerMoved() {
        // Check if we need to reorder the cards
        if (currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
            var curIndex = GetCardIndexFromPosition(true, currentDraggedCardView);
            if (curIndex != currentDraggedCardView.positionIndex) {
                var incrementing = curIndex < currentDraggedCardView.positionIndex;
                var displacedCard = playersHand[curIndex];
                playersHand[currentDraggedCardView.positionIndex] = null;
                currentDraggedCardView.positionIndex = curIndex;
                playersHand[curIndex] = currentDraggedCardView.card;
                var firstDisplacement = true;
                while (displacedCard != null) {
                    if (incrementing) {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex + 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex + 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(true, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(true, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(true, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    } else {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex - 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex - 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(true, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(true, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(true, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    }
                    firstDisplacement = false;
                }
            }
        }
    }

    function preCribCardPointerFinished() {
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;
        if (currentPreCribDraggedCardWasLastInTheCrib) {
            if (tapped || (currentDraggedCardView.offsetTop > GetDeckCardPosition()[1] + cardLoweredHeight * 0.4)) {
                returnCardViewToHandPosition(true, currentDraggedCardView);
            } else {
                dropCardViewInCrib(currentDraggedCardView);
            }
        } else {
            if (tapped || currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
                dropCardViewInCrib(currentDraggedCardView);
            } else {
                returnCardViewToHandPosition(true, currentDraggedCardView);
            }
        }

        lowerCard(currentDraggedCardView);
    }

    function returnCardViewToHandPosition(isPreCrib, cardView) {
        cardView.positionLeftFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[0] + 'px'";
        cardView.positionTopFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[1] + 'px'";
        with (cardView.style) {
            transition = "0.25s ease-out";
            left = eval(cardView.positionLeftFunction);
            top = eval(cardView.positionTopFunction);
            zIndex = cardView.positionIndex + 100;
        };
    }

    function slideCardToHandPositionWithOverlap(isPreCrib, isIncrementing, cardView, curIndex) {
        cardView.positionLeftFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[0] + 'px'";
        cardView.positionTopFunction = "GetHandCardPosition(true, " + isPreCrib + ", " + cardView.positionIndex + ")[1] + 'px'";
        with (cardView.style) {
            transition = "0.07s ease-out";
            left = isIncrementing ? cardView.offsetLeft + cardLoweredWidth * 1.5 + "px" : cardView.offsetLeft + cardLoweredWidth * 1.0 + "px";
            zIndex = isIncrementing ? cardView.positionIndex + 100 - 1 : cardView.positionIndex + 100 - 1;
        };
        setTimeout(function () {
            currentDraggedCardView.style.zIndex = 100 + curIndex;
            with (cardView.style) {
                transition = "0.09s ease-out";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = cardView.positionIndex + 100;
            };
        }, 70);
    }

    function dropCardViewInCrib(cardView) {

        var position = GetDiscardRegionPosition();
        var leftOffset = -cribDiscardSpacing;
        if (crib.length == 1) {
            leftOffset = cribDiscardSpacing;
        } else if (crib.length == 2) {
            returnCardViewToHandPosition(true, cardView);
            return;
        }

        crib.push(cardView.card);
        playersHand[cardView.positionIndex] = null;
        cardView.positionLeftFunction = "GetDiscardRegionPosition()[0] + " + leftOffset + " + 'px'";
        cardView.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
        with (cardView.style) {
            transition = "0.25s ease-out";
            left = eval(cardView.positionLeftFunction);
            top = eval(cardView.positionTopFunction);
            zIndex = crib.length;
        }

        if (crib.length == 2) {
            // Show the submit button
            var confirmCribRegion = document.getElementById('confirm_crib_region');
            confirmCribRegion.positionLeftFunction = "GetCribConfirmRegionPosition()[0] + 'px'";
            confirmCribRegion.positionTopFunction = "GetCribConfirmRegionPosition()[1] + 'px'";
            confirmCribRegion.style.transition = "none";
            confirmCribRegion.style.left = eval(confirmCribRegion.positionLeftFunction);
            confirmCribRegion.style.top = eval(confirmCribRegion.positionTopFunction);
            confirmCribRegion.style.visibility = "visible";
            with (confirmCribRegion.style) {
                transition = "0.5s linear";
                opacity = 1;
                pointerEvents = "auto";
            }
        }
    }

    this.cribCardsConfirmed = function () {
        if (currentMoveStage == 'WaitingForUserToDiscardToCrib' && crib.length == 2) {
            // Check if this is the optimal discards
            var trialCards = [];
            var allCards = [];
            for (var i = 0; i < playersHand.length; i++) {
                if (playersHand[i] !== null) {
                    trialCards.push(playersHand[i]);
                    allCards.push(playersHand[i]);
                }
            }
            for (var i = 0; i < crib.length; i++) {
                allCards.push(crib[i]);
            }
            var scoreStats = computerPlayer.GetScoreStatsForPossibleDiscards(trialCards, crib, isPlayersCrib);
            var optimalStats = computerPlayer.FindOptimalCribDiscards(allCards, isPlayersCrib);
            if (scoreStats[1] < optimalStats[1]) {
                var suboptimalPlay = {};
                suboptimalPlay.isDiscard = true;
                suboptimalPlay.isPlayersCrib = isPlayersCrib;
                suboptimalPlay.playedScore = scoreStats[1];
                suboptimalPlay.optimalScore = optimalStats[1];
                suboptimalPlay.playedCards = [];
                suboptimalPlay.playedCards.push(crib[0]);
                suboptimalPlay.playedCards.push(crib[1]);
                suboptimalPlay.situationCards = [];
                suboptimalPlay.situationCards.push(crib[0]);
                suboptimalPlay.situationCards.push(crib[1]);
                for (var i = 0; i < playersHand.length; i++) {
                    if (playersHand[i] !== null) {
                        suboptimalPlay.situationCards.push(playersHand[i]);
                    }
                }
                suboptimalPlay.optimalCards = [];
                suboptimalPlay.optimalCards.push(optimalStats[0][0]);
                suboptimalPlay.optimalCards.push(optimalStats[0][1]);


                if (GetSetting('setting_warn_suboptimal')) {
                    ShowSuboptimalWarning(suboptimalPlay);
                    return;
                } else {
                    suboptimalPlays.push(suboptimalPlay);
                }
            }
            finishCribConfirmation();
        }
    }

    var currentSuboptimalPlay;

    function ShowSuboptimalWarning(suboptimalPlay) {
        currentSuboptimalPlay = suboptimalPlay;

        if (currentSuboptimalPlay.isDiscard) {
            currentMoveStage = "ShowingDiscardWarning";
        } else {
            currentMoveStage = "ShowingPeggingWarning";
        }

        var suboptimalWarningTitle = document.getElementById('SuboptimalWarningTitle');
        var suboptimalWarningText = document.getElementById('SuboptimalWarningText');
        var suboptimalShowAllButton = document.getElementById('SuboptimalWarningShowAllScoresButton');
        var suboptimalPlayAnywaysButton = document.getElementById('SuboptimalWarningPlayAnywaysButton');
        if (suboptimalPlay.isDiscard) {
            suboptimalShowAllButton.style.display = 'inline';
            suboptimalPlayAnywaysButton.innerText = "Play these cards anyways";
            suboptimalWarningTitle.innerHTML = "That is not the<br>optimal discard";
            suboptimalWarningText.innerHTML = "Your discards will result in an average round score of " + parseFloat(suboptimalPlay.playedScore).toFixed(1) + "<br><br>A better play exists that would result in an average score of " + parseFloat(suboptimalPlay.optimalScore).toFixed(1);
        } else {
            suboptimalShowAllButton.style.display = 'none';
            suboptimalPlayAnywaysButton.innerText = "Play this card anyways";
            suboptimalWarningTitle.innerHTML = "That is not the<br>optimal play";
            suboptimalWarningText.innerHTML = "Your card will result in a score of " + suboptimalPlay.playedScore + "<br><br>A better play exists that would result in a score of " + suboptimalPlay.optimalScore;
        }
        var suboptimalWarning = document.getElementById('SuboptimalWarning');
        suboptimalWarning.style.opacity = 0;
        suboptimalWarning.style.visibility = 'visible';
        suboptimalWarning.style.transition = "0.2s linear";
        suboptimalWarning.style.opacity = 1;
        visibleMenuCards.push('SuboptimalWarning');
    }

    function HideSuboptimalWarning() {
        if (currentSuboptimalPlay.isDiscard) {
            currentMoveStage = "WaitingForUserToDiscardToCrib";
        } else {
            currentMoveStage = "WaitingForUserToPlayPeggingCard";
        }

        visibleMenuCards = [];
        var suboptimalWarning = document.getElementById('SuboptimalWarning');
        suboptimalWarning.style.transition = "0.15s linear";
        suboptimalWarning.style.opacity = 0;
        setTimeout(function () {
            suboptimalWarning.style.visibility = 'hidden';
        }, 200);
    }

    this.SuboptimalWarningTryAgainClick = function () {
        HideSuboptimalWarning();
        if (!currentSuboptimalPlay.isDiscard) {
            returnCardViewToHandPosition(false, currentSuboptimalPlay.playedCards[0].cardView);
        }
    }

    this.SuboptimalWarningShowAllScoresClick = function () {
        ShowAllPlaysForSuboptimalPlay(currentSuboptimalPlay);
    }

    this.SuboptimalWarningHintClick = function () {
        HideSuboptimalWarning();
        if (!currentSuboptimalPlay.isDiscard) {
            returnCardViewToHandPosition(false, currentSuboptimalPlay.playedCards[0].cardView);
        }
        setTimeout(function () {
            BumpHintCards();
        }, 300);
    }

    this.SuboptimalWarningPlayAnywaysClick = function () {
        HideSuboptimalWarning();
        suboptimalPlays.push(currentSuboptimalPlay);
        if (currentSuboptimalPlay.isDiscard) {
            setTimeout(function () {
                finishCribConfirmation();
            }, 200);
        } else {
            setTimeout(function () {
                FinishPeggingPlay(currentDraggedCardView);
            }, 200);
        }
    }

    function finishCribConfirmation() {
        currentMoveStage = 'AnimatingComputerDiscardingToCrib';
        hideCribConfirmationButton();
        HideHintButton();

        // Remove the null cards from the player hand
        for (var i = 0; i < playersHand.length; i++) {
            if (playersHand[i] == undefined) {
                playersHand.splice(i, 1);
                i--;
            }
        }

        AnimateComputerDiscardingToCrib();
    }

    function AnimateComputerDiscardingToCrib() {
        // Hide the crib region
        var view = document.getElementById('crib_region');
        view.style.transition = "0.4s linear";
        view.style.transitionDelay = "0.5s";
        view.style.opacity = 0;

        // Flip over the cards
        crib[0].cardView.isClickable = false;
        crib[1].cardView.isClickable = false;
        flipDownCard(crib[0].cardView);
        flipDownCard(crib[1].cardView);

        // Play the computer cards
        var computerDiscards = computerPlayer.SelectTwoCardsToDiscardInCrib(skillLevel, !isPlayersCrib, computersHand);
        var index = computersHand.indexOf(computerDiscards[0]);
        computersHand.splice(index, 1);
        index = computersHand.indexOf(computerDiscards[1]);
        computersHand.splice(index, 1);
        for (var i = 0; i < computerDiscards.length; i++) {
            crib.push(computerDiscards[i]);
            computerDiscards[i].cardView.positionLeftFunction = "GetDiscardRegionPosition()[0] + 'px'";
            computerDiscards[i].cardView.positionTopFunction = "GetDiscardRegionPosition()[1] + 'px'";
            with (computerDiscards[i].cardView.style) {
                transition = "0.25s ease-out";
                transitionDelay = 600 + i * 200 + "ms";
                left = eval(computerDiscards[i].cardView.positionLeftFunction);
                top = eval(computerDiscards[i].cardView.positionTopFunction);
            }
        }

        // Slide the crib cards to the side
        setTimeout(function () {
            var waitingPosition = GetCribWaitingPosition();
            for (var i = 0; i < crib.length; i++) {
                crib[i].cardView.positionLeftFunction = "GetCribWaitingPosition()[0] + 'px'";
                crib[i].cardView.positionTopFunction = "GetCribWaitingPosition()[1] + 'px'";
                with (crib[i].cardView.style) {
                    transition = "0.5s ease-out";
                    left = waitingPosition[0] + "px";
                }
            }
            setTimeout(function () {
                for (var i = 0; i < crib.length; i++) {
                    with (crib[i].cardView.style) {
                        top = waitingPosition[1] + "px";
                    }
                }
            }, 550);
        }, 1200);

        // Reposition the players hand cards
        for (var i = 0; i < playersHand.length; i++) {
            var cardView = playersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "0.5s ease-out";
                transitionDelay = "0.8s";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i + 100;
            };
        }

        // Reposition the computers hand cards
        for (var i = 0; i < computersHand.length; i++) {
            var cardView = computersHand[i].cardView;
            cardView.positionLeftFunction = "GetHandCardPosition(false, false, " + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetHandCardPosition(false, false, " + i + ")[1] + 'px'";
            cardView.positionIndex = i;
            with (cardView.style) {
                transition = "0.5s ease-out";
                transitionDelay = "0.8s";
                left = eval(cardView.positionLeftFunction);
                top = eval(cardView.positionTopFunction);
                zIndex = i + 100;
            };
        }

        // Put the crib region indicator overlay on the crib cards
        var cribOverlayText = document.getElementById('crib_indicator_card_overlap_text');
        cribOverlayText.innerHTML = isPlayersCrib ? "Your" : "Opponent's";
        var cribOverlay = document.getElementById('crib_indicator_card_overlap');
        cribOverlay.style.zIndex = 6;
        cribOverlay.positionLeftFunction = "GetCribWaitingPosition()[0] + 'px'";
        cribOverlay.positionTopFunction = "GetCribWaitingPosition()[1] + 'px'";
        cribOverlay.style.visibility = "visible";
        cribOverlay.style.transition = "none";
        cribOverlay.style.left = eval(cribOverlay.positionLeftFunction);
        cribOverlay.style.top = eval(cribOverlay.positionTopFunction);
        setTimeout(function () {
            with (cribOverlay.style) {
                transition = "0.5s linear";
                opacity = 1;
            }
        }, 2400);

        setTimeout(InitializePeggingRound, 1800);
    }

    function InitializePeggingRound() {
        recordPlayerPeggingStartingScore = playerScore;
        recordComputerPeggingStartingScore = computerScore;
        currentPeggingCards = [];
        deadPeggingCards = [];
        computerPlayedPeggingCards = [];
        playerPlayedPeggingCards = [];
        isPlayersTurnToPeg = false;
        playerSaysGo = false;
        computerSaysGo = false;
        currentPeggingCount = 0;

        // Flip the top card on the deck
        topCard = cards[deckTopIndex];
        topCard.cardView.style.zIndex = 60;
        flipUpCard(topCard.cardView);
        topCard.cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 10 + 'px'";
        topCard.cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        with (topCard.cardView.style) {
            transition = "0.3s ease-in-out"
            left = eval(topCard.cardView.positionLeftFunction);
            top = eval(topCard.cardView.positionTopFunction);
        }

        var pointsShowDelay = 0;
        if (topCard.rank == 11) {
            // This is a jack, reward the dealer 2 points
            if (isPlayersCrib) {
                playerScore = playerScore + 2;
                setTimeout(function () {
                    scoreboard.SetScorePlayer(playerScore);
                }, bubbleScoreVisibleDuration);
            } else {
                computerScore = computerScore + 2;
                setTimeout(function () {
                    scoreboard.SetScoreOpp(computerScore);
                }, bubbleScoreVisibleDuration);
            }
            var bubblePosition = GetDeckCardPosition();
            AnimateScoreBubble([bubblePosition[0] + 10, bubblePosition[1]], 2, 'Nibs for', isPlayersCrib, 800);
            pointsShowDelay = bubbleScoreVisibleDuration;

            if (isGameOver()) {
                AnimateGameFinished();
                return;
            }
        }

        // Show pegging count indicator
        peggingCountText = document.getElementById('PeggingCountIndicatorScore');
        peggingCountText.innerText = 0;
        peggingCountIndicator = document.getElementById('PeggingCountIndicator');
        peggingCountIndicator.style.transition = "none";
        peggingCountIndicator.style.zIndex = 100;
        peggingCountIndicator.positionLeftFunction = "GetDeckCardPosition()[0] - 115*0.5 + 10 + 'px'";
        peggingCountIndicator.positionTopFunction = "GetDeckCardPosition()[1] - 75*0.5 + 'px'";
        peggingCountIndicator.style.top = eval(peggingCountIndicator.positionTopFunction);
        peggingCountIndicator.style.left = eval(peggingCountIndicator.positionLeftFunction);
        peggingCountIndicator.style.opacity = 0;
        peggingCountIndicator.style.visibility = "visible";
        setTimeout(function () {
            peggingCountIndicator.style.transition = "0.3s linear";
            peggingCountIndicator.style.opacity = 1;
        }, 900 + pointsShowDelay);

        if (isPlayersCrib) {
            setTimeout(function () {
                PlayNextPeggingCardForComputer();
                setTimeout(function () {
                    if (skillLevel === 'Easy' || GetSetting('setting_hints')) {
                        ShowHintButton();
                    }
                    ShowPeggingPrompt("2s");
                    currentMoveStage = 'WaitingForUserToPlayPeggingCard';
                }, 500);
            }, pointsShowDelay + 700);
        } else {
            if (skillLevel === 'Easy' || GetSetting('setting_hints')) {
                ShowHintButton();
            }
            ShowPeggingPrompt("1.7s");
            currentMoveStage = 'WaitingForUserToPlayPeggingCard';
        }
    }

    function SetPeggingCountAnimated(count, delay) {
        setTimeout(function () {
            peggingCountText.style.transition = "0.15s linear";
            peggingCountText.style.opacity = 0;
            setTimeout(function () {
                peggingCountText.style.transition = "0.25s linear";
                peggingCountText.innerText = count;
                peggingCountText.style.opacity = 1;
            }, 100);
        }, delay);
    }

    function ShowPeggingPrompt(delay) {
        isPlayersTurnToPeg = true;
        var peggingPrompt = document.getElementById('pegging_prompt');
        peggingPrompt.style.transition = "none";
        peggingPrompt.positionLeftFunction = "GetPeggingPromptPosition()[0] + 'px'";
        peggingPrompt.positionTopFunction = "GetPeggingPromptPosition()[1] + 'px'";
        peggingPrompt.style.left = eval(peggingPrompt.positionLeftFunction);
        peggingPrompt.style.top = eval(peggingPrompt.positionTopFunction);
        setTimeout(function () {
            peggingPrompt.style.visibility = "visible";
            peggingPrompt.style.transition = "0.3s";
            peggingPrompt.style.transitionDelay = delay;
            peggingPrompt.style.opacity = 1;
        }, 50);
    }

    function HidePeggingPrompt() {
        HideHintButton();
        isPlayersTurnToPeg = false;
        var peggingPrompt = document.getElementById('pegging_prompt');
        peggingPrompt.style.transition = "0.3s";
        peggingPrompt.style.opacity = 0;
    }

    function peggingCardPointerPressed(cardView) {

        // Find the autoplay line for dropped cards
        autoPlayBoundaryY = GetHandCardPosition(true, false, currentDraggedCardView.positionIndex)[1] - cardLoweredHeight * 0.4;

        if (currentPlayerHandCardSpacing >= 0) {
            cardView.style.zIndex = 200;
        }

        raiseCard(currentDraggedCardView);
    }

    function peggingCardPointerMoved() {
        // Check if we need to reorder the cards
        if (currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
            var curIndex = GetCardIndexFromPosition(false, currentDraggedCardView);
            if (curIndex != currentDraggedCardView.positionIndex) {
                var incrementing = curIndex < currentDraggedCardView.positionIndex;
                var displacedCard = playersHand[curIndex];
                playersHand[currentDraggedCardView.positionIndex] = null;
                currentDraggedCardView.positionIndex = curIndex;
                playersHand[curIndex] = currentDraggedCardView.card;
                var firstDisplacement = true;
                while (displacedCard != null) {
                    if (incrementing) {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex + 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex + 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(false, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(false, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(false, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    } else {
                        var tempCard = playersHand[displacedCard.cardView.positionIndex - 1];
                        displacedCard.cardView.positionIndex = displacedCard.cardView.positionIndex - 1;
                        playersHand[displacedCard.cardView.positionIndex] = displacedCard;
                        if (currentPlayerHandCardSpacing < 0) {
                            if (firstDisplacement) {
                                slideCardToHandPositionWithOverlap(false, incrementing, displacedCard.cardView, curIndex);
                            } else {
                                returnCardViewToHandPosition(false, displacedCard.cardView);
                            }
                        } else {
                            returnCardViewToHandPosition(false, displacedCard.cardView);
                        }
                        displacedCard = tempCard;
                    }
                    firstDisplacement = false;
                }
            }
        }
    }

    function peggingCardPointerFinished() {
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;

        lowerCard(currentDraggedCardView);

        if (tapped || currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
            if (isPlayersTurnToPeg) {
                // Check if this play is allowed
                if (currentDraggedCardView.card.value + currentPeggingCount <= 31) {

                    // Check if this play is suboptimal and pause if warning is on
                    var optimalStats = computerPlayer.FindOptimalPeggingCard(playersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
                    var testPeggingCards = [];
                    testPeggingCards = testPeggingCards.concat(currentPeggingCards);
                    testPeggingCards.push(currentDraggedCardView.card);
                    var testPoints = Game.GetPeggingPointsForCards(testPeggingCards);
                    var curPlayScore = 0;
                    for (var i = 0; i < testPoints.length; i++) {
                        curPlayScore = curPlayScore + testPoints[i].points;
                    }

                    if (curPlayScore < optimalStats[1]) {
                        var suboptimalPlay = {};
                        suboptimalPlay.isDiscard = false;
                        suboptimalPlay.isPlayersCrib = isPlayersCrib;
                        suboptimalPlay.playedScore = curPlayScore;
                        suboptimalPlay.optimalScore = optimalStats[1];
                        suboptimalPlay.playedCards = [];
                        suboptimalPlay.playedCards.push(currentDraggedCardView.card);
                        suboptimalPlay.situationCards = [];
                        for (var i = 0; i < currentPeggingCards.length; i++) {
                            suboptimalPlay.situationCards.push(currentPeggingCards[i]);
                        }
                        suboptimalPlay.optimalCards = [];
                        suboptimalPlay.optimalCards.push(optimalStats[0]);

                        if (GetSetting('setting_warn_suboptimal')) {
                            ShowSuboptimalWarning(suboptimalPlay);
                            return;
                        } else {
                            suboptimalPlays.push(suboptimalPlay);
                        }
                    }

                    FinishPeggingPlay(currentDraggedCardView);
                    return;
                }
            }
        }

        returnCardViewToHandPosition(false, currentDraggedCardView);
    }

    function FinishPeggingPlay(cardView) {
        HidePeggingPrompt();
        cardView.isClickable = false;

        // Drop card into peg pile
        playersHand[playersHand.indexOf(cardView.card)] = null;
        currentPeggingCards.push(cardView.card);
        playerPlayedPeggingCards.push(cardView.card);
        AnimateCardViewToPeggingPile(cardView, true);

        var cardAnimationDelay = 500;
        var peggingPoints = GetPeggingPointsLastPlay();
        var totalPoints = 0;
        for (var i = 0; i < peggingPoints.length; i++) {
            var position = GetPeggingFirstCardPosition();
            var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
            var top = position[1];
            var scoringPoints = peggingPoints[i];
            totalPoints = totalPoints + scoringPoints.points;
            AnimateScoreBubble([left, top], scoringPoints.points, scoringPoints.description, true, i * bubbleScoreVisibleDuration + cardAnimationDelay);
        }

        setTimeout(function () {
            // Update the score
            if (totalPoints > 0) {
                playerScore = playerScore + totalPoints;
                scoreboard.SetScorePlayer(playerScore);
            }
        }, peggingPoints.length * bubbleScoreVisibleDuration + cardAnimationDelay);

        setTimeout(function () {

            // Continue after scores registered
            if (isGameOver()) {
                UpdatePeggingAverageRecord();
                AnimateGameFinished();
                return;
            }

            if (currentPeggingCards.length + deadPeggingCards.length == 8) {
                // Pegging Finished
                var finalCardPointDelay = 500;
                if (currentPeggingCount != 31) {
                    // Award point for last card
                    finalCardPointDelay = finalCardPointDelay + bubbleScoreVisibleDuration;
                    var position = GetPeggingFirstCardPosition();
                    var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                    var top = position[1];
                    AnimateScoreBubble([left, top], 1, "Last card", true, 0);
                    playerScore = playerScore + 1;
                    setTimeout(function () {
                        scoreboard.SetScorePlayer(playerScore);
                    }, bubbleScoreVisibleDuration);

                    if (isGameOver()) {
                        UpdatePeggingAverageRecord();
                        AnimateGameFinished();
                        return;
                    }
                }

                setTimeout(function () {
                    OnPeggingFinished();
                }, finalCardPointDelay);
                return;
            }

            if (currentPeggingCount == 31) {
                OnResetPeggingCount();
            }

            var delay = 500;
            if (computerSaysGo) {
                delay = 0;
            }
            setTimeout(function () {
                MakeMoveForComputer();
            }, delay);

        }, peggingPoints.length * bubbleScoreVisibleDuration + cardAnimationDelay);
    }

    function MakeMoveForComputer() {
        var computerPlay = PlayNextPeggingCardForComputer();
        if (computerPlay === undefined) {
            // This is a go
            if (playerSaysGo) {
                if (currentPeggingCount != 31) {
                    // Give the computer a point for last card
                    var position = GetPeggingFirstCardPosition();
                    var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                    var top = position[1];
                    AnimateScoreBubble([left, top], 1, "Last card", false, 0);
                    computerScore = computerScore + 1;
                    setTimeout(function () {
                        scoreboard.SetScoreOpp(computerScore);
                        if (isGameOver()) {
                            UpdatePeggingAverageRecord();
                            AnimateGameFinished();
                            return;
                        }
                        OnResetPeggingCount();
                        ShowTheUserToPlayOrSayGo();
                    }, bubbleScoreVisibleDuration);
                    return;
                }
                OnResetPeggingCount();
            } else {
                ShowMessageThatComputerSaysGo();
            }

            setTimeout(ShowTheUserToPlayOrSayGo, 300);

        } else {
            var peggingPoints = GetPeggingPointsLastPlay();
            var totalPoints = 0;
            var cardAnimationDelay = 500;
            for (var i = 0; i < peggingPoints.length; i++) {
                var position = GetPeggingFirstCardPosition();
                var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                var top = position[1];
                var scoringPoints = peggingPoints[i];
                totalPoints = totalPoints + scoringPoints.points;
                AnimateScoreBubble([left, top], scoringPoints.points, scoringPoints.description, false, i * bubbleScoreVisibleDuration + cardAnimationDelay);
            }
            
            var pointsDelay = peggingPoints.length*bubbleScoreVisibleDuration;
            setTimeout(function () {
                // Update the score
                if (totalPoints > 0) {
                    computerScore = computerScore + totalPoints;
                    scoreboard.SetScoreOpp(computerScore);
                }
            
                // Continue after scores registered
                if (isGameOver()) {
                    UpdatePeggingAverageRecord();
                    AnimateGameFinished();
                    return;
                }

                if (currentPeggingCards.length + deadPeggingCards.length == 8) {
                    // Pegging Finished
                    var finalCardPointDelay = 500;
                    if (currentPeggingCount != 31) {
                        // Award point for last card
                        finalCardPointDelay = finalCardPointDelay + bubbleScoreVisibleDuration;
                        var position = GetPeggingFirstCardPosition();
                        var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
                        var top = position[1];
                        AnimateScoreBubble([left, top], 1, "Last card", false, 0);
                        computerScore = computerScore + 1;
                        setTimeout(function () {
                            scoreboard.SetScoreOpp(computerScore);
                        }, bubbleScoreVisibleDuration);

                        if (isGameOver()) {
                            UpdatePeggingAverageRecord();
                            AnimateGameFinished();
                            return;
                        }
                    }

                    setTimeout(function () {
                        OnPeggingFinished();
                    }, finalCardPointDelay);
                    return;
                }

                if (currentPeggingCount == 31) {
                    OnResetPeggingCount();
                }

                ShowTheUserToPlayOrSayGo();

            }, pointsDelay + cardAnimationDelay);
        }
    }

    function ShowTheUserToPlayOrSayGo() {
        for (var i = 0; i < playersHand.length; i++) {
            if (playersHand[i] !== null && playersHand[i].value + currentPeggingCount <= 31) {
                // There is at least one valid play
                if (skillLevel === 'Easy' || GetSetting('setting_hints')) {
                    ShowHintButton();
                }
                ShowPeggingPrompt("2s");
                return;
            }
        }

        HidePeggingPrompt();
        ShowMessageUserMustSayGo();
    }

    function ShowMessageUserMustSayGo() {
        var playerSaysGoMessage = document.getElementById('player_says_go');
        playerSaysGoMessage.style.transition = "none";
        playerSaysGoMessage.style.opacity = 0;
        playerSaysGoMessage.positionLeftFunction = "window.innerWidth*0.5 - 115*0.5 + 'px'";
        playerSaysGoMessage.positionTopFunction = "GetHandCardPosition(true, false, 2)[1] - 65*0.5 + 'px'";
        playerSaysGoMessage.style.left = eval(playerSaysGoMessage.positionLeftFunction);
        playerSaysGoMessage.style.top = eval(playerSaysGoMessage.positionTopFunction);
        playerSaysGoMessage.style.visibility = "visible";

        playerSaysGoMessage.style.transition = "0.2s linear";
        playerSaysGoMessage.style.opacity = 1;
    }

    function HideMessageUserMustSayGo() {
        var playerSaysGoMessage = document.getElementById('player_says_go');
        playerSaysGoMessage.style.transition = "0.1s linear";
        playerSaysGoMessage.style.opacity = 0;
        playerSaysGoMessage.style.visibility = "hidden";
    }

    this.OnUserSaysGoClick = function () {
        HideMessageUserMustSayGo();
        HideMessageComputerSaysGo();
        playerSaysGo = true;
        if (computerSaysGo) {
            // Give the player a point for last card
            var position = GetPeggingFirstCardPosition();
            var left = position[0] + currentPeggingCards.length * peggingCardsOverlap;
            var top = position[1];
            AnimateScoreBubble([left, top], 1, "Last card", true, 300);
            playerScore = playerScore + 1;
            setTimeout(function () {
                scoreboard.SetScorePlayer(playerScore);
                if (isGameOver()) {
                    UpdatePeggingAverageRecord();
                    AnimateGameFinished();
                    return;
                }
                OnResetPeggingCount();
                setTimeout(function () {
                    MakeMoveForComputer();
                }, 500);
            }, 200 + bubbleScoreVisibleDuration);
            return;
        }

        setTimeout(function () {
            MakeMoveForComputer();
        }, 50);
    }

    function ShowMessageThatComputerSaysGo() {
        computerSaysGo = true;
        var computerSaysGoMessage = document.getElementById('computer_says_go');
        computerSaysGoMessage.style.transition = "none";
        computerSaysGoMessage.style.opacity = 0;
        computerSaysGoMessage.positionLeftFunction = "window.innerWidth*0.5 - 115*0.5 + 'px'";
        computerSaysGoMessage.positionTopFunction = "GetHandCardPosition(false, false, 2)[1] + 15 + 'px'";
        computerSaysGoMessage.style.left = eval(computerSaysGoMessage.positionLeftFunction);
        computerSaysGoMessage.style.top = eval(computerSaysGoMessage.positionTopFunction);
        computerSaysGoMessage.style.visibility = "visible";

        computerSaysGoMessage.style.transition = "0.2s linear";
        computerSaysGoMessage.style.opacity = 1;
    }

    function HideMessageComputerSaysGo() {
        var computerSaysGoMessage = document.getElementById('computer_says_go');
        computerSaysGoMessage.style.transition = "0.1s linear";
        computerSaysGoMessage.style.opacity = 0;
        setTimeout(function () {
            computerSaysGoMessage.style.visibility = 'hidden';
        }, 100);
    }

    function GetPeggingPointsLastPlay() {
        return Game.GetPeggingPointsForCards(currentPeggingCards);
    }

    function PlayNextPeggingCardForComputer() {
        var computerPlay = computerPlayer.SelectNextCardForPegging(skillLevel, computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard)
        if (computerPlay === undefined) {
            // This is a go
            return undefined;
        } else {
            computersHand[computersHand.indexOf(computerPlay)] = null;
            currentPeggingCards.push(computerPlay);
            computerPlayedPeggingCards.push(computerPlay);
            AnimateCardViewToPeggingPile(computerPlay.cardView, false);
            return computerPlay;
        }
    }

    function AnimateCardViewToPeggingPile(cardView, isPlayersCard) {
        cardView.style.transition = "0.3s ease-out";
        cardView.positionLeftFunction = "GetPeggingFirstCardPosition()[0] + (" + currentPeggingCards.length + ")*peggingCardsOverlap + 'px'";
        if (isPlayersCard) {
            cardView.positionTopFunction = "GetPeggingFirstCardPosition()[1] + " + peggingCardsVerticalOffset + " + 'px'";
        } else {
            cardView.positionTopFunction = "GetPeggingFirstCardPosition()[1] - " + peggingCardsVerticalOffset + " + 'px'";
        }
        cardView.style.left = eval(cardView.positionLeftFunction);
        cardView.style.top = eval(cardView.positionTopFunction);
        setTimeout(function () {
            cardView.style.zIndex = currentPeggingCards.length;
            if (!isPlayersCard) {
                flipUpCard(cardView);
            }
        }, 30);

        // Update the pegging count
        currentPeggingCount += cardView.card.value;
        var pCount = currentPeggingCount;
        if (isPlayersCard) {
            SetPeggingCountAnimated(pCount, 300);
        } else {
            SetPeggingCountAnimated(pCount, 600);
        }
    }

    function OnResetPeggingCount() {
        HideMessageUserMustSayGo();
        HideMessageComputerSaysGo();

        // Move all the cards to the dead pile
        for (var i = 0; i < currentPeggingCards.length; i++) {
            deadPeggingCards.push(currentPeggingCards[i]);
        }
        currentPeggingCards = [];

        for (var i = 0; i < deadPeggingCards.length; i++) {
            var deadCard = deadPeggingCards[i];
            deadCard.cardView.positionLeftFunction = "GetPeggingDeadPileFirstCardLeftPosition() + " + i + "*peggingDeadCardsOverlap + 'px'";
            deadCard.cardView.style.transition = "0.4s ease-out";
            deadCard.cardView.style.left = eval(deadCard.cardView.positionLeftFunction);
            deadCard.cardView.style.zIndex = i;
        }

        peggingCountText.innerHTML = "0";
        currentPeggingCount = 0;
        playerSaysGo = false;
        computerSaysGo = false;
    }

    function UpdatePeggingAverageRecord() {
        var computerPeggingPointsThisRound = computerScore - recordComputerPeggingStartingScore;
        var playerPeggingPointsThisRound = playerScore - recordPlayerPeggingStartingScore;
        computerPeggingPointsTotal = computerPeggingPointsTotal + computerPeggingPointsThisRound;
        playerPeggingPointsTotal = playerPeggingPointsTotal + playerPeggingPointsThisRound;

        var setting = 'stat_pegging_count_' + skillLevel;
        var settingVal = GetStatistic(setting);
        SetStatistic(setting, settingVal + 1);
        setting = 'stat_pegging_points_' + skillLevel;
        settingVal = GetStatistic(setting);
        SetStatistic(setting, settingVal + playerPeggingPointsThisRound);
    }

    function OnPeggingFinished() {
        UpdatePeggingAverageRecord();
        HidePeggingPrompt();
        HideMessageComputerSaysGo();
        HideMessageUserMustSayGo();
        peggingCountIndicator = document.getElementById('PeggingCountIndicator');
        peggingCountIndicator.style.transition = "0.2s linear";
        peggingCountIndicator.style.opacity = 0;
        setTimeout(function () {
            peggingCountIndicator.style.visibility = "hidden";
        }, 300);

        AnimateCardsBackForCounting();
    }

    function AnimateCardsBackForCounting() {
        currentMoveStage = 'AnimatingScoresForHands';

        playerPlayedPeggingCards.sort(function (a, b) { return a.rank - b.rank; });
        computerPlayedPeggingCards.sort(function (a, b) { return a.rank - b.rank; });
        playersHand = playerPlayedPeggingCards;
        computersHand = computerPlayedPeggingCards;
        setTimeout(function () {
            for (var i = 0; i < playerPlayedPeggingCards.length; i++) {
                var cardView = playerPlayedPeggingCards[i].cardView;
                cardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
                cardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
                cardView.positionIndex = i;
                cardView.isClickable = true;
                cardView.style.zIndex = i + 100;
                with (cardView.style) {
                    transition = "0.5s ease-out";
                    left = eval(cardView.positionLeftFunction);
                    top = eval(cardView.positionTopFunction);
                };
            }
            for (var i = 0; i < computerPlayedPeggingCards.length; i++) {
                var cardView = computerPlayedPeggingCards[i].cardView;
                cardView.positionLeftFunction = "GetHandCardPosition(false, false, " + i + ")[0] + 'px'";
                cardView.positionTopFunction = "GetHandCardPosition(false, false, " + i + ")[1] + 'px'";
                cardView.positionIndex = i;
                cardView.isClickable = true;
                cardView.style.zIndex = i + 100;
                with (cardView.style) {
                    transition = "0.5s ease-out";
                    left = eval(cardView.positionLeftFunction);
                    top = eval(cardView.positionTopFunction);
                };
            }
        }, 50)

        setTimeout(function () {
            if (isPlayersCrib) {
                CountPointsForComputer();
            } else {
                CountPointsForPlayer();
            }
        }, 1000);
    }

    function CountPointsForPlayer() {
        if (GetSetting('setting_manual_count_scores')) {
            ManualCountHandForPlayer();
        } else {
            AutoCountHandForPlayer();
        }
    }

    var isManuallyCountingTheCrib = false;
    var currentSetOfManualCountCards = [];
    var manualScoringPointsAvailable = [];
    var currentManualSelectedScoringPoints = null;
    var currentCountedManualPoints = [];

    function ManualCountHandForPlayer() {
        isManuallyCountingTheCrib = false;
        InitializeManualCountingOfCards(playersHand, false);
    }

    function InitializeManualCountingOfCards(cards, isCrib) {

        if (skillLevel === 'Easy' || GetSetting('setting_hints')) {
            setTimeout(function () {
                ShowHintButton();
            }, 1000);
        }
        
        currentManualSelectedScoringPoints = null;
        currentCountedManualPoints = [];

        var acceptButton = document.getElementById('ManualCountAcceptButton');
        var mugginsEnabled = GetSetting('setting_muggins');
        acceptButton.disabled = !mugginsEnabled;
        acceptButton.style.visibility = 'visible';
        document.getElementById('ManualPointConfirmButton').style.visibility = 'hidden';
        document.getElementById('ManualScoreBubblePoints').innerHTML = "0";
        document.getElementById('ManualPointsDesc').innerHTML = "";
        
        manualScoringPointsAvailable = Game.GetPointsForHand(cards, topCard, isCrib);
        for (var i=0; i<manualScoringPointsAvailable.length; i++) {
            manualScoringPointsAvailable[i].pointsCounted = false;
        }
        UpdateEnabledStateOfManualCountingFinishedButton();

        var manualCountView = document.getElementById('ManualCount');
        manualCountView.style.zIndex = 700;
        manualCountView.positionLeftFunction = "GetManualCountViewPosition()[0] + 'px'";
        manualCountView.positionTopFunction = "GetManualCountViewPosition()[1] + 'px'";
        manualCountView.style.transition = "none all";
        manualCountView.style.opacity = 0;
        manualCountView.style.visibility = 'visible';
        manualCountView.style.left = eval(manualCountView.positionLeftFunction);
        manualCountView.style.top = eval(manualCountView.positionTopFunction);
        setTimeout(function() {
            manualCountView.style.transition = "0.3s linear";
            manualCountView.style.opacity = 1;
        },200);

        ShowManualCountingPrompt(300);

        currentSetOfManualCountCards = cards;
        for (var i=0; i<cards.length; i++) {
            cards[i].cardView.isClickable = true;
        }
        topCard.cardView.isClickable = true;
        for (var i=0; i<computersHand.length; i++) {
            computersHand[i].cardView.isClickable = false;
        }

        currentMoveStage = 'WaitingForUserToManuallyCount';
    }

    function UpdateEnabledStateOfManualCountingFinishedButton() {
        var mugginsEnabled = GetSetting('setting_muggins');
        var acceptButton = document.getElementById('ManualCountAcceptButton');
        if (mugginsEnabled) {
            acceptButton.disabled = false;
        } else {
            var pointsAvailable = false;
            for (var i=0; i<manualScoringPointsAvailable.length; i++) {
                if (!manualScoringPointsAvailable[i].pointsCounted) {
                    pointsAvailable = true;
                    break;
                }
            }
            acceptButton.disabled = pointsAvailable;
        }
    }

    function ShowManualCountingPrompt(delay) {
        var manualPrompt = document.getElementById('manual_prompt');
        manualPrompt.style.transition = "none";
        manualPrompt.positionLeftFunction = "GetManualPromptPosition()[0] + 'px'";
        manualPrompt.positionTopFunction = "GetManualPromptPosition()[1] + 'px'";
        manualPrompt.style.left = eval(manualPrompt.positionLeftFunction);
        manualPrompt.style.top = eval(manualPrompt.positionTopFunction);
        setTimeout(function () {
            manualPrompt.style.visibility = "visible";
            manualPrompt.style.transition = "0.3s";
            manualPrompt.style.opacity = 1;
        }, delay);
    }

    function HideManualCountingPrompt() {
        var manualPrompt = document.getElementById('manual_prompt');
        manualPrompt.style.transition = "0.3s";
        manualPrompt.style.opacity = 0;
    }

    this.OnAllCountedOKClick = function() {
        var allCounted = document.getElementById('allcounted');
        allCounted.style.opacity = 0;
        allCounted.style.visibility = 'hidden';

        // Just move on because the user is finished counting
        this.OnManualCountAcceptClick();
    }

    function AnalyzeSelectedCardsForManualCounting() {
        var selectedCards = [];
        for (var i=0; i<currentSetOfManualCountCards.length; i++) {
            if (currentSetOfManualCountCards[i].cardView.isSlidUp) {
                selectedCards.push(currentSetOfManualCountCards[i]);
            }
        }
        if (topCard.cardView.isSlidUp) {
            selectedCards.push(topCard);
        }

        for (var i=0; i<manualScoringPointsAvailable.length; i++) {
            if (manualScoringPointsAvailable[i].cards.length === selectedCards.length && !manualScoringPointsAvailable[i].pointsCounted) {
                var matchCount = 0;
                for (var j=0; j<manualScoringPointsAvailable[i].cards.length; j++) {
                    if (selectedCards.indexOf(manualScoringPointsAvailable[i].cards[j]) !== -1) {
                        matchCount = matchCount + 1;
                    }
                }

                if (matchCount === selectedCards.length) {
                    ShowManualCountSubsetSubmitButton(manualScoringPointsAvailable[i]);
                    return;
                }
            }
        }

        HideConfirmPointsButton();
    }

    function ShowManualCountSubsetSubmitButton(availablePoints) {
        currentManualSelectedScoringPoints = availablePoints;
        var button = document.getElementById('ManualPointConfirmButton');
        button.innerHTML = "Click here to add:<br>" + availablePoints.description + " for " + availablePoints.points;
        button.style.visibility = 'visible';
        button.style.opacity = 1;
    }

    function HideConfirmPointsButton() {
        var button = document.getElementById('ManualPointConfirmButton');
        button.style.visibility = 'hidden';
        button.style.opacity = 0;
    }

    this.OnManualPointConfirmClick = function() {
        if (currentManualSelectedScoringPoints !== null) {
            
            currentManualSelectedScoringPoints.pointsCounted = true;
            currentCountedManualPoints.push(currentManualSelectedScoringPoints);
            
            var scoreInfo = GenerateScoreDescriptions(currentCountedManualPoints);
            var scoreDescriptionHTML = scoreInfo[0];
            var totalScore = scoreInfo[1];
            var desc = document.getElementById('ManualPointsDesc');
            desc.innerHTML = scoreDescriptionHTML;
            var pointBubble = document.getElementById('ManualScoreBubblePoints');
            pointBubble.innerHTML = totalScore;

            // Show points animation without incrementing the score
            AnimateManualPoint(currentManualSelectedScoringPoints, topCard);
            
            for (var i=0; i<currentSetOfManualCountCards.length; i++) {
                slideDownCard(currentSetOfManualCountCards[i].cardView);
            }
            slideDownCard(topCard.cardView);

            HideConfirmPointsButton();
            UpdateEnabledStateOfManualCountingFinishedButton();
        }
    }

    var mugginsPoints = [];

    this.OnManualCountAcceptClick = function() {
        if (currentMoveStage !== 'WaitingForUserToManuallyCount') {
            return;
        }

        currentMoveStage = "";
        var allCounted = document.getElementById('allcounted');
        allCounted.style.opacity = 0;
        allCounted.style.visibility = 'hidden';
        HideHintButton();
        HideManualCountingPrompt();
        
        var recordedScore = 0;
        for (var i=0; i<currentCountedManualPoints.length; i++) {
            recordedScore = recordedScore + currentCountedManualPoints[i].points;
        }
        playerScore = playerScore + recordedScore;
        scoreboard.SetScorePlayer(playerScore);

        // Update stats
        if (isManuallyCountingTheCrib) {
            playerCribPointsTotal = playerCribPointsTotal + recordedScore;
            var setting = 'stat_cribs_count_' + skillLevel;
            var settingVal = GetStatistic(setting);
            SetStatistic(setting, settingVal + 1);
            setting = 'stat_cribs_points_' + skillLevel;
            settingVal = GetStatistic(setting);
            SetStatistic(setting, settingVal + recordedScore);
        } else {
            playerHandPointsTotal = playerHandPointsTotal + recordedScore;
            var setting = 'stat_hands_count_' + skillLevel;
            var settingVal = GetStatistic(setting);
            SetStatistic(setting, settingVal + 1);
            setting = 'stat_hands_points_' + skillLevel;
            settingVal = GetStatistic(setting);
            SetStatistic(setting, settingVal + recordedScore);
        }

        if (GetSetting('setting_muggins') && !isGameOver()) {
            mugginsPoints = [];
            var mugginsScore = 0;
            for (var i=0; i<manualScoringPointsAvailable.length; i++) {
                if (!manualScoringPointsAvailable[i].pointsCounted) {
                    mugginsPoints.push(manualScoringPointsAvailable[i]);
                    mugginsScore = mugginsScore + manualScoringPointsAvailable[i].points;
                }
            }

            if (mugginsPoints.length > 0) {
                if (isManuallyCountingTheCrib) {
                    computerCribPointsTotal = computerCribPointsTotal + mugginsScore;
                } else {
                    computerHandPointsTotal = computerHandPointsTotal + mugginsScore;
                }

                var manualCountView = document.getElementById('ManualCount');
                ShakeMugginsView(manualCountView);

                setTimeout(function() {
                    var delay = RegisterAndAnimateHandScores(mugginsPoints, false, isManuallyCountingTheCrib, topCard);
                    setTimeout(function () {
                        ShowMugginsScoreView(mugginsPoints);
                        ShowRecountButton();
                    }, delay);
                }, 1200);
            }
        } else {

            var manualCountView = document.getElementById('ManualCount');
            manualCountView.style.opacity = 0;
            manualCountView.style.visibility = 'hidden';

            if (isGameOver()) {
                AnimateGameFinished();
                return;
            }

            MoveOnAfterCountingHand();
        }
    }

    function ShowMugginsScoreView(scoringPoints, isPlayersPoints) {
        var HandScoreView = document.getElementById('HandScoreView');
        var HandScoreTitle = document.getElementById('HandScoreTitle');
        var HandScoreBubble = document.getElementById('HandScoreBubble');
        var HandScoreBubblePoints = document.getElementById('HandScoreBubblePoints');
        var HandScoreBubblePointsLabel = document.getElementById('HandScoreBubblePointsLabel');
        var HandScorePointsDescription = document.getElementById('HandScorePointsDescription');
        var HandScoreAcceptButton = document.getElementById('HandScoreAcceptButton');

        HandScoreView.style.zIndex = 701;
        HandScoreView.positionLeftFunction = "GetHandScoreViewPosition(false)[0] + 'px'";
        HandScoreView.positionTopFunction = "GetHandScoreViewPosition(false)[1] + 'px'";
        HandScoreView.style.transition = "none all";
        HandScoreView.style.opacity = 0;
        HandScoreView.style.left = eval(HandScoreView.positionLeftFunction);
        HandScoreView.style.top = eval(HandScoreView.positionTopFunction);

        HandScoreAcceptButton.onclick = game.OnAcceptMugginsScore;
        
        var scoreStats = GenerateScoreDescriptions(scoringPoints);
        var scoreDescriptionHTML = scoreStats[0];
        var totalScore = scoreStats[1];
        HandScorePointsDescription.innerHTML = scoreDescriptionHTML;

        HandScoreBubblePoints.innerText = totalScore;
        HandScoreBubblePointsLabel.innerText = scoringPoints == 1 ? "point" : "points";
        HandScoreBubble.style.background = "rgb(190, 0, 0)";
        HandScoreTitle.innerText = "Muggins:";
        
        setTimeout(function () {
            HandScoreView.style.visibility = "visible";
            HandScoreView.style.transition = "0.3s linear";
            HandScoreView.style.opacity = 1;
        }, 100);
    }

    this.OnAcceptMugginsScore = function() {
        var manualCountView = document.getElementById('ManualCount');
        manualCountView.style.opacity = 0;
        manualCountView.style.visibility = 'hidden';
        HideHandScoreView();
        HideRecountButton();
        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }
        
        MoveOnAfterCountingHand();
    }

    function MoveOnAfterCountingHand() {
        if (isManuallyCountingTheCrib) {
            AnimateCompletionOfCribCounting();
        } else {
            if (isPlayersCrib) {
                CollectHandCardsToPrepareCribCount();
            } else {
                setTimeout(function () {
                    CountPointsForComputer();
                }, 300);
            }
        }
    }

    function AutoCountHandForPlayer() {
        var scoringPoints = Game.GetPointsForHand(playersHand, topCard, false);

        var recordHandScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordHandScore = recordHandScore + scoringPoints[i].points;
        }

        playerHandPointsTotal = playerHandPointsTotal + recordHandScore;
        var setting = 'stat_hands_count_' + skillLevel;
        var settingVal = GetStatistic(setting);
        SetStatistic(setting, settingVal + 1);
        setting = 'stat_hands_points_' + skillLevel;
        settingVal = GetStatistic(setting);
        SetStatistic(setting, settingVal + playerHandPointsTotal);

        var delay = RegisterAndAnimateHandScores(scoringPoints, true, false, topCard);
        setTimeout(function () {
            ShowTotalHandScoreView(scoringPoints, true, false);
            ShowRecountButton();
        }, delay);
    }

    function ShowTotalHandScoreView(scoringPoints, isPlayersPoints, isCrib) {
        var HandScoreView = document.getElementById('HandScoreView');
        var HandScoreTitle = document.getElementById('HandScoreTitle');
        var HandScoreBubble = document.getElementById('HandScoreBubble');
        var HandScoreBubblePoints = document.getElementById('HandScoreBubblePoints');
        var HandScoreBubblePointsLabel = document.getElementById('HandScoreBubblePointsLabel');
        var HandScorePointsDescription = document.getElementById('HandScorePointsDescription');
        var HandScoreAcceptButton = document.getElementById('HandScoreAcceptButton');

        HandScoreView.style.zIndex = 700;
        HandScoreView.positionLeftFunction = "GetHandScoreViewPosition(" + isPlayersPoints + ")[0] + 'px'";
        HandScoreView.positionTopFunction = "GetHandScoreViewPosition(" + isPlayersPoints + ")[1] + 'px'";
        HandScoreView.style.transition = "none all";
        HandScoreView.style.opacity = 0;
        HandScoreView.style.left = eval(HandScoreView.positionLeftFunction);
        HandScoreView.style.top = eval(HandScoreView.positionTopFunction);

        if (isCrib) {
            HandScoreAcceptButton.onclick = game.OnAcceptCribScoreClick;
        } else if (isPlayersPoints) {
            HandScoreAcceptButton.onclick = game.OnAcceptPlayerHandScoreClick;
        } else {
            HandScoreAcceptButton.onclick = game.OnAcceptComputerHandScoreClick;
        }

        var scoreStats = GenerateScoreDescriptions(scoringPoints);
        var scoreDescriptionHTML = scoreStats[0];
        var totalScore = scoreStats[1];
        HandScorePointsDescription.innerHTML = scoreDescriptionHTML;

        HandScoreBubblePoints.innerText = totalScore;
        HandScoreBubblePointsLabel.innerText = scoringPoints == 1 ? "point" : "points";
        if (isPlayersPoints) {
            HandScoreBubble.style.background = "rgb(0, 0, 190)";
            if (isCrib) {
                HandScoreTitle.innerText = "Your crib:";
            } else {
                HandScoreTitle.innerText = "Your hand:";
            }
        } else {
            HandScoreBubble.style.background = "rgb(190, 0, 0)";
            if (isCrib) {
                HandScoreTitle.innerText = "Opponent crib:";
            } else {
                HandScoreTitle.innerText = "Opponent hand:";
            }
        }

        setTimeout(function () {
            HandScoreView.style.visibility = "visible";
            HandScoreView.style.transition = "0.3s linear";
            HandScoreView.style.opacity = 1;
        }, 100);
    }

    function GenerateScoreDescriptions(scoringPoints) {
        var scoreDescriptionHTML = "";
        var totalScore = 0;
        // First combine and count 15s and pairs and runs of three
        var fifteensCount = 0;
        var pairsCount = 0;
        var runsOf3Count = 0;
        var runsOf4Count = 0;
        var runsOf5Count = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            if (scoringPoints[i].descriptionID == 0) {
                fifteensCount = fifteensCount + 1;
            } else if (scoringPoints[i].descriptionID == 1) {
                pairsCount = pairsCount + 1;
            } else if (scoringPoints[i].descriptionID == 4) {
                if (scoringPoints[i].points == 3) {
                    runsOf3Count = runsOf3Count + 1;
                } else if (scoringPoints[i].points == 4) {
                    runsOf4Count = runsOf4Count + 1;
                } else if (scoringPoints[i].points == 5) {
                    runsOf5Count = runsOf5Count + 1;
                }
            }
        }
        if (fifteensCount > 0) {
            if (fifteensCount == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Fifteen for 2<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + fifteensCount + " Fifteens for " + 2 * fifteensCount + "<br>";
            }
        }
        if (pairsCount > 0) {
            if (pairsCount == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Pair for 2<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + pairsCount + " Pair for " + 2 * pairsCount + "<br>";
            }
        }
        if (runsOf3Count > 0) {
            if (runsOf3Count == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Run of 3 for 3<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + runsOf3Count + " Runs of 3 for " + 3 * runsOf3Count + "<br>";
            }
        }
        if (runsOf4Count > 0) {
            if (runsOf4Count == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Run of 4 for 4<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + runsOf4Count + " Runs of 4 for " + 4 * runsOf4Count + "<br>";
            }
        }
        if (runsOf5Count > 0) {
            if (runsOf5Count == 1) {
                scoreDescriptionHTML = scoreDescriptionHTML + "Run of 5 for 5<br>";
            } else {
                scoreDescriptionHTML = scoreDescriptionHTML + runsOf5Count + " Runs of 5 for " + 5 * runsOf5Count + "<br>";
            }
        }

        // Then count the rest of the points
        for (var i = 0; i < scoringPoints.length; i++) {
            totalScore = totalScore + scoringPoints[i].points;
            if (scoringPoints[i].descriptionID == 0 || scoringPoints[i].descriptionID == 1 || scoringPoints[i].descriptionID == 4) {
                continue;
            }
            scoreDescriptionHTML = scoreDescriptionHTML + scoringPoints[i].description + " for " + scoringPoints[i].points + "<br>";
        }

        return [scoreDescriptionHTML, totalScore];
    }

    function HideHandScoreView() {
        var HandScoreView = document.getElementById('HandScoreView');
        HandScoreView.style.transition = "0.1s linear";
        HandScoreView.style.opacity = 0;
        HandScoreView.style.visibility = 'hidden';
    }

    var currentRecountScoringPoints;
    var currentRecountScoringIsPlayersPoints;
    var currentRecountScoringIsCrib;
    var currentRecountScoringTopCard;

    function RegisterAndAnimateHandScores(points, isPlayersPoints, isCrib, topCard) {

        currentRecountScoringPoints = points;
        currentRecountScoringIsPlayersPoints = isPlayersPoints;
        currentRecountScoringIsCrib = isCrib;
        currentRecountScoringTopCard = topCard;

        var delay = 0;
        var totalScore = 0;
        for (var i = 0; i < points.length; i++) {
            totalScore = totalScore + points[i].points;
        }

        if (GetSetting('setting_fast_count')) {
            if (isPlayersPoints) {
                playerScore = playerScore + totalScore;
                setTimeout(function () {
                    scoreboard.SetScorePlayer(playerScore);
                }, 400);
            } else {
                computerScore = computerScore + totalScore;
                setTimeout(function () {
                    scoreboard.SetScoreOpp(computerScore);
                }, 400);
            }
        } else {
            delay = AnimateHandScores(points, isPlayersPoints, isCrib, topCard);
            setTimeout(function () {
                if (isPlayersPoints) {
                    playerScore = playerScore + totalScore;
                    scoreboard.SetScorePlayer(playerScore);
                } else {
                    computerScore = computerScore + totalScore;
                    scoreboard.SetScoreOpp(computerScore);
                }
            }, delay);
        }

        return delay;
    }

    function AnimateManualPoint(point, topCard) {
        var includesTopCard = false;
        var position = [0, 0];
        for (var j = 0; j < point.cards.length; j++) {
            // Skip the top card location
            if (point.cards[j] === topCard) {
                includesTopCard = true;
                continue;
            }
            var xString = eval(point.cards[j].cardView.positionLeftFunction);
            var yString = eval(point.cards[j].cardView.positionTopFunction);
            position[0] = position[0] + Number(xString.substring(0, xString.length - 2));
            position[1] = position[1] + Number(yString.substring(0, yString.length - 2));
        }
        if (includesTopCard) {
            position[0] = position[0] / (point.cards.length - 1);
            position[1] = position[1] / (point.cards.length - 1);
        } else {
            position[0] = position[0] / point.cards.length;
            position[1] = position[1] / point.cards.length;
        }
        AnimateScoreBubble(position, point.points, point.description, true, 0);
    }

    function AnimateHandScores(points, isPlayersPoints, isCrib, topCard) {

        var bubblePositions = [];
        for (var i = 0; i < points.length; i++) {
            var includesTopCard = false;
            var position = [0, 0];
            for (var j = 0; j < points[i].cards.length; j++) {
                // Skip the top card location
                if (points[i].cards[j] === topCard) {
                    includesTopCard = true;
                    continue;
                }
                var xString = eval(points[i].cards[j].cardView.positionLeftFunction);
                var yString = eval(points[i].cards[j].cardView.positionTopFunction);
                position[0] = position[0] + Number(xString.substring(0, xString.length - 2));
                position[1] = position[1] + Number(yString.substring(0, yString.length - 2));
            }
            if (includesTopCard) {
                position[0] = position[0] / (points[i].cards.length - 1);
                position[1] = position[1] / (points[i].cards.length - 1);
            } else {
                position[0] = position[0] / points[i].cards.length;
                position[1] = position[1] / points[i].cards.length;
            }
            bubblePositions.push(position);
        }

        var delay = 100;
        for (var i = 0; i < points.length; i++) {
            AnimateScoreBubble(bubblePositions[i], points[i].points, points[i].description, isPlayersPoints, delay + 200);
            BumpCards(points[i].cards, delay);
            delay = delay + bubbleScoreVisibleDuration;
        }

        return delay;
    }

    function CountPointsForComputer() {
        var scoringPoints = Game.GetPointsForHand(computersHand, topCard, false);
        var recordHandScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordHandScore = recordHandScore + scoringPoints[i].points;
        }
        computerHandPointsTotal = computerHandPointsTotal + recordHandScore;

        var moveCardsDelay = 200;
        if (scoreboard.IsCompactLayout()) {
            moveCardsDelay = 600;
        }
        // Slide all of the cards to their counting position
        for (var i = 0; i < computersHand.length; i++) {
            var cardView = computersHand[i].cardView;
            cardView.transition = "0.3s ease-out";
            cardView.positionLeftFunction = "GetComputerHandCountingPosition(" + i + ")[0] + 'px'";
            cardView.positionTopFunction = "GetComputerHandCountingPosition(" + i + ")[1] + 'px'";
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
        }

        setTimeout(function () {
            var delay = RegisterAndAnimateHandScores(scoringPoints, false, false, topCard);
            setTimeout(function () {
                ShowTotalHandScoreView(scoringPoints, false, false);
                ShowRecountButton();
            }, delay);
        }, moveCardsDelay);
    }

    function ShowRecountButton() {
        var recountButton = document.getElementById('RecountHandsView');
        recountButton.style.transition = "none";
        recountButton.positionLeftFunction = "GetRecountButtonPosition(" + currentRecountScoringIsPlayersPoints + ")[0] + 'px'";
        recountButton.positionTopFunction = "GetRecountButtonPosition(" + currentRecountScoringIsPlayersPoints + ")[1] + 'px'";
        recountButton.style.left = eval(recountButton.positionLeftFunction);
        recountButton.style.top = eval(recountButton.positionTopFunction);
        recountButton.style.opacity = 0;
        recountButton.style.visibility = "visible";
        setTimeout(function () {
            recountButton.style.transition = "0.2s linear";
            recountButton.style.opacity = 1;
        }, 50);
    }

    function HideRecountButton() {
        var recountButton = document.getElementById('RecountHandsView');
        recountButton.style.transition = "0.2s linear";
        recountButton.style.opacity = 0;
        setTimeout(function () {
            recountButton.style.visibility = "hidden";
        }, 200);
    }

    this.OnRecountButtonClick = function () {
        var handScoreView = document.getElementById('HandScoreView');
        handScoreView.style.transition = "0.2s linear";
        handScoreView.style.opacity = 0;
        var recountButton = document.getElementById('RecountHandsView');
        recountButton.style.pointerEvents = "none";
        recountButton.style.opacity = 0;
        var handScoreAcceptButton = document.getElementById('HandScoreAcceptButton');
        handScoreAcceptButton.style.pointerEvents = "none";
        setTimeout(function () {
            var delay = AnimateHandScores(currentRecountScoringPoints, currentRecountScoringIsPlayersPoints, currentRecountScoringIsCrib, currentRecountScoringTopCard);
            setTimeout(function () {
                handScoreView.style.opacity = 1;
                handScoreAcceptButton.style.pointerEvents = "auto";
                recountButton.style.pointerEvents = "auto";
                recountButton.style.opacity = 1;
            }, delay);
        }, 300);
    }

    this.OnAcceptPlayerHandScoreClick = function () {
        HideRecountButton();
        HideHandScoreView();

        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }

        if (isPlayersCrib) {
            CollectHandCardsToPrepareCribCount();
        } else {
            setTimeout(function () {
                CountPointsForComputer();
            }, 300);
        }
    }

    this.OnAcceptComputerHandScoreClick = function () {
        HideRecountButton();
        HideHandScoreView();

        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }

        if (!isPlayersCrib) {
            CollectHandCardsToPrepareCribCount();
        } else {
            setTimeout(function () {
                CountPointsForPlayer();
            }, 300);
        }
    }

    function CollectHandCardsToPrepareCribCount() {
        topCard.cardView.style.zIndex = 100;
        for (var i = 0; i < playersHand.length; i++) {
            flipDownCard(playersHand[i].cardView);
            flipDownCard(computersHand[i].cardView);
            playersHand[i].cardView.style.zIndex = i;
            computersHand[i].cardView.style.zIndex = i;

        }

        setTimeout(function () {
            for (var i = 0; i < playersHand.length; i++) {
                var cardView = playersHand[i].cardView;
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.transition = "0.5s ease-out";
                cardView.style.transitionDelay = i * 200 + "ms";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
                cardView = computersHand[i].cardView;
                cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
                cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
                cardView.style.transition = "0.5s ease-out";
                cardView.style.transitionDelay = i * 200 + "ms";
                cardView.style.left = eval(cardView.positionLeftFunction);
                cardView.style.top = eval(cardView.positionTopFunction);
            }

            var cribOverlap = document.getElementById('crib_indicator_card_overlap');
            cribOverlap.style.transition = "0.5s linear";
            cribOverlap.style.opacity = 0;

            crib.sort(function (a, b) { return a.rank - b.rank; });

            setTimeout(function () {
                cribOverlap.style.visibility = 'hidden';

                for (var i = 0; i < crib.length; i++) {
                    var cribCardView = crib[i].cardView;
                    cribCardView.style.transition = "0.5s ease-out";
                    if (isPlayersCrib) {
                        cribCardView.positionLeftFunction = "GetHandCardPosition(true, false, " + i + ")[0] + 'px'";
                        cribCardView.positionTopFunction = "GetHandCardPosition(true, false, " + i + ")[1] + 'px'";
                    } else {
                        cribCardView.positionLeftFunction = "GetComputerHandCountingPosition(" + i + ")[0] + 'px'";
                        cribCardView.positionTopFunction = "GetComputerHandCountingPosition(" + i + ")[1] + 'px'";
                    }
                    cribCardView.style.zIndex = i;
                    cribCardView.style.left = eval(cribCardView.positionLeftFunction);
                    cribCardView.style.top = eval(cribCardView.positionTopFunction);
                }

                setTimeout(function () {
                    for (var i = 0; i < crib.length; i++) {
                        var cribCardView = crib[i].cardView;
                        flipUpCard(cribCardView);
                    }

                    setTimeout(function () {
                        if (isPlayersCrib) {
                            CountCribPointsForPlayer();
                        } else {
                            CountCribPointsForComputer();
                        }
                    }, 400);

                }, 600);
            }, 600);
        }, 500);
    }

    function CountCribPointsForPlayer() {
        if (GetSetting('setting_manual_count_scores')) {
            ManualCountCribForPlayer();
        } else {
            AutoCountCribForPlayer();
        }
    }

    function ManualCountCribForPlayer() {
        isManuallyCountingTheCrib = true;
        InitializeManualCountingOfCards(crib, true);
    }

    function AutoCountCribForPlayer() {
        var scoringPoints = Game.GetPointsForHand(crib, topCard, true);

        var recordCribScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordCribScore = recordCribScore + scoringPoints[i].points;
        }

        playerCribPointsTotal = playerCribPointsTotal + recordCribScore;
        var setting = 'stat_cribs_count_' + skillLevel;
        var settingVal = GetStatistic(setting);
        SetStatistic(setting, settingVal + 1);
        setting = 'stat_cribs_points_' + skillLevel;
        settingVal = GetStatistic(setting);
        SetStatistic(setting, settingVal + recordCribScore);

        var delay = RegisterAndAnimateHandScores(scoringPoints, true, true, topCard);
        setTimeout(function () {
            ShowTotalHandScoreView(scoringPoints, true, true);
            ShowRecountButton();
        }, delay);
    }

    function CountCribPointsForComputer() {
        var scoringPoints = Game.GetPointsForHand(crib, topCard, true);

        var recordCribScore = 0;
        for (var i = 0; i < scoringPoints.length; i++) {
            recordCribScore = recordCribScore + scoringPoints[i].points;
        }

        computerCribPointsTotal = computerCribPointsTotal + recordCribScore;

        var delay = RegisterAndAnimateHandScores(scoringPoints, false, true, topCard);
        setTimeout(function () {
            ShowTotalHandScoreView(scoringPoints, false, true);
            ShowRecountButton();
        }, delay);
    }

    this.OnAcceptCribScoreClick = function () {
        HideRecountButton();
        HideHandScoreView();

        if (isGameOver()) {
            AnimateGameFinished();
            return;
        }

        AnimateCompletionOfCribCounting();
    }

    function AnimateCompletionOfCribCounting() {
        flipDownCard(topCard.cardView);
        topCard.cardView.style.transition = "0.3s ease-out";
        topCard.cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
        topCard.cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
        topCard.cardView.style.left = eval(topCard.cardView.positionLeftFunction);
        topCard.cardView.style.top = eval(topCard.cardView.positionTopFunction);

        for (var i = 0; i < crib.length; i++) {
            var cardView = crib[i].cardView;
            flipDownCard(cardView);
            cardView.style.transition = "0.5s ease-out";
            cardView.style.transitionDelay = 300 + i * 100 + "ms";
            cardView.positionLeftFunction = "GetDeckCardPosition()[0] + 'px'";
            cardView.positionTopFunction = "GetDeckCardPosition()[1] + 'px'";
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
        }

        setTimeout(function () {
            isPlayersCrib = !isPlayersCrib;
            scoreboard.SetCribIndicator(isPlayersCrib);
            AnimateDealingHands();
        }, 1300);
    }

    function ShowHintButton() {
        var hintButton = document.getElementById('hint_button');
        hintButton.positionLeftFunction = "GetHintButtonPosition()[0] + 'px'";
        hintButton.positionTopFunction = "GetHintButtonPosition()[1] + 'px'";
        hintButton.style.transition = "none";
        hintButton.style.left = eval(hintButton.positionLeftFunction);
        hintButton.style.top = eval(hintButton.positionTopFunction);
        hintButton.style.visibility = 'visible';
        hintButton.style.pointerEvents = "auto";
        setTimeout(function () {
            hintButton.style.opacity = 1;
        }, 20);
    }

    function HideHintButton() {
        var hintButton = document.getElementById('hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        BumpHintCards();
    }

    function ShowNoOptimalPlay() {
        var message = document.getElementById('no_hint_view');
        message.style.transition = "none";
        message.style.opacity = 0;
        message.positionLeftFunction = "window.innerWidth*0.5 - 200*0.5 + 'px'";
        message.positionTopFunction = "GetHandCardPosition(true, false, 2)[1] - 100*0.5 + 'px'";
        message.style.left = eval(message.positionLeftFunction);
        message.style.top = eval(message.positionTopFunction);
        message.style.visibility = "visible";

        message.style.transition = "0.2s linear";
        message.style.opacity = 1;
    }

    this.OnNoHintAcceptedClick = function () {
        var message = document.getElementById('no_hint_view');
        message.style.transition = "0.1s linear";
        message.style.opacity = 0;
        setTimeout(function () {
            message.style.visibility = "hidden";
        }, 100);
    }

    function BumpHintCards() {
        var optimalCards = [];
        if (currentMoveStage === 'WaitingForUserToPlayPeggingCard') {
            var bestMoveInfo = computerPlayer.FindOptimalPeggingCard(playersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard);
            if (bestMoveInfo[0] === undefined || bestMoveInfo[1] === 0) {
                ShowNoOptimalPlay();
                return;
            } else {
                optimalCards.push(bestMoveInfo[0]);
            }
        } else if (currentMoveStage === 'WaitingForUserToDiscardToCrib') {
            var cards = [];
            for (var i = 0; i < playersHand.length; i++) {
                if (playersHand[i] !== null) {
                    cards.push(playersHand[i]);
                }
            }
            for (var i = 0; i < crib.length; i++) {
                if (crib[i] != null) {
                    cards.push(crib[i]);
                }
            }
            optimalCards = computerPlayer.FindOptimalCribDiscards(cards, isPlayersCrib)[0];
        } else if (currentMoveStage === 'WaitingForUserToManuallyCount') {
            for (var i=0; i<manualScoringPointsAvailable.length; i++) {
                if (!manualScoringPointsAvailable[i].pointsCounted) {
                    BumpCards(manualScoringPointsAvailable[i].cards, 0);
                    return;
                }
            }

            // Show that all points are counted
            var allCounted = document.getElementById('allcounted');
            allCounted.positionLeftFunction = "window.innerWidth*0.5 - 115*0.5 + 'px'";
            allCounted.positionTopFunction = "GetHandCardPosition(true, false, 2)[1] - 65*0.5 + 'px'";
            allCounted.style.left = eval(allCounted.positionLeftFunction);
            allCounted.style.top = eval(allCounted.positionTopFunction);
            allCounted.style.transition = "none";
            allCounted.style.opacity = 1;
            allCounted.style.visibility = 'visible';
            return;
        }

        BumpCards(optimalCards, 0);
    }

    this.GetMostRecentHandCards = function () {
        return [mostRecentHandCards, mostRecentIsPlayersCrib];
    }

    function AnimateGameFinished() {
        currentMoveStage = "AnimatingGameOver";
        HideMenuButton();
        HideAllMessages();

        // Shake or twist cards
        if (isPlayerWon()) {
            for (var i=0; i<cards.length; i++) {
                TwistCard(cards[i].cardView);
            }
        } else {
            for (var i=0; i<cards.length; i++) {
                ShakeCard(cards[i].cardView);
            }
        }

        // Increment the win statistics
        if (isPlayerWon()) {
            var setting = 'stat_wins_' + skillLevel;
            var settingVal = GetStatistic(setting);
            SetStatistic(setting, settingVal + 1);
            if (isSkunkGame()) {
                setting = 'stat_skunks_' + skillLevel;
                settingsVal = GetStatistic(setting);
                SetStatistic(setting, settingsVal + 1);
            }
        } else {
            var setting = 'stat_losses_' + skillLevel;
            var settingVal = GetStatistic(setting);
            SetStatistic(setting, settingVal + 1);
        }

        // Keep track of suboptimal plays history
        var suboptimalErrorTotal = 0;
        for (var i = 0; i < suboptimalPlays.length; i++) {
            suboptimalErrorTotal = suboptimalErrorTotal + suboptimalPlays[i].optimalScore - suboptimalPlays[i].playedScore;
        }
        var setting = 'stat_suboptimal_history';
        var settingVal = GetStatisticString(setting);
        settingVal = settingVal + parseFloat(suboptimalErrorTotal).toFixed(1) + ",";
        SetStatistic(setting, settingVal);

        ShowGameOver();

        setTimeout(function () {
            scoreboard.Hide();
        }, 2000);
    }

    function ShowGameOver() {
        var closeButton = document.getElementById('game_over_close_button');
        closeButton.style.transition = "none";
        closeButton.style.opacity = 0;
        closeButton.style.pointerEvents = 'none';

        document.getElementById('GameOverResultText').innerHTML = isPlayerWon() ? "You won!" : "You lost";
        document.getElementById('GameOverSkunkText').style.display = isSkunkGame() ? "block" : "none";

        document.getElementById('GameOverTotalScoreYou').innerText = playerScore;
        document.getElementById('GameOverTotalScoreOpp').innerText = computerScore;
        var percent = 0.5;
        if (playerScore + computerScore > 0) {
            percent = computerScore / (playerScore + computerScore);
        }
        document.getElementById('GameOverTotalFill').style.width = 200 * percent + 'px';

        document.getElementById('GameOverPeggingYou').innerText = playerPeggingPointsTotal;
        document.getElementById('GameOverPeggingOpp').innerText = computerPeggingPointsTotal;
        percent = 0.5;
        if (playerPeggingPointsTotal + computerPeggingPointsTotal > 0) {
            percent = computerPeggingPointsTotal / (playerPeggingPointsTotal + computerPeggingPointsTotal);
        }
        document.getElementById('GameOverPeggingFill').style.width = 200 * percent + 'px';

        document.getElementById('GameOverHandsYou').innerText = playerHandPointsTotal;
        document.getElementById('GameOverHandsOpp').innerText = computerHandPointsTotal;
        percent = 0.5;
        if (playerHandPointsTotal + computerHandPointsTotal > 0) {
            percent = computerHandPointsTotal / (playerHandPointsTotal + computerHandPointsTotal);
        }
        document.getElementById('GameOverHandsFill').style.width = 200 * percent + 'px';

        document.getElementById('GameOverCribsYou').innerText = playerCribPointsTotal;
        document.getElementById('GameOverCribsOpp').innerText = computerCribPointsTotal;
        percent = 0.5;
        if (playerCribPointsTotal + computerCribPointsTotal > 0) {
            percent = computerCribPointsTotal / (playerCribPointsTotal + computerCribPointsTotal);
        }
        document.getElementById('GameOverCribsFill').style.width = 200 * percent + 'px';

        var suboptimalError = 0;
        for (var i = 0; i < suboptimalPlays.length; i++) {
            suboptimalError = suboptimalError + suboptimalPlays[i].optimalScore - suboptimalPlays[i].playedScore;
        }
        document.getElementById('GameOverSuboptimalButton').innerHTML = "You made " + suboptimalPlays.length + " suboptimal plays this game for a cummulative error of " + parseFloat(suboptimalError).toFixed(1) + " points.";

        var suboptimalListView = document.getElementById('GameOverSuboptimalPlaysView');
        suboptimalListView.innerHTML = "";
        var discardsCount = 0;
        var peggingSuboptimalCount = 0;
        for (var i = 0; i < suboptimalPlays.length; i++) {
            if (suboptimalPlays[i].isDiscard) {
                discardsCount = discardsCount + 1;
            } else {
                peggingSuboptimalCount = peggingSuboptimalCount + 1;
            }
        }
        if (discardsCount > 0) {
            var header = document.getElementById('GameOverSuboptimalHeaderTemplate').cloneNode(true);
            header.innerText = "Sub-Optimal Discards";
            header.style.display = "block";
            suboptimalListView.appendChild(header);
            for (var i = 0; i < suboptimalPlays.length; i++) {
                if (suboptimalPlays[i].isDiscard) {
                    var subOptimalView = document.getElementById('GameOverSuboptimalDiscardTemplate').cloneNode(true);
                    subOptimalView.style.display = "block";
                    subOptimalView.suboptimalPlay = suboptimalPlays[i];
                    subOptimalView.children[0].innerHTML = suboptimalPlays[i].isPlayersCrib ? "Hand dealt - Your crib" : "Hand dealt - Opp. crib";
                    suboptimalPlays[i].situationCards.sort(function (a, b) { return a.rank - b.rank; });
                    for (var j = 0; j < 6; j++) {
                        var elem = subOptimalView.children[j + 1];
                        if (j < suboptimalPlays[i].situationCards.length) {
                            var back = suboptimalPlays[i].situationCards[j].image;
                            elem.style.background = back;
                        } else {
                            elem.style.display = "none";
                        }
                    }
                    for (var j = 0; j < suboptimalPlays[i].playedCards.length; j++) {
                        subOptimalView.children[j + 8].style.background = suboptimalPlays[i].playedCards[j].image;
                    }
                    subOptimalView.children[11].innerText = parseFloat(suboptimalPlays[i].playedScore).toFixed(1);
                    for (var j = 0; j < suboptimalPlays[i].optimalCards.length; j++) {
                        subOptimalView.children[j + 14].style.background = suboptimalPlays[i].optimalCards[j].image;
                    }
                    subOptimalView.children[17].innerText = parseFloat(suboptimalPlays[i].optimalScore).toFixed(1);
                    suboptimalListView.appendChild(subOptimalView);
                }
            }
        }
        if (peggingSuboptimalCount > 0) {
            var header = document.getElementById('GameOverSuboptimalHeaderTemplate').cloneNode(true);
            header.innerText = "Sub-Optimal Pegging Plays";
            header.style.display = "block";
            suboptimalListView.appendChild(header);
            for (var i = 0; i < suboptimalPlays.length; i++) {
                if (!suboptimalPlays[i].isDiscard) {
                    var subOptimalView = document.getElementById('GameOverSuboptimalDiscardTemplate').cloneNode(true);
                    subOptimalView.style.display = "block";
                    subOptimalView.className = "GameOverSuboptimalPegging";
                    subOptimalView.children[0].innerHTML = "Pegging pile"
                    for (var j = 0; j < 6; j++) {
                        var elem = subOptimalView.children[j + 1];
                        if (j < suboptimalPlays[i].situationCards.length) {
                            var back = suboptimalPlays[i].situationCards[j].image;
                            elem.style.background = back;
                        } else {
                            elem.style.display = "none";
                        }
                    }

                    subOptimalView.children[8].style.background = suboptimalPlays[i].playedCards[0].image;
                    subOptimalView.children[9].style.display = 'none';
                    subOptimalView.children[10].innerText = "for";
                    subOptimalView.children[11].innerText = parseFloat(suboptimalPlays[i].playedScore).toFixed(1);

                    subOptimalView.children[14].style.background = suboptimalPlays[i].optimalCards[0].image;
                    subOptimalView.children[15].style.display = "none";
                    subOptimalView.children[16].innerText = "for";
                    subOptimalView.children[17].innerText = parseFloat(suboptimalPlays[i].optimalScore).toFixed(1);
                    suboptimalListView.appendChild(subOptimalView);
                }
            }
        }

        var gameOverView = document.getElementById('GameOverView');
        visibleMenuCards.push('GameOverView');
        gameOverView.style.height = isSkunkGame() ? "90px" : "55px";
        gameOverView.style.transition = "none";
        gameOverView.style.transform = "translate(-50%,-50%) scale(0)";
        gameOverView.style.top = "50%";
        gameOverView.style.opacity = 1;
        gameOverView.style.visibility = 'visible';
        setTimeout(function () {
            gameOverView.style.transition = "1s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
            gameOverView.style.transform = "translate(-50%,-50%) scale(1)";
            setTimeout(function () {
                gameOverView.style.transition = "1s linear";
                if (suboptimalPlays.length > 0) {
                    gameOverView.style.height = isSkunkGame() ? '500px' : '457px';
                } else {
                    gameOverView.style.height = isSkunkGame() ? '320px' : '277px';
                }
                closeButton.style.transition = "1s linear";
                closeButton.style.opacity = 1;
                closeButton.style.pointerEvents = 'auto';

            }, 3000);
        }, 1000);
    }

    function HideAllMessages() {
        var viewsToHide = [
            'select_low_card_message',
            'low_card_result_message',
            'low_card_you_text',
            'low_card_computer_text',
            'crib_region',
            'confirm_crib_region',
            'crib_indicator_card_overlap',
            'PeggingCountIndicator',
            'pegging_prompt',
            'computer_says_go',
            'player_says_go',
            'HandScoreView',
            'RecountHandsView',
            'hint_button',
            'SuboptimalWarning',
            'no_hint_view',
            'ManualCount',
            'manual_prompt',
            'allcounted'];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "none";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.OnResizeWindow = function OnResizeWindow() {

        var ease = "0.6s ease-out";

        // Redraw the scoreboard
        scoreboard.RedrawView();

        // Reposition all the cards
        for (var i = 0; i < cards.length; i++) {
            var cardView = cards[i].cardView;
            cardView.style.left = eval(cardView.positionLeftFunction);
            cardView.style.top = eval(cardView.positionTopFunction);
            cardView.style.transition = ease;
        }

        // Reposition everything else
        var viewsToPosition = [
            'select_low_card_message',
            'low_card_result_message',
            'low_card_you_text',
            'low_card_computer_text',
            'crib_region',
            'confirm_crib_region',
            'crib_indicator_card_overlap',
            'PeggingCountIndicator',
            'pegging_prompt',
            'computer_says_go',
            'player_says_go',
            'HandScoreView',
            'RecountHandsView',
            'hint_button',
            'no_hint_view',
            'ManualCount',
            'manual_prompt',
            'allcounted'];
        for (var i = 0; i < viewsToPosition.length; i++) {
            var view = document.getElementById(viewsToPosition[i]);
            view.style.transition = ease;
            view.style.left = eval(view.positionLeftFunction);
            view.style.top = eval(view.positionTopFunction);
        }
    }
}
