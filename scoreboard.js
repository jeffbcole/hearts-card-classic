var Scoreboard = function () {
    
    this.isExpanded = false;
    this.isSlidDown = false;

    this.Initialize = function() {
        var delay = 0;
        if (this.isSlidDown) {
            this.SlideUp();
            delay = 1000;
        }
        setTimeout(function() {
            var difficultyView = document.getElementById('scoreboardDifficulty');
            difficultyView.innerHTML = "Difficulty: " + game.skillLevel;
            for (var i=0; i<game.players.length; i++) {
                var player = game.players[i];
                var playerName = document.getElementById('scoreboardPlayerName' + player.playerPosition);
                playerName.innerHTML = player.name;
                var playerBarFill = document.getElementById('scoreboardPlayerBarFill' + player.playerPosition);
                with (playerBarFill.style) {
                    transition = "none";
                    width = "0%";
                }
                var playerScore = document.getElementById('scoreboardPlayerScore' + player.playerPosition);
                playerScore.innerHTML = player.gameScore;
            }    
        }, delay);
    }

    this.OnClick = function() {
        if (this.isExpanded) {
            this.Contract();
        } else {
            this.Expand();
        }
        
    }

    this.Expand = function() {
        if (this.isExpanded) {
            return;
        }

        this.isExpanded = true;

        var scoreboardBackground = document.getElementById('scoreboardBackground');
        var container = document.getElementById('scoreboardRoundScoresRegion');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        var p = [];
        for (var j=0; j<4; j++) {
            p.push(game.players[j]);
        }
        p.sort(function(a,b) { 
            return a.gameScore - b.gameScore;
        });
        
        for (var i=0; i<game.roundScores.length; i++) {
            var roundSeparator = document.createElement('div');
            roundSeparator.className = 'scoreboardRoundEntrySeparator';
            roundSeparator.style.left = i*50 + 'px'
            container.appendChild(roundSeparator);

            var roundNumber = document.createElement('div');
            roundNumber.className = "scoreboardRoundNumber";
            roundNumber.innerHTML = "Round " + (i + 1);
            roundNumber.style.left = i*50 + 'px';
            container.appendChild(roundNumber);
            for (var j=0; j<4; j++) {
                var roundScore = document.createElement('div');
                var curPlayerIndex = p[j].playerPositionInt;
                roundScore.className = 'scoreboardRoundEntry';
                roundScore.innerHTML = "+" + game.roundScores[i][curPlayerIndex];
                roundScore.style.left = i*50 + 'px';
                roundScore.style.top = 15 + j*38 + 'px';
                container.appendChild(roundScore);
            }
        }

        var containerWidth = 50*game.roundScores.length;
        container.style.width = containerWidth + "px";
        with (scoreboardBackground.style) {
            transition = "0.3s linear";
            background = "#000000FF";
            width = 200 + containerWidth + "px";
        }
    }

    this.Contract = function() {
        if (!this.isExpanded) {
            return;
        }
        this.isExpanded = false;

        var scoreboardBackground = document.getElementById('scoreboardBackground');
        with (scoreboardBackground.style) {
            transition = "0.3s linear";
            background = "#00000077";
            width = "200px";
        }
    }

    this.SlideDown = function() {
        if (this.isSlidDown) {
            return;
        }

        this.isSlidDown = true;
        var element = document.getElementById('scoreboard');
        with (element.style) {
            transition = "1s ease-in-out";
            top = "0px";
        }
    }

    this.SlideUp = function() {
        if (!this.isSlidDown) {
            return;
        }

        this.isSlidDown = false;
        var element = document.getElementById('scoreboard');
        with (element.style) {
            transition = "1s ease-in-out";
            top = "-152px";
        }

        this.Contract();

        var difficultyView = document.getElementById('scoreboardDifficulty');
        difficultyView.innerHTML = "";
    }

    this.UpdateScores = function(animate) {
        for (var i=0; i<game.players.length; i++) {
            var player = game.players[i];
            var playerBarFill = document.getElementById('scoreboardPlayerBarFill' + player.playerPosition);
            if (animate) {
                playerBarFill.style.transition = "1s linear";
            } else {
                playerBarFill.style.transition = "none";
            }
            var percent = 100 * player.gameScore / game.losingScore;
            if (percent > 100) {
                percent = 100;
            }
            playerBarFill.style.width = percent + "%";

            var playerScore = document.getElementById('scoreboardPlayerScore' + player.playerPosition);
            playerScore.innerHTML = player.gameScore;
        }

        if (animate) {
            setTimeout(function() {
                var p = [];
                for (var j=0; j<4; j++) {
                    p.push(game.players[j]);
                }
                p.sort(function(a,b) { 
                    return a.gameScore - b.gameScore;
                });
                for (var i=0; i<4; i++) {
                    var player = p[i];
                    var elem = document.getElementById('scoreboardPlayerRegion' + player.playerPosition);
                    elem.style.transition = "0.5s ease-in-out";
                    elem.style.top = i*38 + 'px';
                }
            }, 1000);
        } else {
            var p = [];
                for (var j=0; j<4; j++) {
                    p.push(game.players[j]);
                }
                p.sort(function(a,b) { 
                    return a.gameScore - b.gameScore;
                });
                for (var i=0; i<4; i++) {
                    var player = p[i];
                    var elem = document.getElementById('scoreboardPlayerRegion' + player.playerPosition);
                    elem.style.transition = "none";
                    elem.style.top = i*38 + 'px';
                }
        }

        if (animate) {
            setTimeout(function() {
                game.OnFinishedAnimatingUpdateGameScoreboard();
            }, 1500);
        } else {
            game.OnFinishedAnimatingUpdateGameScoreboard();
        }
    }
}