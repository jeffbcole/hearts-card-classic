var Game = function () {

    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    
    // Local variables
    var scoreboard = new Scoreboard();
    var currentDraggedCardView;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    // Members
    this.currentMoveStage = "";
    this.skillLevel = "";
    this.losingScore = 0;
    this.players = [];
    this.trickCards = [];
    this.roundNumber = 0;
    this.leadIndex = 0;
    this.turnIndex = 0;
    this.isHeartsBroken = false;
    this.cardsPlayedThisRound = [];
    this.roundScores = [];

    var deckTopIndex = 0;
    var cards = [
        { id: 'AS', rank: 1, value: 14, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_Ace.jpg')" },
        { id: '2S', rank: 2, value: 2, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_2.jpg')" },
        { id: '3S', rank: 3, value: 3, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_3.jpg')" },
        { id: '4S', rank: 4, value: 4, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_4.jpg')" },
        { id: '5S', rank: 5, value: 5, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_5.jpg')" },
        { id: '6S', rank: 6, value: 6, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_6.jpg')" },
        { id: '7S', rank: 7, value: 7, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_7.jpg')" },
        { id: '8S', rank: 8, value: 8, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_8.jpg')" },
        { id: '9S', rank: 9, value: 9, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_9.jpg')" },
        { id: 'TS', rank: 10, value: 10, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_10.jpg')" },
        { id: 'JS', rank: 11, value: 11, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_Jack.jpg')" },
        { id: 'QS', rank: 12, value: 12, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_Queen.jpg')" },
        { id: 'KS', rank: 13, value: 13, suit: 'S', suitInt: 2, image: "url('images/Card_Spade_King.jpg')" },
        { id: 'AD', rank: 1, value: 14, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_Ace.jpg')" },
        { id: '2D', rank: 2, value: 2, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_2.jpg')" },
        { id: '3D', rank: 3, value: 3, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_3.jpg')" },
        { id: '4D', rank: 4, value: 4, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_4.jpg')" },
        { id: '5D', rank: 5, value: 5, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_5.jpg')" },
        { id: '6D', rank: 6, value: 6, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_6.jpg')" },
        { id: '7D', rank: 7, value: 7, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_7.jpg')" },
        { id: '8D', rank: 8, value: 8, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_8.jpg')" },
        { id: '9D', rank: 9, value: 9, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_9.jpg')" },
        { id: 'TD', rank: 10, value: 10, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_10.jpg')" },
        { id: 'JD', rank: 11, value: 11, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_Jack.jpg')" },
        { id: 'QD', rank: 12, value: 12, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_Queen.jpg')" },
        { id: 'KD', rank: 13, value: 13, suit: 'D', suitInt: 1, image: "url('images/Card_Diamond_King.jpg')" },
        { id: 'AC', rank: 1, value: 14, suit: 'C', suitInt: 0, image: "url('images/Card_Club_Ace.jpg')" },
        { id: '2C', rank: 2, value: 2, suit: 'C', suitInt: 0, image: "url('images/Card_Club_2.jpg')" },
        { id: '3C', rank: 3, value: 3, suit: 'C', suitInt: 0, image: "url('images/Card_Club_3.jpg')" },
        { id: '4C', rank: 4, value: 4, suit: 'C', suitInt: 0, image: "url('images/Card_Club_4.jpg')" },
        { id: '5C', rank: 5, value: 5, suit: 'C', suitInt: 0, image: "url('images/Card_Club_5.jpg')" },
        { id: '6C', rank: 6, value: 6, suit: 'C', suitInt: 0, image: "url('images/Card_Club_6.jpg')" },
        { id: '7C', rank: 7, value: 7, suit: 'C', suitInt: 0, image: "url('images/Card_Club_7.jpg')" },
        { id: '8C', rank: 8, value: 8, suit: 'C', suitInt: 0, image: "url('images/Card_Club_8.jpg')" },
        { id: '9C', rank: 9, value: 9, suit: 'C', suitInt: 0, image: "url('images/Card_Club_9.jpg')" },
        { id: 'TC', rank: 10, value: 10, suit: 'C', suitInt: 0, image: "url('images/Card_Club_10.jpg')" },
        { id: 'JC', rank: 11, value: 11, suit: 'C', suitInt: 0, image: "url('images/Card_Club_Jack.jpg')" },
        { id: 'QC', rank: 12, value: 12, suit: 'C', suitInt: 0, image: "url('images/Card_Club_Queen.jpg')" },
        { id: 'KC', rank: 13, value: 13, suit: 'C', suitInt: 0, image: "url('images/Card_Club_King.jpg')" },
        { id: 'AH', rank: 1, value: 14, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_Ace.jpg')" },
        { id: '2H', rank: 2, value: 2, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_2.jpg')" },
        { id: '3H', rank: 3, value: 3, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_3.jpg')" },
        { id: '4H', rank: 4, value: 4, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_4.jpg')" },
        { id: '5H', rank: 5, value: 5, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_5.jpg')" },
        { id: '6H', rank: 6, value: 6, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_6.jpg')" },
        { id: '7H', rank: 7, value: 7, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_7.jpg')" },
        { id: '8H', rank: 8, value: 8, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_8.jpg')" },
        { id: '9H', rank: 9, value: 9, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_9.jpg')" },
        { id: 'TH', rank: 10, value: 10, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_10.jpg')" },
        { id: 'JH', rank: 11, value: 11, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_Jack.jpg')" },
        { id: 'QH', rank: 12, value: 12, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_Queen.jpg')" },
        { id: 'KH', rank: 13, value: 13, suit: 'H', suitInt: 3, image: "url('images/Card_Heart_King.jpg')" }
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
    var frontShade = document.createElement("div");
    frontShade.className = "cardFrontShade";
    front.appendChild(frontShade);
    var cardHighlight = document.createElement("div");
    cardHighlight.className = "cardFrontHighlight";
    front.appendChild(cardHighlight);

    var cardBackURI = "url('images/card_back_" + GetSetting('setting_card_color') + ".jpg')";

    for (var i = 0; i < cards.length; i++) {
        var newCard = cardElement.cloneNode(true);
        var card = cards[i];
        card.cardView = newCard;
        card.cardView.isSlidUp = false;
        card.cardView.isFlippedUp = false;
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

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragMouseDown(e) {
        e = e || window.event;

        if (!e.target.classList.contains('card')) {
            return;
        }

        scoreboard.Contract();

        if (game.currentMoveStage === 'ChoosingPassCards') {
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
                passingCardsPointerPressed();
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
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
                raiseCard(currentDraggedCardView);
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
    }

    function closeDragElement() {
        // stop moving when mouse released
        cardTouchFinished();
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

    function flipUpCard(cardView) {
        if (cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = true;
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

    function flipDownCard(cardView, animate) {
        if (!cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = false;
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = animate ? "0.7s ease-out" : "none";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (animate) {
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
        } else {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(180deg)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }         
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

    function ShadeCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var shade = cardFront.firstChild;
        with (shade.style) {
            transition = "0.3s linear";
            opacity = 0.3;
        }
    }

    function UnshadeCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var shade = cardFront.firstChild;
        with (shade.style) {
            transition = "0.3s linear";
            opacity = 0;
        }
    }

    function BumpCards(cards, delay) {
        setTimeout(function() {
            for (var i=0; i<cards.length; i++) {
                BumpCard(cards[i].cardView);
            }    
        }, delay);
    }

    function BumpCard(cardView) {
        var raiseContainer = cardView.firstChild;
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bump');
        });
        raiseContainer.classList.add('bump');
    }

    function FlashHighlightCardView(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[1];
        flashHighlight.addEventListener("animationend", function() {
            flashHighlight.classList.remove('flashHighlight');
        });
        flashHighlight.classList.add('flashHighlight');
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

    function GetHandCardLocation(position, index, cardCount) {
        var cardWidthHalf = 115*0.5;
        var cardHeightHalf = 162*0.5;
        switch (position)
        {
            case 'West':
                var firstLeft = -40;
                var lastLeft = -40;
                var firstTop = 250;
                var lastTop = window.innerHeight-300;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth/cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing*cardCount)*0.5;
                }
                curTop = curTop + index*cardSpacing;
                curLeft = (firstLeft + lastLeft)*0.5;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, 90];
            case 'North':
                var firstLeft = window.innerWidth*0.5 - 120;
                var lastLeft = window.innerWidth*0.5 + 120;
                var firstTop = -40;
                var lastTop = -40;
                var handWidth = lastLeft - firstLeft;
                var cardSpacing = handWidth/(cardCount-1);
                var curLeft = firstLeft;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curLeft = firstLeft + (handWidth - cardSpacing*(cardCount-1))*0.5;
                }
                var curTop = firstTop;
                curLeft = curLeft + index*cardSpacing;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, 0];
            case 'East':
                var firstLeft = window.innerWidth+40;
                var lastLeft = window.innerWidth+40;
                var firstTop = 250;
                var lastTop = window.innerHeight - 300;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth/cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing*cardCount)*0.5;
                }
                curTop = curTop + index*cardSpacing;
                curLeft = firstLeft;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, -90];
            default:
                var firstLeft = 150;
                var lastLeft = window.innerWidth-150;
                var firstTop = window.innerHeight-180;
                var lastTop = window.innerHeight-180;
                var handWidth = lastLeft-firstLeft;
                var cardSpacing = handWidth/(cardCount-1);
                var curLeft = firstLeft;
                var maxSpacing = cardWidthHalf;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curLeft = firstLeft + (handWidth-cardSpacing*(cardCount-1))*0.5;
                    firstTop = window.innerHeight-150;
                    lastTop = window.innerHeight-150;
                }
                curLeft = curLeft + index*cardSpacing;
                var percent = (curLeft - firstLeft)/handWidth;
                var radius = handWidth*3;
                var distanceFromCenter = handWidth*(0.5 - percent);
                var curveHeight = Math.sqrt(radius*radius-distanceFromCenter*distanceFromCenter) - Math.sqrt(radius*radius - handWidth*0.5*handWidth*0.5); 
                var curveRotation = Math.asin(-distanceFromCenter/radius)*180/Math.PI;
                var curTop = firstTop - curveHeight;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, curveRotation];
        }
    }

    this.InitializeGame = function(difficulty) {
        // Game properties
        this.skillLevel = difficulty;
        this.losingScore = Number(GetSetting('setting_losing_score'));
        this.cardsPlayedThisRound = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.currentMoveStage = 'None';
        this.roundScores = [];

        this.players = [];
        var player = new Player();
        player.Initialize('You', true, 'Pro', 'South');
        this.players.push(player);
        switch(difficulty)
        {
            case 'Easy':
            {
                player = new Player();
                player.Initialize('Conrad', false, difficulty, 'West');
                this.players.push(player);
                player = new Player();
                player.Initialize('Louisa', false, difficulty, 'North');
                this.players.push(player);
                player = new Player();
                player.Initialize('Davina', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            case 'Standard':
            {
                player = new Player();
                player.Initialize('Catalina', false, difficulty, 'West');
                this.players.push(player);
                player = new Player();
                player.Initialize('Amelia', false, difficulty, 'North');
                this.players.push(player);
                player = new Player();
                player.Initialize('Seward', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            default:
            {
                player = new Player();
                player.Initialize('Charlotte', false, difficulty, 'West');
                this.players.push(player);
                player = new Player();
                player.Initialize('Dixon', false, difficulty, 'North');
                this.players.push(player);
                player = new Player();
                player.Initialize('Isabella', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
        }
    }

    this.StartAGame = function (difficulty) {

        this.InitializeGame(difficulty);        

        // Clean up all cards and messages
        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].cardView;
            flipDownCard(el, false);
            UnshadeCard(el);
            with (el.style) {
                transition = "none";
                transform = "none";
            }
        }
        HideAllMessages();

        scoreboard.Initialize();

        this.CreatePlayerInfoViews();
        
        this.AnimateDealCardsForRound();
    }

    this.CreatePlayerInfoViews = function() {
        for (var i=0; i<4; i++) {
            var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
            playerName.positionFunction = "GetPlayerNamePosition('" + this.players[i].playerPosition + "')";
            playerName.style.transition = "none";
            var position = eval(playerName.positionFunction);
            playerName.style.left = position[0] + 'px';
            playerName.style.top = position[1] + 'px';
            playerName.innerText = this.players[i].name;

            var playerScore = document.getElementById('player_score_' + this.players[i].playerPosition);
            playerScore.positionFunction = "GetPlayerScorePosition('" + this.players[i].playerPosition + "')";
            position = eval(playerScore.positionFunction);
            playerScore.style.left = position[0] + 'px';
            playerScore.style.top = position[1] + 'px';
            var score = this.players[i].currentRoundPoints > 0 ? this.players[i].currentRoundPoints : "";
            playerScore.innerText = score;
        }
        setTimeout(function () {
            for (var i=0; i<4; i++) {
                var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
                playerName.style.transition = "1s linear";
                playerName.style.visibility = "visible";
                playerName.style.opacity = 1;
                var playerScore = document.getElementById('player_score_' + game.players[i].playerPosition);
                playerScore.style.transition = "1s linear";
                playerScore.style.visibility = "visible";
                playerScore.style.opacity = 1;
            }
        }, 1000);
    }

    this.ResetPlayerRoundScores = function() {
        for (var i=0; i<4; i++) {
            var playerScore = document.getElementById('player_score_' + this.players[i].playerPosition);
            playerScore.positionFunction = "GetPlayerScorePosition('" + this.players[i].playerPosition + "')";
            position = eval(playerScore.positionFunction);
            playerScore.style.left = position[0] + 'px';
            playerScore.style.top = position[1] + 'px';
            var score = this.players[i].currentRoundPoints > 0 ? this.players[i].currentRoundPoints : "";
            playerScore.innerText = score;
        
            if (i===0) {
                var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
                playerName.style.transition = "0.5s linear";
                var pos = eval(playerName.positionFunction);
                playerName.style.left = pos[0] + 'px';
                playerName.style.top = pos[1] + 'px';
            }
        }
    }

    function GetPlayerNamePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
                if (game.players[0].currentRoundPoints > 0) {
                    return [window.innerWidth*0.5-220,window.innerHeight-350];
                } else {
                    return [window.innerWidth*0.5-220,window.innerHeight-330];
                }
            case 'West':
                return [40,250];
            case 'North':
                return [window.innerWidth*0.5 + 160,30];
            default:
                return [window.innerWidth-140,250];
        }
    }

    function GetPlayerScorePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
                return [window.innerWidth*0.5-220,window.innerHeight-330];
            case 'West':
                return [40,270];
            case 'North':
                return [window.innerWidth*0.5 + 160,50];
            default:
                return [window.innerWidth-140,270];
        }
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

    this.AnimateDealCardsForRound = function() {
        this.roundNumber = this.roundNumber + 1;
        this.trickCards = [];
        for (var i=0; i<this.players.length; i++) {
            var player = this.players[i];
            player.cards = [];
            player.passingCards = [];
            player.receivedCards = [];
            player.currentRoundPoints = 0;
            player.isShownVoidInSuit = [false,false,false,false];
        }

        this.ResetPlayerRoundScores();

        // Deal cards for round
        this.isHeartsBroken = false;
        this.cardsPlayedThisRound = [];
        shuffle(cards);
        deckTopIndex = cards.length-1;
        for (var i=0; i<13; i++) {
            for (var j=0; j<4; j++) {
                this.players[j].cards.push(cards[deckTopIndex]);
                deckTopIndex = deckTopIndex-1;
            }
        }

        // Sort the players hand
        this.players[0].cards.sort(function(a,b) {
            if (a.suit != b.suit) {
                return a.suitInt - b.suitInt;
            } else {
                return a.value - b.value;
            }
        });

        // Animate the cards dealt to each player
        // WEST
        var player = this.players[1];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('West', i, player.cards.length);
            var startLeft = -300;
            var endLeft = cardLocation[0];
            var startTop = cardLocation[1];
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('West', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[1];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // North
        var player = this.players[2];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('North', i, player.cards.length);
            var startLeft = cardLocation[0];
            var endLeft = cardLocation[0];
            var startTop = -300;
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('North', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[2];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // East
        var player = this.players[3];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('East', i, player.cards.length);
            var startLeft = window.innerWidth + 300;
            var endLeft = cardLocation[0];
            var startTop = cardLocation[1];
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('East', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[3];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // South
        var player = this.players[0];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('South', i, player.cards.length);
            var startLeft = window.innerWidth*0.5;
            var endLeft = cardLocation[0];
            var startTop = window.innerHeight + 100;
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = true;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
            }
            cardView.positionFunction = "GetHandCardLocation('South', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[0];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
                setTimeout(flipUpCard, i * 80, cardView);
            }
            game.currentMoveStage = "ChoosingPassCards";
        }, 50);
        
        setTimeout(function() {
            var passingIndex = game.roundNumber % 4;
            switch (passingIndex) {
            case 0:
                game.StartTrickTaking();
                break;
            default:
                game.GetPassingCardsFromAllPlayers(passingIndex);
                break;
        }
        }, 500);
    }

    function AnimatePlayerHandCardsIntoPosition(playerPosition, duration) {
        var player;
        var flipUp = false;
        switch (playerPosition) {
            case 'South':
                player = game.players[0];
                flipUp = true;
                break;
            case 'West':
                player = game.players[1];
                break;
            case 'North':
                player = game.players[2];
                break;
            default:
                player = game.players[3];
                break;
        }
        
        for (var i=0; i<player.cards.length; i++) {
            var cardView = player.cards[i].cardView;
            if (flipUp) {
                flipUpCard(cardView);
            } else {
                flipDownCard(cardView, true);
            }
            cardView.positionIndex = i;
            cardView.positionFunction = "GetHandCardLocation('" + playerPosition + "', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
            with (cardView.style) {
                var aposition = eval(cardView.positionFunction);
                transition =  duration + " ease-out";
                transitionDelay = '0ms';
                left = aposition[0] + "px";
                top = aposition[1] + "px";
                transform = 'rotate(' + aposition[2] + 'deg)';
            }
        }
    }

    this.GetPassingCardsFromAllPlayers = function(passingIndex) {
        for (var i=1; i<4; i++) {
            var player = this.players[i];
            player.ChoosePassingCards();
        }

        currentPassingCardView_0 = null;
        currentPassingCardView_1 = null;
        currentPassingCardView_2 = null;

        var selectPassingCardsMessage = document.getElementById('select_passing_cards_message');
        switch (passingIndex) {
            case 1:
                selectPassingCardsMessage.innerText = "Select 3 cards to pass left:";
                break;
            case 2:
                selectPassingCardsMessage.innerText = "Select 3 cards to pass right:";
                break;
            default:
                selectPassingCardsMessage.innerText = "Select 3 cards to pass across:";
                break;
        }
        selectPassingCardsMessage.positionFunction = "GetPassingCardsMessageLocation()";
        var loc = eval(selectPassingCardsMessage.positionFunction);
        selectPassingCardsMessage.style.transition = "none";
        selectPassingCardsMessage.style.left = loc[0] + "px";
        selectPassingCardsMessage.style.top = loc[1] + "px";
        with (selectPassingCardsMessage.style) {
            visibility = "visible";
            transition = "0.5s linear";
            transitionDelay = "1s";
            opacity = 1;
        }

        for (var i=0; i<3; i++) {
            var selectPassingCardsRegion = document.getElementById('select_passing_cards_region_' + i);
            selectPassingCardsRegion.positionFunction = "GetPassingCardsLocation(" + i + ")";
            var loc = eval(selectPassingCardsRegion.positionFunction);
            selectPassingCardsRegion.style.transition = "none";
            selectPassingCardsRegion.style.left = loc[0] + "px";
            selectPassingCardsRegion.style.top = loc[1] + "px";
            with (selectPassingCardsRegion.style) {
                visibility = "visible";
                transition = "0.5s linear";
                transitionDelay = "1s";
                opacity = 1;
            }
        }

        this.currentMoveStage = "ChoosingPassCards";
        
        if (this.skillLevel === 'Easy' || GetSetting('setting_hints')) {
          ShowHintButton(1000);
        }
    }

    function GetPassingCardsMessageLocation() {
        return [0, 100];
    }

    function GetPassingCardsLocation(index)
    {
        var left = 0;
        switch (index) {
            case 0:
                left = window.innerWidth*0.5 - 150;
                break;
            case 1:
                left = window.innerWidth*0.5;
                break;
            default:
                left = window.innerWidth*0.5 + 150;
                break;
        }

        return [left- cardLoweredWidth*0.5, 140];
    }

    var currentPassingCardView_0 = null;
    var currentPassingCardView_1 = null;
    var currentPassingCardView_2 = null;
    var currentDraggedCardWasLastInHand;

    function passingCardsPointerPressed() {

        // Find the autoplay line for dropped cards
        if (currentDraggedCardView === currentPassingCardView_0) {
            currentDraggedCardView.style.zIndex = 200;
            autoPlayBoundaryY = GetPassingCardsLocation(0)[1] + 70;
            currentPassingCardView_0 = null;
            currentDraggedCardWasLastInHand = false;
            HidePassCardsButton();
            game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
            game.players[0].cards.push(currentDraggedCardView.card);
            // Sort the players hand
            game.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        } else if (currentDraggedCardView === currentPassingCardView_1) {
            currentDraggedCardView.style.zIndex = 200;
            autoPlayBoundaryY = GetPassingCardsLocation(0)[1] + 70;
            currentPassingCardView_1 = null;
            currentDraggedCardWasLastInHand = false;
            HidePassCardsButton();
            game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
            game.players[0].cards.push(currentDraggedCardView.card);
            // Sort the players hand
            game.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        } else if (currentDraggedCardView === currentPassingCardView_2) {
            currentDraggedCardView.style.zIndex = 200;
            autoPlayBoundaryY = GetPassingCardsLocation(0)[1] + 70;
            currentPassingCardView_2 = null;
            currentDraggedCardWasLastInHand = false;
            HidePassCardsButton();
            game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
            game.players[0].cards.push(currentDraggedCardView.card);
            // Sort the players hand
            game.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        } else {
            autoPlayBoundaryY = GetHandCardLocation('South', 0, 13)[1] - 50;
            currentDraggedCardWasLastInHand = true;
        }
        raiseCard(currentDraggedCardView);
    }

    function cardTouchFinished() {
        
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;

        if (game.currentMoveStage === 'ChoosingPassCards') {
            if (currentDraggedCardWasLastInHand) {
                if (tapped || (currentDraggedCardView.offsetTop < autoPlayBoundaryY)) {
                    DropCurrentDraggedCardViewIntoPassingSlot();
                } else {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                }
            } else {
                if (tapped || currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                } else {
                    DropCurrentDraggedCardViewIntoPassingSlot();
                }
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
            if (tapped) {
                game.DropCardInTrickPile();
            } else {
                if (currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
                    game.DropCardInTrickPile();
                } else {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                }
            }
        }
        
        
        lowerCard(currentDraggedCardView);
    }

    function DropCurrentDraggedCardViewIntoPassingSlot()
    {
        var player = game.players[0];
        if (player.passingCards.length < 3) {
            var indexOfCard = player.cards.indexOf(currentDraggedCardView.card);
            var card = player.cards[indexOfCard];
            player.cards.splice(indexOfCard, 1);
            player.passingCards.push(card);
            
            // Pick the closest passing spot
            var closestOpenPassingIndex = -1;
            var closestDistance = 10000000;
            for (var i=0; i<3; i++) {
                switch (i) {
                    case 0:
                        if (currentPassingCardView_0 !== null) {
                            continue;
                        }
                        break;
                    case 1:
                        if (currentPassingCardView_1 !== null) {
                            continue;
                        }
                        break;
                    case 2:
                        if (currentPassingCardView_2 !== null) {
                            continue;
                        }
                        break;
                }
                var spotLoc = GetPassingCardsLocation(i);
                var distX = currentDraggedCardView.offsetLeft - spotLoc[0];
                var distY = currentDraggedCardView.offsetTop - spotLoc[1];
                var dist = Math.sqrt(distX*distX + distY*distY);
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestOpenPassingIndex = i;
                }
            }
            
            switch (closestOpenPassingIndex) {
                case 0:
                    currentPassingCardView_0 = currentDraggedCardView;
                    break;
                case 1:
                    currentPassingCardView_1 = currentDraggedCardView;
                    break;
                case 2:
                    currentPassingCardView_2 = currentDraggedCardView;
                    break;
                default:
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                    return;

            }
            currentDraggedCardView.positionFunction = 'GetPassingCardsLocation(' + closestOpenPassingIndex + ')';
            var pos = eval(currentDraggedCardView.positionFunction);
            with (currentDraggedCardView.style) {
                transition =  "0.3s ease-out";
                transitionDelay = '0ms';
                left = pos[0] + "px";
                top = pos[1] + "px";
                transform = 'rotate(0deg)';
                zIndex = 0;
            }

            if (player.passingCards.length === 3) {
                ShowPassCardsButton();
            }
        }
        
        AnimatePlayerHandCardsIntoPosition('South', "0.3s");
    }

    function ShowPassCardsButton() {
        var passCardsRegion = document.getElementById('confirm_passing_cards_region');
        passCardsRegion.positionFunction = 'GetPassingCardsConfirmLocation()';
        var loc = eval(passCardsRegion.positionFunction);
        passCardsRegion.style.transition = 'none';
        passCardsRegion.style.left = loc[0] + 'px';
        passCardsRegion.style.top = loc[1] + 'px';
        passCardsRegion.style.visibility = "visible";
        with (passCardsRegion.style) {
            transition = "0.3s linear";
            opacity = 1;
            pointerEvents = "auto";
        }
    }

    function GetPassingCardsConfirmLocation() {
        var loc = GetPassingCardsLocation(0);
        return [window.innerWidth*0.5, loc[1] + 185];
    }

    function HidePassCardsButton() {
        var confirmCribRegion = document.getElementById('confirm_passing_cards_region');
        with (confirmCribRegion.style) {
            transition = "0.2s linear";
            opacity = 0;
            pointerEvents = "none";
        }
    }

    
    function GetHintButtonPosition() {
        var left = window.innerWidth*0.5 + 250;
        if (left > window.innerWidth - 130) {
            left = window.innerWidth - 130;
        }
        return [left, window.innerHeight-340];
    }

    function ShowHintButton(delay) {
        var hintButton = document.getElementById('hint_button');
        hintButton.positionFunction = "GetHintButtonPosition()";
        hintButton.style.transition = "none";
        var loc = eval(hintButton.positionFunction);
        hintButton.style.left = loc[0] + 'px';
        hintButton.style.top = loc[1] + 'px';
        hintButton.style.visibility = 'visible';
        hintButton.style.pointerEvents = "auto";
        setTimeout(function () {
            hintButton.style.transition = "0.5s linear";
            hintButton.style.opacity = 1;
            setTimeout(function() {
                hintButton.style.transition = "none";
            }, 600);
        }, delay);
    }

    function HideHintButton() {
        var hintButton = document.getElementById('hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        this.BumpHintCards();
    }

    this.OnTestButtonClick = function() {
        var player = this.players[0];
        var bestResult = FindOptimalPlayForCurrentPlayer(game, true, true);
        BumpCard(bestResult.optimalCard.cardView);
    }

    this.BumpHintCards = function() {
        var optimalCards = [];
        if (this.currentMoveStage === 'ChoosingPassCards') {
            var player = this.players[0];
            var bestCards = player.FindBestPassingCards();
            for (var i=0; i<bestCards.length; i++) {
                optimalCards.push(bestCards[i]);
            }
            
        } else if (this.currentMoveStage === 'ChoosingTrickCard') {
            var player = this.players[0];
            var bestCard = player.FindBestPlayingCard(game, true);
            optimalCards.push(bestCard);
        }

        BumpCards(optimalCards, 0);
    }

    this.passingCardsConfirmed = function() {
        // PerformCardPassingBetweenPlayers
        this.currentMoveStage = 'None';
        HidePassCardsButton();
        HideHintButton();

        var player = this.players[1];
        for (var i=0; i<player.passingCards.length; i++) {
            var card =  player.passingCards[i];
            var cardView = card.cardView;
            with (cardView.style) {
                transition = "0.3s ease-in-out";
                left = (cardView.offsetLeft + 30) + "px";
            }
        }

        player = this.players[2];
        for (var i=0; i<player.passingCards.length; i++) {
            var card =  player.passingCards[i];
            var cardView = card.cardView;
            with (cardView.style) {
                transition = "0.3s ease-in-out";
                top = (cardView.offsetTop + 30) + "px";
            }
        }

        player = this.players[3];
        for (var i=0; i<player.passingCards.length; i++) {
            var card =  player.passingCards[i];
            var cardView = card.cardView;
            with (cardView.style) {
                transition = "0.3s ease-in-out";
                left = (cardView.offsetLeft - 30) + "px";
            }
        }

        for (var i=0; i<3; i++) {
            var selectPassingCardsRegion = document.getElementById('select_passing_cards_region_' + i);
            with (selectPassingCardsRegion.style) {
                transition = "0.3s linear";
                transitionDelay = "0s";
                opacity = 0;
            }
        }

        var passingCardsMessage = document.getElementById('select_passing_cards_message');
        with (passingCardsMessage.style) {
            transition = "0.3s linear";
            transitionDelay = "0s";
            opacity = 0;
        }

        setTimeout(() => {
            var passingIndex = game.roundNumber % 4;
            switch (passingIndex) {
                case 1: {
                    // Pass left
                    for (var i=0; i<4; i++) {
                        var player = game.players[i];
                        var passPlayer = game.players[(i+1)%4];
                        for (var j=0; j<player.passingCards.length; j++) {
                            var idx = Math.floor(Math.random() * Math.floor(passPlayer.cards.length));
                            passPlayer.cards.splice(idx, 0, player.passingCards[j]);
                        }
                        passPlayer.receivedCards = [];
                        for (var j=0; j<player.passingCards.length; j++) {
                            passPlayer.receivedCards.push(player.passingCards[j]);
                        }
                        player.passingCards = [];
                    }
                } break;
                case 2: {
                    // Pass right
                    for (var i=0; i<4; i++) {
                        var player = game.players[i];
                        var passPlayer = game.players[(i-1+4)%4];
                        for (var j=0; j<player.passingCards.length; j++) {
                            var idx = Math.floor(Math.random() * Math.floor(passPlayer.cards.length));
                            passPlayer.cards.splice(idx, 0, player.passingCards[j]);
                        }
                        passPlayer.receivedCards = [];
                        for (var j=0; j<player.passingCards.length; j++) {
                            passPlayer.receivedCards.push(player.passingCards[j]);
                        }
                        player.passingCards = [];
                    }
                } break;
                case 3: {
                    // Pass across
                    for (var i=0; i<4; i++) {
                        var player = game.players[i];
                        var passPlayer = game.players[(i+2)%4];
                        for (var j=0; j<player.passingCards.length; j++) {
                            var idx = Math.floor(Math.random() * Math.floor(passPlayer.cards.length));
                            passPlayer.cards.splice(idx, 0, player.passingCards[j]);
                        }
                        passPlayer.receivedCards = [];
                        for (var j=0; j<player.passingCards.length; j++) {
                            passPlayer.receivedCards.push(player.passingCards[j]);
                        }
                        player.passingCards = [];
                    }
                } break;
                default:
                    break;
            }

            AnimatePassingCardsIntoHands();
        }, 350);
    }

    function AnimatePassingCardsIntoHands() {
        AnimatePlayerHandCardsIntoPosition('West', "1s");
        AnimatePlayerHandCardsIntoPosition('North', "1s");
        AnimatePlayerHandCardsIntoPosition('East', "1s");

        var player = game.players[0];
        player.receivedCards.sort(function(a,b) {
            if (a.suit != b.suit) {
                return a.suitInt - b.suitInt;
            } else {
                return a.value - b.value;
            }
        });

        for (var i=0; i<3; i++) {
            var card = player.receivedCards[i];
            var cardView = card.cardView;
            flipUpCard(cardView);
            var loc = GetPassingCardsLocation(i);
            with (cardView.style) {
                transition = "0.8s ease-in-out";
                left = loc[0] + 'px';
                top = loc[1] + 50 + 'px';
                transform = 'rotate(0deg)';
            }
        }

        player.cards.sort(function(a,b) {
            if (a.suit != b.suit) {
                return a.suitInt - b.suitInt;
            } else {
                return a.value - b.value;
            }
        });

        for (var i=0; i<player.cards.length; i++) {
            var cardView = player.cards[i].cardView;
            cardView.style.zIndex = 100 + i;
        }

        setTimeout(function() {
            AnimatePlayerHandCardsIntoPosition('South', '1s');
            setTimeout(function() {
                game.StartTrickTaking();
            }, 1500);
        }, 2000);
    }

    this.StartTrickTaking = function() {
        // Determine the lead index player
        for (var i=0; i<this.players.length; i++) {
            var leadFound = false;
            var player = this.players[i];
            for (var j=0; j<player.cards.length; j++) {
                var card = player.cards[j];
                if (card.id === '2C') {
                    leadFound = true;
                    this.leadIndex = i;
                    break;
                }
            }
            if (leadFound) {
                break;
            }
        }

        this.turnIndex = this.leadIndex;
        var nextPlayer = this.players[this.turnIndex];
        nextPlayer.ChoosePlayCard();
    }

    this.PromptPlayerToPlayCard = function() {
        var playerPrompt = document.getElementById('player_play_prompt');
        playerPrompt.positionFunction = "GetTrickPlayPromptLocation()";
        playerPrompt.style.transition = 'none';
        var loc = eval(playerPrompt.positionFunction);
        playerPrompt.style.left = loc[0] + 'px';
        playerPrompt.style.top = loc[1] + 'px';
        playerPrompt.style.visibility = 'visible';
        with (playerPrompt.style) {
            transition = "0.5s linear";
            transitionDelay = "1s";
            opacity = 1;
        }

        var player = this.players[0];
        var legalPlayCards = this.GetLegalCardsForCurrentPlayerTurn();
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            var cardView = card.cardView;
            var isLegal = false;
            for (var j=0; j<legalPlayCards.length; j++) {
                var legalCard = legalPlayCards[j];
                if (card.id === legalCard.id) {
                    isLegal = true;
                    break;
                }
            }
            if (isLegal) {
                UnshadeCard(cardView);
                cardView.isClickable = true;
            } else {
                ShadeCard(cardView);
                cardView.isClickable = false;
            }
        }
        
        if (this.skillLevel === 'Easy' || GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        this.currentMoveStage = "ChoosingTrickCard";
    }

    function GetTrickPlayPromptLocation() {
        return [window.innerWidth*0.5, 350]; 
    }

    function GetTrickDiscardLocation(playerPostion) {
        switch (playerPostion) {
            case 'South':
                return [window.innerWidth*0.5 - cardLoweredWidth*0.5, 330 - cardLoweredHeight*0.5];
            case 'West':
                return [window.innerWidth*0.5 - cardLoweredWidth*1.5 - 20, 250 - cardLoweredHeight*0.5];
            case 'North':
                return [window.innerWidth*0.5 - cardLoweredWidth*0.5, 150 - cardLoweredHeight*0.5];
            default:
                return [window.innerWidth*0.5 + cardLoweredWidth*0.5 + 20, 250 - cardLoweredHeight*0.5];
        }
    }

    this.GetLegalCardsForCurrentPlayerTurn = function() {
        var legalCards = [];
        var player = this.players[this.turnIndex%4];
        if (this.trickCards.length === 0 && player.cards.length === 13) {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (card.id === '2C') {
                    legalCards.push(card);
                    return legalCards;
                }
            }
        } else {
            if (this.trickCards.length === 0) {
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (this.isHeartsBroken || card.suit != 'H') {
                        legalCards.push(card);
                    }
                }
            } else {
                var leadCard = this.trickCards[0];
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit === leadCard.suit) {
                        legalCards.push(card);
                    }
                }
            }

            if (legalCards.length === 0) {
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (player.cards.length === 13) {
                        if (card.suit === 'H' || card.id === 'QS') {
                            continue;
                        }
                    }
                    legalCards.push(card);
                }
            }
        }

        return legalCards;
    }

    this.OnPlayerChosePlayCard = function(card) {
        this.currentMoveStage = 'None';
        var playerPrompt = document.getElementById('player_play_prompt');
        with (playerPrompt.style) {
            transition = "0.1s linear";
            opacity = 0;
        }

        var player = this.players[this.turnIndex%4];
        this.PlayCard(card);
        
        var cardView = card.cardView;
        cardView.positionFunction = "GetTrickDiscardLocation('" + player.playerPosition + "')";
        var loc = eval(cardView.positionFunction);
        flipUpCard(cardView);
        with (cardView.style) {
            transition = "0.3s ease-out";
            transitionDelay = "0s";
            left = loc[0] + 'px';
            top = loc[1] + 'px';
            transform = 'none';
            zIndex = 0;
        }
        if (player.playerPosition === 'South') {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                var cardView = card.cardView;
                UnshadeCard(cardView);
                cardView.isClickable = false;
            }
        }
        AnimatePlayerHandCardsIntoPosition(player.playerPosition, "0.3s");

        if (this.trickCards.length !== 4) {
            var nextPlayer = this.players[this.turnIndex%4];
            setTimeout(function() {
                nextPlayer.ChoosePlayCard();
            }, 500);
        } else {
            var trickResult = this.GetTrickResult();
            trickResult.trickTaker.currentRoundPoints += trickResult.points;
            this.leadIndex = trickResult.trickTaker.playerPositionInt;
            this.AnimateTrickResult(trickResult);
        }
    }

    this.DropCardInTrickPile = function() {
        var playedCard = currentDraggedCardView.card;
        HideHintButton();
        this.OnPlayerChosePlayCard(playedCard);
    }

    this.PlayCard = function(card) {
        var player = this.players[this.turnIndex%4];
        if (card.suit === 'H') {
            this.isHeartsBroken = true;
        }

        this.cardsPlayedThisRound.push(card);
        if (this.trickCards.length !== 0) {
            var leadCard = this.trickCards[0];
            if (card.suit !== leadCard.suit) {
                player.isShownVoidInSuit[leadCard.suitInt] = true;
            }
        }

        player.cards.splice(player.cards.indexOf(card), 1);
        this.trickCards.push(card);
        this.turnIndex = this.turnIndex + 1;
    }

    this.GetTrickResult = function() {
        var trickResult = {};
        trickResult.highestCard = this.trickCards[0];
        trickResult.trickTaker = this.players[this.leadIndex];
        trickResult.points = 0;
        if (trickResult.highestCard.id === 'QS') {
            trickResult.points = 13;
        } else if (trickResult.highestCard.suit === 'H') {
            trickResult.points = 1;
        }
        for (var i=1; i<this.trickCards.length; i++) {
            var card = this.trickCards[i];
            if (card.id === 'QS') {
                trickResult.points = trickResult.points + 13;
            } else if (card.suit === 'H') {
                trickResult.points = trickResult.points + 1;
            }
            if (card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) {
                trickResult.highestCard = card;
                trickResult.trickTaker = this.players[(this.leadIndex + i)%4];
            }
        }
        return trickResult;
    }

    this.AnimateTrickResult = function(trickResult) {
        var cardView = trickResult.highestCard.cardView;
        FlashHighlightCardView(cardView);

        var delay = 1400;
        if (trickResult.points === 13) {
            AnimateScoreBubble(trickResult.trickTaker.playerPosition, 0, 13, 500);
            delay += 500;
        } else if (trickResult.points > 13) {
            AnimateScoreBubble(trickResult.trickTaker.playerPosition, trickResult.points-13, 13, 500);
            delay += 500;
        } else if (trickResult.points > 0) {
            AnimateScoreBubble(trickResult.trickTaker.playerPosition, trickResult.points, 0, 500);
            delay += 500;
        }

        setTimeout(function() {
            for (var i=0; i<game.trickCards.length; i++) {
                var cardView = game.trickCards[i].cardView;
                cardView.positionFunction = "GetWonTrickCardsPilePostion('" + trickResult.trickTaker.playerPosition + "')";
                var loc = eval(cardView.positionFunction);
                with (cardView.style) {
                    transition = "1s ease-out";
                    left = loc[0] + 'px';
                    top = loc[1] + 'px';
                    visibility = 'hidden';
                }
            }    
        }, delay);

        if (trickResult.points > 0) {
            // UpdatePlayerRoundScore
            var scoreView = document.getElementById('player_score_' + trickResult.trickTaker.playerPosition);
            if (trickResult.trickTaker.playerPosition === 'South') {
                var southName = document.getElementById('player_name_South');
                var loc = eval(southName.positionFunction);
                with (southName.style) {
                    transition = "0.3s linear";
                    transitionDelay = "1.5s";
                    top = loc[1] + 'px';
                }
            }
            setTimeout(function() {
                scoreView.innerHTML = trickResult.trickTaker.currentRoundPoints;
            }, 2000);
        }

        setTimeout(function() {
            if (game.players[0].cards.length !== 0) {
                game.trickCards = [];
                game.turnIndex = game.leadIndex;
                var nextPlayer = game.players[game.turnIndex];
                nextPlayer.ChoosePlayCard();
            } else {
                game.FinishRound();
            }
        }, delay + 1000);
    }

    function GetWonTrickCardsPilePostion(playerPosition) {
        var loc = GetHandCardLocation(playerPosition, 6, 12);
        switch (playerPosition) {
            case 'South':
                return [loc[0], window.innerHeight + 150];
            case 'West':
                return [-150, loc[1]];
            case 'North':
                return [loc[0], -150];
            default:
                return [window.innerWidth + 150, loc[1]];
        }
    }

    function AnimateScoreBubble(playerPosition, heartsPoints, spadesPoints, delay) {

        setTimeout(function () {
            
            var posLeftHeart = 0;
            var posLeftSpade = 0;
            var posTop = 250 - 50;
            var slideDistance = 200;
            
            if (heartsPoints > 0 && spadesPoints > 0) {
                var heartTemplate = document.getElementById('BubbleScoreHeartTemplate');
                var heartScoreBubble = heartTemplate.cloneNode(true);
                heartScoreBubble.getElementsByClassName('BubbleScoreHeartsPoints')[0].innerText = "+" + heartsPoints;
                posLeftHeart = window.innerWidth*0.5 - 50 - 25;
                var spadeTemplate = document.getElementById('BubbleScoreSpadeTemplate');
                var spadeScoreBubble = spadeTemplate.cloneNode(true);
                spadeScoreBubble.getElementsByClassName('BubbleScoreSpadesPoints')[0].innerText = "+" + spadesPoints;
                posLeftSpade = window.innerWidth*0.5 + 25;
            } else if (spadesPoints > 0) {
                var spadeTemplate = document.getElementById('BubbleScoreSpadeTemplate');
                var spadeScoreBubble = spadeTemplate.cloneNode(true);
                spadeScoreBubble.getElementsByClassName('BubbleScoreSpadesPoints')[0].innerText = "+" + spadesPoints;
                posLeftSpade = window.innerWidth*0.5 - 42
            } else if (heartsPoints > 0) {
                var heartTemplate = document.getElementById('BubbleScoreHeartTemplate');
                var heartScoreBubble = heartTemplate.cloneNode(true);
                heartScoreBubble.getElementsByClassName('BubbleScoreHeartsPoints')[0].innerText = "+" + heartsPoints;
                posLeftHeart = window.innerWidth*0.5 - 50
            }
            
            switch (playerPosition) {
                case 'South':
                    slideDistance = window.innerHeight*0.5;
                    var posLeftHeartEnd = posLeftHeart;
                    var posLeftSpadeEnd = posLeftSpade;
                    var posTopHeartEnd = posTop + slideDistance;
                    var posTopSpadeEnd = posTop + slideDistance;
                break;
                case 'West':
                    slideDistance = window.innerWidth*0.5;
                    var posLeftHeartEnd = posLeftHeart - slideDistance;
                    var posLeftSpadeEnd = posLeftSpade - slideDistance;
                    var posTopHeartEnd = posTop;
                    var posTopSpadeEnd = posTop;
                break;
                case 'North':
                    slideDistance = window.innerHeight*0.5;
                    var posLeftHeartEnd = posLeftHeart;
                    var posLeftSpadeEnd = posLeftSpade;
                    var posTopHeartEnd = posTop - slideDistance;
                    var posTopSpadeEnd = posTop - slideDistance;
                break;
                case 'East':
                    slideDistance = window.innerWidth*0.5;
                    var posLeftHeartEnd = posLeftHeart + slideDistance;
                    var posLeftSpadeEnd = posLeftSpade + slideDistance;
                    var posTopHeartEnd = posTop;
                    var posTopSpadeEnd = posTop;
                    break;
            }

            if (heartsPoints > 0) {
                heartScoreBubble.style.opacity = 1;
                heartScoreBubble.style.transition = "none";
                heartScoreBubble.style.transform = 'scale(0)';
                heartScoreBubble.style.left = posLeftHeart + "px";
                heartScoreBubble.style.top = posTop + "px";
                heartScoreBubble.style.zIndex = 500;
                heartScoreBubble.style.visibility = 'visible';

                var cards_region = document.getElementById('cards_region');
                cards_region.appendChild(heartScoreBubble);
                setTimeout(function () {
                    heartScoreBubble.style.transition = "0.3s ease-in";
                    heartScoreBubble.style.transform = 'scale(1)';
                    setTimeout(function () {
                        heartScoreBubble.style.transition = "1s ease-in";
                        heartScoreBubble.style.left = posLeftHeartEnd + 'px';
                        heartScoreBubble.style.top = posTopHeartEnd + 'px';
                        heartScoreBubble.style.opacity = 0;
                        setTimeout(function () {
                            cards_region.removeChild(heartScoreBubble);
                        }, 1000);
                    }, 1200);
                }, 50);
            }
            if (spadesPoints > 0) {
                spadeScoreBubble.style.opacity = 1;
                spadeScoreBubble.style.transition = "none";
                spadeScoreBubble.style.transform = 'scale(0)';
                spadeScoreBubble.style.left = posLeftSpade + "px";
                spadeScoreBubble.style.top = posTop + "px";
                spadeScoreBubble.style.zIndex = 500;
                spadeScoreBubble.style.visibility = 'visible';

                var cards_region = document.getElementById('cards_region');
                cards_region.appendChild(spadeScoreBubble);
                setTimeout(function () {
                    spadeScoreBubble.style.transition = "0.3s ease-in";
                    spadeScoreBubble.style.transform = 'scale(1)';
                    setTimeout(function () {
                        spadeScoreBubble.style.transition = "1s ease-in";
                        spadeScoreBubble.style.left = posLeftSpadeEnd + 'px';
                        spadeScoreBubble.style.top = posTopSpadeEnd + 'px';
                        spadeScoreBubble.style.opacity = 0;
                        setTimeout(function () {
                            cards_region.removeChild(spadeScoreBubble);
                        }, 1000);
                    }, 1200);
                }, 50);
            }

        }, delay);
    }

    this.FinishRound = function() {
        var moonShootPlayer = null;
        var aRoundScores = [];
        for (var i=0; i<4; i++) {
            if (this.players[i].currentRoundPoints === 26) {
                moonShootPlayer = this.players[i];
                for (var j=0; j<4; j++) {
                    if (j === i) {
                        aRoundScores.push(0);
                        continue;
                    }
                    this.players[j].gameScore += 26;
                    aRoundScores.push(26);
                }
                break;
            }
        }

        if (moonShootPlayer === null) {
            for (var i=0; i<4; i++) {
                this.players[i].gameScore += this.players[i].currentRoundPoints;
                aRoundScores.push(this.players[i].currentRoundPoints);
            }
        }

        this.roundScores.push(aRoundScores);

        for (var i=0; i<4; i++) {
            this.players[i].currentRoundPoints = 0;
        }

        if (moonShootPlayer !== null) {
            this.AnimateShootTheMoonForPlayer(moonShootPlayer);
            if (moonShootPlayer.isHuman) {
                var setting = 'stat_moons_shot_' + this.skillLevel;
                var settingVal = GetStatistic(setting);
                SetStatistic(setting, settingVal + 1);
            }
        } else {
            this.ContinueAfterRoundResultAnimations();
        }
    }

    this.AnimateShootTheMoonForPlayer = function(player) {
        var heartsCardViews = [];
        for (var i=0; i<cards.length; i++) {
            if (cards[i].suit === 'H') {
                heartsCardViews.push(cards[i].cardView);
            }
        }
        heartsCardViews.sort(function(a,b){
            return a.card.value - b.card.value;
        });
        heartsCardViews.push(this.GetCardFromString('QS').cardView);

        var labelText = "";
        var handReturnLeft = 0;
        var handReturnTop = 0;
        switch (player.playerPosition) {
            case 'South':
                labelText = "You shot the moon!";
                handReturnLeft = window.innerWidth*0.5;
                handReturnTop = window.innerHeight + 180;
                break;
            case 'West':
                labelText = player.name + " shot the moon.";
                handReturnLeft = -180;
                handReturnTop = window.innerHeight*0.5;
                break;
            case 'North':
                labelText = player.name + " shot the moon.";
                handReturnLeft = window.innerWidth*0.5;
                handReturnTop = -220;
                break;
            default:
                labelText = player.name + " shot the moon.";
                handReturnLeft = window.innerWidth + 220;
                handReturnTop = window.innerHeight*0.5;
                break;
        }

        var moonShootText = document.getElementById('moon_shoot_text');
        moonShootText.innerHTML = labelText;
        with (moonShootText.style) {
            transition = '1s linear';
            transitionDelay = '1s';
            visibility = 'visible';
            opacity = 1;
        }

        var curDelay = 0;
        var delayIncrement = 0.1;
        for (var i=0; i<heartsCardViews.length; i++) {
            var cardView = heartsCardViews[i];
            
            var firstLeft = window.innerWidth*0.5 - 200;
            var lastLeft = window.innerWidth*0.5  + 200;
            var firstTop = window.innerHeight*0.4;
            var lastTop = window.innerHeight*0.4;
            var handWidth = lastLeft-firstLeft;
            var cardSpacing = handWidth/(heartsCardViews.length-1);
            var curLeft = firstLeft + i*cardSpacing;
            var percent = (curLeft - firstLeft)/handWidth;
            var radius = 400;
            var distanceFromCenter = handWidth*(0.5 - percent);
            var curveHeight = Math.sqrt(radius*radius-distanceFromCenter*distanceFromCenter) - Math.sqrt(radius*radius - handWidth*0.5*handWidth*0.5); 
            var curveRotation = Math.asin(-distanceFromCenter/radius)*180/Math.PI;
            var curTop = firstTop - curveHeight;
            var endLeft = curLeft-cardLoweredWidth*0.5;
            var endTop = curTop-cardLoweredHeight*0.5;
            
            flipDownCard(cardView, false);
            setTimeout(flipUpCard, 100 + curDelay*1000, cardView);
            with (cardView.style) {
                transition = "0.3s ease-out";
                transitionDelay = curDelay + "s";
                left = endLeft + 'px';
                top = endTop + 'px';
                transform = 'rotate(' + curveRotation + 'deg)';
                zIndex = i;
                visibility = 'visible';
            }
            curDelay = curDelay + delayIncrement;
        }

        setTimeout(function(desLeft, desTop) {
            for (var i=0; i<heartsCardViews.length; i++) {
                var cardView = heartsCardViews[i];
                with (cardView.style) {
                    left = desLeft + 'px';
                    top = desTop + 'px';
                    transform = 'rotate(180deg)';
                }
            }
            var moonShootText = document.getElementById('moon_shoot_text');
            with (moonShootText.style) {
                transition = '1s linear';
                opacity = 0;
            }
            setTimeout(game.ContinueAfterRoundResultAnimations, 1000);
        }, 4000, handReturnLeft, handReturnTop);

    }

    this.ContinueAfterRoundResultAnimations = function() {
        scoreboard.UpdateScores(this.roundNumber !== 1);
    }

    this.OnFinishedAnimatingUpdateGameScoreboard = function() {
        scoreboard.SlideDown();
        var winner = this.TryToGetWinningPlayer();
        if (winner !== null) {
            this.OnGameOver(winner);
        } else {
            this.AnimateDealCardsForRound();
        }
    }

    this.TryToGetWinningPlayer = function() {
        for (var i=0; i<4; i++) {
            if (this.players[i].gameScore >= this.losingScore) {
                // Check to be sure that someone is the winner
                var p = [];
                for (var j=0; j<4; j++) {
                    p.push(this.players[j]);
                }
                p.sort(function(a,b) { 
                    return a.gameScore - b.gameScore;
                });
                var winner = p[0];
                if (winner.gameScore < p[1].gameScore) {
                    return winner;
                }
                return null;
            }
        }
        return null;
    }

    this.OnGameOver = function(winner) {
        var humanPlayerPlace = this.GetTheHumanPlayersPlace();
        var gameOverLine1 = "";
        var gameOverLine2 = "";
        switch (humanPlayerPlace) {
            case 1:
                gameOverLine1 = "You won!";
                gameOverLine2 = "vs the " + this.skillLevel.toLowerCase() + " players";
                var setting = 'stat_wins_' + this.skillLevel;
                var settingVal = GetStatistic(setting);
                SetStatistic(setting, settingVal + 1);
                break;
            case 2:
                gameOverLine1 = winner.name + " won.";
                switch (humanPlayerPlace) { case 2: gameOverLine2 = "You finished in 2nd place."; break; case 3: gameOverLine2 = "You finished in 3rd place."; break; case 4: gameOverLine2 = "You finished in 4th place."; break;};
                var setting = 'stat_2nd_' + this.skillLevel;
                var settingVal = GetStatistic(setting);
                SetStatistic(setting, settingVal + 1);
                break;
            case 3:
                gameOverLine1 = winner.name + " won.";
                switch (humanPlayerPlace) { case 2: gameOverLine2 = "You finished in 2nd place."; break; case 3: gameOverLine2 = "You finished in 3rd place."; break; case 4: gameOverLine2 = "You finished in 4th place."; break;};
                var setting = 'stat_3rd_' + this.skillLevel;
                var settingVal = GetStatistic(setting);
                SetStatistic(setting, settingVal + 1);
                break;
            case 4:
                gameOverLine1 = winner.name + " won.";
                switch (humanPlayerPlace) { case 2: gameOverLine2 = "You finished in 2nd place."; break; case 3: gameOverLine2 = "You finished in 3rd place."; break; case 4: gameOverLine2 = "You finished in 4th place."; break;};
                var setting = 'stat_4th_' + this.skillLevel;
                var settingVal = GetStatistic(setting);
                SetStatistic(setting, settingVal + 1);
                break;
        }

        HideHintButton();
        HideMenuButton();
        HideAllMessages();

        var gameOverView = document.getElementById('GameOverView');
        var gameOverLine1Elem = document.getElementById('GameOverResultText');
        gameOverLine1Elem.innerText = gameOverLine1;
        var gameOverLine2Elem = document.getElementById('GameOverResultText2');
        gameOverLine2Elem.innerText = gameOverLine2;
        with (gameOverView.style) {
            transition = 'none';
            transform = 'translate(-50%,-50%) scale(0)';
            top = "50%";
            opacity = 1;
            visibility = 'visible';
        }   
        setTimeout(function() {
            with (gameOverView.style) {
                transition = "0.5s ease-out";
                transform = 'translate(-50%,-50%) scale(1)';
            }
        }, 300); 
        setTimeout(function() {
            with (gameOverView.style) {
                transition = "0.5s ease-in";
                transform = 'translate(-50%,-50%) scale(1)';
                top = "-200px";
            }
            scoreboard.SlideUp();

            ShowMainMenu(false);
            ShowTitle();
            
        }, 7000);

        this.AnimateGameOverCardAnimations();
    }

    this.GetTheHumanPlayersPlace = function() {
        var p = [];
        for (var j=0; j<4; j++) {
            p.push(this.players[j]);
        }
        p.sort(function(a,b) { 
            return a.gameScore - b.gameScore;
        });
        for (var i=0; i<4; i++) {
            if (p[i].isHuman) {
                return i+1;
            }
        }
        return 0;
    }

    this.AnimateGameOverCardAnimations = function() {
        var curAnimationId = GetTotalGamesPlayed();
        var totalAnimationsAvailable = 4;
        var cardAnimStartDelay = 1000;
        switch (curAnimationId%totalAnimationsAvailable) {
            case 0:
            {
                // Gravity Bouncing
                
                var startLeft = 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";
                
                    var totalTime = 9;
                    var curTime = 0;
                    var deltaTime = 0.1;
                    var gravity = [0, 200];
                    var curVelocity = [200*deltaTime, 0];
                    var curPositionX = startLeft;
                    var curPositionY = startTop;
                    var isFallingOutOfView = false;
                    var bottomBounceY = window.innerHeight - cardLoweredHeight;
                    while (curTime < totalTime) {
                        var percentComplete = 100 * curTime / totalTime;
                        keyframesText = keyframesText + percentComplete + '% {opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        
                        curPositionX = curPositionX + curVelocity[0];
                        curPositionY = curPositionY + curVelocity[1];
                        curVelocity[0] = curVelocity[0] + gravity[0]*deltaTime;
                        curVelocity[1] = curVelocity[1] + gravity[1]*deltaTime;
                        
                        isFallingOutOfView = totalTime - curTime < 1;

                        // Bounce
                        var bounceDampen = 0.75;
                        if (!isFallingOutOfView) {
                            if (curPositionY > bottomBounceY) {
                                var overshoot = curPositionY - bottomBounceY;
                                curPositionY = bottomBounceY;
                                curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                curVelocity[1] = -curVelocity[1]*bounceDampen;
                            }
                        }
                        if (curPositionX < 0 || curPositionX > window.innerWidth-cardLoweredWidth) {
                            curPositionX = curPositionX - curVelocity[0];
                            curVelocity[0] = curVelocity[0] - gravity[0]*deltaTime;
                            curVelocity[0] = -curVelocity[0];
                        }
                                
                        curTime += deltaTime;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }

            }
            break;

            case 1:
            {
                // Gravity Bouncing off game over view
                                
                var startLeft = window.innerWidth*0.5 - 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var totalTime = 9;
                    var curTime = 0;
                    var deltaTime = 0.1;
                    var gravity = [0, 200];
                    var curVelocity = [200*deltaTime, 0];
                    var curPositionX = startLeft;
                    var curPositionY = startTop;
                    var isFallingOutOfView = false;
                    var bottomBounceY = window.innerHeight - cardLoweredHeight;
                    var gameOverViewWidth = 340;
                    var gameOverViewHeight = 100;
                    var gameOverViewLeft = (window.innerWidth - gameOverViewWidth)*0.5 - cardLoweredWidth*0.5;
                    var gameOverViewRight = gameOverViewLeft + gameOverViewWidth + cardLoweredWidth*0.5;
                    var gameOverViewTop = (window.innerHeight - gameOverViewHeight)*0.5 - cardLoweredHeight*1.1;

                    while (curTime < totalTime) {
                        var percentComplete = 100 * curTime / totalTime;
                        keyframesText = keyframesText + percentComplete + '% {opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        
                        var prevPositionY = curPositionY;
                        curPositionX = curPositionX + curVelocity[0];
                        curPositionY = curPositionY + curVelocity[1];
                        curVelocity[0] = curVelocity[0] + gravity[0]*deltaTime;
                        curVelocity[1] = curVelocity[1] + gravity[1]*deltaTime;
                        
                        isFallingOutOfView = totalTime - curTime < 1;

                        // Bounce
                        var bounceDampen = 0.75;
                        if (!isFallingOutOfView) {
                            if (curPositionY > bottomBounceY) {
                                curPositionY = bottomBounceY;
                                curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                curVelocity[1] = -curVelocity[1]*bounceDampen;
                            } else {
                                // Bounce off game over view
                                if (curPositionX > gameOverViewLeft &&
                                    curPositionX < gameOverViewRight &&
                                    prevPositionY <= gameOverViewTop &&
                                    curPositionY > gameOverViewTop
                                    ) 
                                {
                                    curPositionY = gameOverViewTop;
                                    curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                    curVelocity[1] = -curVelocity[1]*bounceDampen;    
                                }
                            }
                        }
                        if (curPositionX < 0 || curPositionX > window.innerWidth-cardLoweredWidth) {
                            curPositionX = curPositionX - curVelocity[0];
                            curVelocity[0] = curVelocity[0] - gravity[0]*deltaTime;
                            curVelocity[0] = -curVelocity[0];
                        }
                                
                        curTime += deltaTime;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;

            case 2:
            {
                // Spiral into center
                var totalTime = 7;       
                var startLeft = window.innerWidth*0.5 - 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var fullAngle = Math.PI * 2 * 4.25;
                    var spinCenterX = window.innerWidth*0.5;
                    var spinCenterY = window.innerHeight*0.5;
                    var radius = Math.sqrt((spinCenterY - startTop)*(spinCenterY - startTop) + (spinCenterX - startLeft)*(spinCenterX - startLeft));
                    for (var angle = fullAngle; angle >= 0; angle-=0.15) {
                        var percentComplete = 100 * (1 - (angle / fullAngle));
                        
                        var curPositionX = radius*Math.cos(-angle) + spinCenterX - cardLoweredWidth*0.5;
                        var curPositionY = radius*Math.sin(-angle) + spinCenterY - cardLoweredHeight*0.5;
                        keyframesText = keyframesText + percentComplete + '% { opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        radius*=0.985;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;

            case 3:
            {
                // Spiral out from center
                var slideInTime = 0.5;
                var totalTime = 7;       
                var startLeft = window.innerWidth*0.5 - cardLoweredWidth*0.5;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var slideInPercent = slideInTime / (slideInTime + totalTime);
                    keyframesText = keyframesText + (slideInPercent*100) + '% { opacity: 1; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    
                    var fullAngle = Math.PI * 2 * 4.25;
                    var spinCenterX = window.innerWidth*0.5;
                    var spinCenterY = window.innerHeight*0.5;
                    var fullRadius = Math.sqrt((spinCenterY - startTop)*(spinCenterY - startTop) + (spinCenterX - startLeft)*(spinCenterX - startLeft));
                    for (var angle = 0.01; angle < fullAngle; angle+=0.15) {
                        var percentComplete = (angle / fullAngle) * (1-slideInPercent);
                    
                        var radius = (angle/fullAngle)*fullRadius;
                        var curPositionX = radius*Math.cos(-angle) + spinCenterX - cardLoweredWidth*0.5;
                        var curPositionY = radius*Math.sin(-angle) + spinCenterY - cardLoweredHeight*0.5;
                        keyframesText = keyframesText + ((slideInPercent + percentComplete)*100) + '% { opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + startLeft + 'px; top: ' + startTop + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;
        }
    }

    this.OnScoreboardClick = function() {
        scoreboard.OnClick();
    }

    function HideAllMessages() {
        var viewsToHide = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'hint_button',
            'confirm_passing_cards_region',
            'player_play_prompt'
            ];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "none";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.OnResizeWindow = function OnResizeWindow() {

        var ease = "0.4s ease-out";

        // Reposition all the cards
        for (var i = 0; i < cards.length; i++) {
            var cardView = cards[i].cardView;
            if (cardView.positionFunction !== undefined) {
                var position = eval(cardView.positionFunction);
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + "deg)";
                cardView.style.transition = ease;
            }
        }

        // Reposition everything else
        var viewsToPosition = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'hint_button',
            'confirm_passing_cards_region',
            'player_play_prompt'
        ];
        for (var i = 0; i < viewsToPosition.length; i++) {
            var view = document.getElementById(viewsToPosition[i]);
            if (view.positionFunction !== undefined) {
                view.style.transition = ease;
                var position = eval(view.positionFunction);
                view.style.left = position[0] + "px";
                view.style.top = position[1] + "px";
            }
        }
    }
}
