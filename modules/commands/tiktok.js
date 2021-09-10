module.exports.config = {
  name: "tiktok",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "",
  description: "tiktok info",
  commandCategory: "general",
  usages: "tiktok [username]",
  cooldowns: 0,
  dependencies: {
      "tiktok-scraper": "",
      "fs-extra":"",
      "request":"",
      "axios":""
    
  }
};

module.exports.run = async ({ event, api, args }) => {
  var request = global.nodemodule["request"]
  var axios = global.nodemodule["axios"]
  var fs = global.nodemodule["fs-extra"]
 var { threadID,messageID } = event;
 try{
  if(args[0] == "-i"){
  const TikTokScraper = global.nodemodule["tiktok-scraper"];
  const fs = global.nodemodule["fs-extra"]
  const options = {
      number: 50,
      sessionList: ['sid_tt=21312213'],
      proxy: '',
      by_user_id: false,
      asyncDownload: 5,
      asyncScraping: 3,
      filepath: `CURRENT_DIR`,
      fileName: `CURRENT_DIR`,
      filetype: `na`,
      headers: {
          'user-agent': "BLAH",
          referer: 'https://www.tiktok.com/',
          cookie: `tt_webid_v2=68dssds`,
      },
      noWaterMark: false,
      hdVideo: false,
      verifyFp: '',
      useTestEndpoints: false
  }
  let data = await TikTokScraper.getUserProfileInfo(args[1],options);
let linkk;
(data.user.bioLink == undefined) ? linkk = " " : linkk = data.user.bioLink.link
  console.log(linkk)
  let link = data.user.avatarLarger
  let id = data.user.id
  let uniqueId = data.user.uniqueId
  let nickname = data.user.nickname
  let signature = data.user.signature
  let followerCount = data.stats.followerCount
  let followingCount = data.stats.followingCount
  let heart = data.stats.heart
  let videoCount = data.stats.videoCount
  let path = __dirname + "/cache/avt.png";
  request.get(link).pipe(fs.createWriteStream(path).on("close", () => api.sendMessage({body: `===「${uniqueId}」===` +
  `\n» ID: ${id}.` +
  `\n» Nickname: ${nickname}.` +
  `\n» Bio: ${signature}.` +
  `\n» Website: ${linkk}.` +
  `\n» Người Theo Dõi: ${followerCount}.` +
  `\n» Đang Theo Dõi: ${followingCount}.` +
  `\n» Tim: ${heart}.` +
  `\n» Video: ${videoCount}.`,attachment: fs.createReadStream(path)}, threadID, () => fs.unlinkSync(path), messageID)));
}
else if(args[0] == "-v"){
  if(!args[1]) api.sendMessage("Bạn Chưa Nhập Link",threadID,messageID)
 const path = __dirname + "/cache/tiktok.mp4";
 var {data} = await axios.get(`https://godownloader.com/api/tiktok-no-watermark-free?url=${args[1]}&key=godownloader.com`);
  var hmm = data.video_no_watermark
var {data: stream} = await axios.get(hmm, {responseType: 'arraybuffer'});
  fs.writeFileSync(path, Buffer.from(stream, 'utf-8'));
  return api.sendMessage({attachment:fs.createReadStream(path)},event.threadID, () => fs.unlinkSync(path))
}
else if(args[0] == "-mp3"){ 
  if(!args[1]) api.sendMessage("Bạn Chưa Nhập Link",threadID,messageID)
  const path = __dirname + "/cache/tikmp3.mp3";
   var {data} = await axios.get(`https://godownloader.com/api/tiktok-no-watermark-free?url=${args[1]}&key=godownloader.com`);
   var hmm = data.music_url
 var {data: stream} = await axios.get(hmm, {responseType: 'arraybuffer'});
   fs.writeFileSync(path, Buffer.from(stream, 'utf-8'));
   return api.sendMessage({attachment:fs.createReadStream(path)},event.threadID, () => fs.unlinkSync(path))

}}
catch (err) {
  return api.sendMessage("Đã Có Lỗi Xảy Ra")
}}

