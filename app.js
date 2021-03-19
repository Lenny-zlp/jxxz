let livePlayer = requirePlugin('live-player-plugin')
import {
  baseRequest
} from '/pages/until/baseRequest.js';
var _baseRequest = new baseRequest();
App({
  data:{
    //wdurl:"http://192.168.0.9:9002"
    wdurl: "https://shop.jiangxinxiaozhen.com"
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function(options) {
    // console.log("apponLaunch",options)
    wx.hideTabBar().then(res=> {
      console.log(res)
    }).catch(err=> {
      console.log(err)
    })
    // wx.getSystemInfo({
    //   success: function (res) {
    //     wx.setStorage({
    //       key: 'getPhone',
    //       data: { topH: res.statusBarHeight, fontSize: res.fontSizeSetting }
    //     })
        
    //   }
    // }) 
   
  },
  
  // /**
  //  * 当小程序启动，或从后台进入前台显示，会触发 onShow
  //  * 小程序在后台运行onLaunch则不执行 此时获取卡片携带参数测试时取的页面及参数为离开前页面
  //  * 在此统一获取参数会出现问题  在单独分享页面也做了获取参数操作（邀请码功能）
  //  */
  onShow: function(options) {
    if (options.query.scene) {
      let rsShopId = options.query.scene
      // 从卡片获取数据
      if(rsShopId != 'undefined'||rsShopId != '') {
        wx.setStorage({
          key: "shopid",
          data: rsShopId
        })
      }
    }
  //   let shareTicket = options.shareTicket   
  //   //app.js 获取小程序名片页附带的分享信息
  //   //小程序在群里被打开后，获取情景值和shareTicket
  //   wx.getShareInfo({
  //     shareTicket:shareTicket,
  //     success: (res)=> {
  //       console.log("名片页附带的分享信息wx.getShareInfo::",res)
  //     }
  //   })
     // 分享卡片入口场景才调用getShareParams接口获取以下参数
     if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
      livePlayer.getShareParams()
          .then(res => {
            var rsShopId = res.custom_params.rsShopId
            if(rsShopId != 'undefined'||rsShopId != '') {
              wx.setStorage({
                key: "shopid",
                data: rsShopId
              })
            }
              // // 房间号
              // console.log('get room id', res.room_id) 
              // // 用户openid
              // console.log('get openid', res.openid) 
              // // 分享者openid，分享卡片进入场景才有
              // console.log('get share openid', res.share_openid) 
              // // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
              // console.log('get custom params', res.custom_params)
              // console.log("从直播间分享的参数rsShopId",res.custom_params.rsShopId)
          }).catch(err => {
              console.log('get share params', err)
          })
  }



    if (!wx.getStorageSync('shopid') && options.query.shopid){
      wx.setStorage({
        key: 'shopid',
        data: options.query.shopid,
      })
    }
   
    wx.setStorage({
      key: 'screenH',
      data: wx.getSystemInfoSync().windowHeight,
    })
    //用户没有登录、或者登录后没有邀请码，重新获取shopid并授权登录
    // var user = wx.getStorageSync('user');
    // if (user) {
    //   _baseRequest._setCartQty();
    //   if (user.rsShopId == 'undefined' || user.rsShopId == '') {
    //     var shopid = options.query.shopid;
    //     if (shopid) {
    //       wx.removeStorageSync('shopid');
    //       wx.setStorageSync('shopid', shopid)
    //     }
    //   }
    //   //_baseRequest._getWxUser(false);
    // }
    // else {
    //   var shopid = options.query.shopid;
    //   if (shopid) {
    //     wx.removeStorageSync('shopid');
    //     wx.setStorageSync('shopid', shopid)
    //   }
    //   _baseRequest._getWxUser(false, _baseRequest._getWxShouquan());
    // }
  },

  // /**
  //  * 当小程序从前台进入后台，会触发 onHide
  //  */
  onHide: function() {
    wx.removeStorage({
      key: 'report',
      success: function(res) {},
    })
  },

  // /**
  //  * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  //  */
  // onError: function (msg) {

  // },

 
  
})