var visibleMenuCards = [];
			
function MenuCardAppear(elementID) {
	var el = document.getElementById(elementID);
	visibleMenuCards.push(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "50%";
		opacity = 1;
		pointerEvents = "auto";
	}
}

function MenuCardPressDown(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.5s ease-out";
		boxShadow = "0px 0px 0px rgba(0,0,0,0.5)";
		transform = "scale(0.93) translate(-54%,-54%)";
		pointerEvents = "none";
	}
}

function MenuCardPopUp(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.5s ease-in-out";
		boxShadow = "30px 30px 0px rgba(0,0,0,0.5)";
		transform = "scale(1) translate(-50%,-50%)";
		pointerEvents = "auto";
	}
}

function MenuCardDisappear(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
		top = "100%";
		opacity = 0;
		pointerEvents = "none";
	}
}

function ShowTitle() {
	var el = document.getElementById("cribbage_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "16%";
		opacity = 1;
	}
}

function HideTitle() {
	var el = document.getElementById("cribbage_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "0%";
		opacity = 0;
	}
}
function HideMenuButton() {
	var el = document.getElementById('menu_button');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s linear";
		opacity = 0;
		pointerEvents = "none";
	}
}

function ShowMenuButton() {
var el = document.getElementById('menu_button');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s linear";
		opacity = 1;
		pointerEvents = "auto";
	}
}

function MenuButtonPressed() {
	if (visibleMenuCards.length == 0)
	{
		// Show the close button
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'block';
		}
		
		ShowMainMenu();
	}
}

function ShowMainMenu() {
	MenuCardAppear('menu_main');
	HideMenuButton();
}

function menu_main_close_click() {
	visibleMenuCards = [];
	MenuCardDisappear('menu_main');
	ShowMenuButton();
}

function ShowStartAGameMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_start_a_game");
}

function menu_card_close_click() {
	var topMenu = visibleMenuCards.pop();
	MenuCardDisappear(topMenu);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPopUp(menuName);
}

function menu_start_game_click(difficulty) {
	game.StartAGame(difficulty);
	while (visibleMenuCards.length > 0) {
		var topMenu = visibleMenuCards.pop();
		MenuCardPopUp(topMenu);
		MenuCardDisappear(topMenu);
	}
	HideTitle();
	ShowMenuButton();
}

function ShowDifficultiesExplainedMenu()
{
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_difficulties_explained");
}

function ShowSettingsMenu() {
	InitializeSettingsView();
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_settings");
}

function InitializeSettingsView() {
	document.getElementById("setting_manually_count_scores_checkbox").checked = GetSetting('setting_manual_count_scores');
	document.getElementById("setting_muggins_checkbox").checked = GetSetting('setting_muggins');
	document.getElementById("setting_hints_checkbox").checked = GetSetting('setting_hints');
	document.getElementById("setting_warn_suboptimal_checkbox").checked = GetSetting('setting_warn_suboptimal');
	document.getElementById("setting_fast_count_checkbox").checked = GetSetting('setting_fast_count');
	
	var board_color = GetSetting('setting_board_color');
	var allElems = document.getElementsByName('settings_boardbackground_selector');
	for (i = 0; i < allElems.length; i++) {
		if (allElems[i].type == 'radio' && allElems[i].value == board_color) {
			allElems[i].checked = true;
		}
	}
	
	var card_color = GetSetting('setting_card_color');
	var allElems = document.getElementsByName('settings_card_color_selector');
	for (i = 0; i < allElems.length; i++) {
		if (allElems[i].type == 'radio' && allElems[i].value == card_color) {
			allElems[i].checked = true;
		}
	}
}

function SettingManuallyCountScoresClicked(cb) {
	SetSetting('setting_manual_count_scores', cb.checked);
}

function SettingMugginsClicked(cb) {
	SetSetting('setting_muggins', cb.checked);
}

function SettingHintsClicked(cb) {
	SetSetting('setting_hints', cb.checked);
}

function SettingWarnSuboptimalClicked(cb) {
	SetSetting('setting_warn_suboptimal', cb.checked);
}

function SettingFastCountClicked(cb) {
	SetSetting('setting_fast_count', cb.checked);
}

function BoardSelectorClick(radio) {
	SetSetting('setting_board_color', radio.value);
	UpdateBackgroundImageFromSettings();
}

function UpdateBackgroundImageFromSettings() {
	var boardColor = GetSetting('setting_board_color');
	switch (boardColor){
		case 'wood_light':
			document.documentElement.style.backgroundImage = "url(images/woodlightboard.jpg)";
			break;
		case 'wood':
			document.documentElement.style.backgroundImage = "url(images/woodboard.jpg)";
			break;
		case 'wood_dark':
			document.documentElement.style.backgroundImage = "url(images/wooddarkboard.jpg)";
			break;
		case 'wood_gray':
			document.documentElement.style.backgroundImage = "url(images/woodgreyboard.jpg)";
			break;
		case 'green':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#354216";
			break;
		case 'red':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#C20A00";
			break;
		case 'blue':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#071A5F";
			break;
	}
}

function CardSelectorClick(radio) {
	SetSetting('setting_card_color', radio.value);

	var cardBackURI = "url('images/card_back_" + radio.value + ".jpg')";
	var elements = document.getElementsByClassName('cardBack');
	for (var i=0; i<elements.length; i++)
	{
		elements[i].style.backgroundImage = cardBackURI;
	}
}

function ShowStatisticsMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	InitializeStatisticsView();
	MenuCardAppear("menu_statistics");
}

function InitializeStatisticsView() {

	var difficulties = ["Easy", "Standard", "Pro"];
	var totalGamesPlayed = 0;
	var totalWins = 0;
	var totalLosses = 0;
	var totalSkunks = 0;
	for (var i=0; i<difficulties.length; i++) {
		var curDifficulty = difficulties[i];
		var wins = GetStatistic('stat_wins_' + curDifficulty);
		var losses = GetStatistic('stat_losses_' + curDifficulty);
		var skunks = GetStatistic('stat_skunks_' + curDifficulty);
		var gamesPlayed = wins + losses;
		var gamesPlayedElement = document.getElementById('menu_stat_games_played_' + curDifficulty);
		var winsElement = document.getElementById('menu_stat_wins_' + curDifficulty);
		var lossesElement = document.getElementById('menu_stat_losses_' + curDifficulty);
		var skunksElement = document.getElementById('menu_stat_skunks_' + curDifficulty);
		var winPercentElement = document.getElementById('menu_stat_win_percent_' + curDifficulty);
		if (gamesPlayed > 0) {
			gamesPlayedElement.innerText = gamesPlayed;
			winsElement.innerText = wins;
			lossesElement.innerText = losses;
			skunksElement.innerText = skunks;
			winPercentElement.innerText = parseFloat(100*wins / gamesPlayed).toFixed(0) + "%";
		} else {
			gamesPlayedElement.innerText = "";
			winsElement.innerText = "";
			lossesElement.innerText = "";
			skunksElement.innerText = "";
			winPercentElement.innerText = "";
		}
		totalGamesPlayed = totalGamesPlayed + gamesPlayed;
		totalWins = totalWins + wins;
		totalLosses = totalLosses + losses;
		totalSkunks = totalSkunks + skunks;
	}
	var gamesPlayedElement = document.getElementById('menu_stat_games_played_Total');
	var winsElement = document.getElementById('menu_stat_wins_Total');
	var lossesElement = document.getElementById('menu_stat_losses_Total');
	var skunksElement = document.getElementById('menu_stat_skunks_Total');
	var winPercentElement = document.getElementById('menu_stat_win_percent_Total');
	if (totalGamesPlayed > 0) {
		gamesPlayedElement.innerText = totalGamesPlayed;
		winsElement.innerText = totalWins;
		lossesElement.innerText = totalLosses;
		skunksElement.innerText = totalSkunks;
		winPercentElement.innerText = parseFloat(100*totalWins / totalGamesPlayed).toFixed(0) + "%";
	} else {
		gamesPlayedElement.innerText = "0";
		winsElement.innerText = "0";
		lossesElement.innerText = "0";
		skunksElement.innerText = "0";
		winPercentElement.innerText = "";
	}

	var avgCategories = ['stat_pegging', 'stat_hands', 'stat_cribs'];
	for (var i=0; i<avgCategories.length; i++) {
		var curCategory = avgCategories[i];
		var totalCount = 0;
		var totalPoints = 0;
		for (var j=0; j<difficulties.length; j++) {
			var difficulty = difficulties[j];
			var statName = curCategory + '_count_' + difficulty;
			var peggingRoundsCount = GetStatistic(statName);
			totalCount = totalCount + peggingRoundsCount;
			statName = curCategory + '_points_' + difficulty;
			var peggingRoundsTotal = GetStatistic(statName);
			totalPoints = totalPoints + peggingRoundsTotal;
			var element = document.getElementById('menu_' + curCategory + '_' + difficulty);
			if (peggingRoundsCount == 0) {
				element.innerText = "";	
			} else {
				element.innerText = parseFloat(peggingRoundsTotal / peggingRoundsCount).toFixed(1);
			}	
		}
		var element = document.getElementById('menu_' + curCategory + '_' + 'Total');
		if (totalCount == 0) {
			element.innerText = "";
		} else {
			element.innerText = parseFloat(totalPoints / totalCount).toFixed(1);
		}
	}
}

function ResetStatisticsButtonClick() {
	var r = confirm("Are you sure you want to reset your statistics?");
	if (r != true) {
		return;
	}

	var difficulties = ['Easy', 'Standard', 'Pro'];
	var statsToReset = [
		'stat_pegging_count_',
		'stat_pegging_points_',
		'stat_hands_count_',
		'stat_hands_points_',
		'stat_cribs_count_',
		'stat_cribs_points_',
		'stat_wins_',
		'stat_skunks_',
		'stat_losses_',
	];
	for (var i=0; i<statsToReset.length; i++) {
		for (var j=0; j<difficulties.length; j++) {
			var statName = statsToReset[i] + difficulties[j];
			window.localStorage.removeItem(statName);
		}
	}
	window.localStorage.removeItem('stat_suboptimal_history');
	InitializeStatisticsView();
}

function ShowSuboptimalHistoryButtonClick() {
	InitializeSubOptimalHistoryView();
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_suboptimal_history");
}

function InitializeSubOptimalHistoryView() {
	var historyString = GetStatisticString('stat_suboptimal_history');
	var historyItems = historyString.split(",");
	var history = [];
	for (var i=0; i<historyItems.length; i++) {
		if (historyItems[i] !== "") {
			history.push(parseFloat(historyItems[i]));
		}
	}
	
	var historyCanvas = document.getElementById('msoHistory');
	historyCanvas.innerHTML = "";
	var firstGameMessage = document.getElementById('msoNoHistory');
	if (history.length == 0) {
		firstGameMessage.style.visibility = 'visible';
		return;
	} else {
		firstGameMessage.style.visibility = 'hidden';
	}

	var maxError = 5;
	for (var i=0; i<history.length; i++) {
		if (history[i] > maxError) {
			maxError = history[i];
		}
	}
	maxError = Math.ceil(maxError*1.1);

	var graphWidth = 350;
	var graphHeight = 270;
	var graphPadding = [55,10,50,50]; // left, top right bottom
	var plotRegionHeight = graphHeight - graphPadding[1] - graphPadding[3];
	var plotRegionWidth = graphWidth - graphPadding[0] - graphPadding[2];
	var linesCount =  maxError > 10 ? 10 : 5;
	var linesErrorSpacing = Math.round(maxError / linesCount);
	for (var curError=0; curError<=maxError; curError = curError + linesErrorSpacing) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.classList.add('msoHLine');
		var curY = graphHeight - graphPadding[3] - (curError/maxError)*plotRegionHeight;
		line.setAttribute('x1', graphPadding[0] - 15);
		line.setAttribute('y1', curY);
		line.setAttribute('x2', graphPadding[0] + plotRegionWidth + 30);
		line.setAttribute('y2', curY);
		historyCanvas.appendChild(line);

		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.classList.add('msoAxisText');
		text.setAttribute('x', graphPadding[0] - 25);
		text.setAttribute('y', curY);
		text.innerHTML = curError;
		historyCanvas.appendChild(text);
	}

	var xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	xAxisLabel.classList.add('msoAxisText');
	xAxisLabel.setAttribute('x', graphPadding[0] + plotRegionWidth/2);
	xAxisLabel.setAttribute('y', graphHeight - 15);
	xAxisLabel.innerHTML = "Games Played";
	historyCanvas.appendChild(xAxisLabel);

	var yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	yAxisLabel.classList.add('msoAxisText');
	yAxisLabel.setAttribute('x', -110);
	yAxisLabel.setAttribute('y', 15);
	yAxisLabel.style.transform = 'rotate(-90deg)';
	yAxisLabel.innerHTML = "Suboptimal Plays (average missed points)";
	historyCanvas.appendChild(yAxisLabel);

	if (history.length == 1) {
		var curLeft = graphPadding[0] + plotRegionWidth/2;
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.classList.add('msoHLine');
		line.setAttribute('x1', curLeft);
		line.setAttribute('y1', graphHeight - graphPadding[3]);
		line.setAttribute('x2', curLeft);
		line.setAttribute('y2', graphHeight - graphPadding[3] + 3);
		historyCanvas.appendChild(line);

		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.classList.add('msoAxisText');
		text.setAttribute('x', curLeft);
		text.setAttribute('y', graphHeight - graphPadding[3] + 15);
		text.innerHTML = 1;
		historyCanvas.appendChild(text);

		var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		dot.setAttribute('cx', curLeft);
		dot.setAttribute('cy', (graphHeight - graphPadding[3] - (history[0]/maxError)*plotRegionHeight));
		dot.setAttribute('r', 3);
		dot.setAttribute('fill', '#2196F3');
		historyCanvas.appendChild(dot);

		var lastScore = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		lastScore.classList.add('msoLast');
		lastScore.setAttribute('x', curLeft + 3);
		lastScore.setAttribute('y', (graphHeight - graphPadding[3] - (history[0]/maxError)*plotRegionHeight));
		lastScore.innerHTML = history[0];
		historyCanvas.appendChild(lastScore);

	} else {
		var data = "";
		var curLeft = graphPadding[0];
		var xSpacing = plotRegionWidth / (history.length - 1);
		var skip = Math.round(history.length / 5);
		if (skip < 1) {
			skip = 1;
		}
		for (var i=0; i<history.length; i = i + skip) {
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.classList.add('msoHLine');
			line.setAttribute('x1', curLeft);
			line.setAttribute('y1', graphHeight - graphPadding[3]);
			line.setAttribute('x2', curLeft);
			line.setAttribute('y2', graphHeight - graphPadding[3] + 3);
			historyCanvas.appendChild(line);
		
			var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.classList.add('msoAxisText');
			text.setAttribute('x', curLeft);
			text.setAttribute('y', graphHeight - graphPadding[3] + 15);
			text.innerHTML = i+1;
			historyCanvas.appendChild(text);
		
			curLeft = curLeft + xSpacing*skip;
		}
	
		curLeft = graphPadding[0];
		for (var i=0; i<history.length; i++) {
			data = data + curLeft + "," + (graphHeight - graphPadding[3] - (history[i]/maxError)*plotRegionHeight) + " ";
			curLeft = curLeft + xSpacing;
		}
		var historyLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		historyLine.classList.add('msoStroke');
		historyLine.setAttribute('points', data);
		historyCanvas.appendChild(historyLine);
	
		var lastValue = history[history.length-1];
		var lastScore = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		lastScore.classList.add('msoLast');
		lastScore.setAttribute('x', graphPadding[0] + xSpacing*(history.length-1) + 2);
		lastScore.setAttribute('y', (graphHeight - graphPadding[3] - (history[history.length-1]/maxError)*plotRegionHeight));
		lastScore.innerHTML = history[history.length-1];
		historyCanvas.appendChild(lastScore);
	}
}

function ShowDiscardAnalyzer() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	InitializeDiscardAnalyzer();
	MenuCardAppear("menu_discard_analyzer");	
}

function InitializeDiscardAnalyzer() {
	
	// Load up cards from the game or use a default starting hand
	var mostRecent = game.GetMostRecentHandCards();
	var mostRecentCards = mostRecent[0];
	var mostRecentIsPlayersCrib = mostRecent[1];
	if (mostRecentCards.length == 6) {
		while (daSelectedCells.length > 0) {
			var cellToRemove = daSelectedCells.shift();
			cellToRemove.style.background = "black";
		}
		daSelectedCells = [];
		discardAnalyzerIsPlayersCrib = mostRecentIsPlayersCrib;
		for (var i=0; i<mostRecentCards.length; i++) {
			var cell = document.getElementById('daCardCell_' + mostRecentCards[i].id);
			cell.style.background = "#BB0000";
			cell.card = mostRecentCards[i];
			daSelectedCells.push(cell);
		}	
	}

	var cribCheckbox = document.getElementById('da_crib_checkbox');
	var cribText = document.getElementById('daCribIndicatorText');
	cribCheckbox.checked = !discardAnalyzerIsPlayersCrib;	
	cribText.innerText = discardAnalyzerIsPlayersCrib ? "Your Crib" : "Opponent's Crib";	
	
	PrepareDiscardAnalyzerButtons();
}

var discardAnalyzerIsPlayersCrib = true;
function daCribSwitched(cb) {
	var el = document.getElementById('daCribIndicatorText');
	if (cb.checked) {
		discardAnalyzerIsPlayersCrib = false;
		el.innerText = "Opponent's Crib";
	} else {
		discardAnalyzerIsPlayersCrib = true;
		el.innerText = "Your Crib";
	}
	PrepareDiscardAnalyzerButtons();
}

var daSelectedCells = [];

function daCardCellClick(cell, cardString) {
	if (daSelectedCells.indexOf(cell) != -1) {
		cell.style.background = "black";
		daSelectedCells.splice(daSelectedCells.indexOf(cell), 1);	
	} else {
		cell.style.background = "#BB0000";
		cell.card = game.GetCardFromString(cardString);
		daSelectedCells.push(cell);
		while (daSelectedCells.length > 6) {
			var cellToRemove = daSelectedCells.shift();
			cellToRemove.style.background = "black";
		}
	}
	PrepareDiscardAnalyzerButtons();
}

var currentOptimalDAHandCards = [];
var currentOptimalDACribCards =[];

function PrepareDiscardAnalyzerButtons() {
	var cards = [];
	for (var i=0; i<daSelectedCells.length; i++) {
		cards.push(daSelectedCells[i].card);
	}
	
	cards.sort(function(a,b) { return a.rank - b.rank });
	for (var i=0; i<cards.length; i++) {
		var element = document.getElementById('daHandCard' + i);
		element.style.background = cards[i].image;
	}
	for (var i=cards.length; i<6; i++) {
		var element = document.getElementById('daHandCard' + i);
		element.style.background = "black";
	}
	
	var optimalButton = document.getElementById('daOptimalCell');
	var allPlaysButton = document.getElementById('daAllPlaysCell');
	var prompt = document.getElementById('daPrompt');
	if (daSelectedCells.length == 6) {
		var optimalStats = game.FindOptimalCribDiscards(cards, discardAnalyzerIsPlayersCrib);
		currentOptimalDAHandCards = [];
		for (var i=0; i<cards.length; i++) {
			if (cards[i] !== optimalStats[0][0] && cards[i] !== optimalStats[0][1]) {
				currentOptimalDAHandCards.push(cards[i]);
			}
		}
		currentOptimalDACribCards = optimalStats[0];
		var optimalCardImage1 = document.getElementById('daOptimalCardView1');
		var optimalCardImage2 = document.getElementById('daOptimalCardView2');
		optimalCardImage1.style.background = optimalStats[0][0].image;
		optimalCardImage2.style.background = optimalStats[0][1].image;
		var optimalScoreText = document.getElementById('daOptimalScoreText');
		optimalScoreText.innerHTML = "avg score: " + parseFloat(optimalStats[1]).toFixed(1) + " pts"

		optimalButton.style.transition = "0.3s ease-out";
		optimalButton.style.transform = "";
		optimalButton.style.opacity = 1;

		allPlaysButton.style.transition = "0.3s ease-out";
		allPlaysButton.style.transform = "";
		allPlaysButton.style.opacity = 1;

		prompt.innerHTML = "Find the optimal discards for a hand:";
	} else {
		optimalButton.style.transition = "0.3s ease-out";
		optimalButton.style.transform = "translate(-100%,0%)";
		optimalButton.style.opacity = 0;

		allPlaysButton.style.transition = "0.3s ease-out";
		allPlaysButton.style.transform = "translate(100%,0%)";
		allPlaysButton.style.opacity = 0;

		var cardsLeftToClick = 6 - daSelectedCells.length;
		if (cardsLeftToClick == 1) {
			prompt.innerHTML = "Click on 1 more card to find the optimal discards:";	
		} else if (cardsLeftToClick == 6) {
			prompt.innerHTML = "Click on 6 cards to find the optimal discards:";	
		} else {
			prompt.innerHTML = "Click on " + cardsLeftToClick + " cards to find the optimal discards:";
		}
	}
}

function daAllPlaysButtonClick() {
	var cards = [];
	for (var i=0; i<daSelectedCells.length; i++) {
		cards.push(daSelectedCells[i].card);
	}
	InitializeAllPlays(cards, null, discardAnalyzerIsPlayersCrib);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_allplays");
}

function ShowAllPlaysForSuboptimalPlayView(suboptimalPlayView) {
	if (suboptimalPlayView.suboptimalPlay == null) {
		return;
	}
	ShowAllPlaysForSuboptimalPlay(suboptimalPlayView.suboptimalPlay);
}

function ShowAllPlaysForSuboptimalPlay(suboptimalPlay) {
	InitializeAllPlays(suboptimalPlay.situationCards, suboptimalPlay.playedCards, suboptimalPlay.isPlayersCrib);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_allplays");
}

function InitializeAllPlays(cards, playedCards, isCribScorePositive) {
	var allPlaysListView = document.getElementById('mallplist');
	allPlaysListView.innerHTML = "";

	var allPlays = [];
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

			var scoreStats = game.GetScoreStatsForPossibleDiscards(trialCards, cribCards, isCribScorePositive);
			var minScore = scoreStats[0];
			var avgScore = scoreStats[1];
			var maxScore = scoreStats[2];

			var play = {};
			play.isPlayersCrib = isCribScorePositive;
			play.cribCards = cribCards;
			play.handCards = trialCards;
			play.minScore = minScore;
			play.maxScore = maxScore;
			play.avgScore = avgScore;
			allPlays.push(play);
		}
	}

	allPlays.sort(function(a,b) { return b.avgScore - a.avgScore;});
	for (var i=0; i<allPlays.length; i++) {
		var playView = document.getElementById('mallpcelltemplate').cloneNode(true);
		playView.style.display = "block";
		playView.play = allPlays[i];
		playView.children[1].style.background = allPlays[i].cribCards[0].image;
		playView.children[2].style.background = allPlays[i].cribCards[1].image;
		playView.children[4].style.background = allPlays[i].handCards[0].image;
		playView.children[5].style.background = allPlays[i].handCards[1].image;
		playView.children[6].style.background = allPlays[i].handCards[2].image;
		playView.children[7].style.background = allPlays[i].handCards[3].image;
		playView.children[9].innerText = allPlays[i].minScore;
		playView.children[11].innerText = allPlays[i].maxScore;
		playView.children[12].children[3].innerText = parseFloat(allPlays[i].avgScore).toFixed(2);
		
		if (playedCards !== null && 
			((playView.play.cribCards[0] === playedCards[0] && playView.play.cribCards[1] === playedCards[1]) || 
			(playView.play.cribCards[0] === playedCards[0] && playView.play.cribCards[1] === playedCards[1]))) {
				playView.style.background = "red";
				playView.children[13].style.display = "block";
		}
		allPlaysListView.appendChild(playView);
	}
	allPlaysListView.scrollTop = 0;
}

function mallcellClick(playView) {
	InitializeHandAnalysis(playView.play.handCards, playView.play.cribCards, playView.play.isPlayersCrib);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_handAnalysis");
}

function daOptimalButtonClick() {
	InitializeHandAnalysis(currentOptimalDAHandCards, currentOptimalDACribCards, discardAnalyzerIsPlayersCrib);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_handAnalysis");
}

var topCardsScrollView = null;
var topCards = [];
var histogramBars = [];
var currentHighlightedBar = null;

function InitializeHandAnalysis(handCards, cribCards, isCribScorePositive) {
	handCards.sort(function(a,b) { return a.rank -b.rank;});
	for (var i=0; i<handCards.length; i++) {
		document.getElementById('mhacard' + i).style.background = handCards[i].image;
	}
	cribCards.sort(function(a,b) {return a.rank - b.rank;});
	document.getElementById('mhacard4').style.background = cribCards[0].image;
	document.getElementById('mhacard5').style.background = cribCards[1].image;

	currentHighlightedBar = null;

	var scoreStats = game.GetScoreStatsForPossibleDiscards(handCards, cribCards, isCribScorePositive);
	var minScore = scoreStats[0];
	var maxScore = scoreStats[2];
	document.getElementById('mhaMin').innerHTML = scoreStats[0];
	document.getElementById('mhaAvg').innerHTML = parseFloat(scoreStats[1]).toFixed(2);
	document.getElementById('mhaMax').innerHTML = scoreStats[2];

	document.getElementById('mhacribtitle').innerHTML = isCribScorePositive ? "Your crib" : "Opp. crib";

	topCards = [];
	var deck = game.GetCards();
	for (var i=0; i<deck.length; i++) {
		var topCard = deck[i];
		if (handCards.indexOf(topCard) === -1 && cribCards.indexOf(topCard) === -1) {
			var allHandCards = handCards.concat(topCard);
			var allCribCards = cribCards.concat(topCard);
			var handPoints = game.GetScoreForCards(allHandCards, topCard, false);
			var cribPoints = game.GetScoreForCards(allCribCards, topCard, false);
			topCard.handPoints = handPoints;
			topCard.cribPoints = isCribScorePositive ? cribPoints : -cribPoints;
			topCard.totalPoints = handPoints + topCard.cribPoints;
			topCards.push(topCard);
		}
	}
	topCards.sort(function(a,b) {
		if (a.totalPoints == b.totalPoints) {
			return a.rank - b.rank;
		}  else {
			return a.totalPoints - b.totalPoints; 
		}
	});
	var topCardsContainer = document.getElementById('mhatopcardsContainer');
	topCardsContainer.innerHTML = "";
	var edgeWidth = 220 - 21;
	var fullWidth = 966 + edgeWidth + edgeWidth;
	topCardsContainer.style.width = fullWidth + "px";
	var curLeftIndex = 0;
	var curScore = topCards[0].totalPoints;
	var skip = false;
	var histogramCounts = [];
	var curHistogramCount = 0;
	var maxHistogramCount = 0;
	for (var i=0; i<topCards.length; i++) {
		curHistogramCount = curHistogramCount + 1;
		if (topCards[i].totalPoints != curScore) {
			if (!skip) {
				var backgroundDiv = document.createElement("div");
				backgroundDiv.style.position = "absolute";
				backgroundDiv.style.top = "0px";
				backgroundDiv.style.left = edgeWidth + curLeftIndex*21 + "px";
				backgroundDiv.style.height = "80px";
				backgroundDiv.style.background = "blue";
				backgroundDiv.style.width = (i-curLeftIndex)*21 + "px";
				topCardsContainer.appendChild(backgroundDiv);
			}

			histogramCounts[curScore] = curHistogramCount;
			if (curHistogramCount > maxHistogramCount) {
				maxHistogramCount = curHistogramCount;
			}
			curHistogramCount = 0;
			curLeftIndex = i;
			curScore = topCards[i].totalPoints;
			skip = !skip;
		}
	}
	if (!skip) {
		var backgroundDiv = document.createElement("div");
		backgroundDiv.style.position = "absolute";
		backgroundDiv.style.top = "0px";
		backgroundDiv.style.left = edgeWidth + curLeftIndex*21 + "px";
		backgroundDiv.style.height = "80px";
		backgroundDiv.style.background = "blue";
		backgroundDiv.style.width = (topCards.length-curLeftIndex)*21 + "px";
		topCardsContainer.appendChild(backgroundDiv);
	}
	histogramCounts[curScore] = curHistogramCount;		

	// Draw the historgram bars
	var histogramView = document.getElementById('mhaHistorgram');
	histogramView.innerHTML = "";
	var histWidth = 400;
	var histHeight = 127;
	var histPadding = [30, 3, 5, 30]; //left, top, right, bottom
	var histBarWidth = (histWidth - histPadding[0] - histPadding[2])/(maxScore - minScore + 1);
	
	var xAxisLabel = document.createElement("div");
	xAxisLabel.className = "histLabel";
	xAxisLabel.innerHTML = "Score";
	xAxisLabel.style.fontSize = "10pt";
	xAxisLabel.style.width = histWidth + "px";
	xAxisLabel.style.left = "0px";
	xAxisLabel.style.top = histHeight - 17 + "px";
	histogramView.appendChild(xAxisLabel);

	var yAxisLabel = document.createElement("div");
	yAxisLabel.className = "histLabel";
	yAxisLabel.innerHTML = "Probability";
	yAxisLabel.style.fontSize = "10pt";
	yAxisLabel.style.width = histHeight + "px";
	yAxisLabel.style.left = "-50px";
	yAxisLabel.style.top = "50px";
	yAxisLabel.style.transform = "rotate(-90deg)";
	histogramView.appendChild(yAxisLabel);

	histogramBars = [];
	var curLeft = histPadding[0];
	for (var i=minScore; i<=maxScore; i++) {
		if (histogramCounts[i] === undefined) {
			var barDiv = document.createElement("div");
			barDiv.className = "histBar";
			barDiv.style.left = curLeft + "px";
			barDiv.style.width = histBarWidth - 1 + "px";
			barDiv.style.height = "0px";
			barDiv.style.top = histHeight - histPadding[3] + "px";
			histogramView.appendChild(barDiv);
		} else {
			var barDiv = document.createElement("div");
			barDiv.className = "histBar";
			barDiv.style.left = curLeft + "px";
			barDiv.style.width = histBarWidth - 1 + "px";
			var curHeightPercent = histogramCounts[i]/maxHistogramCount;
			var curHeight = curHeightPercent*(histHeight - histPadding[1] - histPadding[3]);
			if (curHeight < 1) {
				barDiv.style.height = "1px";
				barDiv.style.top = histPadding[1] + (histHeight - histPadding[1] - histPadding[3]) - 1 + "px";
			} else {
				barDiv.style.height = curHeight + "px";
				barDiv.style.top = histPadding[1] + (1-curHeightPercent)*(histHeight - histPadding[1] - histPadding[3]) + "px";	
			}
			histogramBars[i] = barDiv;
			histogramView.appendChild(barDiv);
		}
		var xLabel = document.createElement("div");
		xLabel.className = "histLabel";
		xLabel.innerHTML = i;
		xLabel.style.width = histBarWidth + "px";
		xLabel.style.left = curLeft + "px";
		xLabel.style.top = histHeight - histPadding[3] + "px";
		histogramView.appendChild(xLabel);

		curLeft = curLeft + histBarWidth;
	}

	var curLeft = edgeWidth;
	for (var i=0; i<topCards.length; i++) {
		var topCardView = document.createElement("div");
		topCardView.className = "tinytopcard";
		topCardView.style.background = topCards[i].image;
		topCardView.style.left = curLeft + "px";
		topCardsContainer.appendChild(topCardView);
		curLeft = curLeft + 21;
	}
	topCardsScrollView = document.getElementById('mhatopcards');
	topCardsScrollView.scrollLeft = 23*21;
	OnTopCardScroll();
}

function OnTopCardScroll() {
	if (topCardsScrollView != null) {
		var cardIndex = Math.round(topCardsScrollView.scrollLeft/21);
		var topCard = topCards[cardIndex];
		var totalPoints = topCard.totalPoints;
		document.getElementById('mhatotalScore').innerHTML = "= " + totalPoints + " points";
		if (topCard.cribPoints == 0) {
			document.getElementById('mhacribpoints').innerHTML = "";
		} else if (topCard.cribPoints > 0) {
			document.getElementById('mhacribpoints').innerHTML = "+" + topCard.cribPoints + " pts";
		} else {
			document.getElementById('mhacribpoints').innerHTML = topCard.cribPoints + " pts";
		}

		if (currentHighlightedBar !== null) {
			currentHighlightedBar.style.background = "#2196F3";
		}
		currentHighlightedBar = histogramBars[totalPoints]
		currentHighlightedBar.style.background = "white";
	}
}

var curTutorialIndex = 0;

function ShowTutorialMenu() {
	var scrollView = document.getElementById('mtContainer');
	scrollView.scrollLeft = 0;
	curTutorialIndex = 0;
	document.getElementById('mtDecButton').style.visibility = 'hidden';
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_tutorial");
}

function IncrementTutorial() {
	if (curTutorialIndex < 6) {
		curTutorialIndex++;
		var scrollView = document.getElementById('mtContainer');
		scrollView.scrollLeft = curTutorialIndex*400;
		document.getElementById('mtDecButton').style.visibility = 'visible';
		if (curTutorialIndex === 6) {
			document.getElementById('mtIncButton').style.visibility = 'hidden';
		}
	}
}

function DecrementTutorial() {
	if (curTutorialIndex > 0) {
		curTutorialIndex--;
		var scrollView = document.getElementById('mtContainer');
		scrollView.scrollLeft = curTutorialIndex*400;
		document.getElementById('mtIncButton').style.visibility = 'visible';
		if (curTutorialIndex === 0) {
			document.getElementById('mtDecButton').style.visibility = 'hidden';
		}
	}
}

function GameOverClosedClick() {
	game.ReturnAllCardsToDeck();
	visibleMenuCards.pop();
	var elem = document.getElementById('GameOverView');
	with(elem.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
		top = "0%";
		opacity = 0;
	}
	setTimeout(function() {
		elem.style.visibility = 'hidden';

		// Show the close button
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'none';
		}
		ShowMainMenu();
	}, 500);
}

