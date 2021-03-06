var express = require('express');
var app = express();
var fs = require('fs');
var report = require('./src/report/node-report-json.js');

// 跨域请求设置
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/briefingJson', function (req, res) {
	var file = __dirname + "/data/" + "briefing.json";

	var briefingJson = report.getBriefingJson(file);

	fs.writeFile('briefing.json', briefingJson, (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});

	res.end(briefingJson);
});


app.get('/briefingJson.json', function (req, res) {
	var file = __dirname + "/" + "briefing.json";

	fs.readFile(file, (err, briefingJson) => {
		if (err) throw err;
		res.end(briefingJson);
	});
});

var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("应用实例，访问地址为 http://%s:%s", host, port)

});
