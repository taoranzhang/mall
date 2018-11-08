//app.js
App({
  onLaunch: function () {
    var that = this;
    //  设置商城名称
    wx.setStorageSync('mallName', "精选仓");
    this.login();
  },
  login : function () {
    var that = this;
    var token = that.globalData.token;
    if (token) {
      return;
    }
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://www.aigeming.com/login?',
          data: {
            code: res.code
          },
          success: function(res) {
            console.log("shiqi.debug:", res)
            console.log("shiqi.debug code:", res.data.errcode)
            if (res.data.errcode == 10000) {
              // 去注册  (暂时没有实现)
              that.registerUser();
              return;
            }
            if (res.data.errcode != 1000) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel:false
              })
              return;
            }
            that.globalData.token = res.data.access_token;
          }
        })
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/wxapp/register/complex',
              data: {code:code,encryptedData:encryptedData,iv:iv}, // 设置请求的 参数
              success: (res) =>{
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  },
  globalData:{
    userInfo:null,
    subDomain:"mall"
  }
})