// 本页请求未使用封装方法 在请求海报时有返回类型 responseType: 'arraybuffer', 其他可用封装请求request.js 待优化
import {
  baseRequest
} from '../until/baseRequest.js';
var _baseRequest = new baseRequest();
import { request } from '../until/request.js'
// var md5 = require('../until/md5.js');
var signJs = require('../until/sign.js');

let Time =  require('../until/formatTime.js');
Page({
  data: {
    accessToken: "",
    liveList: [],
    roomId: null,
    isShow: false,
    isHide: false,
    sharePic: '',
    isshare: false
  },
    //options(Object)
    onLoad: function(options){
      let { rsShopId, head, nickName } = wx.getStorageSync('user')
      this.setData({ rsShopId, head, nickName })
      this.getLiveList()  
    // // 扫二维码获取数据
      // var scene = decodeURIComponent(options.scene)
      // console.log('scene',scene)
      // console.log('options',options)
      // var custom_params = JSON.parse(decodeURIComponent(options.custom_params))
      // console.log('custom_params',custom_params,options.custom_params)
      // if(scene != 'undefined'||scene != '') {
      //   wx.setStorage({
      //     key: "shopid",
      //     data: scene
      //   })
      // }
    },
  
  onReady: function(){
    
  },
  onShow: function(options){
    var user = wx.getStorageSync('user')
    if (!user) {
      wx.hideShareMenu()
      this.setData({isshare:false})
    } else {
      wx.showShareMenu()
      this.setData({isshare:true})
    }
  },
  // 显示弹层
  clickShow () {
    this.setData({
      isShow: true
    })
  },
  // 关闭弹层
  closePop () {
    this.setData({
      isShow: false
    })
  },
  // 关闭下载图片页面
  closeBtn () {
    this.setData({
      isShow: true,
      isHide: false
    })
  },
  shareCard() {
    wx.navigateTo({
      url: '/pages/user/login/wxlogin/wxlogin'
    })
  },
  //  转发 分享到微信
   onShareAppMessage: function (res) {
    //  console.log('this.data.liveList',this.data.liveList)
    var luser = _baseRequest._getUser();
    // console.log("luser",luser)
    //  let { rsShopId } = wx.getStorageSync('user')
     let imgUrl = this.data.liveList[0].share_img
     let title = this.data.liveList[0].name
     if (luser) {
      return {
        title,
        path: '/pages/live/live?scene=' + luser.rsShopId,
        imageUrl: imgUrl,
      }
    }
  },
  // 生成海报按钮
  sharePic () {
    let user = wx.getStorageSync('user')
        if (!user) {
          wx.navigateTo({
            url: '/pages/user/login/wxlogin/wxlogin'
          })
          return
        }
    this.requestImg()
    // this.setData({
    //   isShow: false,
    //   isHide: true
    // })
  },
  // 请求海报   1
  requestImg() {
    // let { rsShopId, head, nickName} = this.data
    let { rsShopId, head, nickName } = wx.getStorageSync('user')
    let houseid = this.data.liveList[0].roomid
    // console.log(' rsShopId, head, nickName ', rsShopId, head, nickName )
    let data = {"data":{
      scene: rsShopId,
      page: 'pages/live/live',
      header: head,
      username: nickName,
      houseid: houseid
    }}
    let dat = signJs.getSign(data)
    // console.log('dat',dat)
    wx.showLoading({
      title: '生成海报中...',
    })
    wx.request({
      data: dat,
      method: "POST",
      responseType: 'arraybuffer',
      // url: 'http://192.168.0.7:8082/Shop/DrawShareImages',
      url: 'https://api.jiangxinxiaozhen.com/Shop/DrawShareImages',
      header: {"content-type": "application/x-www-form-urlencoded"},
      success:(res)=>{
        // console.log("header",res.header["Content-Type"])
        let header = res.header["Content-Type"]
        if (header == 'image/jpeg') {
          let imgSrc =  wx.arrayBufferToBase64(res.data);//base64编码
          this.setData({
            sharePic: imgSrc,
            isShow: false,
            isHide: true
          })
          // console.log("sharePic",this.data.sharePic)
          wx.hideLoading({fail:(err)=> {console.log(err)}})
        } else {
          wx.showToast({
            title: '请重新生成...',
            icon: 'fail',
            duration: 2000,
            mask: true
          })
        }
      }
     })
  },
  // 保存图片
  savePic () {
    let that = this
    let isFirst = wx.getStorageSync('isFirst') || 0;
    // 用户授权
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: (res)=>{
              that.saveImage()
            },
            fail: ()=>{
              if (isFirst === 0) {
                wx.setStorageSync('isFirst', 1);
              } else {
                wx.openSetting({
                  success: (res)=>{}
                });
              }
            },
            complete: ()=>{}
          });
        } else {
          that.saveImage()
        }
      }
    })
  },
  // 封装保存图片到本地函数
  saveImage() {
    wx.showLoading({
      title: '保存中...',
    })
    let save = wx.getFileSystemManager();
    // console.log('save',save)
    let number = Math.random();
    // 删除缓存列表
    save.readdir({ // 获取文件列表
      dirPath: wx.env.USER_DATA_PATH,
      success(res) {
        // console.log('res',res)
       res.files.forEach((el) => {
        let name=(wx.env.USER_DATA_PATH+el).replace(/usr/g,"usr/");
         //删除时要注意文件名一定要和存的时候一样,不然会报没有unlink无文件权限问题
        save.unlink({
         filePath:name,
         fail(e) {
          console.log('readdir文件删除失败：', e)
         },
         success(succ){
          console.log('readdir文件删除成功：', succ)
         }
        });
       })
      }
     })
    //  保存图片
    save.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
      data: this.data.sharePic,
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          success: function (res) {
            wx.hideLoading({fail:(err)=> {console.log(err)}})
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail: function (err,e) {
            console.log(err,e)
            wx.showToast({
              title: '保存失败',
            })
            wx.hideLoading({fail:(err)=> {console.log(err)}})
          }
        })
        // console.log(res)
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '保存失败',
        })
        wx.hideLoading({fail:(err)=> {console.log(err)}})
      }
    })
    
    // let imgUrl = this.data.sharePic
    // console.log('imgUrlimgUrl',imgUrl)
    // wx.downloadFile({
    //   url: imgUrl,
    //   success (res) {
    //     if (res.statusCode === 200) {
    //       let imgurl = res.tempFilePath
    //       wx.saveImageToPhotosAlbum({
    //         filePath: imgurl,
    //         success(res) { 
    //           wx.showToast({
    //             title: '图片已保存到本地',
    //             icon: 'none',
    //             duration: 2000
    //           })
    //         },
    //         fail(res) {
    //           wx.showToast({
    //             title: '图片保存失败',
    //             icon: 'none',
    //             duration: 2000
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  // // 生成小程序码
  // clickSetCode () {
  //   let that = this
  //   let accessToken = this.data.accessToken
  //   let roomId = 4
  //   let customParams = 123456
  //   wx.request({
  //     // url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${accessToken}`,// 接口A 适用于需要的码数量较少的业务场景
  //     // url: `https://api.weixin.qq.com/wxa/ge twxacodeunlimit?access_token=${accessToken}`,// 接口B 适用于需要的码数量极多的业务场景
  //     url: `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`,// 接口C 适用于需要的码数量较少的业务场景 生成二维码
  //     method: 'POST',
  //     responseType: 'arraybuffer',
  //     // 接口B 使用
  //     // data: {
  //     //   scene: '123&456',
  //     //   page:'pages/list/list'
  //     // },
  //     // 接口A C 使用
  //     data: {
  //       path:`pages/product/product?grouplogid=0&groupid=-1&sku=0000375&custom_params=${customParams}&type=9&open_share_ticket=1`
  //     },
  //     success: (res) => {
  //       console.log('小程序码',res)
  //       // console.log('小程序码',res.data)

  //   //     var imgSrc =  wx.arrayBufferToBase64(res.data);//base64编码
  //   // var save = wx.getFileSystemManager();
  //   // var number = Math.random();
  //   // save.writeFile({
  //   //   filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
  //   //   data: imgSrc,
  //   //   encoding: 'base64',
  //   //   success: res => {
  //   //     wx.saveImageToPhotosAlbum({
  //   //       filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
  //   //       success: function (res) {
  //   //         wx.showToast({
  //   //           title: '保存成功',
  //   //         })
  //   //       },
  //   //       fail: function (err) {
  //   //         console.log(err)
  //   //       }
  //   //     })
  //   //     console.log(res)
  //   //   }, fail: err => {
  //   //     console.log(err)
  //   //   }
  //   // })
  //       let url ='data:image/png;base64,'+ wx.arrayBufferToBase64(res.data)
  //       that.setData({
  //         imgurl: url
  //       })
  //       console.log('ToBase64',wx.arrayBufferToBase64(res.data))
  //       console.log('imgurl',this.data.imgurl)
  //     }
  //   })
  // },

  // 获取access_token密钥
  // getAccessToken () {
  //   let that = this
  //   wx.request({
  //     url: 'https://api.weixin.qq.com/cgi-bin/token',
  //     method: 'GET',
  //     data: {
  //       grant_type:'client_credential',
  //       appid: 'wxc4f4398d9d3dbe86',
  //       secret: '4d195fdc3889598dcc23820d77f41a24'
  //     },
  //     success: (res) => {
  //       this.setData({
  //         accessToken: res.data.access_token
  //       })
  //       // console.log('秘钥',res)
  //       that.getLiveList()
  //     }
  //   })
  // },
  // 获取直播间列表   2
  getLiveList() {
    request({url:'/shop/GetLiveInfo'})
    .then(res=> {
        // console.log("直播",res)
         // 直播列表
         let xcxarr = res.data.room_info
        //  console.log('直播列表',xcxarr)
        //  房间id
         let data = []
         xcxarr.forEach((v,i)=> {
          data.push(v.roomid)
         })
         let dat = data.toString()
        //  console.log("房间ID",dat)
         let obj = {
          'data': {AppletId: dat}
        }
        let query = signJs.getSign(obj)
         //  获取后台录入房间    2
         wx.request({
          data: query,
          method: "POST",
          // url: 'http://192.168.0.7:8082/Shop/GetWxLiveList',
          url: 'https://api.jiangxinxiaozhen.com/Shop/GetWxLiveList',
          header: {"content-type": "application/x-www-form-urlencoded"},
          success:(res)=>{
            // console.log("后台数据",res)
            if(!res.data.data.List) {
              return
            }
            let htarr = res.data.data.List // 后台直播列表图数据
            // console.log("后台录入房间",htarr)
            let zharr = []// 剔除未录入的房间
            // 房间对比
            // console.log('两个房间',xcxarr,htarr)
            for (var i = 0; i < xcxarr.length; ++i) {
              for (var j = 0; j < htarr.length; ++j) {
                if(xcxarr[i].roomid == htarr[j].AppletId) {
                  zharr.push(xcxarr[i])
                  // console.log('单个相同房间',zharr)
                }
              }
            }
            // console.log('相同房间',zharr)
            let livingList = []
            let arr = []
            let end = []
            zharr.forEach( item => {
              item.start_time = Time.formatTime(item.start_time,'Y-M-D h:m:s')
            });
            // console.log('循环前',zharr)
            // 直播中
            livingList = zharr.filter((item,index)=> {
              return item.live_status == 101 || item.live_status == 105 || item.live_status == 106
            })
            // 即将直播
            arr = zharr.filter((item,index)=> {
              return item.live_status == 102
            }).reverse()
            // 已结束 或其他状态
            end = zharr.filter((item,index)=> {
              return item.live_status != 102 &item.live_status != 101 & item.live_status != 105 & item.live_status != 106
            })
            zharr = [...livingList,...arr,...end]
            this.setData({
              liveList: zharr
            })
            // console.log('liveList',this.data.liveList)
            this.getTopImg()
          }
        })
    })
  },
  // 点击进入直播间
  joinLive (data) {
    // console.log("roomId",data.currentTarget.dataset.roomid)
    let { rsShopId } = wx.getStorageSync('user')
    // console.log("rsShopId",rsShopId)
    let roomId = data.currentTarget.dataset.roomid // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1,rsShopId: rsShopId,room_id: roomId})) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    this.setData({
        roomId,
        customParams
    })
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}&type=9&open_share_ticket=1`
  })
  },
  // 请求顶部按钮图片   3
  getTopImg() {
        // 请求后台直播列表图片
        // console.log('top',this.data.liveList[0].roomid)
        let id = this.data.liveList[0]?this.data.liveList[0].roomid:'12'
        let data = {
          'data': {AppletId: id}
        }
        let dat = signJs.getSign(data)
        // console.log('dat',dat)
        wx.request({
          data: dat,
          method: "POST",
          // url: 'http://192.168.0.7:8082/Shop/GetWxLiveList',
          url: 'https://api.jiangxinxiaozhen.com/Shop/GetWxLiveList',
          header: {"content-type": "application/x-www-form-urlencoded"},
          success:(res)=>{
            // console.log("topimg",res,res.data.data.TopImag)
            this.setData({
              topImage: res.data.data.TopImag
            })
          },
          fail:(err)=> {
            console.log("err",err)
          }
         })
  },

  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  },

});