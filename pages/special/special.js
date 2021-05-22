// const requestUrl = require('../../config').requestUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    spec_list: [
      {
        id: 1,
        name: '小龙虾',
        pic: 'xiaolongxia2.jpg'

      },
      {
        id: 2,
        name: '化妆品',
        pic: 'huazhuangpin.jpg'

      }],
    is_show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    var that = this
    wx.showLoading({
      title: '加载中',
    })

    
    wx.request({
      url: requestUrl + 'Rubbish/SpecialList',
      data: {
        
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result.length>0){
            wx.hideLoading()
            that.setData({
              spec_list: res.data.result
            })
          }else{
            that.setData({
              is_show:true
            })
            wx.showToast({
              title: '没有更多数据',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    */
  },
  bindNativeSpecial: function (e) {
    wx.navigateTo({
      url: '../special_detail/special_detail?id=' + e.currentTarget.dataset.sid,

      success: function (res) {
        // 通过eventChannel向被打开页面传送数据,id=1的情况
        // id=1小龙虾
        res.eventChannel.emit('parentGiveSpacialListToSon_id=1', {
          data: [
            {
              id: 1,
              name: '整只小龙虾',
              type: '湿垃圾（餐厨垃圾)',
              pic: 'xiaolongxia.jpg'
            },
            {
              id: 2,
              name: '龙虾壳',
              type: '干垃圾（其他垃圾)',
              pic: 'xiaolongxia.jpg'
            },
            {
              id: 3,
              name: '龙虾肉',
              type: '湿垃圾（餐厨垃圾）',
              pic: 'xiaolongxia.jpg'
            },
            {
              id: 4,
              name: '龙虾黄',
              type: '湿垃圾（餐厨垃圾）',
              pic: 'xiaolongxia.jpg'
            },
            {
              id: 5,
              name: '去头小龙虾',
              type: '干垃圾（其他垃圾）',
              pic: 'xiaolongxia.jpg'
            }]
        }),
          // id=2化妆品
          res.eventChannel.emit('parentGiveSpacialListToSon_id=2', {
            data: [
              {
                id: 1,
                name: '洗净的瓶子',
                type: '可回收垃圾',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 2,
                name: '卸妆棉',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 2,
                name: '化妆刷',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 2,
                name: '粉扑',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },

              {
                id: 3,
                name: '面膜纸',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 4,
                name: '假睫毛',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 4,
                name: '美瞳',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 4,
                name: '发圈',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },

              {
                id: 5,
                name: '口红',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 5,
                name: '眼影',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 5,
                name: '粉饼',
                type: '干垃圾(其他垃圾)',
                pic: 'huazhuangpin3.jpg'
              },

              {
                id: 6,
                name: '指甲油',
                type: '有害垃圾',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 7,
                name: '卸甲水',
                type: '有害垃圾',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 8,
                name: '染发剂、染发剂外壳',
                type: '有害垃圾',
                pic: 'huazhuangpin3.jpg'
              },
              {
                id: 9,
                name: '海藻面膜',
                type: '湿垃圾(厨余垃圾)',
                pic: 'huazhuangpin3.jpg'
              }


            ]
          })
      }
    })
  },
  //跳转博客小程序
  changeJoeling() {
    // wx.navigateToMiniProgram({
    //   appId: 'wxe1e103707cde65e5',
    //   path: 'pages/index/index',
    //   extraData: {
    //     foo: 'bar'
    //   },
    //   envVersion: 'develop',
    //   success(res) {
    //     // 打开成功
    //   }
    // })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '垃圾扔前分一分，绿色生活一百分，今天，你做到了吗？',
      path: '/pages/index/index',
      imageUrl: "/images/share.jpg"
    }
  }
})