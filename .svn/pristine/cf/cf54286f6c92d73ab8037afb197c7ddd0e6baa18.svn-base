// pages/order/goCommentList/goCommentList.js
import { request } from '../../until/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    pageIndex:1,// 第几页
    flag:true,
    ordercode:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {ordercode} = options
    this.setData({ordercode})
    this.getcommentList()
  },
  loadData() {
    this.setData({
      commentList: []
    })
    this.getcommentList()
  },
  getcommentList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/Product/GetReCommentForUser',data:{userId:userid,pageIndex:this.data.pageIndex,ordercode:this.data.ordercode}})
    .then(res=> {
      const { detailList } = res.data.data;
      if(detailList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        commentList: [...this.data.commentList,...detailList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
 /**去评论 */
 to_reviews: function(e) {
  const {commentitem} = e.currentTarget.dataset
  wx.navigateTo({
    url: '/pages/order/comment/comment?detail='+ JSON.stringify(commentitem)// 需要传点击时的单数据
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
    // this.getcommentList()
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
        commentList:[],
        pageIndex: 1,
        flag:true
      })
      this.getcommentList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.flag===false) {
      return 
    }
    let num = this.data.pageIndex;
    num++;
    this.setData({
      pageIndex: num
     })
    this.getcommentList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})