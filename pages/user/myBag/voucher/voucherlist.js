// import {
//   baseRequest
// } from "../../../until/baseRequest.js";
// var base = new baseRequest;
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     pageindex: 1,
//     type: 1,
//     datalist:[]
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {
//     wx.showNavigationBarLoading()
//     this.base(this.data.pageindex)
//   },
//   base: function(page) {
//     var id = {
//       url: "/User/VoucherList",
//       type: 'POST',
//       data: {
//         pageindex: page,
//         source: 0,
//         type: this.data.type,
//         userid: base._getUser().userid,
//       }

//     }
//     base._request(id, this.callback)
//   },
//   callback: function(res) {
   
//     wx.hideNavigationBarLoading()
//     this.setData({
//       data: res.data,
//       normal:res.data.Normal,
//       Expire: res.data.Expire,
//       datalist:this.data.datalist.concat(res.data.dataList)
//     })
//   },
//   onClickTab: function(e) {
//     this.setData({
//       type: e.target.dataset.type,
//       data:[],
//       pageindex:1,
//       datalist:[]
//     })
//     wx.showNavigationBarLoading()
//     this.base(this.data.pageindex)
//   },
//   onReachBottom: function () {  
//     wx.showNavigationBarLoading()
//     this.setData({ pageindex: this.data.pageindex + 1 }) 
//     this.base(this.data.pageindex);
//     if(this.data.data.rows==this.data.datalist.length){
//       wx.showToast({
//         title: '暂无更多信息',
//         icon:'none'
//       })
//     }
//   }
// })

// 重构
import { request } from '../../../until/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    tabs: [
      {
        id: 0,
        value: "未使用",
        isActive: true,
        number:0
      },
      {
        id: 1,
        value: "已用完",
        isActive: false,
        number:0
      },
      {
        id: 2,
        value: "已过期",
        isActive: false,
        number:0
      }
    ],
    notUserList:[],//未使用数组
    completedList:[],//已使用数组
    expiredList:[],//已使用数组
    dataList:[],// 小镇币消费数组
    pageIndex:1,// 第几页
    flag:false,
    cardId:""//卡片ID
  },
  onClose() {
    this.setData({ close: false });
  },
// 标题点击事件
handleItemTap(e) {
  const {index} = e.currentTarget.dataset;
  let {tabs} = this.data;
  tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
  this.setData({
    tabs
  })
},

// 消费记录点击事件
handleMenuTap(e) {
  let cardId = e.currentTarget.dataset.cardid
  this.setData({
    show:true,
    cardId
  })
  this.getConsumption()
},

// 获取消费记录 Consumption
getConsumption() {
  const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherUsedLog',data:{userId:userid,cardId:this.data.cardId}})
    .then(res=> {
      const { dataList } = res.data.data;
      this.setData({
        dataList
      })
    })
},

// 获取未使用数据
  getnotUserList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherList',data:{userId:userid,type:1}})
    .then(res=> {
      const { dataList } = res.data.data;
      let {tabs} = this.data;
      tabs[0].number = dataList.length
      this.setData({
        tabs,
        dataList
      })
      if(dataList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        notUserList: [...this.data.notUserList,...dataList],
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  // 获取已使用数据
  getcompletedList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherList',data:{userId:userid,type:2}})
    .then(res=> {
      const { dataList } = res.data.data;
      let {tabs} = this.data;
      tabs[1].number = dataList.length
      this.setData({
        tabs
      })
      if(dataList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        completedList: [...this.data.completedList, ...dataList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  // 获取已过期数据
  getexpiredList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherList',data:{userId:userid,type:3}})
    .then(res=> {
      const { dataList } = res.data.data;
      let {tabs} = this.data;
      tabs[2].number = dataList.length
      this.setData({
        tabs
      })
      if(dataList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        expiredList: [...this.data.expiredList, ...dataList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getnotUserList()
    this.getcompletedList()
    this.getexpiredList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    // this.getConsumption()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})