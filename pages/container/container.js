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
    this.refreshData();
  },

  // 刷新页面加载
  onShow(options) {
    this.refreshData();
  },

  // 回调
  handleAddClick() {
    wx.navigateTo({
      url: '../add/add',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  // utils
  refreshData() {
    // 拉取数据
    let storedData = wx.getStorageSync('backlogDataList') || [];
    // 处理截止日期问题
    storedData.forEach(item => {
      if (item.expirationDate === "点击选择日期") {
        item.expirationDate = "";
      }
    });
    console.log(storedData);
    this.setData({ formDataList: storedData });
  }
})