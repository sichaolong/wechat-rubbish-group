// const imgUrl = require('../../config').imgUrl
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

    // 这里直接弹窗请求权限，防止bug
    wx.saveImageToPhotosAlbum({})

  },
  bindImage: function (event) {
    var imgName = event.currentTarget.dataset.img_name;
    console.log(imgName)
    var that = this
    // 保存权限

    wx.getSetting({
      success(res) {
        console.log(res)

        // 没有保存的权限
        if (res.authSetting['scope.writePhotosAlbum'] == undefined || res.authSetting['scope.writePhotosAlbum'] == false) {
          wx.saveImageToPhotosAlbum({})

          wx.openSetting({
            success: function (data) {

              wx.showLoading({
                title: '正在下载...',

              }),
                wx.cloud.downloadFile({
                  fileID: 'cloud://xiaosi-9gxqthab24fc8322.7869-xiaosi-9gxqthab24fc8322-1305869883/download_imgs/' + imgName
                }).then(res => {
                  console.log(res)
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (res) {
                      // 取消loading
                      wx.hideLoading({
                        success: (res) => {
                          wx.showToast({
                            title: '保存成功',
                          });
                          that.setData({
                            excode: false
                          })
                        },
                      })


                    },
                    fail: function (res) {
                      wx.hideLoading({
                        success: (res) => {
                          wx.showToast({
                            title: '保存失败',
                          });
                        },
                      })

                    }
                  });
                }).catch(err => {
                  console.log(err)
                  wx.showToast({
                    title: '保存失败',
                  });
                })
            },
            fail: function (data) {
              console.log("openSetting: fail");
            }
          });
        } else {

          wx.showLoading({
            title: '正在下载...',

          }),
            wx.cloud.downloadFile({
              fileID: 'cloud://xiaosi-9gxqthab24fc8322.7869-xiaosi-9gxqthab24fc8322-1305869883/download_imgs/' + imgName
            }).then(res => {
              console.log(res)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {

                  // 取消loading
                  wx.hideLoading({
                    success: (res) => {

                    },

                  })
                  wx.showToast({
                    title: '保存成功',
                  });
                  that.setData({
                    excode: false
                  })

                },
                fail: function (res) {
                  wx.hideLoading({
                    success: (res) => {

                    },
                  })
                  wx.showToast({
                    title: '保存失败',
                  });
                }
              });
            }).catch(err => {
              console.log(err)
              wx.showToast({
                title: '网络错误！保存失败',
              });
            })

          /*
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
          */
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