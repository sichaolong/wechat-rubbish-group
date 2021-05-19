// const requestUrl = require('../../config').requestUrl
const recorderManager = wx.getRecorderManager()


var utils = require('../../utils/util.js');
Page({
  data: {
    audios: {
      'img': 'voice',
      'name': '语音查询'
    }, //录音图标
    hot_list: '',
    is_show: false,
    detail: '',
    seah_name: '',
    is_clock: false,
    keywords: '',
    width: '320',
    bar_height: '26',
    bto_height: '58',
    height: '32',
    rubbish_list: [{
      "name": "干垃圾",
      "name_sx": "glj",
      "desc": "是指除可回收物、有害垃圾、厨余（餐厨）垃圾以外的其它生活废弃物。包括砖瓦陶瓷、普通一次性电池（碱性电池）、受污染的一次性餐盒、卫生间废纸等。"
    }, {
      "name": "湿垃圾",
      "name_sx": "slj",
      "desc": "是指餐饮垃圾、厨余垃圾及废弃食用油脂和集贸市场有机垃圾等易腐蚀性垃圾，包括废弃的食品、蔬菜、瓜果皮核以及家庭产生的花草、落叶等。"
    }, {
      "name": "可回收物",
      "name_sx": "khsw",
      "desc": "是指适宜回收和资源化利用的生活垃圾，包括纸类、塑料、金属、玻璃、木料和织物。"
    },
    {
      "name": "有害垃圾",
      "name_sx": "yhlj",
      "desc": "是指对人体健康或者自然环境造成直接或潜在危害的生活垃圾，包括废电池、废弃药品、废杀虫剂、废水银产品等。"
    }
    ],
    name: "上海"
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取缓存中的城市id
    var cid = wx.getStorageSync('cid');

    console.log(cid)
    //如果城市id不存在则要发起定位授权请求
    if (!cid) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            wx.showModal({
              title: '“垃圾分类引导指南”需要获取你的地理位置',
              content: '你的位置信息将用于垃圾分类城市区分',
              success: function (data) {
                if (data.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
                  //授权失败，默认上海
                  wx.setStorageSync('cid', '2')
                } else if (data.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                        //授权失败，默认上海
                        wx.setStorageSync('cid', '2')
                        //获取默认城市数据,直接查询云数据库
                        wx.cloud.database().collection("citys").where({
                          name: '上海'
                        }).get().then(res => {
                          that.setData({
                            name: res.data[0].name,
                            rubbish_list: res.data[0].rubbish_list
                          })
                        }).catch(err => {
                          console.log(err)
                          wx.showToast({
                            title: '网络错误！',
                            icon: 'none',
                            duration: 3000
                          })

                        })



                      }
                    }
                  })
                }
              }
            })
          }
          else {
            //进行定位
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                //定位成功后获取城市名并获取城市分类数据
                utils.getLocal(res.latitude, res.longitude, function (events) {
                  console.log(events)
                  //获取城市数据,直接查询云数据库
                  wx.cloud.database().collection("citys").where({
                    citys: events.substring(0, events.length - 1)
                  }).get().then(res => {

                    console.log(res)
                    // 当前城市未开放
                    if (res.data.length == 0) {
                      wx.showToast({
                        title: '当前城市【' + events.substring(0, events.length - 1) + '】暂未开放数据,敬请期待~',
                        icon: 'none',
                        duration: 3000
                      })
                      wx.setStorageSync('cid', '2')
                      //获取默认城市数据,直接查询云数据库
                      wx.cloud.database().collection("citys").where({
                        name: "上海"
                      }).get().then(res => {
                        that.setData({
                          name: res.data[0].name,
                          rubbish_list: res.data[0].rubbish_list
                        })
                      }).catch(err => {
                        console.log(err)
                        wx.showToast({
                          title: '网络错误！',
                          icon: 'none',
                          duration: 3000
                        })

                      })


                    }
                    else {
                      wx.setStorageSync('cid', res.data[0].id)
                      that.setData({
                        name: res.data[0].name,
                        rubbish_list: res.data[0].rubbish_list
                      })
                    }
                    // 出错，
                  }).catch(err => {
                    console.log(err)
                    wx.showToast({
                      title: '网络错误！',
                      icon: 'none',
                      duration: 3000
                    })

                  })
                })
              },
              fail() {
                wx.showToast({
                  title: '网络错误~定位失败！',
                  icon: 'none',
                  duration: 3000
                })
              }
            })

          }

        },
        fail() {
          wx.showToast({
            title: '网络错误~定位失败！',
            icon: 'none',
            duration: 3000
          })
        }


      })

    }
    else {
      // 直接根据id查城市，调用云函数
      // 云函数
      var cid_int = parseInt(wx.getStorageSync('cid'))
      console.log(cid)
      wx.cloud.callFunction({
        name: 'getDetailInfo',
        data: {
          cid: cid_int
        },
      }).then(res => {
        console.log(res)
        that.setData({
          name: res.result.data[0].name,
          rubbish_list: res.result.data[0].rubbish_list
        })

      }).catch(err => {

        console.log(err)
      })
    }
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.statusBarHeight
        })
      },
    })


    //加载搜索热词

    wx.cloud.database().collection("hot_search_list").where({}).get().then(res => {
      console.log(res)
      that.setData({
        hot_list: res.data
      })

    }).catch(err => {
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 2000
      })
    })

    /*
    wx.request({
      url: requestUrl + 'Rubbish/hots',
      data: {

      },
      success(res) {
        if (res.data.status == 0) {
          that.setData({
            hot_list: res.data.result
          })
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
    //对停止录音进行监控
    recorderManager.onStop((res) => {
      //此时先判断是否需要发送录音
      if (that.data.is_clock == true) {
        //对录音时长进行判断，少于2s的不进行发送，并做出提示
        if (res.duration < 2000) {
          wx.showToast({
            title: '录音时间太短，请长按录音',
            icon: 'none',
            duration: 1000
          })
        } else {
          const {
            tempFilePath
          } = res;
          wx.showLoading({
            title: '语音检索中',
          })
          //上传录制的音频
          wx.uploadFile({
            url: requestUrl + 'Rubbish/Voice',
            filePath: tempFilePath,
            name: 'voice',
            formData: {
              cid: wx.getStorageSync('cid')
            },
            success: function (event) {
              var datas = JSON.parse(event.data);
              if (datas.status == 0) {
                wx.hideLoading()
                if (datas.result.list.length > 0) {
                  that.setData({
                    is_show: true,
                    detail: datas.result.list,
                    seah_name: datas.result.voice,
                    keywords: datas.result.voice
                  })
                } else {
                  wx.showToast({
                    title: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                    icon: 'none',
                    duration: 2000
                  })
                }
              } else {
                wx.showToast({
                  title: datas.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '录音已取消',
          icon: 'none',
          duration: 2000
        })
      }
    })
    //监控录音异常情况
    recorderManager.onError((res) => {
      if (res['errMsg'] != 'operateRecorder:fail recorder not start') {
        wx.showModal({
          title: '你拒绝使用录音功能，语音识别功能将无法正常使用',
          content: '是否重新授权使用你的录音功能',
          success: function (data) {
            if (data.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (data.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.record"] != true) {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  } else {
                    wx.showToast({
                      title: '授权成功，请长按录音',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  //点击切换城市
  bindLocation: function () {
    this.setData({
      is_show: false,
      keywords: ''
    })
    wx.navigateTo({
      url: '../location/location'
    })
  },
  //热词点击事件
  bindNameDeatail: function (e) {
    /*
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.rid + '&se_name=' + e.currentTarget.dataset.se_name + '&seah_name=' + e.currentTarget.dataset.seah_name
    })
    */
    wx.navigateTo({
      url: '../detail/detail',
      success: function (res) {
        // 通过eventChannel像跳转的页面传参数
        res.eventChannel.emit('parentGiveDataToSon', {
          id: e.currentTarget.dataset.rid,
          se_name: e.currentTarget.dataset.se_name,
          seah_name: e.currentTarget.dataset.seah_name

        })
      }
    })
  },
  //跳转图谱页
  bindDownLoad: function () {
    this.setData({
      is_show: false,
      keywords: ''
    })
    wx.navigateTo({
      url: '../download/download'
    })
  },
  //搜索框
  bindReplaceInput: function (e) {
    this.setData({
      is_show: false
    })
    var keywords = e.detail.value;
    if (keywords) {
      var that = this;
      wx.request({
        url: requestUrl + 'Rubbish/search',
        data: {
          keywords: keywords,
          cid: wx.getStorageSync('cid')
        },
        success(res) {
          if (res.data.status == 0) {
            that.setData({
              detail: ''
            })
            if (res.data.result.length > 0) {
              that.setData({
                is_show: true,
                detail: res.data.result,
                seah_name: keywords
              })
            } else {
              wx.showToast({
                title: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                icon: 'none',
                duration: 1000
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
    } else {
      this.setData({
        is_show: false
      })
    }
  },
  //拍照识别
  bindImageSerach: function () {
    this.setData({
      is_show: false
    })
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '上传检索中',
        })
        // 1. 暂时文件地址
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        // 2. base64格式
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: "base64",
          success: function (data) {
            console.log(data.data)
            wx.setStorageSync('img_base', data.data)
          }
        })
        // 3. 照片后缀,用于上传云存储，暂时不用
        var arr = tempFilePaths[0].split(".")

        // 4. 获取token
        utils.getAccessToken().then(res => {
          console.log(res)

          // 5. 访问接口
          utils.askApiUrl(wx.getStorageSync('img_base')).then(res => {
            console.log(res)
            // 6. 数据渲染 ,根据名字查询垃圾的类
            wx.hideLoading()
            if (res.data.result.advanced_general.result) {
              if (res.data.result.advanced_general.result.length > 0) {
                that.setData({
                  is_show: true,
                  detail: res.data.result.advanced_general.result,
                  seah_name: ''
                })

                // 7. 根据名字查垃圾的类别


                // 0. 取出来key存储到words

                var words = new Array()
                res.data.result.advanced_general.result.forEach((item, index, array) => {
                  words.push(item.keyword)

                })

                // 1. kinds数组存储结果

                var kinds = new Array()

                // 2. 云函数查询整个记录

                // 有缓存
                if (wx.getStorageSync('rubbish_list_cache')) {
                  var rubbish_list_cache = wx.getStorageSync('rubbish_list_cache')
                  for (var i = 0; i < words.length; i++) {
                    // 是否找到分类
                    var flag = false
                    //console.log(words[i])
                    rubbish_list_cache.forEach((item, index, array) => {
                      //执行代码
                      if (item.name == words[i]) {

                        kinds.push(item.kind)

                        flag = true
                      }
                    })
                    if (flag == false) {
                      kinds.push("待更新分类...")
                    }
                  }

                  that.setData({

                    seah_name: kinds
                  })

                }
                //无缓存
                else {


                  wx.cloud.callFunction({
                    name: "getGroupByWord",

                  }).then(res => {
                    console.log(res)

                    if (res.result.data.data.length != 0) {
                      wx.setStorageSync('rubbish_list_cache', res.result.data.data)
                      console.log(wx.getStorageSync('rubbish_list_cache'))
                      for (i = 0; i < words.length; i++) {
                        // 是否找到分类
                        var flag = false
                        //console.log(words[i])
                        res.result.data.data.forEach((item, index, array) => {
                          //执行代码
                          if (item.name == words[i]) {
                            kinds.push(item.kind)
                            flag = true
                          }
                        })
                        if (flag == false) {
                          kinds.push("待更新分类...")
                        }
                      }
                      console.log(kinds)

                      that.setData({

                        seah_name: kinds
                      })






                    }


                  }).catch(err => {
                    console.log(err)
                    wx.showToast({
                      title: '网络错误~',
                      icon: 'none',
                      duration: 2000
                    })
                  })
                }


                console.log(words)
                console.log(kinds)


              } else {
                wx.showToast({
                  title: '如此聪明伶俐的我居然会词穷~',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else {
              wx.showToast({
                title: '如此聪明伶俐的我居然会词穷~',
                icon: 'none',
                duration: 2000
              })
            }

          }).catch(err => {
            console.log(err)



            wx.showToast({
              title: '网络出错~',
              icon: 'none',
              duration: 2000
            })
          })

        }).catch(err => {

          console.log(err)

          wx.showToast({
            title: '网络出错~',
            icon: 'none',
            duration: 2000
          })
        })


      }
    })
  },
  startRecord() {
    wx.showToast({
      title: '请长按录音',
      icon: 'none',
      duration: 1000
    })
  },
  //语音识别 开始录音
  handleRecordStart(e) {
    this.setData({
      is_clock: true, //长按时应设置为true，为可发送状态
      startPoint: e.touches[0], //记录触摸点的坐标信息
      audios: {
        'img': 'stop',
        'name': '录音中'
      },
      is_show: false
    })
    //录音参数
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    }
    //开启录音
    recorderManager.start(options);
    wx.showToast({
      title: '正在录音，往下滑动取消发送',
      icon: 'none',
      duration: 10000
    })
  },
  //停止录音
  handleRecordStop() {
    wx.hideToast(); //结束录音、隐藏Toast提示框
    this.setData({
      audios: {
        'img': 'voice',
        'name': '语音查询'
      }
    })
    recorderManager.stop() //结束录音
  },
  //滑动取消发送
  handleTouchMove: function (e) {
    //计算距离，当滑动的垂直距离大于25时，则取消发送语音
    if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY) > 35) {
      wx.showToast({
        title: "松开手指,取消发送",
        icon: "none",
        duration: 10000
      });
      this.setData({
        is_clock: false //设置为不发送语音
      })
    } else {
      wx.showToast({
        title: '正在录音，往下滑动取消发送',
        icon: 'none',
        duration: 10000
      })
      this.setData({
        is_clock: true
      })
    }
  },
  //分类跳转
  changeDetail: function (e) {
    // rid是当前垃圾种类，1,2,3,4
    wx.navigateTo({
      url: '../detail/detail',
      success: function (res) {
        // 通过eventChannel像跳转的页面传参数
        res.eventChannel.emit('parentGiveDataToSon', {
          id: e.currentTarget.dataset.rid,
          
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