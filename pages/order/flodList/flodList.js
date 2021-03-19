// pages/order/flodList/flodList.js
import { request } from '../../until/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flodList:[],
    productcode:"",
    page:1,
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {sku} = options
    this.setData({productcode:sku})
    this.getFlodList()
  },
  // 获取列表数据
  getFlodList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/Product/CommentAutoList',data:{userId:userid,page:this.data.page,sku:this.data.productcode}})
    .then(res=> {
      let {commentlist} = res.data.data
      if(commentlist.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      commentlist.map((v) =>{
        if(v.Receiver.length>2) {
          v.Receiver = v.Receiver.substring(0,1)+'**'+ v.Receiver.substring(v.Receiver.length-1)
        }
        if(v.Receiver.length==2) {
          v.Receiver = v.Receiver.substring(0,1)+'\xa0\xa0\xa0'+ v.Receiver.substring(v.Receiver.length-1)
        }
      })
      this.setData({
        flodList:[...this.data.flodList,...commentlist]
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.setData({
      flodList:[],
      page: 1,
      flag:true
    })
    this.getFlodList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.flag===false) {
      return 
    }
    let num = this.data.page;
    num++;
    this.setData({
      page: num
     })
    this.getFlodList();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})