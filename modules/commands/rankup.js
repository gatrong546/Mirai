module.exports.config = {
	name: "rankup",
	version: "0.0.1-beta",
	hasPermssion: 1,
	credits: "Mirai Team",
	description: "Thông báo rankup cho từng nhóm, người dùng",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.handleEvent = async function({ api, event, Currencies }) {
	try {
		const { senderID } = event;
		var exp = parseInt((await Currencies.getData(senderID)).exp);		
		if (isNaN(exp)) return;
		exp += 1;
		await Currencies.setData(senderID, { exp });
		return;
	} catch {}
}
module.exports.run = async function({api, event}) {
	api.sendMessage("Lệnh này là một lệnh vô dụng",event.threadID,event.messageID)
}