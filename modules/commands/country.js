module.exports.config = {
	name: "country",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord (Convert By Linh)",
	description: "Country",
	commandCategory: "general",
	usages: "country [vn]",
	cooldowns: 5,
	dependencies: {
		"request": ""
	},
	
};

module.exports.run = async ({ api, event, args }) => {	
const request = global.nodemodule["request"];
const { threadID, messageID } = event;
var country = args.join(" ");
return request(encodeURI(`https://restcountries.eu/rest/v2/name/${country}?fullText=true&fields=name;region;languages;capital;topLevelDomain;callingCodes;population;currencies;regionalBlocs`),(err, response, body) => {
	var data = JSON.parse(body);
	return api.sendMessage(`» Quốc gia: ${data[0].name}.` +
        `\n» Châu lục: ${data[0].region}.` +
        `\n» Ngôn ngữ: ${data[0].languages.map((e) => e.name).join(', ')}.` +
        `\n» Thủ đô: ${data[0].capital}.` +
        `\n» Tên miền: ${data[0].topLevelDomain.join(', ')}.` +
        `\n» Mã gọi: ${data[0].callingCodes.join(', ')}.` +
        `\n» Dân số: ${data[0].population}.` +
        `\n» Tiền tệ: ${data[0].currencies.map((e) => e.code).join(', ')}.` +
        `\n» Khối kinh tế: ${data[0].regionalBlocs.map((e) => e.acronym).join(', ')}.`, event.threadID, event.messageID);
}
)};