require("dotenv").config();

var fs = require("fs");
const fsA = fs.promises;
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
var app = express();

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

app.use(express.static(path.join(__dirname, "/build")));

app.set("trust proxy", 1);

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.post("/GetData", async (req, res) => {
	var now = new Date();
	try {
		var data = await fsA.readFile(
			path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"), "CurrentData.json")
		);
	} catch (err) {
		var data = await fsA.readFile(
			path.join(
				__dirname,
				"/data",
				dateFormat(now.setDate(now.getDate() - 1), "yyyy-mm-dd"),
				"CurrentData.json"
			)
		);
	}
	var obj = JSON.parse(data);
	return res.send(obj);
});

function GetWeather(rain, light, uv, now) {
	// Get if its raining (how heavily)
	// Get the light level compared to average for time for cloudy
	// Options (low to high priority)
	// This is all given that I get get roughly how rainy it is
	// Sunny
	// Partially Cloudy
	// Cloudy
	//
	// Light showers
	// Rain
	// Heavy rain

	return "";
}

app.post("/SaveData", urlEncodedParser, async (req, res) => {
	if (req.body.secret === process.env.SECRET) {
		var now = new Date();
		var temperature = Number(req.body.temperature);
		var humidity = Number(req.body.humidity);
		var wind = Number(req.body.wind);
		var light = Number(req.body.light);
		var uv = Number(req.body.uv);
		var pressure = Number(req.body.pressure);
		var rain = Number(req.body.rain);

		var weather = GetWeather(rain, light, uv, now);

		var exists = true;
		try {
			await fsA.stat(path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd")));
		} catch (err) {
			exists = false;
		}

		if (!exists) await fsA.mkdir(path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd")));
		await fsA.writeFile(
			path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"), "CurrentData.json"),
			JSON.stringify({
				date: dateFormat(now, "yyyy-mm-dd h:MM TT"),
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
		await fsA.writeFile(
			path.join(
				__dirname,
				"/data",
				dateFormat(now, "yyyy-mm-dd"),
				`${dateFormat(now, "h-MM TT")}.json`
			),
			JSON.stringify({
				date: dateFormat(now, "yyyy-mm-dd h:MM TT"),
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

		var exists = true;

		try {
			await fsA.stat(
				path.join(__dirname, "/data/", dateFormat(now, "yyyy-mm-dd"), "ImportantValues.json")
			);
		} catch (err) {
			exists = false;
		}

		if (exists) {
			var importantData = await fsA.readFile(
				path.join(__dirname, "/data/", dateFormat(now, "yyyy-mm-dd"), "ImportantValues.json")
			);
			var objData = JSON.parse(importantData);
			// update peaks and troughs
			if (objData.peak.temperature < temperature) objData.peak.temperature = temperature;
			if (objData.peak.humidity < humidity) objData.peak.humidity = humidity;
			if (objData.peak.wind < wind) objData.peak.wind = wind;
			if (objData.peak.light < light) objData.peak.light = light;
			if (objData.peak.uv < uv) objData.peak.uv = uv;
			if (objData.peak.pressure < pressure) objData.peak.pressure = pressure;

			if (objData.trough.temperature > temperature) objData.trough.temperature = temperature;
			if (objData.trough.humidity > humidity) objData.trough.humidity = humidity;
			if (objData.trough.wind > wind) objData.trough.wind = wind;
			if (objData.trough.light > light) objData.trough.light = light;
			if (objData.trough.uv > uv) objData.trough.uv = uv;
			if (objData.trough.pressure > pressure) objData.trough.pressure = pressure;

			objData.values++;

			// Update average
			objData.average.temperature =
				objData.average.temperature + (temperature - objData.average.temperature) / objData.values;
			objData.average.humidity =
				objData.average.humidity + (humidity - objData.average.humidity) / objData.values;
			objData.average.wind = objData.average.wind + (wind - objData.average.wind) / objData.values;
			objData.average.light =
				objData.average.light + (light - objData.average.light) / objData.values;
			objData.average.uv = objData.average.uv + (uv - objData.average.uv) / objData.values;
			objData.average.pressure =
				objData.average.pressure + (pressure - objData.average.pressure) / objData.values;
			await fsA.writeFile(
				path.join(__dirname, "/data/", dateFormat(now, "yyyy-mm-dd"), "ImportantValues.json"),
				JSON.stringify(objData)
			);
		} else {
			await fsA.writeFile(
				path.join(__dirname, "/data/", dateFormat(now, "yyyy-mm-dd"), "ImportantValues.json"),
				JSON.stringify({
					values: 1,
					average: {
						temperature: temperature,
						humidity: humidity,
						wind: wind,
						light: light,
						uv: uv,
						pressure: pressure,
					},
					peak: {
						temperature: temperature,
						humidity: humidity,
						wind: wind,
						light: light,
						uv: uv,
						pressure: pressure,
					},
					trough: {
						temperature: temperature,
						humidity: humidity,
						wind: wind,
						light: light,
						uv: uv,
						pressure: pressure,
					},
				})
			);
		}

		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
});

app.post("/GetTemperature", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [
		{ id: "Average", color: "hsl(239, 70%, 50%)", data: [] },
		{ id: "Peak", color: "hsl(131, 70%, 50%)", data: [] },
		{ id: "Trough", color: "hsl(336, 70%, 50%)", data: [] },
	];
	for (var i = 0; i < 365; i++) {
		var exists = true;
		var dir = path.join(
			__dirname,
			"data",
			dateFormat(ittrDate, "yyyy-mm-dd"),
			"ImportantValues.json"
		);
		await fsA.stat(dir).catch((err) => {
			exists = false;
		});
		if (!exists) {
			ittrDate.setDate(ittrDate.getDate() + 1);
			continue;
		}

		if (dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")) break;
		var text = await fsA.readFile(dir);
		var objData = JSON.parse(text);
		data[0].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.average.temperature).toFixed(1),
		});
		data[1].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.peak.temperature).toFixed(1),
		});
		data[2].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.trough.temperature).toFixed(1),
		});
		ittrDate.setDate(ittrDate.getDate() + 1);
	}
	res.send(data);
});

app.get("*", (req, res) => {
	res.redirect("/");
});

//httpsServer.listen(3001);
httpServer.listen(3002);
