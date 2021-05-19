// const requestUrl = require('../../config').requestUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    searec_name: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var img_tet;
    var cid = wx.getStorageSync('cid')
    var that = this;

    //1. 用来标识源页面
    var from_page = options.from_age

    // 2. 接受图像识别结果的参数（提升作用域，也方便eventChannel传参)

    // 2.1 rid接受 图片、热词的垃圾类类别id
    var rid = options.rid

    // 2.2 接受热词、图片识别结果
    var se_name = options.se_name

    // 2.3  接受图片识别结果的垃圾类别
    var seah_name = options.seah_name


    // 3. eventChannel的方式页面传值（点图片、热词）
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('parentGiveDataToSon', function (data) {

      console.log(data)
      // 点击的分类id
      rid = data.id;

      // 识别物体名称
      se_name = data.se_name;

      // 分类名称
      seah_name = data.seah_name;

    })


    if (rid>=0) {

      // 4. 云函数获取当前城市垃圾信息（图片、热词）
      wx.cloud.callFunction({
        name: "getDetailInfo",
        data: {
          cid: parseInt(cid)
        }
      }).then(res => {
        console.log(res)

        // 点击图片，数据渲染
        if (!se_name) {
          se_name = '';
        }
        that.setData({
          content: res.result.data[0].rubbish_list[rid - 1],
          searec_name: se_name
        })

      }).catch(err => {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000
        })
      })
    }
    // 图像识别结果
    else {

      var new_rid = 1
      if (seah_name == '干垃圾' || seah_name == '其他垃圾') new_rid = 1
      else if (seah_name == '餐厨垃圾' || seah_name == '湿垃圾') new_rid = 2
      else if (seah_name == '可回收物') new_rid = 3
      else if (seah_name == '有害垃圾') new_rid = 4
      else new_rid = 1
      wx.cloud.callFunction({
        name: "getDetailInfo",
        data: {
          cid: parseInt(cid)
        }
      }).then(res => {
        console.log(res)


        that.setData({
          content: res.result.data[0].rubbish_list[new_rid - 1],
           searec_name: se_name
        })

      }).catch(err => {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000
        })
      })
    }




  },
  //跳转博客小程序
  changeJoeling() {
    wx.showToast({
      title: '待更新~',
      icon: 'none',
      duration: 2000
    })
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