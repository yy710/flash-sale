class CountdownTimer {
  constructor() {
    // define arrary to store timer object
    this.timers = [];
    //this.timersIsRunning = [];//参与刷新列表
    // define object to sync weapp data
    this.data = {};
    this.handles = new Map();
  }

  // add a timer
  add(name, endTime = new Date(), startTime = new Date(), callback = () => { }) {
    this.timers.push({
      name: name,
      startTime: startTime,
      endtime: endTime,
      total_micro_second: 0,
      callback: callback
    });
    this.start(name);
    return this;
  }

  end(name) {
    this.setStatus(name, { id: "end", msg: "抢购已结束" });
    return this;
  }

  stop(name) {
    this.setStatus(name, { id: "stop", msg: "抢购停止" });
    return this;
  }

  start(name) {
    this.setStatus(name, { id: "start", msg: "抢购进行中" });
    return this;
  }

  wait(name) {
    this.setStatus(name, { id: "wait", msg: "抢购即将开始" });
    return this;
  }

  setStatus(name, status) {
    this.timers = this.timers.map(item => {
      item.name === name && (item.status = status);
      return item;
    });
    return this;
  }

  addHandle(status, handle) {
    this.handles.set(status, handle);
    return this;
  }

  run(that) {
    // 渲染倒计时时钟
    let i = 0;
    this.timers = this.timers.map(item => {
      if (item.status === "stop") return item;
      if (item.status === "end") return item;

      if (item.startTime > (new Date())) {
        this.wait(item.name);
        this.data[item.name] = date_format(item.startTime - (new Date()));
        i = 1;
        return item;
      }

      item.total_micro_second = item.endtime.getTime() - (new Date());

      if (item.total_micro_second <= 0) {
        this.data[item.name] = date_format(0);
        this.end(item.name);
        return item;
      }

      this.data[item.name] = date_format(item.total_micro_second);
      i = 1;
      return item;
    });

    that.setData({ timers: this.data });

    // 跳出递归
    if (i === 0) return this;

    // 放在最后--尾递归
    setTimeout(() => this.run(that), 1000)
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
  //var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  //return `剩${days}天${hr}小时${min}分${sec}.${micro_sec}秒`;
  return `剩${days}天${hr}小时${min}分${sec}秒`;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

// 删除数组元素
function remove(arr, item) {
  var result = [];
  arr.forEach(function (element) {
    if (element.name != item) {
      result.push(element);
    }
  });
  return result;
}

module.exports = CountdownTimer;