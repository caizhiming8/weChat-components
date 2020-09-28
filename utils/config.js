let Host = 'http://localhost:58252';

const apiConfig = {
  Host: Host,
  // 消息提示接口
  goShowToast: function (title = '暂无提示', icon = 'none', time = 2000, mask = true) {
    wx.showToast({
      title: title ? title : '暂无提示',
      icon: icon ? icon : 'none',
      duration: time ? time : 2000,
      mask: mask
    })
  },
  // 隐藏提示接口
  goHideToast: function () {
    wx.hideToast()
  }
}

module.exports = apiConfig;