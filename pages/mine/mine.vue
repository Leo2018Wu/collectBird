<template>
	<view class="mine">
		<view class="topContent">
			<view class="coverBlock">
				<view class="vipBg">
					<view class="vipBgContainer" v-if="landladyInfo.userStatus == '1'">
						<image src="../../static/beVip.png" mode="aspectFit"></image>
						<view class="vipTip">开通会员</view>
						<view class="vipRight" @click="goKeepUsing">
							<view>购买</view>
							<image src="../../static/vipRight.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="vipBgContainer" v-else>
						<image src="../../static/isVip.png" mode="aspectFit"></image>
						<view class="vipTip">会员</view>
						<view class="vipRight" @click="goKeepUsing">
							<view>续费</view>
							<image src="../../static/vipRight.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="topContainer">
				<view class="myContainer">
					<view class="">
						<image class="myPhoto" :src="userImg"></image>
					</view>
					<view v-if="show"><button class="login" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true">登录</button></view>
					<view class="detail" v-else>
						<view class="detailTop">
							<view class="myName">{{ userName }}</view>
							<view class="myLevel">
								<image class="levelIcon" src="../../static/queen.png"></image>
								<view class="levelText">LV{{ level }}</view>
							</view>
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
		<button class="shareBanner" hover-class="btnHoverClass" open-type="share"></button>
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
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.landladyInfo.userName + '邀请您体验收租神器',
				imageUrl: '/static/share1.jpg',
				path: '/pages/home/home'
			}
		},
		methods: {
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
		background: url(../../static/vipBg.png);
		background-size: 100% 100%;
		width: 690rpx;
		height: 92rpx;
		position: absolute;
		z-index: 99;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
		padding: 20rpx 65rpx 0 65rpx;

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
	.coverBlock{
		width: 140%;
		height: 100rpx;
		position: absolute;
		left: -20%;
		bottom: 0;
		z-index: 99;
		border-radius: 0 0 50% 50%;
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
		background-image: url(../../static/login.png);
		background-size: 100% 100%;
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
	.shareBanner{
		width: 670rpx;
		height: 190rpx;
		border-radius: 12rpx;
		margin: 40rpx auto 0 auto;
		background: url('data:image/jpg;base64,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AAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAABaOEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgBeOEJJTQQCAAAAAAC+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAwADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhCSU0EMAAAAAAAXwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB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Tj+jwYo+7xZP9XGftuTkNqqyLaqXF9Vbi1jj3A07Ie5XvseJwayB/JcR/wCYpO6VU4TVa4eAcA78mxWowvZ6AZsYAEif7xG/+K//2ThCSU0EIQAAAAAAXQAAAAEBAAAADwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAAABcAQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAIABDAEMAIAAyADAAMQA3AAAAAQA4QklNBAYAAAAAAAcACAAAAAEBAP/hFC1odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDMtMTFUMTA6MDQ6MjMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDMtMTFUMTQ6NTk6NDArMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTExVDE0OjU5OjQwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MWRlZjA0ZjEtY2UyZi0xYjQwLWJlZTktMDgzY2E1MjUzNTljIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGRlYTM3OTAtNjM2NS0xMWVhLTkyNTItZTcxMzYzM2Y4MWJiIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWJiMWM3YzUtMmEzMy04MzQzLWEyODUtYWI4YzE5MDI5YTkzIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxYmIxYzdjNS0yYTMzLTgzNDMtYTI4NS1hYjhjMTkwMjlhOTMiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTFUMTA6MDQ6MjMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzYyNzMwZGEtNTEwMi00NTQ4LThmNTEtYzhiMmExMDk2MjllIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTExVDEwOjA2OjU3KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE1OTU2Zjg0LTJjMTgtZGU0MS1hYzZhLTRlNDcwOWUyNDA0NyIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0xMVQxNDo1OTo0MCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFkZWYwNGYxLWNlMmYtMWI0MC1iZWU5LTA4M2NhNTI1MzU5YyIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0xMVQxNDo1OTo0MCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNTk1NmY4NC0yYzE4LWRlNDEtYWM2YS00ZTQ3MDllMjQwNDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MWJiMWM3YzUtMmEzMy04MzQzLWEyODUtYWI4YzE5MDI5YTkzIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWJiMWM3YzUtMmEzMy04MzQzLWEyODUtYWI4YzE5MDI5YTkzIi8+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6YKA6K+35paw55So5oi3IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpgoDor7fmlrDnlKjmiLciLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLovbvmnb4iIHBob3Rvc2hvcDpMYXllclRleHQ9Iui9u+adviIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IuaLv+i/lOS9oyIgcGhvdG9zaG9wOkxheWVyVGV4dD0i5ou/6L+U5L2jIi8+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0i6YKA6K+35aW95Y+L5YWl6am75ou/6L+U5L2jIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSLpgoDor7flpb3lj4vlhaXpqbvmi7/ov5TkvaMiLz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSLnq4vljbPpgoDor7ciIHBob3Rvc2hvcDpMYXllclRleHQ9Iueri+WNs+mCgOivtyIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYjkxNDI3My1hNDI3LTExN2MtOTIzMy04ZWQ2Njk3YjAwNmY8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjI0RDMwMEE2RTZFMzExRThCNDk2RjE2MjRGQkI4NTAxPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBC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');
		background-size: 100% 100%;
	}
</style>
