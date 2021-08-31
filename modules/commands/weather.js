module.exports.config = {
	name: "weather",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Xem thông tin thời tiết tại khu vực",
	commandCategory: "other",
	usages: "[Location]",
	cooldowns: 5,
	dependencies: {
		"request": ""
	},
	envConfig: {
		"OPEN_WEATHER": "c89a8759cb4cfc3349a5015c1b158a72"
	}
};



module.exports.run = async ({ api, event, args, getText }) => {
	const request = global.nodemodule["request"];
	const { throwError } = global.utils;
	const { threadID, messageID } = event;
	
	var city = args.join(" ");
	if (city.length == 0) return throwError(this.config.name, threadID, messageID);
	return request(encodeURI(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c89a8759cb4cfc3349a5015c1b158a72&units=metric&lang=vi`), (err, response, body) => {
		if (err) throw err;
		var data = JSON.parse(body);
		if (data.cod !== 200)
        return api.sendMessage(`Không tìm thấy ${city}.`, event.threadID, event.messageID);
		else
		api.sendMessage(`===「${data.name}」===` +
		`\n» Quốc gia: ${data.sys.country}.` +
		`\n» Nhiệt độ: ${data.main.temp}℃.` +
		`\n» Cảm giác: ${data.main.feels_like}℃.` +
		`\n» Bầu trời: ${data.weather[0].description.replace(/(mây|bầu trời) /gi, '')}.` +
		`\n» Độ ẩm: ${data.main.humidity}%.` +
		`\n» Tốc độ gió: ${data.wind.speed}km/h.`, event.threadID, event.messageID);
		
		
	});
}