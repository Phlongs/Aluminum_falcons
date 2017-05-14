var keys = require('../keys');
var Twitter = require('twitter');
var unirest = require("unirest");
var express = require('express');
var router = express.Router();
var client = new Twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token,
	access_token_secret: keys.access_secret
});
function tweetsData(company,cb){
	console.log(company)
		var stream =  client.stream('statuses/filter', {track: company});
		var arr = [];
		stream.on('data', function(event) {
			arr.push(event.text);
			if(arr.length === 2){
				cb(arr);
			}
		});
	}
	function awsApi(cb,company){
		var apiResults = []
			tweetsData(company,function(tweetArr){
				
				for(var i = 0 ; i < tweetArr.length; i++){
					unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
					.header("X-Mashape-Key", "BOEwktCNBDmshSUeLunnuyGLz48wp1yHuyljsnNDWN4oLTDPPG")
					.header("Content-Type", "application/x-www-form-urlencoded")
					.header("Accept", "application/json")
					.send("text="+tweetArr[i])
					.end(function (result) {
						console.log("result in awsApi",result);
						apiResults.push(result.body);
						
						if(apiResults.length === i){
							cb(apiResults);
						}

					});
					
				}
			});
	}
module.exports = {
	route: function(app){
		app.post("/api/create_stock",function(req,res){
			awsApi(function(data){
				console.log("this worked",data);
				var dataNum = data.reduce(function(a,b){
					return a.score + b.score;
				});
				
				//console.log(req.body)
				//res.json({company: req.body.company,sentiment:data});
			},req.body.company)
		})
	}


}