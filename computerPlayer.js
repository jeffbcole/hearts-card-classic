var ComputerPlayer = function() {

    this.SelectTwoCardsToDiscardInCrib = function(skillLevel, isComputersCrib, computersHand) {
        switch (skillLevel) {
            case "Easy":
                return [computersHand[0], computersHand[1]];
            case "Standard":
                return this.FindStandardCribDiscards(computersHand, isComputersCrib);
            default:
                return this.FindOptimalCribDiscards(computersHand, isComputersCrib)[0];
        }
    }

    this.FindStandardCribDiscards = function(cards, isCribScorePositive) {
        var trialCards = [];
        var bestCards = [];
        var cribCards = [];
        var currentBestScore = 0;

        bestCards.push(cards[0]);
        bestCards.push(cards[1]);
        for (var i=0; i<cards.length; i++) {
            for (var j=i+1; j<cards.length; j++) {
                trialCards = [];
                cribCards = [];
                for (var n=0; n<cards.length; n++) {
                    if (n!=i && n!=j) {
                        trialCards.push(cards[n]);
                    } else {
                        cribCards.push(cards[n]);
                    }
                }

                // Ignore the top card and just look at these cards
                var trialScore = this.GetScoreForCards(trialCards, null, false);
                var cribScore = GetPairsAndFifteensPointsForSubset(cribCards);
                if (isCribScorePositive) {
                    trialScore = trialScore + cribScore;
                } else {
                    trialScore = trialScore - cribScore;
                }

                if (trialScore > currentBestScore) {
                    bestCards = [];
                    bestCards.push(cards[i]);
                    bestCards.push(cards[j]);
                    currentBestScore = trialScore;
                }
            }
        }

        return bestCards;
    }

    this.FindOptimalCribDiscards = function(cards, isCribScorePositive) {
        var bestCards = [];
        var trialCards = [];
        var cribCards = [];
        var currentBestMinScore = 0;
        var currentBestAvgScore = 0;
        var currentBestMaxScore = 0;

        bestCards.push(cards[0]);
        bestCards.push(cards[1]);
        for (var i=0; i<cards.length; i++) {
            for (var j=i+1; j<cards.length; j++) {
                trialCards = [];
                cribCards = [];
                for (var n=0; n<cards.length; n++) {
                    if (n!=i && n!=j) {
                        trialCards.push(cards[n]);
                    } else {
                        cribCards.push(cards[n]);
                    }
                }

                var scoreStats = this.GetScoreStatsForPossibleDiscards(trialCards, cribCards, isCribScorePositive);
                var minScore = scoreStats[0];
                var avgScore = scoreStats[1];
                var maxScore = scoreStats[2];
                if (avgScore > currentBestAvgScore) {
                    bestCards = [];
                    bestCards.push(cards[i]);
                    bestCards.push(cards[j]);
                    currentBestMinScore = minScore;
                    currentBestAvgScore = avgScore;
                    currentBestMaxScore = maxScore;
                }
            }
        }

        return [bestCards, currentBestAvgScore];
    }

    this.GetScoreStatsForPossibleDiscards = function(trialCards, cribCards, isCribScorePositive) {
        var minScore = 1000;
        var maxScore = -1000;
        // Sum up the scores for all possible flip cards
        var topCard = {suit: "H", rank: 1, value: 1};
        trialCards.push(topCard);
        cribCards.push(topCard);
        var avgTrialScore = 0;
        var avgCribScore = 0;
        var count = 0;
        for (var k=1; k<=13; k++) {
            topCard.rank = k;
            topCard.value = k>10 ? 10 : k;
            for (var m=0; m<4; m++) {
                switch (m) {
                    case 0:
                    topCard.suit = "C";
                    break;
                    case 1:
                    topCard.suit = "D";
                    break;
                    case 2:
                    topCard.suit = "H";
                    break;
                    default:
                    topCard.suit = "S";
                    break;
                }

                var invalidCard = false;
                for (var i=0; i<trialCards.length; i++) {
                    var card = trialCards[i];
                    if (card !== topCard && card.rank == topCard.rank && card.suit == topCard.suit) {
                        invalidCard = true;
                        break;
                    }
                }
                if (invalidCard) {
                    continue;
                }
                for (var i=0; i<cribCards.length; i++) {
                    var card = cribCards[i];
                    if (card !== topCard && card.rank == topCard.rank && card.suit == topCard.suit) {
                        invalidCard = true;
                        break;
                    }
                }
                if (invalidCard) {
                    continue;
                }

                count = count + 1;
                var trialScore = this.GetScoreForCards(trialCards, topCard, false);
                avgTrialScore = avgTrialScore + trialScore;
                var cribScore = this.GetScoreForCards(cribCards, topCard, true);
                avgCribScore = avgCribScore + cribScore;

                if (isCribScorePositive) {
                    if (trialScore + cribScore > maxScore) {
                        maxScore = trialScore + cribScore;
                    }
                    if (trialScore + cribScore < minScore) {
                        minScore = trialScore + cribScore;
                    }
                } else {
                    if (trialScore - cribScore > maxScore) {
                        maxScore = trialScore - cribScore;
                    }
                    if (trialScore - cribScore < minScore) {
                        minScore = trialScore - cribScore;
                    }
                }
            }
        }
        avgTrialScore = avgTrialScore / count;
        avgCribScore = avgCribScore / count;

        if (isCribScorePositive) {
            avgTrialScore = avgTrialScore + avgCribScore;
        } else {
            avgTrialScore = avgTrialScore - avgCribScore;
        }

        // Remove the trial top cards
        var indexOfTrialTopCard = cribCards.indexOf(topCard);
        cribCards.splice(indexOfTrialTopCard, 1);
        indexOfTrialTopCard = trialCards.indexOf(topCard);
        trialCards.splice(indexOfTrialTopCard, 1);

        return [minScore, avgTrialScore, maxScore];
    }

    this.SelectNextCardForPegging = function(skillLevel, computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard) {
        var curBestScore = 0;
        var cardsUnder31 = [];
        for (var i=0; i<computersHand.length; i++) {
            if (computersHand[i] == null) {
                continue;
            }
            if (computersHand[i].value + currentPeggingCount <= 31) {
                cardsUnder31.push(computersHand[i]);
            }
        }
        if (cardsUnder31.length == 0) {
            return undefined;
        }
        
        switch (skillLevel) {
            case 'Easy':
            case 'Standard':
                var bestCard = cardsUnder31[0];
                for (var i=0; i<cardsUnder31.length; i++) {
                    var trialCard = cardsUnder31[i];
                    currentPeggingCards.push(trialCard);
                    var points = Game.GetPeggingPointsForCards(currentPeggingCards);
                    currentPeggingCards.pop();
                    var possibleScore = 0;
                    for (var j=0; j<points.length; j++) {
                        possibleScore = possibleScore + points[j].points;
                    }
                    if (possibleScore > curBestScore) {
                        curBestScore = possibleScore;
                        bestCard = trialCard;
                    }
                }
                return bestCard;
                break;
            case 'Pro':
                // Calculate the score for each possible play and do the highest score
                // Penalize the idea of leading with a 5
                curBestScore = -10;
                var bestCard = cardsUnder31[0];
                for (var i=0; i<cardsUnder31.length; i++) {
                    var trialCard = cardsUnder31[i];
                    currentPeggingCards.push(trialCard);
                    var points = Game.GetPeggingPointsForCards(currentPeggingCards);
                    currentPeggingCards.pop();
                    var possibleScore = 0;
                    for (var j=0; j<points.length; j++) {
                        possibleScore = possibleScore + points[j].points;
                    }

                    // Penalize for a count  of 5
                    if (currentPeggingCount + trialCard.value == 5) {
                        possibleScore = possibleScore -2;
                    }

                    // Penalize for a count of 21
                    if (currentPeggingCount + trialCard.value == 21) {
                        possibleScore = possibleScore -2;
                    }

                    if (possibleScore > curBestScore) {
                        bestCard = trialCard;
                        curBestScore = possibleScore;
                    }
                }     
                return bestCard;   
                break;
                
        }
        return undefined;
    }

    this.FindOptimalPeggingCard = function(computersHand, currentPeggingCount, currentPeggingCards, deadPeggingCards, topCard) {
        var curBestScore = 0;
        var cardsUnder31 = [];
        for (var i=0; i<computersHand.length; i++) {
            if (computersHand[i] == null) {
                continue;
            }
            if (computersHand[i].value + currentPeggingCount <= 31) {
                cardsUnder31.push(computersHand[i]);
            }
        }
        if (cardsUnder31.length == 0) {
            return [undefined, 0];
        }

        if (cardsUnder31.length === 1) {
            return [cardsUnder31[0], -1];
        }

        curBestScore = -10;
        var bestCard = cardsUnder31[0];
        for (var i=0; i<cardsUnder31.length; i++) {
            var trialCard = cardsUnder31[i];
            currentPeggingCards.push(trialCard);
            var points = Game.GetPeggingPointsForCards(currentPeggingCards);
            currentPeggingCards.pop();
            var possibleScore = 0;
            for (var j=0; j<points.length; j++) {
                possibleScore = possibleScore + points[j].points;
            }

            // Penalize for a count  of 5
            if (currentPeggingCount + trialCard.value == 5) {
                possibleScore = possibleScore-1;
            }

            // Penalize for a count of 21
            if (currentPeggingCount + trialCard.value == 21) {
                possibleScore = possibleScore-1;
            }

            if (possibleScore > curBestScore) {
                bestCard = trialCard;
                curBestScore = possibleScore;
            }
        }     
        return [bestCard, curBestScore]; 
    }

    this.GetScoreForCards = function(cards, topCard, isCrib) {
        var subsets = [];
        subsets.push([cards[0], cards[1]]);
        subsets.push([cards[0], cards[2]]);
        subsets.push([cards[1], cards[2]]);
        subsets.push([cards[0], cards[1], cards[2]]);
        
        if (cards.length > 3) {
            subsets.push([cards[0], cards[3]]);
            subsets.push([cards[1], cards[3]]);
            subsets.push([cards[2], cards[3]]);
            subsets.push([cards[0], cards[1], cards[3]]);
            subsets.push([cards[0], cards[2], cards[3]]);
            subsets.push([cards[1], cards[2], cards[3]]);
            subsets.push([cards[0], cards[1], cards[2], cards[3]]);    
        }

        if (cards.length > 4) {
            subsets.push([cards[0], cards[4]]);
            subsets.push([cards[1], cards[4]]);
            subsets.push([cards[2], cards[4]]);
            subsets.push([cards[3], cards[4]]);
            subsets.push([cards[0], cards[1], cards[4]]);
            subsets.push([cards[0], cards[2], cards[4]]);
            subsets.push([cards[0], cards[3], cards[4]]);
            subsets.push([cards[1], cards[2], cards[4]]);
            subsets.push([cards[1], cards[3], cards[4]]);
            subsets.push([cards[2], cards[3], cards[4]]);
            subsets.push([cards[0], cards[1], cards[2], cards[4]]);
            subsets.push([cards[0], cards[1], cards[3], cards[4]]);
            subsets.push([cards[0], cards[2], cards[3], cards[4]]);
            subsets.push([cards[1], cards[2], cards[3], cards[4]]);
            subsets.push([cards[0], cards[1], cards[2], cards[3], cards[4]]);        
        }

        var totalPoints = 0;
        for (var i=0; i<subsets.length; i++) {
            totalPoints = totalPoints + GetPairsAndFifteensPointsForSubset(subsets[i]);
        }

        // Look for any runs and double the score for each pair in the run
        cards.sort(function(a,b) { return a.rank - b.rank;});
        var runLength = 1;
        var multiplier = 1;
        var lastWasAPair = false;
        for (var i=1; i<cards.length; i++) {
            if (cards[i].rank === cards[i-1].rank) {
                if (lastWasAPair) {
                    multiplier = multiplier + 1;
                } else {
                    multiplier = multiplier * 2;
                    lastWasAPair = true;
                }
            }
            else if (cards[i].rank === cards[i-1].rank + 1) {
                runLength = runLength + 1;
                lastWasAPair = false;
            } else {
                if (runLength > 2) {
                    totalPoints = totalPoints + runLength*multiplier;
                }
                lastWasAPair = false;
                multiplier = 1;
                runLength = 1;
            }
        }
        if (runLength > 2) {
            totalPoints = totalPoints + runLength*multiplier;
        }

        if (topCard === null) {
            // Dont look for flush or nobs
            return totalPoints;
        }

        if (cards.length > 3) {
            // Look for a flush
            if (isCrib) {
                // All cards must be the same suit
                var curSuit = cards[0].suit;
                var flushFound = true;
                for (var i=1; i<cards.length; i++) {
                    if (cards[i].suit !== curSuit) {
                        flushFound = false;
                        break;
                    }
                }
                if (flushFound) {
                    totalPoints = totalPoints + 5;
                }
            } else {
                // All cards but the top card must be the same suit
                var curSuit = cards[0].suit;
                if (cards[0] === topCard) {
                    curSuit = cards[1].suit;
                }
                var suitSet = false;
                var flushFound = true;
                for (var i=0; i<cards.length; i++) {
                    if (cards[i] === topCard) {
                        continue;
                    }
                    if (!suitSet) {
                        suitSet = true;
                        curSuit = cards[i].suit;
                    } else {
                        if (cards[i].suit != curSuit) {
                            flushFound = false;
                            break;
                        }
                    }
                }
                if (flushFound) {
                    totalPoints = totalPoints + 4;
                    if (topCard.suit === curSuit) {
                        totalPoints = totalPoints + 1;
                    }
                }
            }
        }

        // Look for nobs
        for (var i=0; i<cards.length; i++) {
            if (cards[i].rank != 11) {
                continue;
            }
            if (cards[i] === topCard) {
                continue;
            }
            if (cards[i].suit === topCard.suit) {
                // Nobs found
                totalPoints = totalPoints + 1;
                break;
            }
        }

        return totalPoints;
    }

    function GetPairsAndFifteensPointsForSubset(cards) {
        var points = 0;

        // look for sum of 15
        var sum = 0;
        for (var i=0; i<cards.length; i++) {
            sum = sum + cards[i].value;
        }
        if (sum === 15) {
            points = points + 2;
        }

        // look for pairs
        if (cards.length == 2) {
            if (cards[0].rank == cards[1].rank) {
                points = points + 2;
            }
        }

        return points;
    }
}