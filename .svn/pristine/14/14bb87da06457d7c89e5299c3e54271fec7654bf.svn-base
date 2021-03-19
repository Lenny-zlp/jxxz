import { request } from '../../until/request.js'
var signJs = require('../../until/sign.js');
import {
  baseRequest
} from '../../until/baseRequest.js';
var base = new baseRequest();
import {
  time
} from '../../until/time.js';
var _time = new time();
var href = require('../../until/click.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    sure: true,
    scrollTop: 0,
    code: 467,
    buttonClicked: false,
    page: [],
    liveList: [],
    accessToken: '',
    isShowAddxcx: false
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onReady: function() {
    wx.setNavigationBarTitle({
      title: '匠心小镇',
    })
    // 是否显示添加到我的小程序（第一次进小程序没有缓存）
    let addxcx = wx.getStorageSync('isshowaddxcx')
    if(!addxcx) {
      this.setData({
        isShowAddxcx:true
      })
      wx.setStorageSync("isshowaddxcx", "first");
    }else{
      this.setData({
        isShowAddxcx:false
      })
    }
  },
  onHide: function() {
    wx.hideLoading({fail:(err)=> {console.log(err)}})
  },
  onShow: function() {
    this.getLiveList()
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        cartnum: wx.getStorageSync('cartnum')
      })
    }
   
    if (this.data.page.length == 0) {
      this._homeload()
    } else {
      if (this.data.code == 467) {
        this._homeload()
      } else {
        this.getPageContent(this.data.code)
      }
    }
    var windowRule = wx.getSystemInfoSync();
    var screenW = windowRule.windowWidth;
    var windowH = windowRule.windowHeight;
    var rpxR = 750 / screenW
    this.setData({
      height: windowH * rpxR - 280
    })
  },
  onHide: function() {
    wx.hideLoading({fail:(err)=> {console.log(err)}})
    clearInterval(this.data.setTime)
  },
  _homeload: function() {
    var id = {
      url: "/shop/page?appversion=3",
      type: 'POST',
      data: {
        source: 1
      },
      _fcallback: this._fcallback
    }
    base._request(id, this._callback)
  },

  _fcallback: function() {
    wx.hideLoading({fail:(err)=> {console.log(err)}})
    this.setData({
      loading: false
    })
  },

  _callback: function(res) {
   // 控制直播列表是否显示
   this.setData({
    ShowZB: res.ShowZB, // 0 不显示  1 显示
    keyword: res.keyword // 热搜
   })
    wx.hideLoading({fail:(err)=> {console.log(err)}})
    //重置导航数据
    var menu = [{
      Code: 467,
      PageName: '首页',
      currentIndex: 0
    }]
    var content = []
    res.data.filter(function(v) {
      if (v.ModuleType == 10) {
        for (var i = 0; i < v.Module.length; i++) {
          var temp = {
            Code: v.Module[i].Code,
            PageName: v.Module[i].PageName,
            currentIndex: i + 1
          }
          menu.push(temp)
        }
      } else {
        content.push(v)
      }
    });
    var that=this
    content.map((v,i)=>{
      if (v.ModuleType == 11) {
          var secondAllTime = v.Module[0].Product.xsg_totalsecond;
          if (secondAllTime > 0) {
            clearInterval(that.data.setTime);
            _time.initinterval(that, secondAllTime);
            that.interval(that, secondAllTime);
          }
      } else if (v.ModuleType ==14){
        var hotview = null
        var hotlist=null
        if (v.Module[0].HotView != '') {       
          hotview = JSON.parse(v.Module[0].HotView);
        } 

        if (hotview.length > 0) {
            hotlist = hotview.map((m,i) => {
            let arr = [],
              arrsku = [],
              arrtype = [],
              temp, sku;
            if (m.Code.indexOf('|') > 0) {
              sku = m.Code.split('|')
            }               
            for (var i = 0; i < m.Coords.split('|').length; i++) {
              temp = m.Coords.split('|')[i].split(',');
              var position = {
                left: Math.round(temp[0] * 100),
                top: Math.round(temp[1] * 100),
                width: Math.round(temp[2] * 100),
                height: Math.round(temp[3] * 100)
              }
              arr.push(position);
              arrsku.push(m.Code.split('|')[i]);
              arrtype.push(m.LinkTypes.split('|')[i]);
            }
            m.coordsArrow = arr;
            m.skuArrow = arrsku;
            m.typeArrow = arrtype;
            return m;                           
          });
        }
        v.hotview = hotlist
      }
    })
    //重置首页page数据
    let page = menu.map((v, i) => {
      if (v.Code == 467) {
        v.content = content
      } else {
        v.content = []
      }
      return v
    })
    this.setData({
      menu: menu,
      page: page
    })
    
  },
  //调取倒计时函数
  interval: function(that, num) {
    that.data.setTime = setInterval(function() {
      num--;
      _time.initinterval(that, num);
      if (num < 0) {
        that.onShow()
      }
    }.bind(this), 1000);
  },
  onclickTab: function(e) {
    wx.hideLoading({fail:(err)=> {console.log(err)}})
    this.setData({
      currentPage: e.target.dataset.cur,
      code: e.target.dataset.code
    })
  },
  //滑动页面更换频道页数据
  onchange: function(event) {

    var index = event.detail.current,
      that = this
    var code = this.data.page[index].Code;

    if (code == 467) {
      wx.showLoading({
        title: "加载中..."
      })
      this._homeload()
    } else {
      wx.showLoading({
        title: "加载中..."
      })
      this.getPageContent(code)
    }
    this.setData({
      code: code
    })
  },
  swipertop: function(event) {
    var index = event.detail.current,
      that = this
    if (event.detail.source == 'touch') {
      this.setData({
        currentPage: index,
        scrollTop: 0
      })
    }
  },
  getPageContent: function(code) {
    this.setData({
      sure: false
    })
    var id = {
      url: "/shop/topic",
      type: 'POST',
      data: {
        id: code
      }
    }
    base._request(id, this.pagecallback);
  },
  pagecallback(res) {
    wx.hideLoading({fail:(err)=> {console.log(err)}})
    var that = this
    var page = this.data.page.filter(function(v) {
      if (v.Code == that.data.code) {
        v.content = res.data
      }
      return v
    })
    this.setData({
      page: page,
      sure: true
    })
  },
  // 点击获取当前元素的sku，跳转到对应详情页
  tapHref: function(event) {
    var code = event.currentTarget.dataset.code;
    var link = event.currentTarget.dataset.link;
    var linktype = event.currentTarget.dataset.linktype;
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        if (linktype == 1) {
          href.href('/pages/product/product?sku=' + event.currentTarget.dataset.sku + "&groupid=-1&grouplogid=0");
        } else if (linktype == 5) {
          href.href('/pages/product/webView/webView?url=' + link);
        }
      }
    }

  },
  //点击跳转到倒计时列表页
  toPurchase: function() {
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        href.href('/pages/purchase/purchase')
      }
    }

  },
  //点击跳转到拼团列表页
  toCollage: function() {
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        href.href('/pages/collage/collage')
      }
    }

  },
  onShoptop: function(e) {
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        if (e.target.dataset.link != undefined) {
          href.href('/pages/shopTop/shopTop?id=' + e.target.dataset.link + '&title=' + e.target.dataset.title)
        }
      }
    }

  },

getLiveList(res) {
    request({url:'/shop/GetLiveInfo'})
    .then(res=> {
        // 直播列表
         let xcxarr = res.data.room_info
        // console.log('直播列表',xcxarr)
        //  房间ＩＤ
         let data = []
         xcxarr.forEach((v,i)=> {
          data.push(v.roomid)
          //  console.log("房间ID", v.roomid)
         })
         let dat = data.toString()
          // console.log("房间ID2",dat)
         let obj = {
          'data': {AppletId: dat}
        }
        let query = signJs.getSign(obj)
        //  获取后台录入房间
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
            let zharr = []
            // 房间对比
            for (var i = 0; i < xcxarr.length; i++) {
              for (var j = 0; j < htarr.length; j++) {
                   if(xcxarr[i].roomid == htarr[j].AppletId) {
                  zharr.push(xcxarr[i])
                }
              }
            }
              let livingList = []
              let arr = []
              let end = []
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
              // console.log("排序后的数组", this.data.liveList)
      
      
              // 请求后台直播列表图片
              if(this.data.liveList.length == 1) {
                let data = {
                  'data': {AppletId: `${this.data.liveList[0].roomid}`}
                }
                let dat = signJs.getSign(data)
                // console.log('dat1',dat)
                // 请求后台数据
                this.getrequest(dat)
              }
              if(this.data.liveList.length == 2) {
                let data = {
                  'data': {AppletId: `${this.data.liveList[0].roomid},${this.data.liveList[1].roomid}`}
                }
                let dat = signJs.getSign(data)
                // console.log('dat2',dat)
                // 请求后台数据
                this.getrequest(dat)
              }
              if(this.data.liveList.length >= 3) {
                let data = {
                  'data': {AppletId: `${this.data.liveList[0].roomid},${this.data.liveList[1].roomid},${this.data.liveList[2].roomid}`}
                }
                let dat = signJs.getSign(data)
                // console.log('dat3',dat)
                // 请求后台数据
                this.getrequest(dat)
              }
          
          }
        })
     })
  },
  // 请求后台直播列表图数据
  getrequest(dat) {
    wx.request({
      data: dat,
      method: "POST",
      // url: 'http://192.168.0.7:8082/Shop/GetWxLiveList',
      url: 'https://api.jiangxinxiaozhen.com/Shop/GetWxLiveList',
      header: {"content-type": "application/x-www-form-urlencoded"},
      success:(res)=>{
        let relist = res.data.data.List // 后台直播列表图数据
        this.setData({
          relist
        })
        let rearr = []
        let roomList = this.data.liveList // 小程序获取的直播房间列表
        let resList = this.data.relist // 后台直播列表图数据
        resList.forEach( item => {
          if (roomList.length == 1) {
              roomList[0].share_img = item.BannersImg
              rearr = [roomList[0]]
          }
          if (roomList.length == 2) {
            if (item.AppletId == roomList[0].roomid) {
              roomList[0].share_img = item.BannersImg
              }
              if (item.AppletId == roomList[1].roomid) {
              roomList[1].share_img = item.BannersImg
              }
              rearr = [roomList[0],roomList[1]]
          }
          if (roomList.length >= 3) {
            if (item.AppletId == roomList[0].roomid) {
              roomList[0].share_img = item.RegularImg
              }
              if (item.AppletId == roomList[1].roomid) {
              roomList[1].share_img = item.RegularImg
              }
              if (item.AppletId == roomList[2].roomid) {
              roomList[2].share_img = item.RegularImg
              }
              rearr = [roomList[0],roomList[1],roomList[2]]
          }
        })
        this.setData({ relist: rearr })
      }
      })

  },
  // 点击进入直播列表
  clickmore() {
    wx.navigateTo({
      url: '/pages/live/live'
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
  // 点击隐藏添加到我的小程序
  addxcx () {
  this.setData({
    isShowAddxcx:false
  })
  }
})