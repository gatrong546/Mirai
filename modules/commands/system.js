module.exports.config = {
	name: "system",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Xem thông tin phần cứng mà bot đang sử dụng",
	commandCategory: "system",
	cooldowns: 5,
	dependencies: {
		"systeminformation": "",
		"pidusage": ""
	}
};

function byte2mb(bytes) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(bytes, 10) || 0;
	while (n >= 1024 && ++l) n = n / 1024;
	return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)}${units[l]}`;
}
	function secondsToHms(time){
		var h = Math.floor(time / 3600);
		var m = Math.floor(time % 3600 / 60);
		var s = Math.floor(time % 3600 % 60);
		var hDisplay = h > 0 ? `0${h}`.slice(-2) : '00';
		var mDisplay = m > 0 ? `0${m}`.slice(-2) : '00';
		var sDisplay = s > 0 ? `0${s}`.slice(-2) : '00';
		return `${hDisplay}:${mDisplay}:${sDisplay}`;
}

module.exports.run = async function ({ api, event }) {
	const { cpu, time, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo, graphics, dockerInfo, } = global.nodemodule["systeminformation"];
	const timeStart = Date.now();

	try {
		const pidusage = await global.nodemodule["pidusage"](process.pid)
		var { manufacturer, brand, speedMax, physicalCores, cores, speed, speedMin } = await cpu();
		var { main: mainTemp } = await cpuTemperature();
		var { currentLoad: load } = await currentLoad();
		var { uptime } = await time();
		var diskInfo = await diskLayout();
		var memInfo = await memLayout();
		var { total: totalMem, available: availableMem } = await mem();
		var { platform: OSPlatform, distro, uefi, arch, build: release } = await osInfo();
		var { controllers: graphicsControl, } = await graphics();
		var disk = [], i = 1;

		var hours = Math.floor(uptime / (60 * 60));
		var minutes = Math.floor((uptime % (60 * 60)) / 60);
		var seconds = Math.floor(uptime % 60);
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;

		for (const singleDisk of diskInfo) {
			disk.push(
				`====「 DISK ${i++}  ====\n` +
				"» Tên: " + singleDisk.name + "\n" +
				"» Nhà Sản Xuất: " + singleDisk.vendor + "\n" +
				"» Cổng: " + singleDisk.interfaceType + "\n" + 
				"» Loại: " + (singleDisk.type == undefined ? "Không Xác Định" : singleDisk.type === 'HD' ? 'HDD' : singleDisk.type) + "\n" +
				"» Kích Thước: " + byte2mb(singleDisk.size)
			)
		}

	
		console.log(uefi)
		return api.sendMessage(
			"====「 CPU  ====\n" +
			"» Tên: " + manufacturer + " " + brand + "\n" +
			"» Tốc Độ Mặc Định: " + speed + "GHz\n" +
			"» Số Luồng: " + cores + "\n" +
			"» Số Nhân: " + physicalCores + "\n" +
			"» Load: " + load.toFixed(1) + "%\n" +
			"==== 「 RAM 」 ====\n" +
			"» Tổng: " + byte2mb(totalMem) +
			"\n» Loại: " + memInfo[0].type +
			"\n» Khả Dụng: " + byte2mb(availableMem) +
			"\n» Nodejs: " + byte2mb(pidusage.memory) + "\n" +
			disk.join("\n") + "\n" +
			"====「 OS  ====\n" +
			"» Tên: " + distro +
			"\n» Nền Tảng: " + OSPlatform +
			"\n» Kiến Trúc: " + arch +
			"\n» Phiên Bản: " +release +
			"\n» Chế Độ Khởi Động: " + (uefi == true ? "UEFI" : "Legacy")  +
			"\n» Thời Gian Hoạt Động: " + hours + ":" + minutes + ":" + seconds +
			"\n» Thời Gian Lấy Dữ Liệu: " + secondsToHms((Date.now() - timeStart) * (10 ** -3)),
			event.threadID, event.messageID
		)
	}
	catch (e) {
		console.log(e) 
	}
}