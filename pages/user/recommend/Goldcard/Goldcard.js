import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/recommend/Goldcard/Goldcard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.opencard(options.isshare)
  },
 onShow:function(){
   var user = wx.getStorageSync('user')
  //  if (!user) {
  //    wx.hideShareMenu()
  //  }
 },
   opencard(share) {
    var _user = _baseRequest._getUser();
    if(_user) {
      var para = {
        url: '/Shop/ShopVipBuy/',
        type: 'POST',
        data: {
          shopcode: _user.shopcode,
          level: '3',
          v: 'v0',
          mobile: _user.mobile
        }
      } 
      _baseRequest._request(para, (res)=> {
        // BuyUrl 立即开通
        // ShareUrl 推荐
        // var thatapp = getApp();
        this.setData({
          url: share == 1 ? res.data.ShareUrl + '&isxcx=1': res.data.BuyUrl + '&isxcx=1'
          // url: thatapp.data.wdurl +'/VipBuy/index?isapp=1&v=v0&isxcx=1&isshare='+share
        })
      })
    } else {
      // wx.hideShareMenu()
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (res) {
  //   var luser = _baseRequest._getUser();
  //   if (luser)
  //   return {
  //     title: '金卡会员 开通有礼',
  //     imageUrl: 'https://cache.jiangxinxiaozhen.com//VipBuy/VipSendImg1.jpg',
  //     path: '/pages/user/recommend/Goldcard/Goldcard?shopid=' + luser.rsShopId,
  //   }
  // }
})