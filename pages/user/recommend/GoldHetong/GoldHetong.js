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
    var thatapp = getApp();
    this.setData({
      url: thatapp.data.wdurl + '/VipBuy/ApipactDeal?Id=' + options.id
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var luser = _baseRequest._getUser();
    if (luser)
    return {
      title: '金卡会员 开通有礼',
      imageUrl: 'https://cache.jiangxinxiaozhen.com//VipBuy/VipSendImg1.jpg',
      path: '/pages/user/recommend/Goldcard/Goldcard?shopid=' + luser.rsShopId,
    }
  }
})