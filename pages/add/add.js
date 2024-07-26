// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarData: {
      visible: false,
      createdDate: 'Todo: 获取当前日期',
      expirationDate: '点击选择日期',
      currentCalendar: '',
    },

    defaultListData: [
      { script: '待办事项', content: "请输入", type: "input" },
      { script: '创建时间', content: "", type: "calendar" },
      { script: '截止日期', content: "", type: "calendar" },
      { script: '距离截止日', content: "提交后自动填写", type: "text" },
      { script: '是否已完成', content: "括号", type: "checkbox" },
      { script: '标签', content: "图片2", type: "icon" },
      { script: '优先级', content: "图片2", type: "icon" }
    ],
  },

  onCalendarClick: function (event) {
    console.log("onCalendarClick");
    this.setData({
      'calendarData.visible': true,
      'calendarData.currentCalendar': event.currentTarget.dataset.source
    });
  },

  handleCalendarConfirm: function (event) {
    const { value } = event.detail;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    if (this.data.calendarData.currentCalendar == '创建时间') {
      this.setData({
        'calendarData.createdDate': format(value)
      })
      this.updateCalendarData('创建时间', this.data.calendarData.createdDate);
    } else if (this.data.calendarData.currentCalendar == '截止日期') {
      this.setData({
        'calendarData.expirationDate': format(value)
      });
      this.updateCalendarData('截止日期', this.data.calendarData.expirationDate);
    }
  },

  onCalendarClose: function ({ detail }) {
    console.log('onCalendarClose');
    this.setData({ 'calendarData.visible': false });
    console.log(detail.trigger);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化创建时间和截止日期
    this.updateCalendar();
  },

  updateCalendar: function () {
    this.updateCalendarData('创建时间', this.data.calendarData.createdDate);
    this.updateCalendarData('截止日期', this.data.calendarData.expirationDate);
  },

  updateCalendarData: function (script, newContent) {
    // 初始化创建时间和截止日期
    const scriptIndex = this.data.defaultListData.findIndex(item => item.script === script);
    if (scriptIndex) {
      this.setData({
        [`defaultListData[${scriptIndex}].content`]: newContent
      });
    }
  },
})