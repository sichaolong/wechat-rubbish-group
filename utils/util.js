// const requestUrl = require('../config').requestUrl
var QQMapWX = require('./qqmap-wx-jssdk.js');
var qqmapsdk;
//1. 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/*
const rubbishCity = function (cid, type, event) {
  按照城市名查详细信息
  if (type == 'name') {
    wx.request({
      url: requestUrl + 'Rubbish/City',
      data: {
        name: cid
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result) {
            wx.setStorageSync('city_fenlei', res.data.result.rubbish_list)
            return event(res.data.result);
          } else {
            wx.showToast({
              title: '网络异常',
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
  }
}
*/



/*
   wx.request({
     url: requestUrl + 'Rubbish/City',
     data: {
       id: cid
     },
     
     success(res) {
       if (res.data.status == 0) {
         if (res.data.result) {
           wx.setStorageSync('city_fenlei', res.data.result.rubbish_list)
           return event(res.data.result);
         } else {
           wx.showToast({
             title: '网络异常',
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
 }
 */

//2. 根据坐标获取位置信息
const getLocal = function (latitude, longitude, event) {
  qqmapsdk = new QQMapWX({
    key: 'AUGBZ-BZBWR-6U7WT-W4T6E-QLPFO-FLF2V'
  });
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },

    success: function (res) {
      let city = res.result.ad_info.city

      return event(city)
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
// 3. 格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//4. 获取access_token
const getAccessToken = function () {
  return new Promise((resolve, reject) => {
    // 1. 获取access token
    var API_KEY = 'khxI6thr4Iv7HLYOCqSRqUWM'
    var SECRET_KEY = 'U9cG8ICR3gQtrbMuPtDGOgNzWZTLmAxc'
    var URL = 'https://aip.baidubce.com/oauth/2.0/token'
    wx.request({
      url: URL,
      data: {
        grant_type: "client_credentials",
        client_id: API_KEY,
        client_secret: SECRET_KEY
      },
      dataType: "json",
      method: "GET",
      success: (result) => {
        console.log(result)

        wx.setStorageSync('access_token', result.data.access_token)
      },

      fail: function (res) {
       
        wx.showToast({
          title: '网络错误，请重试！',
          icon: 'none',
          duration: 2000
        })
        reject(res);
      },
      complete: function (res) {
        resolve(res);
      }
    })
  })
}

//5. 访问api

const askApiUrl = function (img_base){
  return new Promise((resolve, reject) => {
    // 2. 访问api
    var API_URL = 'https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination?access_token='

    wx.request({
      url: API_URL + wx.getStorageSync('access_token'),
      // access_token:,
      data: {
        image: img_base,
        scenes: ['advanced_general']
      },
      header: {
        'Content-Type': 'application/json;charset=utf-8' // 默认值
      },
      dataType: "json",
      method: "POST",
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (res) {
       
        wx.showToast({
          title: '网络错误，请重试！',
          icon: 'none',
          duration: 2000
        })
        reject(res);
      },
      complete: function (res) {
        resolve(res);
      }
    })
  })
}

//6. 云数据库下载图片

const downloadImgs = function(fileId){

  return new Promise((resolve, reject) => {
    // 2. 访问api
    var API_URL = 'https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination?access_token='

    wx.request({
      url: API_URL + wx.getStorageSync('access_token'),
      // access_token:,
      data: {
        image: img_base,
        scenes: ['advanced_general']
      },
      header: {
        'Content-Type': 'application/json;charset=utf-8' // 默认值
      },
      dataType: "json",
      method: "POST",
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (res) {
       
        wx.showToast({
          title: '网络错误，请重试！',
          icon: 'none',
          duration: 2000
        })
        reject(res);
      },
      complete: function (res) {
        resolve(res);
      }
    })
  })

}
module.exports = {
  formatTime: formatTime,
  getLocal: getLocal,
  getAccessToken: getAccessToken,
  askApiUrl:askApiUrl
}
