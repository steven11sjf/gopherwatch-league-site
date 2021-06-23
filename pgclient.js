const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

client.connect();

/*client.query('CREATE TABLE players_tbl ( name varchar(20), team varchar(80), draftpos int, tankeligible boolean, dpseligible int, supporteligible int, tanksr int, dpssr int, supportsr int, discordtag varchar(80), discordpublic boolean, othernames varchar(80), pronouns varchar(20), bio varchar(240), twitch varchar(80), twitter varchar(80), mvp int);', (err,res) => {
	if(err) throw err;
	for(let row of res.rows) {
		console.log(JSON.stringify(row));
	}
	client.end();
});*/

var pgclient = {

	// inserts a player into the table
	// uses the same format as a row in players.json["players"]
	insertPlayer: function insertPlayer(obj) {
		let tank = parseInt(obj.tank), dps=parseInt(obj.dps), support=parseInt(obj.support), draft=parseInt(obj.draft);
		if(isNaN(tank)) tank = -1;
		if(isNaN(dps)) dps = -1;
		if(isNaN(support)) support = -1;
		if(isNaN(draft)) draft = -1;
		console.log(obj.battletag,tank,dps,support,draft);
		let query = 'INSERT INTO ';
		query += 'players(battletag,team,draftpos,tank,dps,support,discord,othernames,pronouns,bio,twitch,twitter) ';
		query += 'VALUES (';
		query += `\'${obj.battletag}\',\'${obj.team}\',${draft},`;
		query += `${tank},${dps},${support},`;
		query += `\'${obj.discordtag}\',\'${obj.morebtags}\',\'${obj.pronouns}\',\'${obj.bio}\',\'${obj.twitch}\',`;
		query += `\'${obj.twitter}\')`;
		query += ';';
		client.query(query, (err,res) => {
			if(err) throw err;
			console.log('uwu');
		});
	},
	
	// updates values for a player in the players table
	// (battletag)  : string containing battletag
	// (rows)       : the rows to be updated as a string. surrounded by parentheses and with single quotes
	//                around each string header. i.e. "('team','draftpos')"
	// (info)       : the updated values for the row, formatted like rows was. 
	//                i.e. "('Bendigo Bilbies',62)"
	updatePlayer: function updatePlayer(battletag, rows, info) {
		// UPDATE players SET (col1,col2,...)=(data1,data2,...) WHERE battletag='battletag';
		let query = 'UPDATE players SET ' + rows + '=' + info + ' WHERE battletag=\'' + battletag + '\';';
		client.query(query,(err,res) => {
			if(err) throw err;
			console.log('Updated player ' + battletag);
		});
	},
	
	// gets the row for a player with given battletag
	getPlayer: function getPlayer(battletag) {
		// SELECT * FROM players WHERE battletag='battletag';
		let query = 'SELECT * FROM players WHERE battletag=\'' + battletag + '\';';
		client.query(query,(err,res) => {
			if(err) throw err;
			return res.rows;
		});
	},
	
	// updates a match's value in the table
	// (ident)		: the identifier for the row, which is the row's id. 
	updateMatch: function updateMatch(ident, cols, data) {
		// UPDATE match_tbl SET (col1,col2,...)=(data1,data2,...) WHERE id=ident;
		let query = 'UPDATE match_tbl SET ' + cols + '=' + data + ' WHERE id=' + ident;
		client.query(query,(err,res) => {
			if(err) throw err;
			console.log('Updated match #'+ident);
		});
	},
	
	// gets matches based on the team
	getMatchesByTeam: function getMatchesByTeam(team) {
		// SELECT * FROM match_tbl WHERE team1='team' OR team2='team';
		let query = 'SELECT * FROM match_tbl WHERE team1=\'' + team + '\' OR team2=\'' + team + '\';';
		client.query(query,(err,res) => {
			if(err) throw err;
			return res.rows;
		});
	},
	
	// gets matches based on round
	getMatchesByRound: function getMatchesByRound(round) {
		// SELECT * FROM match_tbl WHERE round=round;
		let query = 'SELECT * FROM match_tbl WHERE round=' + round + ';';
		client.query(query,(err,res) => {
			if(err) throw err;
			return res.rows;
		});
	},
	
	// gets all matches
	getAllMatches: function getAllMatches() {
		// SELECT * FROM match_tbl;
		let query = 'SELECT * FROM match_tbl;';
		client.query(query,(err,res) => {
			if(err) throw err;
			return res.rows;
		});
	}
	
	// inserts a match
	insertMatch: function insertMatch(match) {
		// INSERT INTO match_tbl(columns) VALUES (data);
		let query = 'INSERT INTO match_tbl(';
		query += 'tournament,team1,team2,date,time,played,map1,map1w,map2,map2w,map3,map3w,map4,map4w,map5,map5w,map6,map6w,map7,map7w,map8,map8w,winner,vod,round,mvp)  VALUES (';
		query += match.tournament;
		query += ',';
		query += match.team1;
		query += ',';
		query += match.team2;
		query += ',';
		query += match.date;
		query += ',';
	}
}

module.exports = pgclient;