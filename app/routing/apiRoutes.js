var friendsData = require('../data/friends.js');
var path = require('path');

var compatibilityArray = [];

module.exports = function(app){
	app.post('/api/survey', function(req, res){ 
		friendsData.push(req.body);
		userScores = req.body.scores;
		compatibilityArray = [];
		for(friendNum=0;friendNum<friendsData.length-1;friendNum++){
			var compatibilityScore = 0;
			var scoreDiff = 0;

			for (var i = 0; i < userScores.length; i++) {
				scoreDiff = Math.abs(userScores[i]-friendsData[friendNum].scores[i]);
				compatibilityScore = compatibilityScore + scoreDiff;	
			}

			compatibilityArray.push(compatibilityScore);
		}

		var bestFriendScore = compatibilityArray[0];

		for (var i = 0; i < compatibilityArray.length; i++) {
			if(compatibilityArray[i]<bestFriendScore){
				bestFriendScore = compatibilityArray[i];
			}
		}

		var ties = [];

		for (var i = 0; i < compatibilityArray.length; i++) {
			if(bestFriendScore == compatibilityArray[i]){
				ties.push(i);
			}
		}

		var max = ties.length-1;
		var min = 0;

		var randomIndexAmongTies = (Math.floor(Math.random() * (max - min + 1)) + min);
		var bestFriendIndex = ties[randomIndexAmongTies];
		var bestFriendName = friendsData[bestFriendIndex].friendName;
		if(ties.length>1){
			var alertText = "Choosen randomly among " + ties.length + " matches";
		} else{
			var alertText = "There were no ties!";
		}

		var bestFriendPhotoLink = friendsData[bestFriendIndex].friendPhoto;
		if(bestFriendIndex == friendsData.length-1){
			bestFriendName = "You are your own best friend!";
			alertText = "You are the first to use FriendFinder!";
			bestFriendPhotoLink = friendsData[0].friendPhoto;
		}

		res.json({
			'name': bestFriendName,
			'alert': alertText,
			'photo': bestFriendPhotoLink
		});
	});
};
