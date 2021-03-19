import { request } from '../../until/request.js'
import {
  time
} from '../../until/time.js';
var _time = new time();
import {
  baseRequest
} from '../../until/baseRequest.js';
var _base = new baseRequest();
import {
  product
} from '../product-model.js';
var _product = new product();
var pageList = require('../../until/pageList.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minPrice: '0',
    maxPrice: '20',
    pageIndex: 1,
    navs: [],
    productList: [],
    flag: false,
    currentTab: 0,
    navScrollLeft: 0,
    isHavvData: true,
    addView: false,
    product: {},
    modelcolor: [],//规格
    modelhue: [],// 尺寸
    addnum: '1',
    collage: false,
    sheight: '',
    selcolor: '',
    selhue: ''
  },
  setTab: function (e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    pageList.windowH(this, 0)
    // var user = wx.getStorageSync('user')
    // if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
    //   wx.hideShareMenu()
    // }
    // console.log('凑单',options.scene)
    // if(options.scene) {
    //   console.log('options', options.scene)
    //   wx.setStorage({
    //     key: "shopid",
    //     data: options.scene
    //   })
    // }
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNavs(this.data.minPrice,this.data.maxPrice,this.data.pageIndex)
    // var user = wx.getStorageSync('user')
    // if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
    //   wx.hideShareMenu()
    // } else {
    //   wx.showShareMenu()
    // }
  },

  // 导航栏点击项居中
  switchNav(event) {
    let { minprice,maxprice } = event.currentTarget.dataset
    // console.log("nav",minprice,maxprice)
    // 下标
    var cur = event.currentTarget.dataset.current;
      //每个tab选项宽度占1/5          手机宽度/5
      var singleNavWidth = this.data.windowWidth / 5;
      //tab选项居中                            
      this.setData({
        navScrollLeft: (cur - 2) * singleNavWidth,
        minPrice: minprice,
        maxPrice: maxprice,
        productList:[],
        pageIndex: 1,
        isHavvData: true,
      })
      if (this.data.currentTab == cur) {
        //return false;
      } else {
        this.setData({
          currentTab: cur,
          flag:false,
          productList:[],
          pageIndex: 1,
          isHavvData: true,
        })
      }
      this.getNavs(minprice,maxprice,this.data.pageIndex)
  },
  // 滑动页面切换
  switchTab(event) {
    var cur = event.detail.current;
    var { MinPrice,MaxPrice } = this.data.navs[cur]
    //  console.log(cur,MinPrice,MaxPrice)
     //this.getDataList(this.data.navData[cur].HotProductId)
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth,
      productList:[],
      isHavvData: true,
      minPrice:MinPrice,
      maxPrice: MaxPrice,
      pageIndex: 1
    });
    this.getNavs(MinPrice,MaxPrice,this.data.pageIndex)
  },
  // 获取凑单数据
  getNavs(minPrice,maxPrice,pageIndex) {
    request({url:'/Product/Collect',data:{minPrice:minPrice,maxPrice:maxPrice,pageIndex:pageIndex}})
    .then(res=> {
      let { list, spans } = res.data.data
      if(list.length==0) {
        this.setData({
          isHavvData: false
        })
        return
      }
      if(this.data.pageIndex == 1) {
        this.setData({
          productList: []
        })
      }
      this.setData({
        navs: spans,
        productList: [...this.data.productList,...list]
      })
    })
  },
  // 跳转详情页
  goDetail(event) {
    wx.navigateTo({
      url: '/pages/product/product?sku=' + event.currentTarget.dataset.sku
    });
      
  },
  // 购物车点击事件
  addCart(e) {
    var _userinfo = wx.getStorageSync('user');
    const stylecount = e.currentTarget.dataset.stylecount
    // let product = e.currentTarget.dataset.product
    // this.setData({
    //   product,
    //   addView: true
    // })
    // // console.log('product',this.data.product)
    // this.getProduct(this.data.product)
    // return

    // console.log('stylecount', stylecount)
    if (!_userinfo) {
      wx.navigateTo({
            url: '/pages/user/login/wxlogin/wxlogin?id=product',
          })
          return
    }
    if(stylecount == 1) {
      const url = '/MyCart/AddItem?sku=' + e.currentTarget.dataset.sku + '&qty=' + this.data.addnum + '&userid=' + _userinfo.userid;
      request({url})
      .then( res => {
        if (res.data.state.returnCode == 1) {
          wx.showToast({
              title: '添加购物车成功!',
              icon: 'none',
              duration: 2000
            })
        } else {
          wx.showToast({
              title: res.data.state.error,
              icon: 'none',
              duration: 2000
            })
        }
      })
    } else {
      let product = e.currentTarget.dataset.product
        this.setData({
          product,
          selcolor:product.Color,
          addView: true
        })
        this.getProduct(this.data.product)
      // console.log(123)
      // wx.navigateTo({
      //   url: '/pages/product/product?sku=' + e.currentTarget.dataset.sku
      // });
    }
  },
 //规格弹层回调参数
 _tanchuCallback: function(res) {
  this.setData({
    modelcolor: res.modelcolor,
    modelhue: res.modelhue
  })
  if (res.modelproduct != null) {
    this.setData({
      modelproduct: res.modelproduct,
      modelproductcode: res.modelproduct.ProductCode,
      modelproductstock: res.modelproduct.stock,
      status:res.modelproduct.status
    })
  } else {
    this.setData({
      modelproductcode: "",
      modelproductstock: 0,
      status: 1
    })

  }
},

//选择规格颜色回调函数
_tanchuCallback2: function(res) {
  res = res.data;
  res.modelcolor.forEach((e) => {
    if(e.Selected==1) {
      this.setData({
        selcolor: e.Color
      })
    }
  });
  res.modelhue.forEach((e) => {
    if(e.Selected==1) {
      this.setData({
        selhue: e.Hue
      })
    }
  });
  this.setData({
    modelcolor: res.modelcolor,
    modelhue: res.modelhue
  })
  if (res.modelproduct != null) {
    this.setData({
      modelproduct: res.modelproduct,
      modelproductcode: res.modelproduct.ProductCode,
      modelproductstock: res.modelproduct.stock,
      status: res.modelproduct.status
    })
  } else {
    this.setData({
      modelproductcode: "",
      modelproductstock: 0,
      status: 1
    })
  }

},

subtract: function(e) {
  let num = e.currentTarget.dataset.num;
  num--
  if (num < 1) {
    num = 1
  }
  this.setData({
    addnum: num
  })
},
add: function(e) {
  let num = e.currentTarget.dataset.num;
  var limittips = e.currentTarget.dataset.limitcounttips;
  if (e.currentTarget.dataset.limitcount == 0 || e.currentTarget.dataset.limitcount > num) {
    num++
    this.setData({
      addnum: num
    })
  } else if (e.currentTarget.dataset.limitcount > 0 && num >= e.currentTarget.dataset.limitcount) {
    wx.showToast({
      title: limittips + "",
      icon: "none",
    })
  }
},
checklimit: function(e) {
  let num = e.detail.value;
  var limittips = e.currentTarget.dataset.limitcounttips;
  this.setData({
    addnum: num
  })
  if (e.currentTarget.dataset.limitcount > 0 && num >= e.currentTarget.dataset.limitcount) {
    wx.showToast({
      title: limittips + "",
      icon: "none",
    })
  }

},
addhide: function() {
  this.setData({
    addView: false,
    modelproduct: []
  })
},

//点击规格触发事件
colorbtn: function(e) {
  if(e.currentTarget.dataset.color == this.data.selcolor) {
    return;
  }
  if (e.currentTarget.dataset.status != 2) {
    return false;
  }
  this.setData({
    selcolor: e.currentTarget.dataset.color,
    selhue: ''
  })
  this.getCHProduct(this.data.selcolor, '')
},
// 获取规格尺寸
getProduct(product) {
  var data = {
    styleId:product.StyleId,
    GroupId:'',
    ProductCode:product.ProductCode,
    hue:product.Hue,
    color:product.Color,
    v:'v3'
  }
  request({url:'/Product/GetCHProductCude',data})
  .then(res=> {
    var { modelproduct, modelcolor, modelhue } = res.data.data
    this.setData({
      modelproduct,
      modelcolor,
      modelhue
    })
    if (modelproduct != null) {
      this.setData({
        modelproduct,
        modelproductcode:modelproduct.ProductCode,
        modelproductstock: modelproduct.stock,
        status:modelproduct.status
      })
    } else {
      this.setData({
        modelproductcode: "",
        modelproductstock: 0,
        status: 1
      })

    }
  })
},
//点击尺码触发事件
huebtn: function(e) {
  if(e.currentTarget.dataset.hue == this.data.selhue) {
    return;
  }
  this.setData({
    selhue: e.currentTarget.dataset.hue
  })
  this.getCHProduct(this.data.selcolor, this.data.selhue)
},
//获取规格参数
getCHProduct: function(color, hue) {
  var url = '/product/GetCHProductCude?styleId=' + this.data.product.StyleId + '&GroupId=' + this.data.product.GroupId + '&ProductCode=' + this.data.product.ProductCode + '&hue=' + encodeURIComponent(hue) + '&color=' + encodeURIComponent(color) + '&v=v3'
  var _CHP = _product.getRequest(url, this._tanchuCallback2);
},
//规格弹出层确定按钮
subbtn: function(e) {
  var _userinfo = wx.getStorageSync('user');
  if (e.currentTarget.dataset.sku == "") {
    wx.showToast({
      title: "请选择尺码",
      icon: "none",
    })
    return false;
  }
  if (e.currentTarget.dataset.stock == 0) {
    // 到货通知
    const ProductCode = e.currentTarget.dataset.sku
    request({url:"/Product/ArrivalNotice",data:{UserId:_userinfo.userid,ProductCode}})
    .then(res => {
        wx.showToast({
          title: res.data.state.error,
          icon: 'none',
          duration: 2000
        })
    })
    // wx.showToast({
    //   title: "库存不足",
    //   icon: "none",
    // })
    return false;
  }
  if (e.currentTarget.dataset.limitcount > 0 && this.data.addnum > e.currentTarget.dataset.limitcount) {
    wx.showToast({
      title: "库存不足",
      icon: "none",
    })
    return false;
  }
  this.addhide();
  request({url:'/MyCart/AddItem',data:{sku:e.currentTarget.dataset.sku,qty:this.data.addnum,userid:_userinfo.userid}})
  .then(res=> {
    if (res.data.state.returnCode == 1) {
      wx.showToast({
        title: "加入购物车成功!",
        success: ()=> {
          this.setData({
            cartnum: res.data.data.Cart.CartUNM
          });
          wx.setStorage({
            key: 'cartnum',
            data: res.data.data.Cart.CartUNM,
          })
        }
      })
    } else {
      wx.showToast({
        title: res.data.state.error,
        icon: "none",
        duration: 3000
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  bindscrolltolower: function() {
    this.onReachBottom()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isHavvData === false) {
      return 
    }
    let num = this.data.pageIndex;
    num++;
    this.setData({
      pageIndex: num
     })
     this.getNavs(this.data.minPrice,this.data.maxPrice,this.data.pageIndex)
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function(res) {
  //   var luser = _base._getUser();
  //   console.log('luser.rsShopId',luser.rsShopId)
  //   if (luser)
  //     return {
  //       title: '凑单列表',
  //       imageUrl: this.data.productList[0].ImgUrl,
  //       path: '/pages/product/together/together?scene=' + luser.rsShopId
  //     }
  // },
})