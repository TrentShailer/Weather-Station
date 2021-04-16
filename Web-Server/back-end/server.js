require("dotenv").config();

var fs = require("fs");
var path = require("path");
var dateFormat = require("dateformat");
// var https = require("https");
var http = require("http");
// var privateKey = fs.readFileSync("", "utf8");
// var certificate = fs.readFileSync("", "utf8");

// var credentials = { key: privateKey, cert: certificate };

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: true });

// Initialise libraries
var express = require("express");
const { stringify } = require("querystring");
var app = express();

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

app.use(express.static(path.join(__dirname, "/build")));

app.set("trust proxy", 1);

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.post("/GetData", (req, res) => {
	var now = new Date();
	var data = fs.readFileSync(
		path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"), "CurrentData.json")
	);
	var obj = JSON.parse(data);
	console.log(obj);
	return res.send(obj);
});

function GetWeather(temperature, wind, rain, light, uv, now) {
	return "";
}

app.post("/SaveData", urlEncodedParser, (req, res) => {
	if (req.body.secret === process.env.SECRET) {
		var now = new Date();
		var temperature = req.body.temperature;
		var humidity = req.body.humidity;
		var wind = req.body.wind;
		var light = req.body.light;
		var uv = req.body.uv;
		var pressure = req.body.pressure;
		var rain = req.body.rain;

		var weather = GetWeather(temperature, wind, rain, light, uv, now);
		if (!fs.existsSync(path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"))))
			fs.mkdirSync(path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd")));
		fs.writeFileSync(
			path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"), "CurrentData.json"),
			JSON.stringify({
				date: dateFormat(now, "yyyy-mm-dd h:MM:ss TT"),
				data: {
					temperature: temperature,
					humidity: humidity,
					weather: weather,
					wind: wind,
					light: light,
					uv: uv,
					pressure: pressure,
				},
			})
		);
		fs.writeFileSync(
			path.join(
				__dirname,
				"/data",
				dateFormat(now, "yyyy-mm-dd"),
				`${dateFormat(now, "h-MM-ss TT")}.json`
			),
			JSON.stringify({
				date: dateFormat(now, "yyyy-mm-dd h:MM:ss TT"),
				data: {
					temperature: temperature,
					humidity: humidity,
					weather: weather,
					wind: wind,
					light: light,
					uv: uv,
					pressure: pressure,
				},
			})
		);
		// ImportantValues.json format:
		/*
		{
			average: {
				temperature: #,
				humidity: #,
				wind: #,
				light: #,
				uv: #,
				pressure: #
			},
			peak: {
				temperature: #,
				humidity: #,
				wind: #,
				light: #,
				uv: #,
				pressure: #
			},
			trough: {
				temperature: #,
				humidity: #,
				wind: #,
				light: #,
				uv: #,
				pressure: #
			}
		}
		*/
		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
});

app.get("*", (req, res) => {
	res.redirect("/");
});

//httpsServer.listen(3001);
httpServer.listen(3002);
