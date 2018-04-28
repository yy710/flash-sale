//获取应用实例
const app = getApp()
var Timer = require('../../countdownTimer.js');
let wafer = app.globalData.wafer;

// timer.add("timer1", new Date(2018, 2, 21, 22, 31, 5, 0));
// timer.add("timer2", new Date(2018, 2, 21, 8, 10, 0, 0), new Date(2018, 2, 21, 2, 15, 0, 0));
// timer.add("timer3");

//let fmap = new Map();
//fmap.set(0, (that, amount) => that.setData({ "products[0].amount": amount }));
//fmap.set(1, (that, amount) => that.setData({ "products[1].amount": amount })); 
//fmap.set(2, (that, amount) => that.setData({ "products[2].amount": amount }));

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
      login: true,
      data: sendData,
      success: respont => {
        console.log("respont: ", respont);
        //that.setData({ products: respont.data.products });
      }
    });
  },

  onShow() {
    var timer = new Timer();
    let that = this;
    wafer.request({
      url: "https://www.xingshenxunjiechuxing.com/flashsale/init",
      success: res => {
        let _products = JSON.parse(res.data);
        console.log("pageOnShow/res.data: ", _products);
        // get products array
        let products = _products.map(item => {
          timer.add(item.name, item.status, item.expire.end, item.expire.start);
          delete item.expire;
          return item;
        });

        that.setData({ "products": products });
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
      wx.sendSocketMessage({ data: "onLoad..." });
    })
    wx.onSocketError(function (res) {
      console.log('WebSocketopen fail!');
    })
    wx.onSocketMessage(function (res) {
      console.log('webSocket recived from server：', res.data);

      const { index, amount } = JSON.parse(res.data);
      let products = that.data.products;
      products[index].amount = amount;
      that.setData({"products": products});
  
      //const a = `products[${index}].amount`;
      //eval(`that.setData({ products[${index}].amount: amount })`);
      //fmap.get(index)(that, amount);

      //let updates = JSON.parse(res.data);
      //console.log('webSocket recived from server：', updates);
      //mergeObject(updates, that.date.products);
      //that.setDate({products: updates});
    })
  }
})

function mergeObject(updates, defaults) {
  for (let key in defaults) {
    updates[key] = updates[key] || defaults[key];
  }
  //return update;
}