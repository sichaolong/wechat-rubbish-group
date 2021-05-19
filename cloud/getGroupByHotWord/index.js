// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 获取热值列表
 * @param {*} event 
 * @param {*} context 
 */

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
 
  return db.collection('hot_search_list').where({
    name: event.se_name
  }).get()


  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}