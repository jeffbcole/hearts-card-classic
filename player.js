var Player = function() {

    this.name = "";
    this.isHuman = false;
    this.skillLevel = "";
    this.playerPosition = "";
    this.playerPositionInt = 0;
    this.cards = [];
    this.passingCards = [];
    this.receivedCards = [];
    this.currentRoundPoints = 0;
    this.gameScore = 0;
    this.isShownVoidInSuit = [false, false, false, false];

    this.Initialize = function(aName, aIsHuman, aSkill, aPosition) {
        this.name = aName;
        this.isHuman = aIsHuman;
        this.skillLevel = aSkill;
        this.currentRoundPoints = 0;
        this.gameScore = 0;
        this.playerPosition = aPosition;
        switch (this.playerPosition) {
            case 'South':
                this.playerPositionInt = 0;
                break;
            case 'West':
                this.playerPositionInt = 1;
                break;
            case 'North':
                this.playerPositionInt = 2;
                break;
            default:
                this.playerPositionInt = 3;
                break;
        }
    }

    this.ChoosePassingCards = function() {
        if (!this.isHuman) {
            var bestCards = this.FindBestPassingCards();
            for (var i=0; i<bestCards.length; i++) {
                this.passingCards.push(bestCards[i]);
                var indexOfBestCard = this.cards.indexOf(bestCards[i]);
                this.cards.splice(indexOfBestCard, 1);
            }
        }
    }

    this.FindBestPassingCards = function() {
        switch (this.skillLevel) {
            case "Easy":
                return [this.cards[0], this.cards[1], this.cards[2]];
            default:
                var bestCards = [];
                bestCards = bestCards.concat(this.cards);
                bestCards = bestCards.concat(this.passingCards);
                bestCards.sort(function(a,b) { 
                    if (a.value === b.value) {
                        if (a.value >= 12) {
                            if (a.suit === "S") {
                                return -1;
                            } else if (b.suit == "S") {
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

                return [bestCards[0], bestCards[1], bestCards[2]];
        }
    }

    this.ChoosePlayCard = function() {
        if (this.isHuman) {
            game.PromptPlayerToPlayCard();
        } else {
            var card = this.FindBestPlayingCard(game, false);
            game.OnPlayerChosePlayCard(card);
        }
    }

    this.FindBestPlayingCard = function(aGame, isForHint) {
        var possiblePlays = aGame.GetLegalCardsForCurrentPlayerTurn();
        switch (this.skillLevel) {
            case 'Easy':
                return possiblePlays[0];
            case 'Standard':
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

                        var currentPlayer = aGame.players[aGame.turnIndex%4];
                        if (currentPlayer.cards.length === 13) {
                            // First play of the round so there is no chance of taking a point
                            // Play the highest card possible
                            return possiblePlays[possiblePlays.length-1];

                        } else if (aGame.trickCards.length<3) {
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
            case 'Pro':
                var optimalPlayResult = FindOptimalPlayForCurrentPlayer(aGame, isForHint, false);
                return optimalPlayResult.optimalCard;
        }
    }
}