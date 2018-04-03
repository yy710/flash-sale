//获取应用实例
const app = getApp()
var Timer = require('../../countdownTimer.js');
var timer = new Timer();
timer.add("timer1", new Date(2018, 2, 21, 22, 31, 5, 0));
timer.add("timer2", new Date(2018, 2, 21, 8, 10, 0, 0), new Date(2018, 2, 21, 2, 15,0,0));
timer.add("timer3");
console.log("timer: ", timer);

Page({
  data: {
    products: [
      {
        name: "比亚迪 宋MAX",
        price: 10.99,
        model: "2017款 1.5T 7座MPV",
        amount: 5,
        status: "即将开始抢购",
        countDown: ""
      }
    ],
    timers: {},
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    timer.start("timer1");
    timer.start("timer2");
    timer.start("timer3");
    timer.stop("timer3");
    timer.run(this);

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
