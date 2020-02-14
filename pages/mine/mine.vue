<template>
	<view class="mine">
		<view class="topContent">
			<view class="myMsg">
				<view class="myContainer">
					<view class=""><image class="myPhoto" :src="userImg"></image></view>
					<view class="login" v-if="!show" @click="openLogin"><view class="logintext">登录</view></view>
					<view class="detail" v-if="show">
						<view class="detailTop">
							<view class="myName">{{ userName }}</view>
							<view class="myLevel">
								<image class="levelIcon" src="../../static/queen.png"></image>
								<view class="levelText">LV{{ level }}</view>
							</view>
						</view>
						<view class="detailBottom">邀请码: {{ inviCode }}</view>
					</view>
				</view>
			</view>
			<view class="emptyBackground"></view>
			<view class="houseTotalMsg">
				<view class="leftMsg">
					<view class="leftMsgTitle">剩余天数</view>
					<view class="leftMsgValue">{{ remainDay }}</view>
					<view class="leftMsgDate">{{ trialDate }}到期</view>
				</view>
				<view class="line"></view>
				<view class="rightMsg">
					<view class="rightMsgTitle">房号容量</view>
					<view class="rightMsgValue">{{ roomNum }}</view>
				</view>
			</view>
		</view>
		<view class="jumpPortal">
			<view class="jumpPortalitem" @click="openNewsInvitationCode">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon1.png" mode=""></image>
					<view class="jumpPortalText">填写邀请码</view>
					<view class="modalNum">{{ usedInviCode ? usedInviCode : 0}}</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/telphone.png" mode=""></image>
					<view class="jumpPortalText">手机号</view>
				</view>
				<view class="rightPart">
					<button class="getTelNumImg" open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"></button>
					<view class="getTelNum" v-if="false">已绑定 {{ phoneNumber }}</view>
				</view>
			</view>
			<view class="jumpPortalitem">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon5.png" mode=""></image>
					<view class="jumpPortalText">邀请好友</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem" @click="openFeedBack">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon2.png" mode=""></image>
					<view class="jumpPortalText">意见反馈</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem" @click="openHelp">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon3.png" mode=""></image>
					<view class="jumpPortalText">帮助</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem" @click="openAboutUs">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon4.png" mode=""></image>
					<view class="jumpPortalText">关于收租鸟</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
		</view>
		<!-- 填写邀请码弹窗 -->
		<view class="modal" v-show="invitationCodeFlag" @click="cancle"></view>
		<view class="modalBox" v-show="invitationCodeFlag">
			<view class="modalTitle">填写邀请码</view>
			<view class="modalContent">
				<view class="modalInput">
					<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
						<evan-form-item prop="invitationCode">
							<template v-slot:main>
								<input type="text" value="" maxlength="4" v-model="info.invitationCode" placeholder="请输入邀请码" style="font-size: 30rpx;" />
							</template>
						</evan-form-item>
					</evan-form>
					<view class="reminder">
						<view class="reminderSymbol">!</view>
						<view class="reminderText">邀请码仅填写一次</view>
					</view>
				</view>
				<view class="button">
					<view class="btn_cancle" @click="cancle" data-statu="close">取消</view>
					<view class="modalLine"></view>
					<view class="btn_ok active" @click="submit" data-statu="open">确定</view>
				</view>
			</view>
		</view>
		<!-- 授权弹窗 -->
		<is-login v-show="loginFlag" v-on:ffffff="ffffff" :childLoginFlag="loginFlag" v-on:childByValue="childByValue"></is-login>
		<view class="isloginModal" v-show="loginFlag" @click="cancleLogin"></view>
		<!-- <view class="isloginBox" v-show="loginFlag">
			<image class="bgcImg" src="../../static/authorization.png" mode=""></image>
			<view class="deleteImg" @click="cancleLogin"><image src="../../static/delete.png" mode=""></image></view>
			<view class="loginTxt">授权登录体验完整功能</view>
			<view class="loginImg">
				<view class="notLogin" @click="cancleLogin"><image src="../../static/notLogin.png" mode=""></image></view>
				<button class="loginButton" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true"></button>
			</view>
		</view> -->
	</view>
</template>

<script>
import evanFormItem from '../../components/evan-form/evan-form-item.vue';
import evanForm from '../../components/evan-form/evan-form.vue';
import { mapState, mapMutations } from 'vuex';
import { isLogin } from '../../components/isLogin.vue';
export default {
	components: {
		evanFormItem,
		evanForm,
		'is-login': isLogin
	},
	data() {
		return {
			invitationCodeFlag: false, // 是否显示填写邀请码弹窗
			loginFlag: false, //登录弹窗
			userImg: '../../static/tourist.png', //用户头像
			userName: '游客', //用户昵称
			gender: '', //用户性别
			openId: '',
			show: false, //是否显示点击登录
			roomNum: '0',
			inviCode: '', // 我的邀请码
			usedInviCode: '', //填写邀请码
			level: '',
			// landladyInfo: {},
			remainDay: '0', //剩余天数
			trialDate: '2030-01-01',
			phoneNumber: '17521774352', // 绑定手机号
			info: {
				invitationCode: ''
			},
			rules: {
				invitationCode: {
					required: true,
					message: '请填写邀请码'
				}
			},
			loginingStatus: false //登录状态
		};
	},
	computed: {
		...mapState(['landladyInfo'])
	},
	onLoad(options) {
		this.$nextTick(() => {
			this.$refs.form.setRules(this.rules);
		});
		if (this.$store.state.isloginStatus) {
			// 获取数据
			this.show = true;
			let userInfo = {
				openId: this.$store.state.userOpenId,
				userName: this.$store.state.landladyInfo.userName,
				userImg: this.$store.state.landladyInfo.userImg,
				userSex: this.$store.state.landladyInfo.userSex
			};
			console.log(userInfo);
			this.getMineMsg(userInfo);
		} else {
			this.show = false;
		}
	},
	onShow() {
		// 查看是否已经授权
		if (this.$store.state.isloginStatus) {
			// 获取数据
			this.show = true;
			let userInfo = {
				openId: this.$store.state.userOpenId,
				userName: this.$store.state.landladyInfo.userName,
				userImg: this.$store.state.landladyInfo.userImg,
				userSex: this.$store.state.landladyInfo.userSex
			};
			this.getMineMsg(userInfo);
		} else {
			this.show = false;
		}
	},
	methods: {
		ffffff(value){
			console.log(value);
			this.loginFlag = value;
			this.show = true;
			this.getMineMsg({openId:this.$store.state.userOpenId});
			
		},
		childByValue(childValue) {
			console.log(childValue);
			this.loginFlag = childValue;
			this.getMineMsg({openId:this.$store.state.userOpenId});
		},
		// getUserInfo() {
		// 	this.loginFlag = false;
		// 	console.log(11111);
		// 	let self = this;
		// 	uni.login({
		// 		provider: 'weixin',
		// 		success: function(loginRes) {
		// 			console.log(loginRes, '1111');
		// 			uni.checkSession({
		// 				success() {
		// 					// session_key 未过期，并且在本生命周期一直有效
		// 					self.$store.commit('openCode', loginRes.code);
		// 					self.$request.post('/wx/login', { code: loginRes.code }).then(res => {
		// 						console.log(res);
		// 						if (res) {
		// 							self.openId = res.data.data.openid;
		// 							self.$store.commit('isloginStatus', true);
		// 							self.$store.commit('userOpenId', res.data.data.openid);
		// 							self.$store.commit('sessionKey', res.data.data.session_key);
		// 							uni.getUserInfo({
		// 								provider: 'weixin',
		// 								success: function(infoRes) {
		// 									if (infoRes.userInfo) {
		// 										self.show = true;
		// 										// 微信的gender 1 男 2 女 0 未知
		// 										// 收租鸟userSex 0 男 1 女
		// 										if (infoRes.userInfo.gender == '1') {
		// 											self.gender = '0';
		// 										} else if (infoRes.userInfo.gender == '2') {
		// 											self.gender = '1';
		// 										} else {
		// 											self.gender = '未知';
		// 										}
		// 										let userInfo = {
		// 											openId: res.data.data.openid,
		// 											userName: infoRes.userInfo.nickName,
		// 											userImg: infoRes.userInfo.avatarUrl,
		// 											userSex: self.gender
		// 										};
		// 										self.getMineMsg(userInfo);

		// 										console.log(infoRes);
		// 									}
		// 								},
		// 								fail: function(res) {
		// 									uni.showToast({
		// 										title: '微信授权不成功！',
		// 										duration: 2000
		// 									});
		// 								}
		// 							});
		// 						}
		// 					});
		// 				},
		// 				fail() {
		// 					// session_key 已经失效，需要重新执行登录流程
		// 					uni.login({
		// 						provider: 'weixin',
		// 						success: function(loginRes) {
		// 							self.$request.post('/wx/login', { code: loginRes.code }).then(res => {
		// 								console.log(res);
		// 							});
		// 						}
		// 					}); // 重新登录
		// 				}
		// 			});
		// 		},
		// 		fail: function(res) {}
		// 	});
		// },

		getMineMsg(userInfo) {
			let _this = this;
			_this.$request
				.post('user/findByOpenId', userInfo)
				.then(res => {
					_this.$store.commit('landladyInfo', res.data.data);
					console.log(res.data.data);
					let myMsgs = res.data.data;
					_this.userName = myMsgs.userName
					_this.userImg = myMsgs.userImg
					_this.usedInviCode = myMsgs.usedInviCode;
					_this.level = myMsgs.level;
					_this.inviCode = myMsgs.inviCode;
					_this.trialDate = myMsgs.trialDate;
					_this.remainDay = myMsgs.remainDay;
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 关闭填写邀请码弹窗
		cancle() {
			this.invitationCodeFlag = false;
		},
		// 打开填写邀请码弹窗
		openNewsInvitationCode(e) {
			if (!this.usedInviCode) {
				this.invitationCodeFlag = true;
			}
		},
		//跳转意见反馈
		openFeedBack(e) {
			uni.navigateTo({
				url: '../feedback/feedback'
			});
		},
		//跳转关于收租鸟
		openAboutUs(e) {
			uni.navigateTo({
				url: '../aboutUs/aboutUs'
			});
		},
		//跳转帮助
		openHelp(e) {
			uni.navigateTo({
				url: '../help/help'
			});
		},
		submit() {
			let _this = this;
			this.$refs.form.validate(res => {
				if (isNaN(this.info.invitationCode) && this.info.invitationCode.length <= 4) {
					uni.showToast({
						title: '请填写4位数字邀请码!'
					});
				} else {
					uni.showLoading({
						title: '正在提交'
					});
					let v = {
						id: this.$store.state.landladyInfo.id,
						usedInviCode: this.info.invitationCode
					};
					this.$request
						.post('/user/useInviCode', v)
						.then(res => {
							console.log(res);
							if (res) {
								uni.showToast({
									title: '提交成功'
								});
								this.info.invitationCode = '';
								this.invitationCodeFlag = false;
								// this.invitationCode = this.info.invitationCode;
								this.getMineMsg({openId: this.$store.state.userOpenId});
							}
						})
						.catch(() => {
							uni.hideLoading();
						});
				}
			});
		},
		cancleLogin(e) {
			this.loginFlag = false;
		},
		openLogin(e) {
			this.loginFlag = true;
		}
	}
};
</script>

<style>
.mine {
	height: 100vh;
	width: 100%;
	background-color: #fafafa;
}
.myContainer {
	height: 114rpx;
	width: 100%;
	display: flex;
	margin-top: 40rpx;
}

.topContent {
	height: 36%;
	width: 100%;
	position: relative;
	overflow: hidden;
}
.login {
	width: 150rpx;
	height: 60rpx;
	background: -webkit-linear-gradient(146deg, rgba(244, 183, 74, 1) 0%, rgba(240, 153, 66, 1) 100%);
	background: linear-gradient(-56deg, rgba(244, 183, 74, 1) 0%, rgba(240, 153, 66, 1) 100%);
	opacity: 0.8;
	border-radius: 30rpx;
	margin-left: 30rpx;
	text-align: center;
	line-height: 60rpx;
	margin-top: 34rpx;

}
.logintext {
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
}
.myMsg {
	height: 72%;
	/* background:linear-gradient(-56deg,rgba(244,183,74,1) 0%,rgba(240,153,66,1) 100%); */
	background-color: #f09a42;
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: flex-start;
}
.emptyBackground {
	background-color: #fafafa;
}
.myPhoto {
	width: 115rpx;
	height: 115rpx;
	border-radius: 50%;
}

.detailTop {
	position: relative;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.myLevel {
	width: 121rpx;
	height: 40rpx;
	margin-left: 7rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 22rpx;
	border-radius: 20rpx;
	background: linear-gradient(-56deg, rgba(244, 183, 74, 1) 0%, rgba(240, 153, 66, 1) 100%);
}
.detail {
	padding-left: 19rpx;
	height: 57rpx;
}

.levelIcon {
	width: 20rpx;
	height: 20rpx;
	color: #fff;
}

.levelText {
	color: #fff;
	margin-left: 20rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.detailBottom {
	margin-top: 25rpx;
	color: #fff;
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.myName {
	font-size: 40rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
}

.houseTotalMsg {
	width: 690rpx;
	height: 180rpx;
	position: absolute;
	bottom: 40rpx;
	left: 30rpx;
	background-color: #fff;
	border-radius: 15rpx;
	display: flex;
	justify-content: space-between;
}

.leftMsg {
	width: 48%;
	text-align: center;
	padding-top: 30rpx;
}

.leftMsgTitle {
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.leftMsgValue {
	font-size: 55rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(255, 164, 73, 1);
}

.leftMsgDate {
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
}

.rightMsg {
	width: 48%;
	text-align: center;
	padding-top: 30rpx;
}

.rightMsgTitle {
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.rightMsgValue {
	font-size: 55rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(255, 164, 73, 1);
}

.line {
	width: 1rpx;
	height: 61rpx;
	/* border: 1rpx solid rgba(166, 166, 166, 1); */
	position: absolute;
	top: 57rpx;
	left: 50%;
	background-color: rgba(190, 190, 190, 1);
}

.jumpPortal {
	background-color: #fff;
	height: 65%;
	padding: 20rpx 40rpx;
}
.jumpPortalImg {
	width: 48rpx;
	height: 48rpx;
}

.jumpPortalitem {
	height: 15%;
	border-bottom: 3rpx solid #f5f5f5;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
}

.leftPart {
	display: flex;
	justify-content: flex-start;
}

.rightPartImg {
	width: 24rpx;
	height: 24rpx;
}

.jumpPortalText {
	margin-left: 25rpx;
	font-size: 32rpx;
	font-family: PingFang SC;
	/* font-weight: 500; */
}
.modalNum {
	position: absolute;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
	top: 34%;
	right: 40rpx;
}
.getTelNumImg {
	background-image: url(../../static/getTelNum.png);
	width: 213rpx !important;
	height: 53rpx !important;
	background-size: 100% 100%;
	border: none !important;
	outline: none !important;
}
.getTelNum {
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
}

/* 弹窗 */
.modal {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background: #000;
	opacity: 0.5;
	overflow: hidden;
	z-index: 500;
}
.modalTitle {
	height: 25%;
}
.modalContent {
	height: 75%;
}
.modalBox {
	width: 540rpx;
	height: 362rpx;
	overflow: hidden;
	position: fixed;
	top: 28%;
	left: 15%;
	z-index: 1001;
	background: rgba(255, 255, 255, 1);
	/* background: #FAFAFA; */
	border-radius: 25rpx;
}

.modalTitle {
	padding-top: 40rpx;
	font-size: 36rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
	text-align: center;
}

.modalInput {
	padding: 25rpx 0rpx 10rpx 0rpx;
	/* border-bottom: 1rpx solid #eeeeee; */
	width: 80%;
	text-align: center;
	margin: 0 auto;
	font-size: 30rpx;
}
.reminderText {
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 160, 68, 1);
}
.reminder {
	text-align: center;
	color: #ffa044;
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 160, 68, 1);
	display: flex;
	justify-content: center;
	padding: 10rpx 20rpx 25rpx;
}

.reminderSymbol {
	width: 30rpx;
	height: 30rpx;
	border: 1rpx solid #ffa044;
	border-radius: 50%;
	margin-right: 10rpx;
	line-height: 24rpx;
	text-align: center;
}

.button {
	width: 100%;
	height: 90rpx;
	border-top: 1rpx solid rgba(238, 238, 238, 1);
	display: flex;
	justify-content: space-around;
	font-size: 34rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	position: relative;
	line-height: 80rpx;
}

.modalLine {
	width: 1rpx;
	height: 89rpx;
	/* border: 1rpx solid rgba(238, 238, 238, 1); */
	background-color: rgba(238, 238, 238, 1);
	position: absolute;
	top: 0%;
	left: 50%;
}

.active {
	color: #ffa044;
}

/* 登录弹窗 */
.isloginModal {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background: #000;
	opacity: 0.5;
	overflow: hidden;
	z-index: 500;
}
.isloginBox {
	width: 513rpx;
	height: 537rpx;
	overflow: hidden;
	position: fixed;
	top: 19%;
	left: 15%;
	z-index: 1001;
}
.bgcImg {
	width: 100%;
	height: 100%;
	z-index: 9000;
}
.loginTxt {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 36px;
	text-align: center;
	z-index: 9000;
	position: absolute;
	bottom: 79px;
	left: 106rpx;
}
.deleteImg {
	width: 38rpx;
	height: 38rpx;
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	z-index: 9000;
}
.deleteImg image {
	width: 100%;
	height: 100%;
}
.loginImg {
	position: absolute;
	z-index: 9000;
	bottom: 60rpx;
	left: 0rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0rpx 52rpx;
}
.notLogin {
	width: 185rpx;
	height: 70rpx;
}
/* .isLogin {
	margin-left: 37rpx;
	width: 185rpx;
	height: 70rpx;
} */
.notLogin image {
	width: 100%;
	height: 100%;
}
.isLogin image {
	width: 100%;
	height: 100%;
}
.loginButton {
	width: 185rpx !important;
	height: 70rpx !important;
	background-image: url(../../static/login.png);
	background-size: 100% 100%;
	margin-left: 37rpx;
	border: none !important;
	outline: none !important;
	border-radius: 30rpx;
}
button::after {
	border: none;
}
</style>
