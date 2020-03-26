<template>
	<view class="mine">
		<view class="topContent">
			<view class="coverBlock">
				<view class="vipBg">
					<image class="posiBg" src="../../static/buyCrown.png" mode="aspectFill"></image>
					<view class="vipBgContainer" v-if="landladyInfo.userStatus == '2'" >
						<image src="../../static/isVip.png" mode="aspectFit"></image>
						<view class="vipTip">会员</view>
						<view class="vipRight" @click="goKeepUsing">
							<view>续费</view>
							<image src="../../static/vipRight.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="vipBgContainer" v-else>
						<image src="../../static/beVip.png" mode="aspectFit"></image>
						<view class="vipTip">开通会员</view>
						<view class="vipRight" @click="goKeepUsing">
							<view>购买</view>
							<image src="../../static/vipRight.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="topContainer">
				<view class="myContainer">
					<view class="">
						<image v-if="!landladyInfo.userImg" class="myPhoto" :src="userImg"></image>
						<image v-else  class="myPhoto" :src="landladyInfo.userImg"></image>
					</view>
					<view v-if="!landladyInfo.userImg"><button class="login" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true">登录</button></view>
					<view class="detail" v-else>
						<view class="detailTop">
							<view class="myName">{{ userName }}</view>
							<!-- <view class="myLevel">
								<image class="levelIcon" src="../../static/queen.png"></image>
								<view class="levelText">LV{{ level }}</view>
							</view> -->
						</view>
						<view class="detailBottom">我的邀请码: {{ inviCode }}</view>
					</view>
				</view>
			</view>

		</view>
		<view class="jumpPortal">
			<view class="jumpPortalitem" @click="openNewsInvitationCode">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon1.png" mode=""></image>
					<view class="jumpPortalText">填写邀请码</view>
					<view class="modalNum">{{ usedInviCode ? usedInviCode : '' }}</view>
				</view>
				<view class="rightPart">
					<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
				</view>
			</view>
			<view class="jumpPortalitem" v-if="landladyInfo.id">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/telphone.png" mode=""></image>
					<view class="jumpPortalText">手机号</view>
				</view>
				<view class="rightPart">
					<button class="getTelNumImg" hover-class="btnHoverClass" v-if="!landladyInfo.phoneNumber" open-type="getPhoneNumber"
					 @getphonenumber="getPhoneNumber"></button>
					<view class="getTelNum" v-if="landladyInfo.phoneNumber">{{ landladyInfo.phoneNumber }}</view>
				</view>
			</view>
			<view class="jumpPortalitem" v-else @click.stop="openPhoneNumber">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/telphone.png" mode=""></image>
					<view class="jumpPortalText">手机号</view>
				</view>
				<view class="rightPart">
					<button class="getTelNumImg" hover-class="btnHoverClass" v-if="!landladyInfo.phoneNumber"></button>
					<view class="getTelNum" v-if="landladyInfo.phoneNumber">{{ phoneNumber }}</view>
				</view>
			</view>
			<!-- 		<view class="jumpPortalitem" @click="openInviteFriends">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon5.png" mode=""></image>
					<button class="jumpPortalText" hover-class="btnHoverClass" open-type="share">邀请好友</button>
				</view>
				<view class="rightPart">
					<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
				</view>
			</view> -->
			<view class="jumpPortalitem" @click="openFeedBack">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon2.png" mode=""></image>
					<view class="jumpPortalText">意见反馈</view>
				</view>
				<view class="rightPart">
					<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
				</view>
			</view>
			<view class="jumpPortalitem" @click="openHelp">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon3.png" mode=""></image>
					<view class="jumpPortalText">帮助</view>
				</view>
				<view class="rightPart">
					<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
				</view>
			</view>
			<view class="jumpPortalitem" @click="openAboutUs">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon4.png" mode=""></image>
					<view class="jumpPortalText">关于收租鸟</view>
				</view>
				<view class="rightPart">
					<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
				</view>
			</view>
		</view>
		<button class="shareBanner" @click="shareFirend"></button>
		<!-- 填写邀请码弹窗 -->
		<view class="modal" v-show="invitationCodeFlag" @click="cancle"></view>
		<view class="modalBox" v-show="invitationCodeFlag">
			<view class="modalTitle">填写邀请码</view>
			<view class="modalContent">
				<view class="modalInput">
					<input class="text" type="text" value="" maxlength="6" v-model="usedInviCode" placeholder="请输入邀请码(仅填写1次)" style="font-size: 30rpx;"
					 autofocus required />
					<view class="inputLine"></view>
				</view>
				<view class="button">
					<view class="btn_cancle" @click="cancle" data-statu="close">取消</view>
					<view class="modalLine"></view>
					<view class="btn_ok active" @click="submit" data-statu="open">确定</view>
				</view>
			</view>
		</view>
		<message-modal v-if="showMessageModal" :deadNum="deadNum" v-on:emitCancel="returntCancel" v-on:emitSure="returnSure"></message-modal>
		<!-- 授权弹窗 -->
		<is-login v-show="loginFlag" v-on:isShowloginBtn="isShowloginBtn" :childLoginFlag="loginFlag" v-on:childByValue="childByValue"></is-login>
		<!-- <view class="isloginModal" v-show="loginFlag" @click="cancleLogin"></view> -->
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
	import messageModal from '../../components/messageModal.vue';
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	import {
		mapState,
		mapMutations,

	} from 'vuex';
	import {
		isLogin
	} from '../../components/isLogin.vue';
	export default {
		components: {
			evanFormItem,
			evanForm,
			'is-login': isLogin,
			messageModal
		},
		data() {
			return {
				showMessageModal: false,
				invitationCodeFlag: false, // 是否显示填写邀请码弹窗
				loginFlag: false, //登录弹窗
				userImg: '../../static/tourist.png', //用户头像
				userName: '', //用户昵称
				// gender: '', //用户性别
				show: true, //是否显示点击登录
				roomNum: '50', // 房间容量暂时写死
				inviCode: '', // 我的邀请码
				usedInviCode: '', //填写邀请码
				level: '', // 级别
				remainDay: '0', //剩余天数
				trialDate: '2030-01-01',
				phoneNumber: '', // 绑定手机号
				loginingStatus: false, //登录状态
				deadNum: ''
			};
		},
		computed: {
			...mapState(['landladyInfo'])
		},
		onLoad(options) {
			this.caclTrialDate()
		},
		onShow(options) {
			let data = this.$store.state.landladyInfo
			if(data.id){
				let userInfo = {
					openId: data.openId,
					userImg: data.userImg,
					userName: data.userName,
					userSex: data.userSex
				}
				this.getMineMsg(userInfo)
			}else{
				this.checkLoginStatus().then(res => {
					console.log(res);
					if (res) {
						this.show = true;
					} else {
						this.show = false;
						// this.getMineMsg({
						// 	openId: this.$store.state.userOpenId
						// });
					}
				});
			}
		},
		methods: {
			shareFirend(){
				uni.navigateTo({
					url:"../shareFriend/shareFriend"
				})
			},
			returntCancel() {
				this.showMessageModal = false
			},
			returnSure() {
				this.goKeepUsing();
				this.showMessageModal = false
			},
			caclTrialDate() {
				console.log('Nihhao')
				let date, sDate1, sDate2, dateSpan, iDays
				console.log(date, this.trialDate)
				date = this.$getDate()
				sDate1 = Date.parse(date.replace(/\-/g, "/"));
				sDate2 = Date.parse(this.$store.state.landladyInfo.trialDate.replace(/\-/g, "/"));
				dateSpan = sDate2 - sDate1;
				iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
				console.log(iDays)
				if (iDays <= 0) {
					this.showMessageModal = true;
				} else if (iDays <= 15) {
					this.showMessageModal = true;
					this.deadNum = iDays
				}
			},
			goKeepUsing() {
				uni.navigateTo({
					url: '../keepUsing/keepUsing?trialDate=' + this.trialDate + '&roomLimitNum=' + this.landladyInfo.buyNum
				})
			},
			getUserInfo() {
				console.log(11111);
				let self = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes, '1111');
						uni.checkSession({
							success() {
								// session_key 未过期，并且在本生命周期一直有效
								self.$store.commit('openCode', loginRes.code);
								self.$request.post('/wx/login', {
									code: loginRes.code
								}).then(res => {
									console.log(res);
									if (res) {
										self.openId = res.data.data.openid;
										self.$store.commit('isloginStatus', true);
										self.$store.commit('userOpenId', res.data.data.openid);
										self.$store.commit('sessionKey', res.data.data.session_key);
										uni.getUserInfo({
											provider: 'weixin',
											success: function(infoRes) {
												console.log(infoRes);
												if (infoRes.userInfo) {
													self.show = false;
													// 微信的gender 1 男 2 女 0 未知
													// 收租鸟userSex 0 男 1 女
													if (infoRes.userInfo.gender == '1') {
														self.gender = '0';
													} else if (infoRes.userInfo.gender == '2') {
														self.gender = '1';
													} else {
														self.gender = '未知';
													}
													let userInfo = {
														openId: res.data.data.openid,
														userName: infoRes.userInfo.nickName,
														userImg: infoRes.userInfo.avatarUrl,
														userSex: self.gender
													};
													self.getMineMsg(userInfo);

												}
											},
											fail: function(res) {
												uni.showToast({
													title: '微信授权不成功！',
													icon: 'none',
													duration: 2000
												});
											}
										});
									}
								});
							},
							fail() {
								// session_key 已经失效，需要重新执行登录流程
								uni.login({
									provider: 'weixin',
									success: function(loginRes) {
										self.$request.post('/wx/login', {
											code: loginRes.code
										}).then(res => {
											console.log(res);
										});
									}
								}); // 重新登录
							}
						});
					},
					fail: function(res) {}
				});
			},
			checkLoginStatus() {
				let _this = this;
				return new Promise((reslove, rej) => {
					//判断用户是否授权过
					uni.getSetting({
						success(res) {
							console.log(res);
							if (res.authSetting['scope.userInfo']) {
								_this.$store.commit('isloginStatus', true);
								_this.show = false;
								let userInfo = {
									openId: _this.$store.state.userOpenId,
									userName: _this.$store.state.landladyInfo.userName,
									userImg: _this.$store.state.landladyInfo.userImg,
									userSex: _this.$store.state.landladyInfo.userSex
								};
								_this.getMineMsg(userInfo);
							}
						},
						complete() {
							reslove(!_this.$store.state.isloginStatus);
						}
					});
				});
			},
			isShowloginBtn(value) {
				console.log(value);
				this.show = value;
			},
			childByValue(value) {
				let _this = this;
				console.log('进入父组件获取到子组件传来数据', value);
				_this.loginFlag = false;
				if (value) {
					_this.userName = value.userName;
					_this.userImg = value.userImg;
					_this.usedInviCode = value.usedInviCode;
					_this.level = value.level;
					_this.inviCode = value.inviCode;
					_this.trialDate = value.trialDate;
					_this.remainDay = value.remainDay;
				}
			},

			// 获取手机号方法
			getTelNum(res) {
				this.$request
					.post('/wx/takeWxDecode', res)
					.then(v => {
						this.phoneNumber = v.data.data.phoneNumber;
						this.landladyInfo.phoneNumber = v.data.data.phoneNumber;
						this.$store.commit('landladyInfo', this.landladyInfo)
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 点击获取手机号
			getPhoneNumber(e) {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes, '1111');
						let result = {
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: loginRes.code
						};
						_this.getTelNum(result);
					}
				});
			},
			// 获取用户信息
			getMineMsg(userInfo) {
				let _this = this;
				_this.$request
					.post('user/findByOpenId', userInfo)
					.then(res => {
						_this.$store.commit('landladyInfo', res.data.data);
						console.log(res.data.data);
						let myMsgs = res.data.data;
						_this.userName = myMsgs.userName;
						_this.userImg = myMsgs.userImg;
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
			// 提交邀请码
			submit() {
				let _this = this;
				if (_this.usedInviCode) {
					// 校验方法
					// console.log(/^[A-Z]\d{5}$/.test(_this.usedInviCode));
					// console.log(_this.usedInviCode.replace(/^[A-Z]\d{4}$/,true));
					let checkoutFlag = /^[A-Z0-9]{6}$/.test(_this.usedInviCode);
					if (checkoutFlag) {
						uni.showLoading({
							title: '正在提交'
						});
						let v = {
							id: _this.$store.state.landladyInfo.id,
							usedInviCode: _this.usedInviCode
						};
						_this.$request
							.post('/user/useInviCode', v)
							.then(res => {
								console.log(res);
								if (res) {
									uni.showToast({
										title: '提交成功'
									});
									_this.usedInviCode = '';
									_this.invitationCodeFlag = false;
									_this.getMineMsg({
										openId: _this.$store.state.userOpenId
									});
								}
							})
							.catch(() => {
								uni.hideLoading();
							});
					} else {
						uni.showToast({
							title: '请输入包含数字和大写字母的6位邀请码!',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: '请填写邀请码!',
						icon: 'none'
					});
				}
			},

			// 弹窗其他页面跳转

			//打开获取手机号
			openPhoneNumber() {
				this.checkLoginStatus().then(res => {
					this.loginFlag = res;
				});
			},
			// 打开填写邀请码弹窗
			openNewsInvitationCode(e) {
				this.checkLoginStatus().then(res => {
					this.loginFlag = res;
					if (!this.loginFlag && !this.usedInviCode) {
						this.invitationCodeFlag = true;
					}
				});
			},
			// 关闭填写邀请码弹窗
			cancle() {
				this.invitationCodeFlag = false;
			},
			//跳转意见反馈
			openFeedBack(e) {
				this.checkLoginStatus().then(res => {
					this.loginFlag = res;
					if (!this.loginFlag) {
						uni.navigateTo({
							url: '../feedback/feedback'
						});
					}
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
			// 跳转邀请好友
			openInviteFriends(e) {
				this.checkLoginStatus().then(res => {
					this.loginFlag = res;
					// if (!this.loginFlag) {
					// 	uni.navigateTo({
					// 		url: '../feedback/feedback'
					// 	});
					// }
				});
			},
			// 点击关闭登录弹窗
			cancleLogin(e) {
				this.loginFlag = false;
			},
			// 未登录状态下点击登录
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
		overflow-x: hidden;
	}

	.myContainer {
		height: 114rpx;
		width: 100%;
		display: flex;
		margin-top: 40rpx;
		position: relative;
	}

	.topContent {
		height: 350rpx;
		width: 100%;
		position: relative;

	}

	.topContainer {
		background: #F09942;
		height: 282rpx;
		width: 100%;
		overflow: hidden;
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: flex-start;
	}

	.vipBg {
		background-color: #4a4a4a;
		width: 690rpx;
		height: 92rpx;
		position: absolute;
		z-index: 99;
		left: 50%;
		transform: translateX(-50%);
		bottom: -10rpx;
		padding: 20rpx 60rpx 0 60rpx;
		position: relative;
		border-radius: 20rpx;
	}
	.posiBg{
		position: absolute;
		width: 130rpx;
		height: 126rpx;
		top:0;
		right:146rpx;
		opacity: 0.07;
	}

	.vipBgContainer {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 26rpx;
		color: #C6C6C6;
	}

	.vipTip {
		margin-right: auto;
	}

	.vipBgContainer image {
		width: 39rpx;
		height: 38rpx;
		margin-right: 16rpx;

	}

	.vipRight {
		font-size: 24rpx;
		color: #66550A;
		padding-left: 18rpx;
		height: 40rpx;
		line-height: 40rpx;
		display: flex;
		align-items: center;
		background-color: #F9DE6B;
		border-radius: 20rpx;
	}

	.vipRight image {
		width: 10rpx;
		height: 20rpx;
		margin-left: 6rpx;
	}

	.coverBlock {
		width: 100%;
		height: 100rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 99;
		border-radius: 0 0 70% 70%;
		background: #F09942;
		overflow: hidden;
	}

	.login {
		width: 150rpx;
		height: 60rpx;
		background: linear-gradient(-56deg, rgba(244, 183, 74, 1) 0%, rgba(240, 153, 66, 1) 100%);
		opacity: 0.8;
		border-radius: 30rpx;
		margin-left: 30rpx;
		text-align: center;
		line-height: 60rpx;
		margin-top: 34rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
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
		/* height: 65%; */
		padding: 20rpx 40rpx 20rpx 40rpx;
	}

	.jumpPortalImg {
		width: 48rpx;
		height: 48rpx;
	}

	.jumpPortalitem {
		height: 110rpx;
		/* height: 15%; */
		border-bottom: 3rpx solid #f5f5f5;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.leftPart {
		display: flex;
		justify-content: flex-start;
		margin-right: auto;
		width: 100%;
		height: 100%;
		align-items: center;
	}

	.rightPartImg {
		width: 24rpx;
		height: 24rpx;
	}

	.jumpPortalText {
		width: calc(100% - 100rpx);
		height: 100%;
		margin-left: 25rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		display: flex;
		align-items: center;
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
		height: 28%;
	}

	.modalContent {
		height: 72%;
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
		height: 28%;
		padding-top: 40rpx;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		text-align: center;
	}

	.modalInput {
		padding: 80rpx 0rpx 0rpx 0rpx;
		text-align: center;
		margin: 0 auto;
		font-size: 30rpx;
		width: 376rpx;
		height: 151rpx;
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
		margin-top: 20rpx;
	}

	.inputLine {
		width: 184px;
		height: 1px;
		background: rgba(238, 238, 238, 1);
		margin-top: 10rpx;
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

	/* .text{
	border-bottom: 1rpx solid rgba(238,238,238,1);
} */
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
		margin-left: 37rpx;
		border: none !important;
		outline: none !important;
		border-radius: 30rpx;
	}

	.keepUsing {
		width: 138rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFA449;
		border-radius: 25rpx;
		font-size: 25rpx;
		color: #FFFFFF;
		position: absolute;
		bottom: -20rpx;
		left: calc((100% - 138rpx) / 2);
	}

	.keepUsing image {
		width: 11rpx;
		height: 18rpx;
		margin-left: 8rpx;
	}

	.shareBanner {
		width: 670rpx;
		height: 190rpx;
		border-radius: 12rpx;
		margin: 40rpx auto 0 auto;
		background: url('data:image/jpg;base64,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AAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAIASAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAWjhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAAThCSU0EAgAAAAAABAAAAAA4QklNBDAAAAAAAAIBAThCSU0ELQAAAAAAAgAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0cAAAAGAAAAAAAAAAAAAAC/AAACgwAAAAli/09jkdEALU/uZTlcD2WHTvYAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAoMAAAC/AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpj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AG8AcAAgAEMAQwAgADIAMAAxADcAAAABADhCSU0EBgAAAAAABwAGAAAAAQEA/+EQn2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wMy0xMVQyMDoxNDoxMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0xMVQyMDoxNDo1NCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMTFUMjA6MTQ6NTQrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyYmJiY2IxZC01OGI0LTYyNDItOGI2YS0zNDliY2FlYmE4MjYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkN2VmZjU3MC02MzkxLTExZWEtYTNmMy1lZWY3Zjg0MjMyZmYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0NzgxOTdiOS04Mjc5LTliNGMtOTJlYy1lNjZlZDBhZWNmZWMiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3ODE5N2I5LTgyNzktOWI0Yy05MmVjLWU2NmVkMGFlY2ZlYyIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0xMVQyMDoxNDoxMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NWUzMGU2MS1hYjljLWU0NDctYjBhMS0xYzBjN2RkYzY5MmEiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTFUMjA6MTQ6NTQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyYmJiY2IxZC01OGI0LTYyNDItOGI2YS0zNDliY2FlYmE4MjYiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTFUMjA6MTQ6NTQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDVlMzBlNjEtYWI5Yy1lNDQ3LWIwYTEtMWMwYzdkZGM2OTJhIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ3ODE5N2I5LTgyNzktOWI0Yy05MmVjLWU2NmVkMGFlY2ZlYyIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ3ODE5N2I5LTgyNzktOWI0Yy05MmVjLWU2NmVkMGFlY2ZlYyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4ADkFkb2JlAGRAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQoJCg0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAvwKDAwERAAIRAQMRAf/dAAQAUf/EAaIAAAAHAQEBAQEAAAAAAAAAAAQFAwIGAQAHCAkKCwEAAgIDAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAACAQMDAgQCBgcDBAIGAnMBAgMRBAAFIRIxQVEGE2EicYEUMpGhBxWxQiPBUtHhMxZi8CRygvElQzRTkqKyY3PCNUQnk6OzNhdUZHTD0uIIJoMJChgZhJRFRqS0VtNVKBry4/PE1OT0ZXWFlaW1xdXl9WZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3OEhYaHiImKi4yNjo+Ck5SVlpeYmZqbnJ2en5KjpKWmp6ipqqusra6voRAAICAQIDBQUEBQYECAMDbQEAAhEDBCESMUEFURNhIgZxgZEyobHwFMHR4SNCFVJicvEzJDRDghaSUyWiY7LCB3PSNeJEgxdUkwgJChgZJjZFGidkdFU38qOzwygp0+PzhJSktMTU5PRldYWVpbXF1eX1RlZmdoaWprbG1ub2R1dnd4eXp7fH1+f3OEhYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A9g1z4up+lqdXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWmsVdirVcaTTq40tOrjS06uNLTq40tOrjS06uNLTq40tOrjS0urjSKdXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWnVxpadXGlp1caWltcaTTq40tOrjS06uNLT//Q9e8s+MafpincsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWncsaWmuWNLS3ljSadyxpadyxpadyxpadyxpadyxpadyxpadyxpadyxpaX8saRTuWNLTuWNLTuWNLTuWNLTu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');
		background-size: 100% 100%;
		position: relative;
	}

</style>
