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
      createDateInNum: null,
      expirationDateInNum: null,
    },
    title: '未命名',
    defaultListData: [
      { script: '待办事项', content: "请输入", type: "input" },
      { script: '创建时间', content: "", type: "calendar" },
      { script: '截止日期', content: "", type: "calendar" },
      { script: '距离截止日', content: "提交后自动填写", type: "text" },
      { script: '是否已完成', content: "括号", type: "checkbox" },
      { script: '标签', content: "图片2", type: "icon" },
      { script: '优先级', content: "图片2", type: "icon" }
    ],

    // 提交存储数据的data
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

  handleCalendarClick(e) {
    console.log("handleCalendarClick");
    this.setData({
      'calendarData.visible': true,
      'calendarData.currentCalendar': e.currentTarget.dataset.source
    });
  },

  handleInputBlur(e) {
    const { value } = e.detail;
    this.data.formData.title = value;
    // 显示title
    if (value === '') {
      this.setData({ 'title': '未命名' })
    } else {
      this.setData({ 'title': value })
    }
  },

  handleCalendarConfirm(e) {
    const { value } = e.detail;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    if (this.data.calendarData.currentCalendar === '创建时间') {
      // this.data.calendarData.createDateInNum = value;
      this.data.calendarData.createdDate = format(value);
      this.updateCalendarData('创建时间', this.data.calendarData.createdDate);
    } else if (this.data.calendarData.currentCalendar === '截止日期') {
      this.data.calendarData.expirationDateInNum = value;
      this.data.calendarData.expirationDate = format(value);
      this.updateCalendarData('截止日期', this.data.calendarData.expirationDate);
    }

    // 计算截止日期
    if (!!this.data.calendarData.expirationDateInNum) {
      const currentDateInNum = new Date().getTime();
      const msInExpiration = this.data.calendarData.expirationDateInNum - currentDateInNum;
      const dayInExpiration = Math.ceil(msInExpiration / (1000 * 60 * 60 * 24));
      const target = this.data.defaultListData.find(item => item.script === '距离截止日');
      if (!!target) {
        target.content = dayInExpiration;
        this.setData({ 'defaultListData': this.data.defaultListData });
      }
    }
  },

  handleIsDone(e) {
    const { checked } = e.detail;
    console.log(checked);
    this.data.formData.isDone = checked;
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