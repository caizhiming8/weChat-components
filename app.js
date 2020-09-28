//app.js
var webapi = require('utils/config.js');
App({
  globalData: {
    'isIpx': false,
    'webapi': webapi
  },
  onLaunch: function () {
    let _this = this;
    // 获取手机型号
    wx.getSystemInfo({
      success(res) {
        let modelmes = res.model;
        if (modelmes.indexOf('iPhone X') != -1 || modelmes.indexOf('iPhone XS') != -1 || modelmes.indexOf('iPhone XS Max') != -1 || modelmes.indexOf('iPhone XR') != -1 || modelmes.indexOf('iPhone 11') != -1 || modelmes.indexOf('iPhone 11 Pro') != -1 || modelmes.indexOf('iPhone 11 Pro Max') != -1) {
          _this.globalData.isIpx = true;
        }
      }
    })
  }
})