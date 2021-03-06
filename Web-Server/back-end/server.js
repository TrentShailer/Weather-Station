require("dotenv").config();

var fs = require("fs");
const fsA = fs.promises;
var path = require("path");
var dateFormat = require("dateformat");
var http = require("http");

if (process.argv[2] !== "nohttps") {
	var https = require("https");
	var privateKey = fs.readFileSync("", "utf8");
	var certificate = fs.readFileSync("", "utf8");

	var credentials = { key: privateKey, cert: certificate };
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialise libraries
var express = require("express");
var app = express();

var httpServer = http.createServer(app);
if (process.argv[2] !== "nohttps") {
	var httpsServer = https.createServer(credentials, app);
}

app.use(express.static(path.join(__dirname, "/build")));

app.set("trust proxy", 1);

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.post("/GetData", async (req, res) => {
	var now = new Date();
	try {
		var data = await fsA.readFile(
			path.join(
				__dirname,
				"/data",
				dateFormat(now, "yyyy-mm-dd"),
				"CurrentData.json"
			)
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

function GetWeather(rain, pressure, uv, now) {
	return "";
}

app.post("/SaveData", urlEncodedParser, async (req, res) => {
	if (req.body.secret === process.env.SECRET) {
		var now = new Date();
		var temperature = Number(req.body.temperature);
		var humidity = Number(req.body.humidity);
		var wind = Number(req.body.wind);
		var uv = Number(req.body.uv);
		var pressure = Number(req.body.pressure);
		var rain = Number(req.body.rain);

		var weather = GetWeather(rain, pressure, uv, now);

		var exists = true;
		try {
			await fsA.stat(
				path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"))
			);
		} catch (err) {
			exists = false;
		}

		if (!exists)
			await fsA.mkdir(
				path.join(__dirname, "/data", dateFormat(now, "yyyy-mm-dd"))
			);
		await fsA.writeFile(
			path.join(
				__dirname,
				"/data",
				dateFormat(now, "yyyy-mm-dd"),
				"CurrentData.json"
			),
			JSON.stringify({
				date: dateFormat(now, "yyyy-mm-dd h:MM TT"),
				data: {
					temperature: temperature,
					humidity: humidity,
					weather: weather,
					wind: wind,
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
					uv: uv,
					pressure: pressure,
				},
			})
		);

		var exists = true;
		try {
			await fsA.stat(
				path.join(
					__dirname,
					"/data/",
					dateFormat(now, "yyyy-mm-dd"),
					"ImportantValues.json"
				)
			);
		} catch (err) {
			exists = false;
		}

		if (exists) {
			var importantData = await fsA.readFile(
				path.join(
					__dirname,
					"/data/",
					dateFormat(now, "yyyy-mm-dd"),
					"ImportantValues.json"
				)
			);
			var objData = JSON.parse(importantData);
			// update peaks and troughs
			if (objData.peak.temperature < temperature)
				objData.peak.temperature = temperature;
			if (objData.peak.humidity < humidity)
				objData.peak.humidity = humidity;
			if (objData.peak.wind < wind) objData.peak.wind = wind;
			if (objData.peak.uv < uv) objData.peak.uv = uv;
			if (objData.peak.pressure < pressure)
				objData.peak.pressure = pressure;

			if (objData.trough.temperature > temperature)
				objData.trough.temperature = temperature;
			if (objData.trough.humidity > humidity)
				objData.trough.humidity = humidity;
			if (objData.trough.wind > wind) objData.trough.wind = wind;
			if (objData.trough.uv > uv) objData.trough.uv = uv;
			if (objData.trough.pressure > pressure)
				objData.trough.pressure = pressure;

			objData.values++;
			objData.extra.rain += rain;

			// Update average
			objData.average.temperature =
				objData.average.temperature +
				(temperature - objData.average.temperature) / objData.values;
			objData.average.humidity =
				objData.average.humidity +
				(humidity - objData.average.humidity) / objData.values;
			objData.average.wind =
				objData.average.wind +
				(wind - objData.average.wind) / objData.values;
			objData.average.uv =
				objData.average.uv + (uv - objData.average.uv) / objData.values;
			objData.average.pressure =
				objData.average.pressure +
				(pressure - objData.average.pressure) / objData.values;
			await fsA.writeFile(
				path.join(
					__dirname,
					"/data/",
					dateFormat(now, "yyyy-mm-dd"),
					"ImportantValues.json"
				),
				JSON.stringify(objData)
			);
		} else {
			await fsA.writeFile(
				path.join(
					__dirname,
					"/data/",
					dateFormat(now, "yyyy-mm-dd"),
					"ImportantValues.json"
				),
				JSON.stringify({
					values: 1,
					average: {
						temperature: temperature,
						humidity: humidity,
						wind: wind,
						uv: uv,
						pressure: pressure,
					},
					peak: {
						temperature: temperature,
						humidity: humidity,
						wind: wind,
						uv: uv,
						pressure: pressure,
					},
					trough: {
						temperature: temperature,
						humidity: humidity,
						wind: wind,
						uv: uv,
						pressure: pressure,
					},
					extra: {
						rain: rain,
					},
				})
			);
		}

		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
});
app.post("/GetWeather", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [{ id: "mm of Rain", data: [] }];
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

		if (
			dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")
		)
			break;
		var text = await fsA.readFile(dir);
		var objData = JSON.parse(text);
		data[0].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.extra.rain / 60).toFixed(1),
		});
		ittrDate.setDate(ittrDate.getDate() + 1);
	}
	res.send(data);
});

app.post("/GetTemperature", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [
		{ id: "Average", data: [] },
		{ id: "Maximum", data: [] },
		{ id: "Minimum", data: [] },
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

		if (
			dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")
		)
			break;
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

app.post("/GetHumidity", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [
		{ id: "Average", data: [] },
		{ id: "Maximum", data: [] },
		{ id: "Minimum", data: [] },
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

		if (
			dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")
		)
			break;
		var text = await fsA.readFile(dir);
		var objData = JSON.parse(text);
		data[0].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.average.humidity).toFixed(1),
		});
		data[1].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.peak.humidity).toFixed(1),
		});
		data[2].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.trough.humidity).toFixed(1),
		});
		ittrDate.setDate(ittrDate.getDate() + 1);
	}
	res.send(data);
});

app.post("/GetWind%20Speed", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [
		{ id: "Average", data: [] },
		{ id: "Maximum", data: [] },
		{ id: "Minimum", data: [] },
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

		if (
			dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")
		)
			break;
		var text = await fsA.readFile(dir);
		var objData = JSON.parse(text);
		data[0].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.average.wind).toFixed(1),
		});
		data[1].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.peak.wind).toFixed(1),
		});
		data[2].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.trough.wind).toFixed(1),
		});
		ittrDate.setDate(ittrDate.getDate() + 1);
	}
	res.send(data);
});

app.post("/GetUV%20Index", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [
		{ id: "Average", data: [] },
		{ id: "Maximum", data: [] },
		{ id: "Minimum", data: [] },
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

		if (
			dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")
		)
			break;
		var text = await fsA.readFile(dir);
		var objData = JSON.parse(text);
		data[0].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.average.uv).toFixed(1),
		});
		data[1].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.peak.uv).toFixed(1),
		});
		data[2].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.trough.uv).toFixed(1),
		});
		ittrDate.setDate(ittrDate.getDate() + 1);
	}
	res.send(data);
});
app.post("/GetAir%20Pressure", async (req, res) => {
	var now = new Date();
	var ittrDate = new Date();
	ittrDate.setFullYear(ittrDate.getFullYear() - 1);
	var data = [
		{ id: "Average", data: [] },
		{ id: "Maximum", data: [] },
		{ id: "Minimum", data: [] },
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

		if (
			dateFormat(ittrDate, "yyyy-mm-dd") === dateFormat(now, "yyyy-mm-dd")
		)
			break;
		var text = await fsA.readFile(dir);
		var objData = JSON.parse(text);
		data[0].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.average.pressure).toFixed(1),
		});
		data[1].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.peak.pressure).toFixed(1),
		});
		data[2].data.push({
			x: dateFormat(ittrDate, "yyyy-mm-dd"),
			y: +Number(objData.trough.pressure).toFixed(1),
		});
		ittrDate.setDate(ittrDate.getDate() + 1);
	}
	res.send(data);
});

app.get("*", (req, res) => {
	res.redirect("/");
});

if (process.argv[2] !== "nohttps") {
	httpsServer.listen(3002);
}

httpServer.listen(2002);
