<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
 //  setting: function() (){
	// const that = this;
 //    wx.login({
 //        //用户登录
 //        success(res) {
 //            console.log(res.code)
 //            if (res.code) {
 //                // 发起网络请求
 //                var code = res.code;
 //                wx.getSetting({
 //                    //查看用户是否授权
 //                    success(res) {
 //                        console.log(res)
 //                        if (res.authSetting['scope.userInfo']) {
 //                            //用户已经授权
 //                            wx.getUserInfo({
 //                              //获取用户信息
 //                                success: (res) => {
 //                                    console.log(res)
 //                                    res.userInfo.nickName    // 存起来用户昵称
 //                                    res.userInfo.avatarUrl   // 存起来用户头像
 //  								  uni.setStorage({         // 存起来授权状态
 //  								  	key: 'loginSwitch',
 //  									data: '1'
 //  								  })
 //  			                    },
 //  								fail(err) {
 //  									console.log(err)
 //  								}
 //                            })
 //                        }
 //                    }
 //                })
 //            }
 //        }
 //    })
 //   }
};
</script>

<style>
/*每个页面公共css */
view,
input,
scroll-view {
  box-sizing: border-box;
}
.textOverFlow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
switch {
  transform: scale(0.5);
}
radio{
	transform: scale(0.7);
	
}
.form-input-placeholder {
  color: #999999;
  font-size: 30rpx;
  text-align: right !important;
}
.form-input {
  width: 100%;
  height: 100%;
  text-align: right;
}
button{
	margin: 0;
	padding: 0;
	border: none !important;
}
</style>
