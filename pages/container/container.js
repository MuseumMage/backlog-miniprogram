// pages/container/container.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formDataList: [],
    addButton: {
      size: 'large',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.pullDataList();
  },

  // 刷新页面加载
  onShow(options) {
    this.pullDataList();
  },

  // 回调
  handleAddClick() {
    // wx.navigateTo({
    //   url: '../add/add',
    // })
    
    // test
    this.pushItemData({
        id: '',
        title: '',
        createdDate: '',
        expirationDate: '',
        isDone: false,
        tag: '',
        priority: '',
      }
    );
  },

  handleEdit(event) {
    const index = event.currentTarget.dataset.index; // 获取点击的索引
    const cellData = this.data.formDataList[index]; // 获取对应的单元格数据
    const cellDataStr = encodeURIComponent(JSON.stringify(cellData)); // 将对象转为字符串
    // 跳转到 detail 页面并传递数据
    wx.navigateTo({
      url: `/pages/detail/detail?cellData=${cellDataStr}`
    });
  },

  // 阻止事件冒泡
  handleCheckbox() {
    console.log("checkbox stop propogation");
  },

  // Checkbox事件
  handleIsDone(e) {
    const { checked } = e.detail;
    console.log(e);
    const index = e.currentTarget.dataset.index; // 获取点击的索引
    this.setData({
      [`formDataList[${index}].isDone`]: checked
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.pullDataList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  // data method
  pullDataList() {
    // 拉取数据
    let storedData = wx.getStorageSync('backlogDataList') || [];
    console.log(storedData);
    this.setData({ formDataList: storedData });
  },

  pushItemData (item) {
    this.data.formDataList.push(item);
    wx.setStorageSync('backlogDataList', this.data.formDataList);
    console.log(this.data.formDataList);
  },

  getItem(dataIndex) {  
    return this.data.formDataList[index];
  }
})