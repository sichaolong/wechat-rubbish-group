// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV 
})
/**
 * 获取全部的垃圾分类数据
 * @param {} event 
 * @param {*} context 
 */

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
 

  return db.collection('rubbish_list').where({
    city_name: event.current_city
  }).get()






  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}