// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarData: {
      visible: false,
      createdDate: '',
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

    formData: {
      id: '',
      title: '',
      createdDate: '',
      expirationDate: '',
      isDone: false,
      tag: '',
      priority: '',
    }
  },

  onCalendarClick(e) {
    console.log("onCalendarClick");
    this.setData({
      'calendarData.visible': true,
      'calendarData.currentCalendar': e.currentTarget.dataset.source
    });
  },

  handleInputBlur(e) {
    const { value } = e.detail;
    this.setData({
      'formData.title': value
    });
  },

  handleCalendarConfirm(e) {
    const { value } = e.detail;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    if (this.data.calendarData.currentCalendar === '创建时间') {
      this.setData({
        'calendarData.createdDate': format(value),
      })
      this.updateCalendarData('创建时间', this.data.calendarData.createdDate);
    } else if (this.data.calendarData.currentCalendar === '截止日期') {
      this.setData({
        'calendarData.expirationDate': format(value)
      });
      this.updateCalendarData('截止日期', this.data.calendarData.expirationDate);
    }
  },

  handleIsDone(e) {
    const { checked } = e.detail;
    console.log(checked);
    this.setData({
      'formData.isDone': checked
    })
  },

  onCalendarClose({ detail }) {
    console.log('onCalendarClose');
    this.setData({ 'calendarData.visible': false });
    console.log(detail.trigger);
  },

  // 点击提交
  handleSubmit() {
    try {
      //debugger;
      let storedData = wx.getStorageSync('backlogDataList') || [];
      console.log(storedData);
      // 将当前表单数据添加到存储数据中
      this.data.formData.createdDate = this.data.calendarData.createdDate;
      this.data.formData.expirationDate = this.data.calendarData.expirationDate;
      console.log(this.data.formData);
      storedData.push(this.data.formData);
      // 保存数据到本地存储
      wx.setStorageSync('backlogDataList', storedData);
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (e) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化创建时间和截止日期
    this.updateCalendar();
  },

  // utils
  updateCalendar() {
    this.updateCalendarData('创建时间', this.getCurrentDate());
    this.updateCalendarData('截止日期', this.data.calendarData.expirationDate);
  },

  updateCalendarData(script, newContent) {
    // 初始化创建时间和截止日期
    const scriptIndex = this.data.defaultListData.findIndex(item => item.script === script);
    if (scriptIndex) {
      this.setData({
        [`defaultListData[${scriptIndex}].content`]: newContent
      });
    }
  },

  getCurrentDate() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
});