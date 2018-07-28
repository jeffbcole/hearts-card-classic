var FindOptimalPlayForCurrentPlayer = function(aGame, isForHint) {
    
    var maxSimulations = 5000;
    var simsPerPossiblePlay = 1000;
    
    if (isForHint) {
        maxSimulations = 5000*3;
        simsPerPossiblePlay = 1000*3;
    }

    // Create a game state copy that can be manipulated and restored to simulate outcomes
    var simGame = {};
    simGame.skillLevel = 'Standard';
    simGame.isHeartsBroken = aGame.isHeartsBroken;
    simGame.losingScore = aGame.losingScore;
    simGame.cardsPlayedThisRound = [];
    simGame.trickCards = [];
    simGame.players = [];
    var player = new Player();
    player.Initialize('You', true, 'Standard', 'South');
    simGame.players.push(player);
    player = new Player();
    player.Initialize('Catalina', false, 'Standard', 'West');
    simGame.players.push(player);
    player = new Player();
    player.Initialize('Amelia', false, 'Standard', 'North');
    simGame.players.push(player);
    player = new Player();
    player.Initialize('Seward', false, 'Standard', 'East');
    simGame.players.push(player);
    
    var currentPlayer = aGame.players[aGame.turnIndex%4];
    var currentSimPlayer = simGame.players[aGame.turnIndex%4];

    // Set the game deck of cards to only have the cards remaining
    var gameCards = aGame.GetCards();
    var cardsRemaining = [];
    for (var i=0; i<gameCards.length; i++) {
        var isAlreadyPlayed = false;
        for (var j=0; j<aGame.cardsPlayedThisRound.length; j++) {
            if (aGame.cardsPlayedThisRound[j].id === gameCards[i].id) {
                isAlreadyPlayed = true;
                break;
            }
        }
        if (isAlreadyPlayed) {
            continue;
        }
        for (var j=0; j<currentPlayer.cards.length; j++) {
            if (currentPlayer.cards[j].id === gameCards[i].id) {
                isAlreadyPlayed = true;
                break;
            }
        }
        if (isAlreadyPlayed) {
            continue;
        }
        
        cardsRemaining.push(gameCards[i]);
    }
  
    var possiblePlays = aGame.GetLegalCardsForCurrentPlayerTurn();
    var possiblePlaysCumulativePoints = [];
    for (var i=0; i<possiblePlays.length; i++) {
        possiblePlaysCumulativePoints.push(0);
    }

    if (possiblePlays.length*simsPerPossiblePlay > maxSimulations) {
        simsPerPossiblePlay = Math.floor(maxSimulations / possiblePlays.length);
    }

    for (var i=0; i<possiblePlays.length; i++) {
        // For each possible play,
        // make the play and then simulate out to the end of the round
        // with each player using the Standard skill level decision making
        // Then Restore the game state
        for (var simCount = 0; simCount < simsPerPossiblePlay; simCount++) {
            // Reset the sim game state
            for (var k=0; k<4; k++) {
                var player = aGame.players[k];
                var simPlayer = simGame.players[k];
                simPlayer.skillLevel = 'Standard';
                simPlayer.currentRoundPoints = player.currentRoundPoints;
                simPlayer.cards = [];
                simPlayer.isShownVoidInSuit = [player.isShownVoidInSuit[0], player.isShownVoidInSuit[1], player.isShownVoidInSuit[2], player.isShownVoidInSuit[3]];
            }
            simGame.trickCards = [].concat(aGame.trickCards);
            simGame.roundNumber = aGame.roundNumber;
            simGame.leadIndex = aGame.leadIndex;
            simGame.turnIndex = aGame.turnIndex;
            simGame.isHeartsBroken = aGame.isHeartsBroken;

            // Shuffle the deck
            var deckIdx = 0;
            for (var k = cardsRemaining.length - 1; k > 0; k--) {
                var randIdx = Math.floor(Math.random() * (k + 1));
                x = cardsRemaining[k];
                cardsRemaining[k] = cardsRemaining[randIdx];
                cardsRemaining[randIdx] = x;
            }

            for (var n=0; n<currentPlayer.cards.length; n++) {
                currentSimPlayer.cards.push(currentPlayer.cards[n]);
            }

            // Play the next possible play card
            var card = possiblePlays[i];
            if (card.suit === 'H') {
                simGame.isHeartsBroken = true;
            }
            if (simGame.trickCards.length !== 0) {
                var leadCard = simGame.trickCards[0];
                if (card.suit !== leadCard.suit) {
                    currentSimPlayer.isShownVoidInSuit[leadCard.suitInt] = true;
                }
            }
            currentSimPlayer.cards.splice(currentSimPlayer.cards.indexOf(card), 1);
            simGame.trickCards.push(card);
            simGame.turnIndex = simGame.turnIndex + 1;

            // Deal the remaining cards to the rest of the players
            var idx = aGame.turnIndex;
            for (var deckIdx = 0; deckIdx<cardsRemaining.length; deckIdx++) {
                idx++;
                var simPlayer = simGame.players[idx%4];
                if (simPlayer === currentSimPlayer) {
                    deckIdx--;
                    continue;
                }
                simPlayer.cards.push(cardsRemaining[deckIdx]);
            }

            // Assure that no player has a card they are supposed to be void
            for (var j=0; j<4; j++) {
                var simPlayer = simGame.players[j];
                if (simPlayer.playerPosition === currentSimPlayer.playerPosition) {
                    continue;
                }
                for (var k=0; k<simPlayer.cards.length; k++) {
                    var aCard = simPlayer.cards[k];
                    if (simPlayer.isShownVoidInSuit[aCard.suitInt]) {
                        // Swap the card with the first possible neighbor
                        var swapCardFound = false;
                        for (var n=1; n<4; n++) {
                            var neighborPlayer = simGame.players[(j+n)%4];
                            if (neighborPlayer.playerPosition === currentSimPlayer.playerPosition) {
                                continue;
                            }
                            if (!neighborPlayer.isShownVoidInSuit[aCard.suitInt]) {
                                for (var m=0; m<neighborPlayer.cards.length; m++) {
                                    var cardToSwap = neighborPlayer.cards[m];
                                    if (!simPlayer.isShownVoidInSuit[cardToSwap.suitInt]) {
                                        swapCardFound = true;
                                        simPlayer.cards.splice(k,1);
                                        simPlayer.cards.push(cardToSwap);
                                        neighborPlayer.cards.splice(m, 1);
                                        neighborPlayer.cards.push(aCard);
                                        break;
                                    }
                                }
                            }
                            if (swapCardFound) {
                                break;
                            }
                        }
                    }
                }
            }

            // Finish the round
            var firstPass = true;
            while (firstPass || currentSimPlayer.cards.length > 0) {
                firstPass = false;
                // Finish the trick
                while (simGame.trickCards.length < 4) {
                    var nextPlayer = simGame.players[simGame.turnIndex%4];
                    var nextCard = FindStandardPlayForGameSimulator(simGame);
                    // Play the Card
                    if (nextCard.suit === 'H') {
                        simGame.isHeartsBroken = true;
                    }
                    if (simGame.trickCards.length !== 0) {
                        var leadCard = simGame.trickCards[0];
                        if (nextCard.suit !== leadCard.suit) {
                            nextPlayer.isShownVoidInSuit[leadCard.suitInt] = true;
                        }
                    }

                    nextPlayer.cards.splice(nextPlayer.cards.indexOf(nextCard), 1);
                    simGame.trickCards.push(nextCard);
                    simGame.turnIndex = simGame.turnIndex + 1;
                }

                // GetTrickResult
                var trickResult = {};
                trickResult.highestCard = simGame.trickCards[0];
                trickResult.trickTaker = simGame.players[simGame.leadIndex];
                trickResult.points = 0;
                if (trickResult.highestCard.id === 'QS') {
                    trickResult.points = 13;
                } else if (trickResult.highestCard.suit === 'H') {
                    trickResult.points = 1;
                }
                for (var n=1; n<simGame.trickCards.length; n++) {
                    var card = simGame.trickCards[n];
                    if (card.id === 'QS') {
                        trickResult.points =  trickResult.points + 13;
                    } else if (card.suit === 'H') {
                        trickResult.points = trickResult.points + 1;
                    }
                    if (card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) {
                        trickResult.highestCard = card;
                        trickResult.trickTaker = simGame.players[(simGame.leadIndex + n)%4];
                    }
                }
                trickResult.trickTaker.currentRoundPoints += trickResult.points;
                simGame.leadIndex = trickResult.trickTaker.playerPositionInt;
                simGame.turnIndex = simGame.leadIndex;
                simGame.trickCards = [];
            }

            // Correct for moon shots
            if (currentSimPlayer.currentRoundPoints == 26) {
                currentSimPlayer.currentRoundPoints = 0;
            } else {
                for (var k=0; k<4; k++) {
                    var aPlayer = simGame.players[k];
                    if (aPlayer != currentSimPlayer) {
                        if (aPlayer.currentRoundPoints == 26) {
                            currentSimPlayer.currentRoundPoints = 26;
                        }
                    }
                }
            }
            possiblePlaysCumulativePoints[i] += currentSimPlayer.currentRoundPoints;
        }
    }

    var optimalPlayResult = [];
    optimalPlayResult.possibleCards = possiblePlays;
    optimalPlayResult.possibleCardsScores = [];
    var curBestPoints = Number.MAX_SAFE_INTEGER;
    var curBestScore = 0;
    var curWorstScore = -1;
    var curBestPlayIndex = 0;
    for (var i=0; i<possiblePlays.length; i++) {
        var mean = possiblePlaysCumulativePoints[i]/simsPerPossiblePlay;
        if (possiblePlaysCumulativePoints[i] < curBestPoints) {
            curBestPoints = possiblePlaysCumulativePoints[i];
            curBestPlayIndex = i;
            curBestScore = mean;
        }
        optimalPlayResult.possibleCardsScores.push(mean);
        if (curWorstScore < mean) {
            curWorstScore = mean;
        }
    }
    optimalPlayResult.optimalCard = possiblePlays[curBestPlayIndex];
    optimalPlayResult.optimalScore = curBestScore;
    optimalPlayResult.worstScore = curWorstScore;

    console.log(optimalPlayResult.possibleCardsScores);
    return optimalPlayResult;
}

var FindStandardPlayForGameSimulator = function(aGame) {
    var possiblePlays = GetLegalCardsForCurrentPlayerTurnInGameSimulator(aGame);
    
    if (aGame.trickCards.length === 0) {
        // Lead with the lowest card value possible
        var play = possiblePlays[0];
        for (var i=1; i<possiblePlays.length; i++) {
            var possiblePlay = possiblePlays[i];
            if (possiblePlay.value < play.value) {
                play = possiblePlay;
            }
        }
        return play;
    } else {
        var leadCard = aGame.trickCards[0];
        var play = possiblePlays[0];
        if (play.suit === leadCard.suit) {
            // Must play the same suit
            possiblePlays.sort(function(a,b) { 
                return a.value - b.value;
            });

            var highestCardInTrick = leadCard;
            for (var i=1; i<aGame.trickCards.length; i++) {
                var playedCard = aGame.trickCards[i];
                if (playedCard.suit === leadCard.suit && playedCard.value > highestCardInTrick.value) {
                    highestCardInTrick = playedCard;
                }
            }

            if (aGame.trickCards.length<3) {
                // Play the highest card that will not take the hand
                var curPlay = possiblePlays[0];
                if (curPlay.value > highestCardInTrick) {
                    // We have to play our lowest card and hope the next person is higher
                    return curPlay;
                } else {
                    // Play the highest value that is less than the current highest card in the trick
                    for (var i=1; i<possiblePlays.length; i++) {
                        var possibleCard = possiblePlays[i];
                        if (possibleCard.value < highestCardInTrick.value) {
                            curPlay = possibleCard;
                        }
                    }
                    return curPlay;
                }
            } else {
                var curTrickPoints = 0;
                for (var i=0; i<aGame.trickCards.length; i++) {
                    var card = aGame.trickCards[i];
                    if (card.suit === 'H') {
                        curTrickPoints = curTrickPoints + 1;
                    } else if (card.id === 'QS') {
                        curTrickPoints = curTrickPoints + 13;
                    }
                }

                if (curTrickPoints === 0) {
                    // No points so we can play the highest card of suit
                    var highestCard = possiblePlays[possiblePlays.length-1];
                    if (highestCard.id === 'QS' && possiblePlays.length > 1) {
                        highestCard = possiblePlays[possiblePlays.length-2];
                    }
                    return highestCard;
                } else {
                    // Try to not take the trick but if we must, then play the highest card
                    var curPlay = possiblePlays[0];
                    if (curPlay.value > highestCardInTrick.value) {
                        // play our highest card
                        var highestCard = possiblePlays[possiblePlays.length-1];
                        if (highestCard.id === 'QS' && possiblePlays.length > 1) {
                            highestCard = possiblePlays[possiblePlays.length-2];
                        }
                        return highestCard;
                    } else {
                        // Play the highest value that is less than the current highest card in the trick
                        for (var i=1; i<possiblePlays.length; i++) {
                            var possibleCard = possiblePlays[i];
                            if (possibleCard.value < highestCardInTrick.value) {
                                curPlay = possibleCard;
                            }
                        }
                        return curPlay;
                    }
                }
            }
        } else {
            // Play the highest valued card we have
            possiblePlays.sort(function(a,b) { 
                // Queen of spades is highest
                if (a.id === 'QS') {
                    return -1;
                } else if (b.id === 'QS') {
                    return 1;
                }
                // Otherwise prefer AS and KS over hearts
                if (a.value === b.value) {
                    if (a.value >= 12) {
                        if (a.suit === 'S') {
                            return -1;
                        } else if (b.suit === 'S') {
                            return 1;
                        } else {
                            return b.suitInt - a.suitInt;
                        }
                    } else {
                        return b.suitInt - a.suitInt;
                    }
                } else {
                    return b.value - a.value;
                }
            });
            return possiblePlays[0];
        }
    }
}

var GetLegalCardsForCurrentPlayerTurnInGameSimulator = function(aGame) {
    var legalCards = [];
    var player = aGame.players[aGame.turnIndex%4];
    if (aGame.trickCards.length === 0 && player.cards.length === 13) {
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            if (card.id === '2C') {
                legalCards.push(card);
                return legalCards;
            }
        }
    } else {
        if (aGame.trickCards.length === 0) {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                if (aGame.isHeartsBroken || card.suit != 'H') {
                    legalCards.push(card);
                }
            }
        } else {
            var leadCard = aGame.trickCards[0];
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