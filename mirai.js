//////////////////////////////////////////////////////
//========= Require all variable need use =========//
/////////////////////////////////////////////////////

const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("fca-xuyen-get");
const axios = require("axios");

global.client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	eventRegistered: new Array(),
	handleSchedule: new Array(),
	handleReaction: new Array(),
	handleReply: new Array(),
	mainPath: process.cwd(),
	timeRunProcess: new Array(),
	timeStart: Date.now(),
	configPath: new String()
});

global.data = new Object({
	threadInfo: new Map(),
	threadData: new Map(),
	userName: new Map(),
	userBanned: new Map(),
	threadBanned: new Map(),
	allUserID: new Array(),
	allCurrenciesID: new Array(),
	allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

try {
	global.client.configPath = join(global.client.mainPath, "config.json");
	var configValue = require(global.client.configPath);
	logger.loader(`Đã tìm thấy file config: ${"config.json"}`);
}
catch {
	if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
		var configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
		configValue = JSON.parse(configValue);
		logger.loader(`Đã tìm thấy file config: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
	}
	else return logger.loader(`Không tìm thấy file config: ${"config.json"}`, "error");
}

try {
	for (const [name, value] of Object.entries(configValue)) global.config[name] = value;
	logger.loader("Config Loaded!");
}
catch {
	return logger.loader("Không thể load config!", "error");
}

writeFileSync(global.client.configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

const { commands, events, timeRunProcess } = global.client;

////////////////////////////////////////////////
//========= Import command to GLOBAL =========//
////////////////////////////////////////////////

const _0x5d60=['\x4b\x68\u00f4\x6e\x67\x20\x74\x68\u1ec3\x20','\x6c\x6f\x61\x64\x65\x72','\x74\u1ea3\x69\x20\x63\x6f\x6e\x66\x69\x67','\x6d\x61\x69\x6e\x50\x61\x74\x68','\x65\x6e\x76\x43\x6f\x6e\x66\x69\x67','\x6e\x67\x20\u0111\u00fa\x6e\x67\x20\u0111\u1ecb','\x6a\x73\x6f\x6e','\x2c\x20\x6c\u1ed7\x69\x3a\x20','\x31\x33\x66\x41\x69\x71\x79\x72','\x6e\x70\x6d\x20\x2d\x2d\x70\x61\x63\x6b','\x73\x74\x72\x69\x6e\x67\x69\x66\x79','\x68\x61\x6e\x64\x6c\x65\x45\x76\x65\x6e','\x63\u00e0\x69\x20\u0111\u1eb7\x74\x20\x70\x61','\x64\x75\x6c\x65\x20','\x65\x76\x65\x6e\x74\x52\x65\x67\x69\x73','\x20\x68\u1ed7\x20\x74\x72\u1ee3\x20\x63\x68','\x6f\x20\x6d\x6f\x64\x75\x6c\x65\x20','\x34\x30\x33\x35\x75\x68\x7a\x4c\x73\x42','\x62\x75\x69\x6c\x74\x69\x6e\x4d\x6f\x64','\x69\x6e\x63\x6c\x75\x64\x65\x73','\x61\x62\x6c\x65\x64','\x66\x69\x6c\x74\x65\x72','\x6d\x6f\x64\x75\x6c\x65','\x76\u1edb\x69\x20\x6d\u1ed9\x74\x20\x6d\x6f','\x20\x76\u1edb\x69\x20\x6c\u1ed7\x69\x3a\x20','\x70\x61\x72\x73\x65','\x20\x62\u1ecb\x20\x74\x72\u00f9\x6e\x67\x20','\x2e\x6a\x73','\x6e\x6f\x64\x65\x5f\x6d\x6f\x64\x75\x6c','\x63\x6b\x61\x67\x65\x20','\x6c\x6f\x61\x64\x20\x6d\x6f\x64\x75\x6c','\x39\x30\x31\x38\x34\x37\x63\x45\x50\x6f\x45\x58','\x63\x6f\x6d\x6d\x61\x6e\x64\x44\x69\x73','\x6e\x6f\x64\x65\x6d\x6f\x64\x75\x6c\x65','\x6d\x61\x6e\x64\x20','\x6f\x6e\x4c\x6f\x61\x64\x20\x6d\x6f\x64','\x64\x65\x70\x65\x6e\x64\x65\x6e\x63\x69','\x61\x67\x65\x2d\x6c\x6f\x63\x6b\x20\x66','\x63\x77\x64','\x2e\x2f\x70\x61\x63\x6b\x61\x67\x65\x2e','\x2c\x20\x74\x69\u1ebf\x6e\x20\x68\u00e0\x6e','\x20\x63\x68\x6f\x20\x6d\x6f\x64\x75\x6c','\x6e\x68\x20\x63\u00f4\x6e\x67\x20\x74\x6f','\x4c\x6f\x61\x64\x65\x64\x20\x63\x6f\x6e','\x31\x38\x36\x47\x76\x47\x71\x71\x79','\x65\x78\x61\x6d\x70\x6c\x65','\x73\x65\x74','\x74\x65\x72\x65\x64','\x68\x61\x73','\x20\x6d\x6f\x64\x75\x6c\x65\x20','\x70\x75\x73\x68','\x63\x61\x63\x68\x65','\x63\x6f\x6e\x66\x69\x67','\x66\x69\x67\x20\x6d\x6f\x64\x75\x6c\x65','\x65\x6e\x64\x73\x57\x69\x74\x68','\x68\x61\x73\x4f\x77\x6e\x50\x72\x6f\x70','\x67\x65\x20','\x75\x6c\x65\x3a\x20','\x63\x6c\x69\x65\x6e\x74','\x31\x33\x33\x37\x38\x34\x38\x4d\x78\x5a\x55\x56\x5a','\x6d\x73\x0a','\x65\x6e\x74\x72\x69\x65\x73','\x6e\x6f\x77','\x65\x72\x72\x6f\x72','\x37\x6b\x77\x4e\x50\x78\x67','\x65\x72\x74\x79','\x65\x20\x63\x6f\x6d\x6d\x61\x6e\x64\x20','\x75\x6e\x64\x65\x66\x69\x6e\x65\x64','\x33\x38\x39\x35\x39\x65\x41\x69\x58\x47\x50','\x65\x6e\x76','\x63\x6f\x6e\x66\x69\x67\x4d\x6f\x64\x75','\x74\x68\u1ea5\x79\x20\x70\x61\x63\x6b\x61','\x77\x61\x72\x6e','\x6f\x6e\x4c\x6f\x61\x64','\x6e\x61\x6d\x65','\x4c\x6f\x61\x64\x65\x64\x20\x63\x6f\x6d','\x6f\x6d\x6d\x61\x6e\x64\x73\x2f','\x73\x74\x61\x63\x6b','\x63\u00f9\x6e\x67\x20\x74\u00ea\x6e\x20\x6b','\x75\x6c\x65\x73','\x61\x6c\x73\x65\x20\x2d\x2d\x73\x61\x76','\x31\x35\x32\x33\x32\x39\x35\x74\x78\x74\x58\x45\x6b','\x68\u00e1\x63\x21','\x31\x30\x35\x31\x30\x35\x37\x47\x75\x4f\x64\x73\x66','\x2f\x6d\x6f\x64\x75\x6c\x65\x73\x2f\x63','\x54\u00ea\x6e\x20\x6d\x6f\x64\x75\x6c\x65','\x63\x6f\x6e\x66\x69\x67\x56\x61\x6c\x75','\x31\x36\x34\x30\x33\x31\x51\x77\x4c\x46\x78\x59'];function _0x51e3(_0x557e2e,_0x23c31b){_0x557e2e=_0x557e2e-(0x5e*0x3+0x22f*-0x1+0x20c);let _0x508769=_0x5d60[_0x557e2e];return _0x508769;}(function(_0x527520,_0x4d176e){const _0x29b405=_0x51e3;while(!![]){try{const _0x3119ad=-parseInt(_0x29b405(0x146))+-parseInt(_0x29b405(0x138))*parseInt(_0x29b405(0xfb))+-parseInt(_0x29b405(0x120))+parseInt(_0x29b405(0x122))+-parseInt(_0x29b405(0x126))*-parseInt(_0x29b405(0x10f))+parseInt(_0x29b405(0x10a))+-parseInt(_0x29b405(0x12f))*-parseInt(_0x29b405(0x113));if(_0x3119ad===_0x4d176e)break;else _0x527520['push'](_0x527520['shift']());}catch(_0x42095a){_0x527520['push'](_0x527520['shift']());}}}(_0x5d60,-0xa38d4+-0x15a7a3*-0x1+0x19c1*0x12),function(){const _0x49f566=_0x51e3,_0x55adf0=readdirSync(global[_0x49f566(0x109)][_0x49f566(0x12a)]+(_0x49f566(0x123)+'\x6f\x6d\x6d\x61\x6e\x64\x73'))[_0x49f566(0x13c)](_0x462ec1=>_0x462ec1[_0x49f566(0x105)](_0x49f566(0x142))&&!_0x462ec1[_0x49f566(0x13a)](_0x49f566(0xfc))&&!global[_0x49f566(0x103)][_0x49f566(0x147)+_0x49f566(0x13b)]['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x462ec1));for(const _0x502c0b of _0x55adf0){const _0x27d42f=Date[_0x49f566(0x10d)]();try{var _0x12cea7=require(global[_0x49f566(0x109)][_0x49f566(0x12a)]+('\x2f\x6d\x6f\x64\x75\x6c\x65\x73\x2f\x63'+_0x49f566(0x11b))+_0x502c0b);if(!_0x12cea7[_0x49f566(0x103)]||!_0x12cea7['\x72\x75\x6e']||!_0x12cea7[_0x49f566(0x103)]['\x63\x6f\x6d\x6d\x61\x6e\x64\x43\x61\x74'+'\x65\x67\x6f\x72\x79'])throw new Error('\x4d\x6f\x64\x75\x6c\x65\x20\x6b\x68\u00f4'+_0x49f566(0x12c)+'\x6e\x68\x20\x64\u1ea1\x6e\x67\x21');if(commands[_0x49f566(0xff)](_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]||''))throw new Error(_0x49f566(0x124)+_0x49f566(0x141)+_0x49f566(0x13e)+'\x64\x75\x6c\x65\x20\x6d\x61\x6e\x67\x20'+_0x49f566(0x11d)+_0x49f566(0x121));if(_0x12cea7[_0x49f566(0x103)][_0x49f566(0x14b)+'\x65\x73']&&typeof _0x12cea7['\x63\x6f\x6e\x66\x69\x67']['\x64\x65\x70\x65\x6e\x64\x65\x6e\x63\x69'+'\x65\x73']=='\x6f\x62\x6a\x65\x63\x74'){const _0x1facc9=JSON[_0x49f566(0x140)](readFileSync(_0x49f566(0x14e)+_0x49f566(0x12d)))[_0x49f566(0x14b)+'\x65\x73'],_0x2c8ab9=require(_0x49f566(0x13d))[_0x49f566(0x139)+_0x49f566(0x11e)];for(const _0x357cea in _0x12cea7[_0x49f566(0x103)][_0x49f566(0x14b)+'\x65\x73']){var _0x348940=0x204f+-0x1*-0x23f3+-0x1*0x4442,_0x226534=![],_0x5e3c71;const _0x5ed418=join(__dirname,'\x6e\x6f\x64\x65\x6d\x6f\x64\x75\x6c\x65'+'\x73',_0x49f566(0x143)+'\x65\x73',_0x357cea);try{if(!global[_0x49f566(0x148)]['\x68\x61\x73\x4f\x77\x6e\x50\x72\x6f\x70'+_0x49f566(0x110)](_0x357cea)){if(_0x1facc9[_0x49f566(0x106)+'\x65\x72\x74\x79'](_0x357cea)||_0x2c8ab9[_0x49f566(0x13a)](_0x357cea))global[_0x49f566(0x148)][_0x357cea]=require(_0x357cea);else global[_0x49f566(0x148)][_0x357cea]=require(_0x5ed418);}}catch{logger[_0x49f566(0x128)]('\x4b\x68\u00f4\x6e\x67\x20\x74\u00ec\x6d\x20'+_0x49f566(0x116)+_0x49f566(0x107)+_0x357cea+(_0x49f566(0x136)+_0x49f566(0x137))+_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]+(_0x49f566(0xf7)+'\x68\x20\x63\u00e0\x69\x20\u0111\u1eb7\x74\x2e'+'\x2e\x2e'),_0x49f566(0x117));const _0x247e48={};_0x247e48['\x73\x74\x64\x69\x6f']='\x69\x6e\x68\x65\x72\x69\x74',_0x247e48[_0x49f566(0x114)]=process[_0x49f566(0x114)],_0x247e48['\x73\x68\x65\x6c\x6c']=!![],_0x247e48[_0x49f566(0x14d)]=join(__dirname,_0x49f566(0x148)+'\x73'),execSync(_0x49f566(0x130)+_0x49f566(0x14c)+_0x49f566(0x11f)+'\x65\x20\x69\x6e\x73\x74\x61\x6c\x6c\x20'+_0x357cea+(_0x12cea7['\x63\x6f\x6e\x66\x69\x67'][_0x49f566(0x14b)+'\x65\x73'][_0x357cea]=='\x2a'||_0x12cea7[_0x49f566(0x103)]['\x64\x65\x70\x65\x6e\x64\x65\x6e\x63\x69'+'\x65\x73'][_0x357cea]==''?'':'\x40'+_0x12cea7['\x63\x6f\x6e\x66\x69\x67'][_0x49f566(0x14b)+'\x65\x73'][_0x357cea]),_0x247e48);for(_0x348940=-0x1ad1+-0x17d6+0x32a8;_0x348940<=0x81*0x38+0x1d2c+-0x3961;_0x348940++){require[_0x49f566(0x102)]={};try{if(_0x1facc9[_0x49f566(0x106)+_0x49f566(0x110)](_0x357cea)||_0x2c8ab9['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x357cea))global[_0x49f566(0x148)][_0x357cea]=require(_0x357cea);else global[_0x49f566(0x148)][_0x357cea]=require(_0x5ed418);_0x226534=!![];break;}catch(_0xffbe73){_0x5e3c71=_0xffbe73;}if(_0x226534||!_0x5e3c71)break;}if(!_0x226534||_0x5e3c71)throw _0x49f566(0x127)+_0x49f566(0x133)+_0x49f566(0x144)+_0x357cea+(_0x49f566(0xf8)+'\x65\x20')+_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]+_0x49f566(0x12e)+_0x5e3c71+'\x20'+_0x5e3c71[_0x49f566(0x11c)];}}logger[_0x49f566(0x128)]('\u0110\u00e3\x20\x74\u1ea3\x69\x20\x74\x68\u00e0'+_0x49f566(0xf9)+'\u00e0\x6e\x20\x62\u1ed9\x20\x70\x61\x63\x6b'+'\x61\x67\x65\x20\x63\x68\x6f\x20\x6d\x6f'+_0x49f566(0x134)+_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]);}if(_0x12cea7[_0x49f566(0x103)][_0x49f566(0x12b)])try{for(const [_0x26033c,_0x4d8618]of Object[_0x49f566(0x10c)](_0x12cea7[_0x49f566(0x103)]['\x65\x6e\x76\x43\x6f\x6e\x66\x69\x67'])){if(typeof global[_0x49f566(0x115)+'\x6c\x65'][_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]]==_0x49f566(0x112))global['\x63\x6f\x6e\x66\x69\x67\x4d\x6f\x64\x75'+'\x6c\x65'][_0x12cea7['\x63\x6f\x6e\x66\x69\x67']['\x6e\x61\x6d\x65']]={};if(typeof configValue[_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]]==_0x49f566(0x112))configValue[_0x12cea7['\x63\x6f\x6e\x66\x69\x67'][_0x49f566(0x119)]]={};if(typeof configValue[_0x12cea7[_0x49f566(0x103)]['\x6e\x61\x6d\x65']][_0x26033c]!==_0x49f566(0x112))global['\x63\x6f\x6e\x66\x69\x67\x4d\x6f\x64\x75'+'\x6c\x65'][_0x12cea7['\x63\x6f\x6e\x66\x69\x67'][_0x49f566(0x119)]][_0x26033c]=configValue[_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]][_0x26033c];else global[_0x49f566(0x115)+'\x6c\x65'][_0x12cea7[_0x49f566(0x103)]['\x6e\x61\x6d\x65']][_0x26033c]=_0x4d8618||'';if(typeof configValue[_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]][_0x26033c]==_0x49f566(0x112))configValue[_0x12cea7['\x63\x6f\x6e\x66\x69\x67'][_0x49f566(0x119)]][_0x26033c]=_0x4d8618||'';}logger[_0x49f566(0x128)](_0x49f566(0xfa)+_0x49f566(0x104)+'\x20'+_0x12cea7['\x63\x6f\x6e\x66\x69\x67'][_0x49f566(0x119)]);}catch(_0x3dbd33){logger[_0x49f566(0x128)](_0x49f566(0x127)+_0x49f566(0x129)+_0x49f566(0x100)+_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]+'\x20'+JSON[_0x49f566(0x131)](_0x3dbd33),'\x65\x72\x72\x6f\x72');}if(_0x12cea7[_0x49f566(0x118)])try{const _0x331797={};_0x331797[_0x49f566(0x125)+'\x65']=configValue,_0x12cea7['\x6f\x6e\x4c\x6f\x61\x64'](_0x331797);}catch(_0x31aff0){throw new Error(_0x49f566(0x127)+_0x49f566(0x14a)+_0x49f566(0x108)+_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]+'\x20'+JSON[_0x49f566(0x131)](_0x31aff0),_0x49f566(0x10e));}if(_0x12cea7[_0x49f566(0x132)+'\x74'])global[_0x49f566(0x109)][_0x49f566(0x135)+_0x49f566(0xfe)][_0x49f566(0x101)](_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]);commands[_0x49f566(0xfd)](_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)],_0x12cea7),logger[_0x49f566(0x128)](_0x49f566(0x11a)+_0x49f566(0x149)+_0x12cea7[_0x49f566(0x103)]['\x6e\x61\x6d\x65']+'\x21');}catch(_0x5e5609){logger['\x6c\x6f\x61\x64\x65\x72'](_0x49f566(0x127)+_0x49f566(0x145)+_0x49f566(0x111)+_0x502c0b+_0x49f566(0x13f)+_0x5e5609,'\x65\x72\x72\x6f\x72');}Date[_0x49f566(0x10d)]()-_0x27d42f>-0x3e*-0x5e+0x10f7+0x187*-0x1a?timeRunProcess['\x70\x75\x73\x68'](_0x12cea7[_0x49f566(0x103)][_0x49f566(0x119)]+'\x20\x2d\x20'+(Date[_0x49f566(0x10d)]()-_0x27d42f)+_0x49f566(0x10b)):'';}}());

//////////////////////////////////////////////
//========= Import event to GLOBAL =========//
//////////////////////////////////////////////

const _0x19b0=['\x20\x68\u1ed7\x20\x74\x72\u1ee3\x20\x63\x68','\x70\x61\x72\x73\x65','\x63\x6f\x6e\x66\x69\x67\x56\x61\x6c\x75','\x6d\x6f\x64\x75\x6c\x65','\x63\x6f\x6e\x66\x69\x67\x4d\x6f\x64\x75','\x35\x34\x37\x30\x39\x4c\x46\x4a\x78\x65\x54','\x76\x65\x6e\x74\x73\x2f','\x68\x20\x63\u00e0\x69\x20\u0111\u1eb7\x74\x2e','\x63\u00e0\x69\x20\u0111\u1eb7\x74\x20\x70\x61','\u00e0\x6e\x20\x62\u1ed9\x20\x70\x61\x63\x6b','\x75\x6c\x65\x3a\x20','\x6c\x6f\x61\x64\x20\x6d\x6f\x64\x75\x6c','\x54\u00ea\x6e\x20\x6d\x6f\x64\x75\x6c\x65','\x65\x6e\x74\x72\x69\x65\x73','\x2e\x6a\x73','\x6d\x6f\x64\x75\x6c\x65\x20','\x20\x62\u1ecb\x20\x74\x72\u00f9\x6e\x67\x20','\x65\x20\x65\x76\x65\x6e\x74\x20','\x33\x36\x31\x37\x35\x35\x4d\x75\x50\x45\x74\x6c','\x77\x61\x72\x6e','\x65\x20\x69\x6e\x73\x74\x61\x6c\x6c\x20','\x61\x6c\x73\x65\x20\x2d\x2d\x73\x61\x76','\x69\x6e\x68\x65\x72\x69\x74','\x61\x67\x65\x2d\x6c\x6f\x63\x6b\x20\x66','\x73\x74\x64\x69\x6f','\x65\x6e\x64\x73\x57\x69\x74\x68','\x76\u1edb\x69\x20\x6d\u1ed9\x74\x20\x6d\x6f','\x75\x6c\x65\x20','\x31\x34\x33\x38\x33\x37\x4f\x50\x63\x52\x66\x6a','\x66\x69\x6c\x74\x65\x72','\x6f\x20\x6d\x6f\x64\x75\x6c\x65\x20','\x64\x65\x70\x65\x6e\x64\x65\x6e\x63\x69','\x68\x61\x73\x4f\x77\x6e\x50\x72\x6f\x70','\x20\x65\x76\x65\x6e\x74\x20\x6d\x6f\x64','\x6e\x61\x6d\x65','\x2e\x2f\x70\x61\x63\x6b\x61\x67\x65\x2e','\x73\x74\x72\x69\x6e\x67\x69\x66\x79','\x6e\x74\x20','\x20\x2d\x20','\x2f\x6d\x6f\x64\x75\x6c\x65\x73\x2f\x65','\x65\x72\x74\x79','\x6e\x68\x20\x63\u00f4\x6e\x67\x20\x74\x6f','\x20\x76\u1edb\x69\x20\x6c\u1ed7\x69\x3a\x20','\x6e\x6f\x77','\x6d\x73\x0a','\u0110\u00e3\x20\x74\u1ea3\x69\x20\x74\x68\u00e0','\x63\x6f\x6e\x66\x69\x67','\x66\x69\x67\x20\x65\x76\x65\x6e\x74\x20','\x6d\x61\x69\x6e\x50\x61\x74\x68','\x70\x75\x73\x68','\x2c\x20\x6c\u1ed7\x69\x3a\x20','\x65\x72\x72\x6f\x72','\x20\x63\x68\x6f\x20\x6d\x6f\x64\x75\x6c','\x62\x75\x69\x6c\x74\x69\x6e\x4d\x6f\x64','\x76\x65\x6e\x74\x73','\x4b\x68\u00f4\x6e\x67\x20\x74\x68\u1ec3\x20','\x34\x31\x34\x38\x36\x37\x72\x4f\x58\x6a\x4c\x62','\x39\x6b\x6a\x48\x69\x7a\x65','\x36\x43\x62\x57\x4f\x6e\x68','\x6f\x6e\x4c\x6f\x61\x64\x20\x6d\x6f\x64','\x4b\x68\u00f4\x6e\x67\x20\x74\u00ec\x6d\x20','\x33\x38\x33\x36\x36\x35\x7a\x6b\x73\x57\x4f\x56','\x73\x74\x61\x63\x6b','\x68\x61\x73','\x6c\x6f\x61\x64\x65\x72','\x65\x6e\x76','\x63\u00f9\x6e\x67\x20\x74\u00ea\x6e\x20\x6b','\x4d\x6f\x64\x75\x6c\x65\x20\x6b\x68\u00f4','\x75\x6e\x64\x65\x66\x69\x6e\x65\x64','\x65\x6e\x76\x43\x6f\x6e\x66\x69\x67','\x65\x76\x65\x6e\x74\x44\x69\x73\x61\x62','\x4c\x6f\x61\x64\x65\x64\x20\x63\x6f\x6e','\x75\x6c\x65\x73','\x2c\x20\x74\x69\u1ebf\x6e\x20\x68\u00e0\x6e','\x31\x45\x48\x57\x76\x4a\x59','\x31\x31\x32\x33\x37\x30\x32\x54\x41\x78\x53\x6b\x65','\x63\x6c\x69\x65\x6e\x74','\x69\x6e\x63\x6c\x75\x64\x65\x73','\x74\u1ea3\x69\x20\x63\x6f\x6e\x66\x69\x67','\x6e\x6f\x64\x65\x6d\x6f\x64\x75\x6c\x65','\x74\x68\u1ea5\x79\x20\x70\x61\x63\x6b\x61','\x64\x75\x6c\x65\x20','\x64\x75\x6c\x65\x20\x6d\x61\x6e\x67\x20','\x73\x68\x65\x6c\x6c','\x31\x30\x30\x36\x31\x65\x74\x6a\x53\x70\x64','\x73\x65\x74'];function _0x5461(_0x4a73c5,_0x3905f6){_0x4a73c5=_0x4a73c5-(-0x1492+0x1*-0x96f+0x1e76);let _0x1e4129=_0x19b0[_0x4a73c5];return _0x1e4129;}(function(_0x3438fa,_0x301e5a){const _0x3c9334=_0x5461;while(!![]){try{const _0x45d324=-parseInt(_0x3c9334(0xab))*parseInt(_0x3c9334(0x9e))+-parseInt(_0x3c9334(0xbc))*parseInt(_0x3c9334(0x9a))+parseInt(_0x3c9334(0x7d))+-parseInt(_0x3c9334(0xb5))*parseInt(_0x3c9334(0x9b))+-parseInt(_0x3c9334(0x99))+parseInt(_0x3c9334(0xc9))+parseInt(_0x3c9334(0xac));if(_0x45d324===_0x301e5a)break;else _0x3438fa['push'](_0x3438fa['shift']());}catch(_0x14b206){_0x3438fa['push'](_0x3438fa['shift']());}}}(_0x19b0,0x11d*0x547+0x3*-0x1ded5+0x3fa73*0x1),function(){const _0x555a26=_0x5461,_0x5cbd6c=readdirSync(global['\x63\x6c\x69\x65\x6e\x74']['\x6d\x61\x69\x6e\x50\x61\x74\x68']+(_0x555a26(0x88)+_0x555a26(0x97)))[_0x555a26(0x7e)](_0x354241=>_0x354241[_0x555a26(0x7a)](_0x555a26(0xc5))&&!global[_0x555a26(0x8f)][_0x555a26(0xa7)+'\x6c\x65\x64'][_0x555a26(0xae)](_0x354241));for(const _0x550fdb of _0x5cbd6c){const _0x17bf65=Date['\x6e\x6f\x77']();try{var _0x1a435d=require(global[_0x555a26(0xad)][_0x555a26(0x91)]+(_0x555a26(0x88)+_0x555a26(0xbd))+_0x550fdb);if(!_0x1a435d[_0x555a26(0x8f)]||!_0x1a435d['\x72\x75\x6e'])throw new Error(_0x555a26(0xa4)+'\x6e\x67\x20\u0111\u00fa\x6e\x67\x20\u0111\u1ecb'+'\x6e\x68\x20\x64\u1ea1\x6e\x67\x21');if(events[_0x555a26(0xa0)](_0x1a435d[_0x555a26(0x8f)]['\x6e\x61\x6d\x65'])||'')throw new Error(_0x555a26(0xc3)+_0x555a26(0xc7)+_0x555a26(0x7b)+_0x555a26(0xb3)+_0x555a26(0xa3)+'\x68\u00e1\x63\x21');if(_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x80)+'\x65\x73']&&typeof _0x1a435d[_0x555a26(0x8f)][_0x555a26(0x80)+'\x65\x73']=='\x6f\x62\x6a\x65\x63\x74'){const _0x19305b=JSON[_0x555a26(0xb8)](readFileSync(_0x555a26(0x84)+'\x6a\x73\x6f\x6e'))[_0x555a26(0x80)+'\x65\x73'],_0x40275e=require(_0x555a26(0xba))[_0x555a26(0x96)+_0x555a26(0xa9)];for(const _0x12f8c5 in _0x1a435d[_0x555a26(0x8f)][_0x555a26(0x80)+'\x65\x73']){var _0x3f94fb=0x1*0x1+-0xf39+-0x79c*-0x2,_0x32ed5a=![],_0x1f2fd5;const _0x468ad6=join(__dirname,'\x6e\x6f\x64\x65\x6d\x6f\x64\x75\x6c\x65'+'\x73','\x6e\x6f\x64\x65\x5f\x6d\x6f\x64\x75\x6c'+'\x65\x73',_0x12f8c5);try{if(!global[_0x555a26(0xb0)][_0x555a26(0x81)+_0x555a26(0x89)](_0x12f8c5)){if(_0x19305b[_0x555a26(0x81)+_0x555a26(0x89)](_0x12f8c5)||_0x40275e[_0x555a26(0xae)](_0x12f8c5))global[_0x555a26(0xb0)][_0x12f8c5]=require(_0x12f8c5);else global[_0x555a26(0xb0)][_0x12f8c5]=require(_0x468ad6);}}catch{logger[_0x555a26(0xa1)](_0x555a26(0x9d)+_0x555a26(0xb1)+'\x67\x65\x20'+_0x12f8c5+(_0x555a26(0xb7)+_0x555a26(0x7f))+_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]+(_0x555a26(0xaa)+_0x555a26(0xbe)+'\x2e\x2e'),_0x555a26(0xca));const _0x9e47d2={};_0x9e47d2[_0x555a26(0x79)]=_0x555a26(0x77),_0x9e47d2['\x65\x6e\x76']=process[_0x555a26(0xa2)],_0x9e47d2[_0x555a26(0xb4)]=!![],_0x9e47d2['\x63\x77\x64']=join(__dirname,_0x555a26(0xb0)+'\x73'),execSync('\x6e\x70\x6d\x20\x2d\x2d\x70\x61\x63\x6b'+_0x555a26(0x78)+_0x555a26(0x76)+_0x555a26(0x75)+_0x12f8c5+(_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x80)+'\x65\x73'][_0x12f8c5]=='\x2a'||_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x80)+'\x65\x73'][_0x12f8c5]==''?'':'\x40'+_0x1a435d[_0x555a26(0x8f)]['\x64\x65\x70\x65\x6e\x64\x65\x6e\x63\x69'+'\x65\x73'][_0x12f8c5]),_0x9e47d2);for(_0x3f94fb=-0x25be+-0x1082+0x3641;_0x3f94fb<=-0x18aa+-0x9a7+0x2254;_0x3f94fb++){require['\x63\x61\x63\x68\x65']={};try{if(global[_0x555a26(0xb0)]['\x69\x6e\x63\x6c\x75\x64\x65\x73'](_0x12f8c5))break;if(_0x19305b[_0x555a26(0x81)+_0x555a26(0x89)](_0x12f8c5)||_0x40275e[_0x555a26(0xae)](_0x12f8c5))global[_0x555a26(0xb0)][_0x12f8c5]=require(_0x12f8c5);else global[_0x555a26(0xb0)][_0x12f8c5]=require(_0x468ad6);_0x32ed5a=!![];break;}catch(_0x176c62){_0x1f2fd5=_0x176c62;}if(_0x32ed5a||!_0x1f2fd5)break;}if(!_0x32ed5a||_0x1f2fd5)throw _0x555a26(0x98)+_0x555a26(0xbf)+'\x63\x6b\x61\x67\x65\x20'+_0x12f8c5+(_0x555a26(0x95)+'\x65\x20')+_0x1a435d['\x63\x6f\x6e\x66\x69\x67'][_0x555a26(0x83)]+_0x555a26(0x93)+_0x1f2fd5+'\x20'+_0x1f2fd5[_0x555a26(0x9f)];}}logger[_0x555a26(0xa1)](_0x555a26(0x8e)+_0x555a26(0x8a)+_0x555a26(0xc0)+'\x61\x67\x65\x20\x63\x68\x6f\x20\x6d\x6f'+_0x555a26(0xb2)+_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]);}if(_0x1a435d[_0x555a26(0x8f)][_0x555a26(0xa6)])try{for(const [_0x45661c,_0x2a6833]of Object[_0x555a26(0xc4)](_0x1a435d[_0x555a26(0x8f)][_0x555a26(0xa6)])){if(typeof global[_0x555a26(0xbb)+'\x6c\x65'][_0x1a435d[_0x555a26(0x8f)]['\x6e\x61\x6d\x65']]==_0x555a26(0xa5))global[_0x555a26(0xbb)+'\x6c\x65'][_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]]={};if(typeof configValue[_0x1a435d['\x63\x6f\x6e\x66\x69\x67'][_0x555a26(0x83)]]=='\x75\x6e\x64\x65\x66\x69\x6e\x65\x64')configValue[_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]]={};if(typeof configValue[_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]][_0x45661c]!==_0x555a26(0xa5))global[_0x555a26(0xbb)+'\x6c\x65'][_0x1a435d['\x63\x6f\x6e\x66\x69\x67'][_0x555a26(0x83)]][_0x45661c]=configValue[_0x1a435d['\x63\x6f\x6e\x66\x69\x67']['\x6e\x61\x6d\x65']][_0x45661c];else global[_0x555a26(0xbb)+'\x6c\x65'][_0x1a435d[_0x555a26(0x8f)]['\x6e\x61\x6d\x65']][_0x45661c]=_0x2a6833||'';if(typeof configValue[_0x1a435d[_0x555a26(0x8f)]['\x6e\x61\x6d\x65']][_0x45661c]==_0x555a26(0xa5))configValue[_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]][_0x45661c]=_0x2a6833||'';}logger['\x6c\x6f\x61\x64\x65\x72'](_0x555a26(0xa8)+_0x555a26(0x90)+_0x555a26(0xc6)+_0x1a435d['\x63\x6f\x6e\x66\x69\x67']['\x6e\x61\x6d\x65']);}catch(_0x4ad412){throw new Error(_0x555a26(0x98)+_0x555a26(0xaf)+_0x555a26(0x82)+_0x555a26(0x7c)+_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]+'\x2c\x20'+_0x4ad412);}if(_0x1a435d['\x6f\x6e\x4c\x6f\x61\x64'])try{const _0x5b60fb={};_0x5b60fb[_0x555a26(0xb9)+'\x65']=configValue,_0x1a435d['\x6f\x6e\x4c\x6f\x61\x64'](_0x5b60fb);}catch(_0x2b18fc){throw new Error(_0x555a26(0x98)+_0x555a26(0x9c)+_0x555a26(0xc1)+_0x1a435d[_0x555a26(0x8f)][_0x555a26(0x83)]+_0x555a26(0x8b)+JSON[_0x555a26(0x85)](_0x2b18fc));}events[_0x555a26(0xb6)](_0x1a435d['\x63\x6f\x6e\x66\x69\x67']['\x6e\x61\x6d\x65'],_0x1a435d),logger['\x6c\x6f\x61\x64\x65\x72']('\x4c\x6f\x61\x64\x65\x64\x20\x65\x76\x65'+_0x555a26(0x86)+_0x1a435d['\x63\x6f\x6e\x66\x69\x67'][_0x555a26(0x83)]+'\x21');}catch(_0x5222a6){logger['\x6c\x6f\x61\x64\x65\x72'](_0x555a26(0x98)+_0x555a26(0xc2)+_0x555a26(0xc8)+_0x550fdb+'\x20\x76\u1edb\x69\x20\x6c\u1ed7\x69\x3a\x20'+_0x5222a6,_0x555a26(0x94));}Date[_0x555a26(0x8c)]()-_0x17bf65>0xa96+-0x8b8+-0x2b*0xb?timeRunProcess[_0x555a26(0x92)](_0x1a435d['\x63\x6f\x6e\x66\x69\x67'][_0x555a26(0x83)]+_0x555a26(0x87)+(Date[_0x555a26(0x8c)]()-_0x17bf65)+_0x555a26(0x8d)):'';}}());

logger.loader(`Load thành công: ${commands.size} module commands | ${events.size} module events`);
if (global.config.DeveloperMode == true && global.client.timeRunProcess.length != 0) logger.loader(global.client.timeRunProcess.join("\r"), "warn");
logger.loader(`=== ${Date.now() - global.client.timeStart}ms ===`);

writeFileSync(global.client.configPath, JSON.stringify(configValue, null, 4), 'utf8');
unlinkSync(global.client.configPath + ".temp");

try {
	var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
	var appState = require(appStateFile);
}
catch (e) {
	return logger("Đã xảy ra lỗi trong khi lấy appstate đăng nhập, lỗi: " + e, "error");
}

////////////////////////////////////////////////////////////
//========= Login account and start Listen Event =========//
////////////////////////////////////////////////////////////

const _0x26e6=['\x75\x73\x65\x72\x49\x44','\x55\x73\x65\x72\x49\x44','\x2e\x20\x4c\x69\u00ea\x6e\x20\x68\u1ec7\x20','\x67\x65\x74\x43\x75\x72\x72\x65\x6e\x74','\x68\x20\x73\u00e1\x63\x68\x20\x67\x6c\x6f','\x41\x44\x4d\x49\x4e\x42\x4f\x54','\x48\x69\u1ec7\x6e\x20\x74\u1ea1\x69\x20\x74','\x49\x44\x20\x62\u00e1\x6f\x20\x63\u00e1\x6f','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x67\x62','\x65\x63\x74\x20\x76\u00e0\x6f\x20\x6c\u00fa','\u0110\x61\x6e\x67\x20\x6b\x69\u1ec3\x6d\x20','\x20\x6d\x69\x72\x61\x69\x70\x72\x6f\x6a','\x62\x61\x6c\x20\x62\x61\x6e\x21','\x63\x68\x69\x20\x74\x69\u1ebf\x74\x21','\u0110\u00e3\x20\x6b\x69\u1ec3\x6d\x20\x74\x72','\x20\x76\u1edb\x69\x20\x6c\u00fd\x20\x64\x6f','\x33\x32\x35\x30\x33\x32\x6e\x6b\x71\x46\x6b\x57','\x64\x61\x74\x61','\x64\x6c\x69\x73\x74\x20\x63\u1ee7\x61\x20','\x61\x6c\x6c\x54\x68\x72\x65\x61\x64\x49','\x2c\x20\x4c\x69\u00ea\x6e\x20\x68\u1ec7\x20','\x74\u1edb\x69\x20\x66\x61\x63\x65\x62\x6f','\x63\x6c\x69\x65\x6e\x74','\x72\x6f\x6e\x67\x20\x66\x72\x69\x65\x6e','\x72\x65\x61\x73\x6f\x6e','\x31\x36\x32\x37\x65\x6c\x65\x68\x62\x67','\x69\x72\x61\x69\x70\x72\x6f\x6a\x65\x63','\x6c\x6f\x67','\x62\x69\u1ebf\x74\x20\x74\x68\u00ea\x6d\x20','\x73\x65\x74','\x72\x61\x69\x70\x72\x6f\x6a\x65\x63\x74','\x31\x32\x30\x4d\x67\x61\x79\x71\x44','\x31\x30\x39\x38\x35\x35\x31\x47\x66\x71\x71\x42\x69','\x68\x61\x73\x4f\x77\x6e\x50\x72\x6f\x70','\x61\x20\x78\x6f\x6e\x67\x20\x64\x61\x6e','\x31\x32\x34\x37\x31\x39\x34\x66\x6c\x66\x71\x62\x6f','\u00e1\x63\x68\x20\x67\x6c\x6f\x62\x61\x6c','\x33\x31\x31\x50\x54\x41\x51\x57\x76','\x6f\x6b\x20\x68\x74\x74\x70\x73\x3a\x2f','\x63\x61\x63\x68\x65','\x31\x65\x77\x49\x67\x75\x6a','\x68\x61\x73','\x74\x68\x72\x65\x61\x64\x42\x61\x6e\x6e','\x63\x68\x69\x20\x74\x69\u1ebf\x74\x2c\x20','\x4c\x69\x73\x74','\x20\x62\x61\x6e\x2e\x2e\x2e','\x31\x47\x6f\x71\x6d\x52\x6f','\x67\x65\x74','\x61\x70\x69','\x69\x73\x74\x2e\x6a\x73\x6f\x6e','\x41\x4e\x20\x5d','\x34\x34\x35\x33\x34\x38\x6a\x55\x53\x58\x59\x6c','\x74\x20\x76\u00e0\x6f\x20\x6c\u00fa\x63\x20','\x64\x61\x74\x65\x41\x64\x64\x65\x64','\x63\x6f\x6e\x66\x69\x67\x50\x61\x74\x68','\x38\x30\x30\x38\x37\x34\x76\x74\x56\x4e\x4b\x72','\u1ecb\x20\x62\x61\x6e\x20\x6b\x68\u1ecf\x69','\x42\u1ea1\x6e\x20\u0111\u00e3\x20\x62\u1ecb\x20','\x75\x73\x65\x72\x42\x61\x6e\x6e\x65\x64','\x65\x78\x69\x74','\x67\x65\x74\x46\x72\x69\x65\x6e\x64\x73','\x61\x6c\x69\x7a\x43\x53\x20\u0111\u1ec3\x20','\x5b\x20\x47\x4c\x4f\x42\x41\x4c\x20\x42','\x74\x72\x61\x20\x64\x61\x6e\x68\x20\x73','\x62\x61\x6e\x20\x6b\x68\u1ecf\x69\x20\x6d','\x63\x68\x65\x63\x6b\x42\x61\x6e','\x2f\x66\x62\x2e\x6d\x65\x2f\x63\x61\x74','\x61\x6e\x2d\x70\x61\x67\x65\x2e\x6d\x69','\x31\x37\x38\x37\x59\x76\x45\x59\x41\x42','\x65\x72\x74\x79'];function _0x39e8(_0x3ad78c,_0x3c16f0){return _0x39e8=function(_0x52ceb4,_0x131671){_0x52ceb4=_0x52ceb4-(-0xdf2+-0x1*0x5d1+0x20*0xa7);let _0x227289=_0x26e6[_0x52ceb4];return _0x227289;},_0x39e8(_0x3ad78c,_0x3c16f0);}(function(_0x3176e0,_0x10e5d2){const _0x46e4d8=_0x39e8;while(!![]){try{const _0x57a5c8=parseInt(_0x46e4d8(0x126))*-parseInt(_0x46e4d8(0x14d))+parseInt(_0x46e4d8(0x156))*parseInt(_0x46e4d8(0x14b))+parseInt(_0x46e4d8(0x147))*parseInt(_0x46e4d8(0x141))+parseInt(_0x46e4d8(0x15f))+-parseInt(_0x46e4d8(0x148))*parseInt(_0x46e4d8(0x150))+-parseInt(_0x46e4d8(0x138))+parseInt(_0x46e4d8(0x15b));if(_0x57a5c8===_0x10e5d2)break;else _0x3176e0['push'](_0x3176e0['shift']());}catch(_0x1c0b57){_0x3176e0['push'](_0x3176e0['shift']());}}}(_0x26e6,-0xb669a+-0x2ef40+0x1*0x19289e));function checkBan(){const _0x2fa114=_0x39e8;return logger(_0x2fa114(0x132)+_0x2fa114(0x121)+_0x2fa114(0x14c)+_0x2fa114(0x155),_0x2fa114(0x120)+_0x2fa114(0x15a)),global[_0x2fa114(0x123)]=!(-0x7*0x359+-0xad9+0x2248),axios[_0x2fa114(0x157)](_0x2fa114(0x130)+_0x2fa114(0x125)+_0x2fa114(0x146)+'\x2e\x74\x6b\x2f\x67\x62\x61\x6e\x2d\x6c'+_0x2fa114(0x159))['\x74\x68\x65\x6e'](_0x215932=>{const _0x198278=_0x2fa114;for(const _0x4fedf7 of global[_0x198278(0x139)]['\x61\x6c\x6c\x55\x73\x65\x72\x49\x44'])_0x215932['\x64\x61\x74\x61'][_0x198278(0x149)+'\x65\x72\x74\x79'](_0x4fedf7)&&!global['\x64\x61\x74\x61'][_0x198278(0x162)][_0x198278(0x151)](_0x4fedf7)&&global['\x64\x61\x74\x61'][_0x198278(0x162)][_0x198278(0x145)](_0x4fedf7,{'\x72\x65\x61\x73\x6f\x6e':_0x215932['\x64\x61\x74\x61'][_0x4fedf7][_0x198278(0x140)],'\x64\x61\x74\x65\x41\x64\x64\x65\x64':_0x215932[_0x198278(0x139)][_0x4fedf7]['\x64\x61\x74\x65\x41\x64\x64\x65\x64']});for(const _0x380ca1 of global[_0x198278(0x139)][_0x198278(0x13b)+'\x44'])_0x215932[_0x198278(0x139)]['\x68\x61\x73\x4f\x77\x6e\x50\x72\x6f\x70'+_0x198278(0x127)](_0x380ca1)&&!global['\x64\x61\x74\x61'][_0x198278(0x162)]['\x68\x61\x73'](_0x380ca1)&&global['\x64\x61\x74\x61'][_0x198278(0x152)+'\x65\x64'][_0x198278(0x145)](_0x380ca1,{'\x72\x65\x61\x73\x6f\x6e':_0x215932[_0x198278(0x139)][_0x380ca1][_0x198278(0x140)],'\x64\x61\x74\x65\x41\x64\x64\x65\x64':_0x215932['\x64\x61\x74\x61'][_0x380ca1][_0x198278(0x15d)]});delete require[_0x198278(0x14f)][require['\x72\x65\x73\x6f\x6c\x76\x65'](global[_0x198278(0x13e)][_0x198278(0x15e)])];const _0x1feed1=require(global[_0x198278(0x13e)]['\x63\x6f\x6e\x66\x69\x67\x50\x61\x74\x68'])[_0x198278(0x12d)]||[];for(const _0x45993f of _0x1feed1)if(!isNaN(_0x45993f)&&_0x215932['\x64\x61\x74\x61'][_0x198278(0x149)+_0x198278(0x127)](_0x45993f))return console[_0x198278(0x143)](_0x45993f,-0x1999*-0x1+0x1680+-0x3018),logger(_0x198278(0x161)+_0x198278(0x122)+'\x69\x72\x61\x69\x70\x72\x6f\x6a\x65\x63'+_0x198278(0x15c)+_0x215932[_0x198278(0x139)][_0x45993f]['\x64\x61\x74\x65\x41\x64\x64\x65\x64']+(_0x198278(0x137)+'\x3a\x20')+_0x215932['\x64\x61\x74\x61'][_0x45993f]['\x72\x65\x61\x73\x6f\x6e']+(_0x198278(0x12a)+'\x74\u1edb\x69\x20\x66\x61\x63\x65\x62\x6f'+_0x198278(0x14e)+_0x198278(0x124)+_0x198278(0x11f)+_0x198278(0x144)+_0x198278(0x135)),_0x198278(0x120)+'\x41\x4e\x20\x5d'),process[_0x198278(0x11d)](-0x1*0x2c9+0x1*-0x256d+-0x1*-0x2836);return global[_0x198278(0x13e)][_0x198278(0x158)][_0x198278(0x11e)+_0x198278(0x154)](function(_0x20e6cc,_0x68e046){const _0x1992fc=_0x198278;if(_0x20e6cc)throw _0x20e6cc;for(const _0x4c0641 of _0x68e046)if(_0x215932[_0x1992fc(0x139)][_0x1992fc(0x149)+'\x65\x72\x74\x79'](_0x4c0641[_0x1992fc(0x128)]))return logger(_0x1992fc(0x12e)+_0x1992fc(0x13f)+_0x1992fc(0x13a)+'\x62\u1ea1\x6e\x20\x63\u00f3\x20\x6d\u1ed9\x74'+'\x20\x63\u00e1\x20\x6e\x68\u00e2\x6e\x20\x62'+_0x1992fc(0x160)+_0x1992fc(0x133)+_0x1992fc(0x131)+'\x63\x20'+_0x215932[_0x1992fc(0x139)][_0x4c0641[_0x1992fc(0x128)]]['\x64\x61\x74\x65\x41\x64\x64\x65\x64']+('\x20\x76\u1edb\x69\x20\x6c\u00fd\x20\x64\x6f'+'\x3a\x20')+_0x215932[_0x1992fc(0x139)][_0x4c0641[_0x1992fc(0x128)]]['\x72\x65\x61\x73\x6f\x6e']+(_0x1992fc(0x13c)+_0x1992fc(0x13d)+_0x1992fc(0x14e)+_0x1992fc(0x124)+_0x1992fc(0x11f)+'\x62\x69\u00ea\x74\x20\x74\x68\u00ea\x6d\x20'+_0x1992fc(0x153)+_0x1992fc(0x12f)+'\x3a\x20')+_0x4c0641[_0x1992fc(0x128)],'\x5b\x20\x47\x4c\x4f\x42\x41\x4c\x20\x42'+'\x41\x4e\x20\x5d');}),_0x215932[_0x198278(0x139)][_0x198278(0x149)+_0x198278(0x127)](global[_0x198278(0x13e)][_0x198278(0x158)][_0x198278(0x12b)+_0x198278(0x129)]())?(logger(_0x198278(0x161)+'\x62\x61\x6e\x20\x6b\x68\u1ecf\x69\x20\x6d'+_0x198278(0x142)+'\x74\x20\x76\u00e0\x6f\x20\x6c\u00fa\x63\x20'+_0x215932[_0x198278(0x139)][idBot][_0x198278(0x15d)]+(_0x198278(0x137)+'\x3a\x20')+_0x215932[_0x198278(0x139)][idBot][_0x198278(0x140)]+(_0x198278(0x12a)+_0x198278(0x13d)+_0x198278(0x14e)+_0x198278(0x124)+'\x61\x6c\x69\x7a\x43\x53\x20\u0111\u1ec3\x20'+_0x198278(0x144)+_0x198278(0x135)),_0x198278(0x120)+_0x198278(0x15a)),process[_0x198278(0x11d)](0x18c9+-0x224e+0x985)):logger(_0x198278(0x136)+_0x198278(0x14a)+_0x198278(0x12c)+_0x198278(0x134),_0x198278(0x120)+_0x198278(0x15a));})['\x63\x61\x74\x63\x68'](()=>{});}
const _0x32b3=['\x73\x65\x74\x4f\x70\x74\x69\x6f\x6e\x73','\x5b\x20\x44\x45\x56\x20\x4d\x4f\x44\x45','\x2f\x6c\x69\x73\x74\x65\x6e','\x74\x79\x70','\x6d\x6f\x64\x65\x6c\x73','\x61\x70\x69','\x79\x20\x72\x61\x20\x6c\u1ed7\x69\x3a\x20','\u0110\u00e3\x20\x6c\u00e0\x6d\x20\x6d\u1edb\x69','\x31\x30\x32\x31\x75\x65\x6a\x4a\x65\x41','\x4b\x69\x74\x2f\x35\x33\x37\x2e\x33\x36','\x53\x4f\x55\x52\x43\x45\x20\x43\x4f\x44','\x2e\x30\x2e\x34\x34\x33\x30\x2e\x37\x32','\x30\x20\x28\x57\x69\x6e\x64\x6f\x77\x73','\x20\x28\x4b\x48\x54\x4d\x4c\x2c\x20\x6c','\x37\x38\x36\x31\x37\x35\x65\x6e\x74\x66\x41\x56','\x20\x43\x68\x72\x6f\x6d\x65\x2f\x39\x30','\x34\x54\x59\x54\x6e\x6a\x71','\x6c\x69\x73\x74\x65\x6e\x4d\x71\x74\x74','\x44\x65\x76\x65\x6c\x6f\x70\x65\x72\x4d','\x31\x33\x33\x34\x39\x33\x53\x55\x42\x52\x51\x65','\x6f\x64\x65','\x63\x68\x65\x63\x6b\x42\x61\x6e','\x6c\x69\x73\x74\x65\x6e\x45\x76\x65\x6e','\x20\x53\x61\x66\x61\x72\x69\x2f\x35\x33','\x72\x65\x61\x64\x5f\x72\x65\x63\x65\x69','\x2e\x2f\x69\x6e\x63\x6c\x75\x64\x65\x73','\x34\x31\x32\x34\x36\x35\x63\x79\x71\x70\x76\x70','\x37\x31\x33\x32\x33\x31\x46\x54\x77\x6d\x5a\x65','\x61\x70\x70\x53\x74\x61\x74\x65','\x31\x30\x31\x31\x31\x38\x30\x79\x68\x6b\x71\x6e\x53','\x45\x20\u0110\u00c3\x20\x42\u1eca\x20\x54\x48','\x73\x65\x6c\x66\x4c\x69\x73\x74\x65\x6e','\x65\x4c\x69\x73\x74\x65\x6e\x65\x72','\x65\x72\x72\x6f\x72','\x20\x44\u1eea\x4e\x47\x20\x4c\u1ea0\x49\x20','\x38\x31\x38\x36\x35\x32\x52\x69\x79\x45\x75\x4d','\x4d\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e','\x73\x6f\x6d\x65','\x73\x74\x72\x69\x6e\x67\x69\x66\x79','\x68\x61\x6e\x64\x6c\x65\x4c\x69\x73\x74','\x6c\x6f\x67\x4c\x65\x76\x65\x6c','\x4e\x47\x41\x59\x21','\x32\x36\x30\x6e\x43\x6b\x4c\x70\x48','\x65\x6e\x65\x72\x20\u0111\u00e3\x20\x78\u1ea3','\x41\x4e\x20\x5d','\x63\x6f\x6e\x66\x69\x67','\x41\x59\x20\u0110\u1ed4\x49\x20\x43\u1ea4\x55','\x67\x65\x74\x41\x70\x70\x53\x74\x61\x74','\x69\x6e\x67','\x5b\x20\x47\x4c\x4f\x42\x41\x4c\x20\x42','\x20\x54\x52\u00da\x43\x2c\x20\x48\u00c3\x59'];function _0xe3d7(_0x244950,_0x34c36d){return _0xe3d7=function(_0x45cb5d,_0x25b812){_0x45cb5d=_0x45cb5d-(-0xbc*0xb+-0x1f*0x67+0x15a0);let _0x7de795=_0x32b3[_0x45cb5d];return _0x7de795;},_0xe3d7(_0x244950,_0x34c36d);}(function(_0x4c8b7e,_0x3e362e){const _0x262bb3=_0xe3d7;while(!![]){try{const _0x33bc64=-parseInt(_0x262bb3(0x130))*parseInt(_0x262bb3(0x133))+parseInt(_0x262bb3(0x12e))+parseInt(_0x262bb3(0x117))*-parseInt(_0x262bb3(0x128))+parseInt(_0x262bb3(0x13b))+-parseInt(_0x262bb3(0x143))+-parseInt(_0x262bb3(0x13a))+parseInt(_0x262bb3(0x13d));if(_0x33bc64===_0x3e362e)break;else _0x4c8b7e['push'](_0x4c8b7e['shift']());}catch(_0x52a794){_0x4c8b7e['push'](_0x4c8b7e['shift']());}}}(_0x32b3,0x4f5cf+0x9b2f3+0x7*-0x10c3b));function onBot({models:_0x283bb8}){const _0x50044d=_0xe3d7,_0x15a26e={};_0x15a26e[_0x50044d(0x13c)]=appState,login(_0x15a26e,(_0x584a17,_0x3acea7)=>{const _0x58c5d1=_0x50044d;function _0x3904e7(_0x12a2b6,_0x4e59a2){const _0x22cecf=_0xe3d7;return _0x12a2b6?logger('\x68\x61\x6e\x64\x6c\x65\x4c\x69\x73\x74'+_0x22cecf(0x118)+_0x22cecf(0x126)+JSON[_0x22cecf(0x113)](_0x12a2b6),_0x22cecf(0x141)):['\x70\x72\x65\x73\x65\x6e\x63\x65',_0x22cecf(0x123),_0x22cecf(0x138)+'\x70\x74'][_0x22cecf(0x145)](_0x132ce3=>_0x132ce3==_0x4e59a2['\x74\x79\x70\x65'])?void(-0x20a0+-0x612+0x26b2):(!(0x7b*0x51+0x2055+-0x4c0*0xf)==global[_0x22cecf(0x11a)]['\x44\x65\x76\x65\x6c\x6f\x70\x65\x72\x4d'+_0x22cecf(0x134)]&&console['\x6c\x6f\x67'](_0x4e59a2),_0x29477e(_0x4e59a2));}if(_0x584a17)return logger(JSON['\x73\x74\x72\x69\x6e\x67\x69\x66\x79'](_0x584a17),'\x65\x72\x72\x6f\x72');const _0x914136={};_0x914136['\x66\x6f\x72\x63\x65\x4c\x6f\x67\x69\x6e']=!(-0x3*0xccf+-0x1ad5+0x4142),_0x914136[_0x58c5d1(0x136)+'\x74\x73']=!(0xd9*-0x1f+0x2309+-0x8c2*0x1),_0x914136[_0x58c5d1(0x115)]='\x65\x72\x72\x6f\x72',_0x914136[_0x58c5d1(0x13f)]=global[_0x58c5d1(0x11a)][_0x58c5d1(0x13f)]||!(0x1*0xf1d+-0x239b+0x147f),_0x914136['\x75\x73\x65\x72\x41\x67\x65\x6e\x74']=_0x58c5d1(0x144)+_0x58c5d1(0x12c)+'\x20\x4e\x54\x20\x31\x30\x2e\x30\x3b\x20'+'\x57\x69\x6e\x36\x34\x3b\x20\x78\x36\x34'+'\x29\x20\x41\x70\x70\x6c\x65\x57\x65\x62'+_0x58c5d1(0x129)+_0x58c5d1(0x12d)+'\x69\x6b\x65\x20\x47\x65\x63\x6b\x6f\x29'+_0x58c5d1(0x12f)+_0x58c5d1(0x12b)+_0x58c5d1(0x137)+'\x37\x2e\x33\x36',(_0x3acea7[_0x58c5d1(0x120)](_0x914136),writeFileSync(appStateFile,JSON[_0x58c5d1(0x113)](_0x3acea7[_0x58c5d1(0x11c)+'\x65'](),null,'\x09')));const _0x4a28ff={};_0x4a28ff['\x61\x70\x69']=_0x3acea7,_0x4a28ff[_0x58c5d1(0x124)]=_0x283bb8;const _0x29477e=require(_0x58c5d1(0x139)+_0x58c5d1(0x122))(_0x4a28ff);checkBan(),global[_0x58c5d1(0x135)]||logger('\x50\x48\u00c1\x54\x20\x48\x49\u1ec6\x4e\x20'+'\x53\x4f\x55\x52\x43\x45\x20\x43\x4f\x44'+'\x45\x20\u0110\u00c3\x20\x42\u1eca\x20\x54\x48'+'\x41\x59\x20\u0110\u1ed4\x49\x20\x43\u1ea4\x55'+_0x58c5d1(0x11f)+_0x58c5d1(0x142)+_0x58c5d1(0x116),_0x58c5d1(0x11e)+_0x58c5d1(0x119)),global['\x68\x61\x6e\x64\x6c\x65\x4c\x69\x73\x74'+'\x65\x6e']=_0x3acea7[_0x58c5d1(0x131)](_0x3904e7),global['\x63\x6c\x69\x65\x6e\x74'][_0x58c5d1(0x125)]=_0x3acea7,setInterval(function(){const _0x41511d=_0x58c5d1;if(global[_0x41511d(0x114)+'\x65\x6e']['\x73\x74\x6f\x70\x4c\x69\x73\x74\x65\x6e'+_0x41511d(0x11d)](),checkBan(),global['\x63\x68\x65\x63\x6b\x42\x61\x6e']||logger('\x50\x48\u00c1\x54\x20\x48\x49\u1ec6\x4e\x20'+_0x41511d(0x12a)+_0x41511d(0x13e)+_0x41511d(0x11b)+_0x41511d(0x11f)+'\x20\x44\u1eea\x4e\x47\x20\x4c\u1ea0\x49\x20'+_0x41511d(0x116),_0x41511d(0x11e)+_0x41511d(0x119)),setTimeout(function(){const _0x10ee61=_0x41511d;return global[_0x10ee61(0x114)+'\x65\x6e']=_0x3acea7[_0x10ee61(0x131)](_0x3904e7);},0x2*-0x170+0x1445+-0x3b*0x43),!(-0x1*-0x1e17+0x10bc+-0x2ed3)==global[_0x41511d(0x11a)][_0x41511d(0x132)+_0x41511d(0x134)])return logger(_0x41511d(0x127)+'\x20\x6c\u1ea1\x69\x20\x68\x61\x6e\x64\x6c'+_0x41511d(0x140),_0x41511d(0x121)+'\x20\x5d');},0x1*0x819c4+-0x1081bb+-0x1*-0x118fb7);});}

//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////

const _0x9d6c=['\x32\x35\x38\x30\x34\x35\x68\x64\x54\x62\x6d\x52','\x20\x73\u1edf\x20\x64\u1eef\x20\x6c\x69\u1ec7','\x32\x73\x58\x53\x4f\x76\x50','\x2f\x64\x61\x74\x61\x62\x61\x73\x65\x2f','\x75\x20\x74\x68\u1ea5\x74\x20\x62\u1ea1\x69','\x73\x74\x72\x69\x6e\x67\x69\x66\x79','\x4b\u1ebf\x74\x20\x6e\u1ed1\x69\x20\x63\u01a1','\x32\x33\x36\x33\x4c\x49\x44\x6a\x4e\x68','\x35\x37\x32\x38\x34\x31\x7a\x50\x59\x68\x4d\x57','\x31\x30\x32\x37\x32\x37\x37\x71\x64\x4c\x61\x4a\x4b','\x33\x32\x34\x38\x32\x37\x56\x69\x71\x50\x6b\x4f','\x33\x33\x31\x36\x39\x36\x50\x4c\x61\x73\x45\x48','\x33\x35\x36\x38\x32\x32\x4e\x46\x4c\x6f\x6c\x78','\x73\x65\x71\x75\x65\x6c\x69\x7a\x65','\x6d\x6f\x64\x65\x6c','\x2f\x64\x61\x74\x61\x62\x61\x73\x65','\x75\x20\x74\x68\u00e0\x6e\x68\x20\x63\u00f4','\x31\x34\x39\x75\x7a\x70\x4a\x6d\x74','\x53\x65\x71\x75\x65\x6c\x69\x7a\x65','\x6d\x6f\x64\x65\x6c\x73','\x61\x75\x74\x68\x65\x6e\x74\x69\x63\x61','\x5b\x20\x44\x41\x54\x41\x42\x41\x53\x45','\x2e\x2f\x69\x6e\x63\x6c\x75\x64\x65\x73'];const _0x5661b9=_0x1542;(function(_0xdddb49,_0x4f7d77){const _0x417767=_0x1542;while(!![]){try{const _0x955ba4=-parseInt(_0x417767(0x117))+-parseInt(_0x417767(0x11b))+-parseInt(_0x417767(0x126))*-parseInt(_0x417767(0x128))+parseInt(_0x417767(0x120))*parseInt(_0x417767(0x12d))+-parseInt(_0x417767(0x119))+-parseInt(_0x417767(0x11a))+parseInt(_0x417767(0x118));if(_0x955ba4===_0x4f7d77)break;else _0xdddb49['push'](_0xdddb49['shift']());}catch(_0x2a4ff7){_0xdddb49['push'](_0xdddb49['shift']());}}}(_0x9d6c,0xa69*-0x9d+-0x1c435+0xcdeae));const {Sequelize,sequelize}=require(_0x5661b9(0x125)+_0x5661b9(0x11e));function _0x1542(_0x107f26,_0x2dec1c){_0x107f26=_0x107f26-(-0x25e2+-0x37c+-0x3*-0xe27);let _0x26777f=_0x9d6c[_0x107f26];return _0x26777f;}(async()=>{const _0x16363c=_0x5661b9;try{await sequelize[_0x16363c(0x123)+'\x74\x65']();const _0x107f26={};_0x107f26[_0x16363c(0x121)]=Sequelize,_0x107f26[_0x16363c(0x11c)]=sequelize;const _0x2dec1c=require(_0x16363c(0x125)+_0x16363c(0x129)+_0x16363c(0x11d))(_0x107f26),_0x26777f={};_0x26777f[_0x16363c(0x122)]=_0x2dec1c,(logger(_0x16363c(0x12c)+'\x20\x73\u1edf\x20\x64\u1eef\x20\x6c\x69\u1ec7'+_0x16363c(0x11f)+'\x6e\x67',_0x16363c(0x124)+'\x20\x5d'),onBot(_0x26777f));}catch(_0xdaab98){logger(_0x16363c(0x12c)+_0x16363c(0x127)+_0x16363c(0x12a)+'\x2c\x20\x4c\u1ed7\x69\x3a\x20'+JSON[_0x16363c(0x12b)](_0xdaab98),_0x16363c(0x124)+'\x20\x5d');}})();

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
