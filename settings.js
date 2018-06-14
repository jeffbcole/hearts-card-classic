var setting_manual_count_scores_default = false;
var setting_muggins_default = false;
var setting_hints_default = false;
var setting_warn_suboptimal_default = false;
var setting_fast_count_default = false;
var setting_board_color_default = 'wood';
var setting_card_color_default = 'blue';

function GetSetting(setting) {
	switch (setting) {
		case "setting_manual_count_scores":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_manual_count_scores_default : (settingVal == 'true');
			break;
		case "setting_muggins":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_muggins_default : (settingVal == 'true');
			break;
		case "setting_hints":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_hints_default : (settingVal == 'true');
			break;
		case "setting_warn_suboptimal":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_warn_suboptimal_default : (settingVal == 'true');
			break;
		case "setting_fast_count":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_fast_count_default : (settingVal == 'true');
			break;
		case "setting_board_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_board_color_default : settingVal;
			break;
		case "setting_card_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_card_color_default : settingVal;
			break;
	}
}

function SetSetting(setting, val) {
	window.localStorage.setItem(setting, val);
}

function GetStatistic(statistic) {
    var val = window.localStorage.getItem(statistic);
    return val == null ? Number(0) : Number(val);
}

function GetStatisticString(statistic) {
	var val = window.localStorage.getItem(statistic);
	return val == null ? "" : val;
}

function SetStatistic(statistic, value) {
	window.localStorage.setItem(statistic, value);
}

function redirectToAppStore() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
	if (/windows phone/i.test(userAgent)) {
		window.location.replace("https://www.microsoft.com/en-us/store/p/cribbage-classic/9wzdncrfjhg7");
		return true;
	}
  
	if (/android/i.test(userAgent)) {
		window.location.replace("https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0ahUKEwiK16z69vrXAhUEz2MKHQTPBHAQFggwMAE&url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.gamesbypost.cribbageclassic%26hl%3Den&usg=AOvVaw0PiEE9Anr8UoUvzp2L47vp");
		return true;
	}
  
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		window.location.replace("https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=4&cad=rja&uact=8&ved=0ahUKEwiK16z69vrXAhUEz2MKHQTPBHAQFgg9MAM&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fcribbage-classic%2Fid901900997%3Fmt%3D8&usg=AOvVaw17oi1oNyltt6JXntrfOCaO");
		return true;
	}
  
	return false;
}