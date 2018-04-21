//获取应用实例
const app = getApp()
var Timer = require('../../countdownTimer.js');
var timer = new Timer();
// timer.add("timer1", new Date(2018, 2, 21, 22, 31, 5, 0));
// timer.add("timer2", new Date(2018, 2, 21, 8, 10, 0, 0), new Date(2018, 2, 21, 2, 15, 0, 0));
// timer.add("timer3");

Page({
  data: {
    products: [],
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
    // websocket
    wx.connectSocket({
      url: 'wss://www.xingshenxunjiechuxing.com',
      success: console.log
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      wx.sendSocketMessage({data: "hehe"});
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！');
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
    })

    // get products array
    let _progucts = [
      {
        name: "比亚迪 宋MAX",
        price: 10.99,
        model: "2017款 1.5T 7座MPV",
        image: "../../images/song-max-01.jpg",
        amount: 5,
        status: { id: 1, msg: "即将开始..." },
        timer: { start: new Date(2018, 3, 19, 22, 31, 5, 0), end: new Date }
      },
      {
        name: "比亚迪 唐100",
        price: 28.5,
        model: "2017款 2.0T 5座SUV",
        image: "../../images/tang-01.jpg",
        amount: 1,
        status: { id: 2, msg: "正在抢购中..." },
        timer: { start: new Date(), end: new Date }
      },
      {
        name: "比亚迪 F0",
        price: 3.99,
        model: "2018款 1.0 A0级",
        image: "../../images/song-max-01.jpg",
        amount: 3,
        status: { id: 4, msg: "已抢完..." },
        timer: { start: new Date(), end: new Date(2018, 3, 19, 22, 31, 5, 0) }
      }
    ];

    //create products data
    let products = _progucts.map(item => {
      timer.add(item.name, item.timer.end, item.timer.start);
      delete item.timer;
      return item;
    });

    this.setData({ products: products });
    console.log("timer: ", timer);
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
