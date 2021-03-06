// const requestUrl = require('../../config').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cid = wx.getStorageSync('cid');
    if (!cid) {
      cid = 2
    }
    var that = this;
    wx.cloud.callFunction({
      name: "getAllCitys"
    }).then(res => {
      console.log(res)
      if (res) {
        if (res.result.data) {
          var newcityList = [];
          for (var i = 0; i < res.result.data.length; i++) {
            if (cid == res.result.data[i].id) {
              newcityList[i] = {
                "name": res.result.data[i].name,
                "id": res.result.data[i].id,
                "is_show": true
              };
            } else {
              newcityList[i] = {
                "name": res.result.data[i].name,
                "id": res.result.data[i].id,
                "is_show": false
              };
            }
          }
          that.setData({
            city_list: newcityList
          })
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../index/index'
            })
          }, 1000)
        }
      } else {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../index/index'
          })
        }, 1000)
      }

    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../index/index'
        })
      }, 1000)

    })


  },
  bindNativeCity: function (e) {
    const cid = e.currentTarget.dataset.cid
    console.log(cid)
    var newcityList = [];
    for (var i = 0; i < this.data.city_list.length; i++) {
      if (cid == this.data.city_list[i].id) {
        newcityList[i] = {
          "name": this.data.city_list[i].name,
          "id": this.data.city_list[i].id,
          "is_show": true
        };
      } else {
        newcityList[i] = {
          "name": this.data.city_list[i].name,
          "id": this.data.city_list[i].id,
          "is_show": false
        };
      }
    }
    this.setData({
      city_list: newcityList
    });
    wx.setStorageSync('cid', cid)
    // 清除缓存
    wx.setStorageSync('rubbish_list_cache', null)
    

  },

  // 重新获得当前城市
  reGetCurrentCity() {
    wx.setStorageSync('cid', "")
    wx.switchTab({
      url: '../index/index',
    })
    // 刷新城市列表
   this.onLoad()

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
  //分享
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