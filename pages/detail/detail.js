// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 渲染页面的数据
    title: '未命名',
    defaultListData: [
      { script: '待办事项', content: "请输入", type: "input" },
      { script: '创建时间', content: "", type: "calendar" },
      { script: '截止日期', content: "", type: "calendar" },
      { script: '距离截止日', content: "提交后自动填写", type: "text" },
      { script: '是否已完成', content: "false", type: "checkbox" },
      { script: '标签', content: "图片2", type: "icon" },
      { script: '优先级', content: "图片2", type: "icon" }
    ],

    // 日历数据
    calendarData: {
      visible: false,
      createdDate: '',
      expirationDate: '点击选择日期',
      currentCalendar: '',
      createDateInNum: null,
      expirationDateInNum: null,
    },

    // 提交存储数据的data
    formData: {
      id: '',
      title: '',
      createdDate: '',
      expirationDate: '',
      isDone: false,
      tag: '',
      priority: '',
    },

    // 当前页面的pageIndex
    pageIndex: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从 URL 参数中获取 pageIndex
    this.data.pageIndex = options.pageIndex;

    // 从 URL 参数中获取并反序列化 cellData
    const cellDataStr = decodeURIComponent(options.cellData);
    const cellData = JSON.parse(cellDataStr);

    console.log('获取到的 cellData:', cellData);

    // 更新页面数据
    const defaultListData = this.data.defaultListData || [];
    const updatedListData = defaultListData.map(item => {
      switch (item.script) {
        case '待办事项':
          item.content = cellData.title;
          break;
        case '创建时间':
          item.content = cellData.createdDate === "" ? "点击选择日期" : cellData.createdDate;
          break;
        case '截止日期':
          item.content = cellData.expirationDate === "" ? "点击选择日期" : cellData.createdDate;
          break;
        case '距离截止日':
          let dayInExpiration = "";
          if (cellData.expirationDate != "") {
            const currentDateInNum = new Date().getTime();
            const expirationDateInNum = Date.parse(cellData.expirationDate);
            const msInExpiration = expirationDateInNum - currentDateInNum;
            dayInExpiration = Math.ceil(msInExpiration / (1000 * 60 * 60 * 24));
          }
          item.content = dayInExpiration;
          break;
        case '是否已完成':
          item.content = cellData.isDone;
          break;
        case '标签':
          item.content = cellData.tag;
          break;
        case '优先级':
          item.content = cellData.priority;
          break;
      }
      return item;
    });

    this.setData({
      formData: cellData,
      defaultListData: updatedListData,
      title: cellData.title
    });

    console.log("渲染页面的数据", updatedListData);
  },

  // 回调
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
      // 将当前表单数据添加到存储数据中
      this.data.formData.createdDate = this.data.calendarData.createdDate === "点击选择日期" ? "" : this.data.calendarData.createdDate;
      this.data.formData.expirationDate = this.data.calendarData.expirationDate === "点击选择日期" ? "" : this.data.calendarData.expirationDate;

      console.log("提交formData数据", this.data.formData);
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateCellData', {
        ...this.data.formData,
      });

      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500, // 设置显示时间
        success: () => {
          // 延迟一段时间后返回上一页
          setTimeout(function () {
            wx.navigateBack();
          }, 1500); // 延迟时间与 wx.showToast 的 duration 保持一致
        }
      });
    } catch (e) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // utils
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
  },
})