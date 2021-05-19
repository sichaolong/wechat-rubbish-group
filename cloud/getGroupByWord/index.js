// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 获取全部的垃圾分类数据
 * @param {} event 
 * @param {*} context 
 */

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()


  return db.collection('rubbish_list').doc("97fb694660a494ee00e6dc585aa7c014"
  ).get()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}