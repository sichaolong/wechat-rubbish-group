const imgUrl = require('../../config').imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: imgUrl +'/Public/uploads/rubbish'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindImage: function (event) {
    var imagesUrls = event.currentTarget.dataset.imgsurl;
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.openSetting({
            success: function (data) {
              wx.downloadFile({
                //需要下载的图片地址
                url: imagesUrls,
                success(res) {
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: function (res) {
                        wx.showToast({
                          title: '保存成功',
                        });
                        that.setData({
                          excode: false
                        })
                      },
                      fail: function (res) {
                        wx.showToast({
                          title: '保存失败',
                        });
                      }
                    });
                  }
                }
              });
            },
            fail: function (data) {
              console.log("openSetting: fail");
            }
          });
        } else {
          wx.downloadFile({
            //需要下载的图片地址
            url: imagesUrls,
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    wx.showToast({
                      title: '保存成功',
                    });
                    that.setData({
                      excode: false
                    })
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: '保存失败',
                    });
                  }
                });
              }
            }
          });
        }
      }
    })
  },
  //跳转博客小程序
  changeJoeling() {
    wx.showToast({
      title: '待更新~',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 用户点击右上角分享
   */
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