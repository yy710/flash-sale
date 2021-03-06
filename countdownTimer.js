class CountdownTimer {
  constructor() {
    // define arrary to store timer object
    this.timers = [];
    this._timers = [];//参与刷新
    // define map to sync weapp data
    this.data = {};
  }

  // add a timer
  add(name, endTime = new Date(), callback = () => { }) {
    this.timers.push({
      name: name,
      endtime: endTime,
      total_micro_second: 0,
      callback: callback
    });
  }

  stop(name = '') {
    this.timers.forEach(item => {
      if (item.name === name) {
        // delete 
remove(this.timers, );
      }
    })
  }

  start(that,timers,) {
    // 渲染倒计时时钟
    this.timers.forEach(item => {
      item.total_micro_second = item.endtime.getTime() - (new Date());
      this.data[item.name] = date_format(item.total_micro_second);
      // delete timer
      if (item.total_micro_second <= 0) {
        this.data[item.name] = "抢购已结束，请关注下一次";
        //delete this.data[item.name];
      }

      item.total_micro_second -= 10;
    });

    that.setData({ timers: this.data });

    // timeout则跳出递归
    if (this.data === {}) {
      return;
    }

    // 放在最后--尾递归
    setTimeout(() => this.start(that), 10)
  }
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  //计算剩余的天数
  var days = Math.floor(micro_second / (1000 * 60 * 60 * 24));
  // 秒数
  micro_second -= days * (1000 * 60 * 60 * 24);
  var second = Math.floor(micro_second / 1000);

  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return `剩${days}天${hr}小时${min}分${sec}.${micro_sec}秒`;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

// 删除数组元素
function remove(arr, item) {
  var result = [];
  arr.forEach(function (element) {
    if (element != item) {
      result.push(element);
    }
  });
  return result;
}  

module.exports = CountdownTimer;