
var md5 = require('md5.js');
var signJs = require('sign.js');
var baseurl = 'https://api.jiangxinxiaozhen.com';
// var baseurl = 'http://192.168.0.7:8080/';
// var baseurl = 'http://192.168.0.7:8082/';
class baseRequest {
  /**处理参数并发起请求 */
  request(parms) {
    var that = this
    //给参数加上sign验签
    var dataJson = signJs.getSign(parms)
    //默认get请求
    if (!parms.type) {
      parms.type = 'GET'
    }
    //发起请求
    wx.request({
      url: baseurl + parms.url,
      method: parms.type,
      data: dataJson,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        // console.log("手机绑定",res)
        if (res.statusCode == 200) { //返回数据成功
          if (parms.sCallBack) {
            parms.sCallBack(res)
          }
        } else { //返回数据失败
          wx.showToast({
            title: '服务器内部错误！',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: function(err) { //发起请求失败
        if (parms.fCallBack) {
          parms.fCallBack()
        }
      }
    })
  }

  /**发起请求-给页面js调用  demo见pages/demo/demolist/demo*/
  _request(para, callBack) {
    var parms = {
      url: para.url,
      type: para.type,
      data: para.data,
      sCallBack: function(res) {
        // console.log("54的res.data",res.data)
        callBack && callBack(res.data)//走完后到91行打印哪里
      },
      fCallBack: function() {
        para._fcallback && para._fcallback()
      },
    }
    // console.log("parms",parms)
    this.request(parms)
  }

  /**获取用户缓存 */
  _getUser() {
    var user = wx.getStorageSync('user');
    // console.log("获取缓存user2",user)
    if (user) { //获取到用户缓存就返回
      // console.log("获取到缓存user2",user)
      if (user.mobile == 'undefined' || user.mobile == '') {
        wx.navigateTo({
          url: '/pages/user/login/bindingTel/bindingTel?userid=' + user.userid,
        })
        return false;
      } else if (user.rsShopId == 'undefined' || user.rsShopId == '') {
        var shopid = wx.getStorageSync('shopid')
        // 如果本地无邀请码 则默认绑定005
        // if(!shopid) {
        //   shopid = '005'
        // }
        // console.log("shopid",shopid)
        // console.log("绑手机号的shopid",shopid)
        if (shopid) {
          var para = {
            url: "/Account/ChangeShopIdByXcx",
            type: "POST",
            data: {
              shopid: shopid,
              userid: user.userid
            }
          }
          this._request(para, (res) => {//这里停止 返回54行 走完后又返回
            // console.log("手机号帮邀请码返回的res",res)
            if (res.state.returnCode > 0) {
              user.rsShopId = res.data.ShopId;
              user.reLoginName = res.data.LoginName;
              user.shareShopCode = res.data.ShopCode;
              user.shopcode = res.data.ShopCode;
              // console.log("帮邀请码走着里 清除前的user",wx.getStorageSync('user'))
              wx.removeStorageSync('user')
              // console.log(111)
              wx.setStorageSync('user', user);
              // console.log("绑定完成后存入的user",wx.getStorageSync('user'))
            } else {
              // console.log("1");
              wx.navigateTo({
                url: '/pages/user/login/bindingNum/bindingNum?userid=' + user.userid,
              })
              return false;
            }
          })
        } else {
          // console.log("2");
          wx.navigateTo({
            url: '/pages/user/login/bindingNum/bindingNum?userid=' + user.userid,
          })
          return false;
        }
      }
      // console.log(user);
      // 此处可以存入缓存
      return user;//此处返回399行走callback
    } else { //获取不到另行处理，回到登录页或重新请求微信登陆等
      // wx.showModal({
      //   title: '系统提示',
      //   content: '账户已离线请重新登陆！',
      // })
      // console.log("没缓存")
      this._getWxShouquan()
    }
  }
  /**获取微信授权 弃用*/
  _getWxShouquan() {
    wx.navigateTo({
      url: '/pages/user/login/wxlogin/wxlogin',
    })
    //获取微信是否授权(没有登录)   
    //_openWxUser(true)
    // var that = this
    // that._openWxUser(1)
    // wx.getSetting({
    //   success(res) {    
    //       if (res.authSetting.userInfo = true) //授权过获取信息，直接登录
    //       {
    //         that._getWxUser()
    //       } else {
    //         //打开登录授权页面授权
    //         that._openWxUser(true)
    //       }
    //   },
    //   fail: function() {
    //     that._openWxUser(true)
    //   }
    // })
  }
  _getWxUserByApi(encryptedData, iv, scode, islogin, callback) {
    var that = this
    var url = islogin ? "/Account/UserInfoByWxXcx" : "/Account/GetOpenIdByWxXcx"
    var para = {
      url: url,
      type: "POST",
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: scode
      }
    }
    this._request(para, (resu) => {
      if (resu.state.returnCode > 0) {
        //登录
        if (resu) {
          wx.removeStorageSync('openid')
          wx.setStorageSync('openid', resu.data.openId)
          if (islogin){
            that._userLogin(resu)
          }
          else if (callback != undefined)
            callback(resu)
        }
        //that._userLogin(resu.data.data.nickName, resu.data.data.openId, resu.data.data.unionId)
      }
    })
  }
  // 允许授权后调用
  _getWxUser(islogin, callback) {
    var that = this;
    var code = '';
    wx.login({
      success(res) {
        //授权完成获取信息/解密unionid
        wx.getUserInfo({
          data: {
            withCredentials: true
          },
          success(ress) {
            if (res.code) {
              var resu = that._getWxUserByApi(ress.encryptedData, ress.iv, res.code, islogin, callback)
            }
          }
        })
      }
    })
  }
  _userLogin(resu) {
    let rsShopId  = wx.getStorageSync('shopid')
    var that = this
    var para = {
      url: "/Account/UserLoginByWeiXin",
      type: "POST",
      data: {
        nickName: resu.data.nickName ? resu.data.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "*") : "",
        username: resu.data.openId,
        unionId: resu.data.unionId ? resu.data.unionId : '',
        Head: resu.data.avatarUrl,
        ShopId: rsShopId,
        source: 3,
        usertype: 3
      }
    }
    this._request(para, (res) => { 
      let shopid = wx.getStorageSync('shopid')
      // if(!shopid) {
      //   shopid = '005'
      // }
      let userid= res.data.Userid
      let Mobile = res.data.Mobile
      let rsShopId = res.data.rsShopId
      // console.log('shopid',shopid,'userid',userid,"Mobile",Mobile,"rsShopId",rsShopId)
      // console.log('微信授权登录后',res)
      var user = wx.getStorageSync('user');
      if(!user)
      {
        wx.setStorageSync('user', {
          'userid': res.data.Userid,
          'username': res.data.Username,
          'nickName': res.data.nickName,
          'head': res.data.Head,
          'mobile': res.data.Mobile,
          'loginName': res.data.LoginName,
          'shopcode': res.data.ShopCode,
          'shareShopCode': res.data.ShareShopCode,
          'userRatingId': res.data.UserRatingId,
          'shopId': res.data.ShopId,
          'status': res.data.status,
          'isSuperLife': res.data.IsSuperLife,
          'personName': res.data.PersonName,
          'rsShopId': res.data.rsShopId,
          'reLoginName': res.data.reLoginName,
        })
      }
      if(shopid&&userid&&(rsShopId==''||rsShopId=='undefined')) {
        // if((res.data.rsShopId==''||res.data.rsShopId=='undefined') && shopid!='' && shopid !='undefined')
        //   {
        //     res.data.rsShopId = shopid;
        //   }
        this._getUser()
        wx.navigateBack();
        wx.hideLoading({fail:(err)=> {console.log(err)}});
      }else{
        // console.log("33")
        that._userLoginBind(res)
      }
      
    })
  }
  _userLoginBind(res) {
    // console.log('_userLoginBin', res);
    if (res.state.returnCode > 0) {
      //登录成功清除原缓存，写入新的 
      wx.removeStorageSync('user')
      // console.log(222)
      wx.setStorageSync('user', {
        'userid': res.data.Userid,
        'username': res.data.Username,
        'nickName': res.data.nickName,
        'head': res.data.Head,
        'mobile': res.data.Mobile,
        'loginName': res.data.LoginName,
        'shopcode': res.data.ShopCode,
        'shareShopCode': res.data.ShareShopCode,
        'userRatingId': res.data.UserRatingId,
        'shopId': res.data.ShopId,
        'status': res.data.status,
        'isSuperLife': res.data.IsSuperLife,
        'personName': res.data.PersonName,
        'rsShopId': res.data.rsShopId,
        'reLoginName': res.data.reLoginName,
      })
      var _userinfo = wx.getStorageSync('user');
      // console.log(_userinfo.mobile == 'undefined' || _userinfo.mobile == '')
      if (_userinfo.mobile == 'undefined' || _userinfo.mobile == '') {
        // console.log("去绑手机页")
        wx.navigateTo({
          url: '/pages/user/login/bindingTel/bindingTel?userid=' + _userinfo.userid,
        })
        return false;
      }
      // console.log(_userinfo.rsShopId == 'undefined' || _userinfo.rsShopId == '');
      if (_userinfo.rsShopId == 'undefined' || _userinfo.rsShopId == '') {
        // console.log("3",_userinfo);
        wx.navigateTo({
          url: '/pages/user/login/bindingNum/bindingNum?userid=' + _userinfo.userid,
        })
        return false;
      }
    
      if (res.data.rsShopId > 0) {
        wx.removeStorageSync('shopid');
        wx.setStorageSync('shopid', res.data.rsShopId)
        // console.log("有的话需要存手机号",res.data.Mobile)
      }
      // console.log('back');
      wx.navigateBack();
      wx.hideLoading({fail:(err)=> {console.log(err)}});
    } else {
      wx.hideLoading({fail:(err)=> {console.log(err)}});
      wx.showToast({
        title: res.state.error,
        icon: 'none',
        duration: 2000
      })
    }
  }
  _clearLoginReseat() {
    wx.removeStorageSync('user');
    wx.reLaunch({
      url: '/pages/home/shop/shop',
    })
  }
  _openBindCodeOrMobile(userId, mobile, shopid) {
    wx.navigateTo({
      url: '/pages/user/login/wxlogin/wxlogin',
    })
  }
  _getOpenId(callback) {
    //获取openid
    var wxopenid = wx.getStorageSync('openid');
    if (wxopenid) {
      callback({
        data: {
          openId: wxopenid
        }
      });
    } else {
      this._getWxUser(false, callback);
    }
  }
  _getShopId() {
    var shopid = wx.getStorageSync('shopid');
    if (shopid)
      return shopid;
    else
      return this._getUser().rsShopId
  }
  /**评论的星星显示 */
  starsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        array.push(1)
      } else {
        array.push(0)
      }
    }
    return array;
  }

  domain() {
    return baseurl;
  }

  getSignData(parms) {
    return signJs.getSign(parms);
  }

  _getUserMobile(encryptedData, iv, userid, callback) {
    var that = this;
    var code = '';
    wx.login({
      success(res) {
        if (res.code) {
          var resu = that._getWxUserMobileByApi(encryptedData, iv, res.code, userid, callback)
        }
      }
    })
    wx.hideLoading({fail:(err)=> {console.log(err)}});
  }

  _getWxUserMobileByApi(encryptedData, iv, scode, userid, callback) {
    let rsShopId  = wx.getStorageSync('shopid')
    var that = this
    var para = {
      url: "/Account/GetUserMobileByWxXcx",
      type: "POST",
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: scode,
        ShopId: rsShopId,
        Userid: userid
      }
    }
    this._request(para, (resu) => {
      if (resu.state.returnCode > 0) {
      // 清除缓存 存入新值 user
      wx.removeStorageSync('user')
      // console.log(333)
      wx.setStorageSync('user', {
        'userid': resu.data.Userid,
        'username': resu.data.Username,
        'nickName': resu.data.nickName,
        'head': resu.data.Head,
        'mobile': resu.data.Mobile,
        'loginName': resu.data.LoginName,
        'shopcode': resu.data.ShopCode,
        'shareShopCode': resu.data.ShareShopCode,
        'userRatingId': resu.data.UserRatingId,
        'shopId': resu.data.ShopId,
        'status': resu.data.status,
        'isSuperLife': resu.data.IsSuperLife,
        'personName': resu.data.PersonName,
        'rsShopId': resu.data.rsShopId,
        'reLoginName': resu.data.reLoginName,
      })
      // console.log("手机授权存入的user1",wx.getStorageSync('user'))
        let shopid = wx.getStorageSync('shopid')
        // if(!shopid) {
        //   shopid = '005'
        // }
        // console.log("005",shopid)
        let userid= resu.data.Userid
        let Mobile = resu.data.Mobile
        let rsShopId = resu.data.rsShopId
        //  console.log('shopid',shopid,'userid',userid,"Mobile",Mobile,"rsShopId",rsShopId)
        //  console.log('手机授权登录',resu)
        if(shopid&&userid&&Mobile&&(rsShopId==''||rsShopId=='undefined')) {
          // console.log("手机授权走这里")
          if((resu.data.rsShopId==''||resu.data.rsShopId=='undefined') && shopid!='' && shopid !='undefined')
          {
            resu.data.rsShopId = shopid;
          }
          this._getUser()//这里走66行 
        }
        
        // console.log("应该得到绑定后的数据 由callback返回")
        // console.log("此处回到_userLoginBind",resu);
        // console.log("获取绑定后返回res",wx.getStorageSync('user'));
        // let data = 
        callback(resu)//此处回到_userLoginBind
      } else {
        wx.showToast({
          title: resu.state.error,
          icon: 'none',
          duration: 3000
        })
      }
    })
  }
  buttonClicked(self) {
    self.setData({
      buttonClicked: true
    })
    setTimeout(function() {
      self.setData({
        buttonClicked: false
      })
    }, 1000)
  }

  _setCartQty() {
    var para = {
      url: '/User/GetCartQty',
      type: 'GET',
      data: {
        userid: this._getUser().userid,
        cartid: wx.getStorageSync("CartId")
      }
    }
    this._request(para, (res) => {
      if (res.state.returnCode == 1) {
        wx.setStorageSync('cartnum', res.data.cartnum);
        if (res.data.cartnum > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: res.data.cartnum,
          })
        }
      }
    });
  }
}
export {
  baseRequest
}