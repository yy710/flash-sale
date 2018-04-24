class Timer {
  constructor(name = 'no name', status = {}, endTime = (new Date()).getTime, startTime = (new Date()).getTime) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.ms = 0;
  }

  end() {
    this.setStatus({ id: "end", msg: "抢购已结束..." });
    return this;
  }

  stop() {
    this.setStatus({ id: "stop", msg: "抢购已停止..." });
    return this;
  }

  start() {
    this.setStatus({ id: "start", msg: "距抢购结束" });
    return this;
  }

  wait() {
    this.setStatus({ id: "wait", msg: "距抢购开始" });
    return this;
  }

  setStatus(status) {
    this.status = status;
    return this;
  }

  getStatus() {
    let currenTime = (new Date()).getTime();
    let t1 = this.startTime - currenTime;
    let t2 = this.endTime - currenTime;

    if (t1 > 0) {
      this.ms = t1;
      this.wait();
    }
    else if (t2 > 0) {
      this.ms = t2;
      this.start();
    } else {
      this.end();
    }
    return this.status;
  }
}
//------------------------------------------------------------------------------------------


class CountdownTimer {
  constructor() {
    // define arrary to store timer object
    this.timers = [];
    // define object to sync weapp data
    this.data = {};
    //this.handlesMap = new Map();
  }

  // add a timer
  add(name = 'no name', status = {}, endTime = (new Date()).getTime, startTime = (new Date()).getTime) {
    let timer = new Timer(name, status, endTime, startTime);
    this.timers.push(timer);
    //this.start(name);
    return this;
  }

  addHandle(status, handle) {
    let handles = this.handlesMap.get(status) || [];
    handles.push(handle);
    this.handlesMap.set(status, handles);
    return this;
  }

  // 渲染倒计时时钟
  run(that) {
    // flag for empty timers arrary
    let i = 0;
    // define activing timers
    let _timers = [];

    this.timers.forEach(item => {
      let status = item.getStatus();

      if (status.id === "stop" || status.id === "end") {
        let ct = {};
        ct.time = date_format(0);
        ct.status = status;
        this.data[item.name] = ct;
        return;
      }

      // wait
      if (status.id === 'wait' || status.id === 'start') {
        let ct = {};
        ct.time = date_format(item.ms);
        ct.status = status;
        this.data[item.name] = ct;
        i = 1;
        _timers.push(item);
        return;
      }
    });

    this.timers = _timers;
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