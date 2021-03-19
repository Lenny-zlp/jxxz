// pages/order/commentList/commentList.js
import { request } from '../../until/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    ordercode:'',
    detail: null,
    tabs: [
      {
        id: 0,
        value: "待评价",
        isActive: true,
        active:true,
        totalCount:0
      },
      {
        id: 1,
        value: "已评价",
        isActive: false,
        active:false
      }
    ],
    commentList:[],//待评价数组
    commentedList:[],//已评价数组
    pageIndex:1,// 第几页
    pageIndex1:1,// 第几页
    flag:true,
    flag1:true,
    bigImgs:[],//放大图片数组
    index:0,
    isbotline: false
  },

  closeBigimg: function() {
    this.setData({
      show: false
    })
  },
  showbigimg: function(e) {
    let {imgs,index} = e.currentTarget.dataset
    let bigImgs = imgs.map((v)=> {
      return {url:v.bigimg}
    })
    this.setData({
      bigImgs,
      index,
      current:index,
      show: true 
    })
  },
  touchSwiper:function(e){
   if(e.detail.source=='touch'){
     this.setData({ current: e.detail.current})
   }
  },

  // // 图片点击放大事件
  // showPopup(e) {
  //     let {imgs,index} = e.currentTarget.dataset
  //     let bigImgs = imgs.map((v)=> {
  //       return {url:v.bigimg}
  //     })
  //     this.setData({
  //       bigImgs,
  //       index,
  //       show: true 
  //     })
  // },

  onClose() {
    this.setData({ show: false });
  },

  // // z图片左右滑动事件
  // touchStart: function (e) {
  //   if (e.touches.length == 1) {
  //     this.setData({
  //       startX: e.touches[0].clientX
  //     });
  //   }
  // },
  // touchEnd: function (e) {
  //   if (e.changedTouches.length == 1) {
  //     var endX = e.changedTouches[0].clientX;
  //     var diffX = this.data.startX - endX;
  //     let index = this.data.index
  //     const length = this.data.bigImgs.length
  //     if (diffX < -10) {
  //       index--
  //       if(index < 0) {
  //         index=0
  //         return
  //       }
  //       this.setData({index})
  //     } else if (diffX > 10) {
  //       index++
  //       if(index==length) {
  //         return
  //       }
  //       this.setData({index})
  //     }else{
  //       this.setData({ show: false });
  //     }
  //   }
  // },

// 标题点击事件
handleItemTap(e) {
  const {index} = e.currentTarget.dataset;
  let {tabs} = this.data;
  tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
  this.setData({
    tabs
  })
},
 /**去评论 */
 to_reviews: function(e) {
   const {commentitem} = e.currentTarget.dataset
  wx.navigateTo({
    url: '/pages/order/comment/comment?detail='+ JSON.stringify(commentitem)// 需要传点击时的单数据
  })

},
// 获取待评价数据
  getcommentList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/Product/GetReCommentForUser',data:{userId:userid,pageIndex:this.data.pageIndex}})
    .then(res=> {
      const { detailList,totalCount } = res.data.data;
      this.data.tabs.forEach(function(item,i) {
        if(item.id==0) {
          item.totalCount=totalCount
        }
      })
      let tabs = this.data.tabs
      this.setData({
        tabs
      })
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
  // 获取已评价数据
  getcommentedList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/Product/GetCommentedForUser',data:{userId:userid,pageIndex:this.data.pageIndex1}})
    .then(res=> {
      let { CommentList } = res.data.data;
      CommentList.map((v,i)=> {
        v.starArr = this.starsArray(v.commentlevel)
      })
      if(CommentList.length === 0) {
        this.setData({
          flag1:false,
          isbotline: true
        })
        return
      }
      this.setData({
        commentedList: [...this.data.commentedList, ...CommentList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },

  //  跳转详情页
  goDetail(event) {
    wx.navigateTo({
      url: '/pages/product/product?sku=' + event.currentTarget.dataset.sku
    });
      
  },
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
  },
  // 评价完成后返回调用函数
  loadData() {
    this.setData({
      commentList:[],
      commentedList:[],
      pageIndex: 1,
      pageIndex1: 1,
      flag: true,
      flag1: true
    })
    this.getcommentList();
    this.getcommentedList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcommentList();
    this.getcommentedList()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.setData({
      commentList:[],
      commentedList:[],
      pageIndex: 1,
      pageIndex1: 1,
      flag:true,
      flag1:true
    })
    this.getcommentList();
    this.getcommentedList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.tabs[0].isActive) {
      if(this.data.flag===false) {
      return 
    }
    let num = this.data.pageIndex;
    num++;
    this.setData({
      pageIndex: num
     })
    this.getcommentList();
    }

    if (this.data.tabs[1].isActive) {
      if(this.data.flag1===false) {
        return 
      }
      let num = this.data.pageIndex1;
      num++;
      this.setData({
        pageIndex1: num
       })
      this.getcommentedList()
    }

    // if(this.data.flag===false) {
    //   return 
    // }
    // let num = this.data.pageIndex;
    // num++;
    // this.setData({
    //   pageIndex: num
    //  })
    // this.getcommentList();
    // this.getcommentedList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})