//获取应用实例
const app = getApp()
var Timer = require('../../countdownTimer.js');
var timer = new Timer();
let wafer = app.globalData.wafer;
// timer.add("timer1", new Date(2018, 2, 21, 22, 31, 5, 0));
// timer.add("timer2", new Date(2018, 2, 21, 8, 10, 0, 0), new Date(2018, 2, 21, 2, 15, 0, 0));
// timer.add("timer3");

Page({
  data: {
    products: [],
    timers: {},
    userInfo: {}
  },

  buy(e) {
    //console.log("buy", e.detail);
    let that = this;
    let sendData = {};
    sendData.formId = e.detail.formId;
    sendData.productId = e.detail.target.dataset.productId;
    console.log("send data: ", sendData);

    wafer.request({
      url: "https://www.xingshenxunjiechuxing.com/flashsale/buy",
      login: false,
      data: sendData,
      success: respont => {
        console.log("respont: ", respont);
        //that.setData({ products: respont.data.products });
      }
    });
  },

  onShow() {
    let that = this;
    wafer.request({
      url: "https://www.xingshenxunjiechuxing.com/flashsale/init",
      success: res => {
        let _products = JSON.parse(res.data);
        console.log("pageOnShow: ", _products);
        // get products array
        let products = _products.map(item => {
          timer.add(item.name, item.status, item.expire.end, item.expire.start);
          //delete item.expire;
          return item;
        });

        that.setData({ products: products });
        console.log("timer: ", timer);
        timer.run(that);
      }
    });

  },

  onLoad: function () {
    let that = this;
    // websocket
    wx.connectSocket({
      url: 'wss://www.xingshenxunjiechuxing.com',
      success: console.log
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket opened！')
      wx.sendSocketMessage({ data: "hehe" });
    })
    wx.onSocketError(function (res) {
      console.log('WebSocketopen fail!');
    })
    wx.onSocketMessage(function (res) {
      let products = JSON.parse(res.data);
      console.log('webSocket recived from server：', products);
      that.setData({ products: products });
    })
  }
})
