module.exports.config = {
	name: "ip",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord (Convert By Linh)",
	description: "lấy thông tin ip",
	commandCategory: "general",
	usages: "ip [ip]",
	cooldowns: 5,
	dependencies: {
		"request": ""
	},
	info: [
		{
			key: 'ip',
			prompt: '',
			type: 'IP',
			example: 'ip 1.1.1.1'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {	
const request = global.nodemodule["request"];
const { throwError } = global.utils;
const { threadID, messageID } = event;
var ip = args.join(" ");
return request(encodeURI(`http://ip-api.com/json/${ip}?fields=continent,country,city,timezone,isp,query,org`),(err, response, body) => {
	if (err) throw err;
	var data = JSON.parse(body);
	if (!data.continent && !data.country && !data.city && !data.timezone && !data.isp && !data.org)
        return api.sendMessage('Không tìm thấy thông tin của IP này.', event.threadID, event.messageID);
    return api.sendMessage(`===「${data.query}」===` +
        `\n» Châu lục: ${data.continent}` +
        `\n» Quốc gia: ${data.country}` +
        `\n» Thành phố: ${data.city}` +
        `\n» Múi giờ: ${data.timezone}` +
		`\n» Tổ Chức: ${data.isp}` +
        `\n» Nhà cung cấp: ${data.org}`, event.threadID, event.messageID);
		
}
)};