<template>
	<view class="home">
		<view v-if="true">
			<view class="mouth">
				<view class="mouthIncome">
					<view class="mouthIncomeText">本月净收入 (元)</view>
					<span class="mouthIncomeNum">{{ mouthIncome | thousandsPoints }}</span>
				</view>
				<view class="payment">
					<view class="">
						<view class="paymentText">本月账单待收</view>
						<span class="paymentNum">{{ billDuein | thousandsPoints}}</span>
					</view>
					<view class="">
						<view class="paymentText">本月账单已收</view>
						<span class="paymentNum">{{ billReceived | thousandsPoints}}</span>
					</view>
					<view class="">
						<view class="paymentText">今日已收金额</view>
						<span class="paymentNum">{{ todayReceived | thousandsPoints}}</span>
					</view>
				</view>
			</view>
			<view class="bannerBox">
				<view class="bannerTop">
					<view v-for="(item,index) in homeList" @click="switchPage(item.url)" :key="index">
						<view class="bannerItem">
							<view v-if="item.icon && noteNum > 0" class="bannerIcon">{{noteNum ? noteNum : ""}}</view>
							<image class="bannerImg" :src="item.imgUrl" mode="aspectFit"></image>
						</view>
						<span class="bannerText">{{item.title}}</span>
					</view>
				</view>
				<view class="banner">
					<swiper class="swiper" :indicator-dots="false" autoplay="true" interval="5000" duration="1000" @change="swiperChange">
						<block v-for="(item, index) in imgUrls" :key="index">
							<swiper-item class="radius">
								<image :src="item.url" class="slide-image" mode="aspectFill" @click="swiperTarget(item.link)" />
							</swiper-item>
						</block>
					</swiper>
					<view class="dots">
						<view v-for="(item, index) in imgUrls" :key="index">
							<view class="dot" :class="{active : index == swiperCurrent}"></view>
						</view>
					</view>
				</view>
				<view class="officalBox">
					<official-account style="border: none;" bindload="bindload" v-on:binderror="binderror"></official-account>
				</view>
				<view class="noticeBox">
					<image class="leftImg" src="../../static/updateIcon.png" mode="aspectFit"></image>
					<view class="noticeContent">
						<swiper class="noticeContentSwiper" :vertical="true" :indicator-dots="false" autoplay="true" interval="5000"
						 duration="800">
							<block v-for="(item,index) in contentList" :key="index">
								<swiper-item>
									<view>{{item.text1}}</view>
									<view>{{item.text2}}</view>
								</swiper-item>
							</block>
						</swiper>

					</view>
				</view>
			</view>
			<!-- 授权弹窗 -->
			<view class="isloginModal" v-if="loginFlag" @click="cancleLogin"></view>
			<view class="isloginBox" v-if="loginFlag">
				<image class="bgcImg" src="../../static/authorization.png" mode=""></image>
				<view class="deleteImg" @click="cancleLogin">
					<image src="../../static/delete.png" mode=""></image>
				</view>
				<view class="loginTxt">授权登录体验完整功能</view>
				<view class="loginImg">
					<!-- <view class="notLogin" @click="cancleLogin">
						<image src="../../static/notLogin.png" mode=""></image>
					</view> -->
					<button class="loginButton"  open-type="getUserInfo" @getuserinfo="getUserInfo">授权微信登录</button>
				</view>
			</view>
		</view>

		<!-- 新手指引 -->
		<view class="guideMask" @catchtouchmove="true" v-if="stepOne || stepTwo || stepThree || stepFour"></view>
		<view v-if="stepOne">
			<image class="guide1" src="../../static/guide1.png" mode="aspectFit"></image>
			<image class="guide2" src="../../static/guide2.png" mode="aspectFit" @click="showNextOne"></image>
		</view>
		<view v-if="stepTwo">
			<image class="guide6" src="../../static/guide6.png" mode="aspectFit"></image>
			<image class="guide3" src="../../static/guide3.png" mode="aspectFit" @click="showNextTwo"></image>
		</view>
		<view v-if="stepThree">
			<image class="guide4" src="../../static/guide4.png" mode="aspectFit" @click="showNextThree"></image>
			<image class="guide5" src="../../static/homeIcon4.png" mode="aspectFit"></image>
		</view>
		<view v-if="stepFour">
			<image class="guide7" src="../../static/guide5.png" mode="aspectFit" @click="showNextFour"></image>
			<image class="guide8" src="../../static/homeIcon6.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {
				init: false,
				stepOne: false,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
				contentList: [{
					text1: '支持手动生成最新账单',
					text2: '账单明细支持编辑'
				}, {
					text1: '租客支持退租、续租',
					text2: '支持均摊电费'
				}, {
					text1: '新增收支报表，便于横向比对',
					text2: '新增记事入口，记录收租琐事'
				}, {
					text1: '新增房东列表，查看房东信息',
					text2: '更新帮助手册，便于检索帮助'
				}, {
					text1: '关注收租鸟服务号，及时接收相关信息',
					text2: ''
				}],
				mouthIncome: '0', //本月净收入
				billDuein: '0', //本月账单待收
				billReceived: '0', //本月账单已收
				todayReceived: '0', //今日已收金额
				loginFlag: false,
				isPopUpModal: false,
				swiperCurrent: 0,
				circular: true,
				imgUrls: [{
						link: '',
						// url: '../../static/banner1.jpg',
						url: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/banner1.jpg'
					},
					{
						link: '../houseList/houseList',
						url: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/banner2.jpg'
					},
					{
						link: '../shareFriend/shareFriend',
						url:'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/banner3.jpg'
					}
				],
				homeList: [{
						title: '房源',
						imgUrl: '../../static/homeIcon1.png',
						url: '../houseList/houseList',
						icon:false
					}, {
						title: '租客',
						imgUrl: '../../static/homeIcon2.png',
						url: '../renterManage/renterManage',
						icon:false
					}, {
						title: '账单',
						imgUrl: '../../static/homeIcon3.png',
						url: '../billManage/billManage?billType=' + 0,
						icon:false
					}, {
						title: '报表',
						imgUrl: '../../static/homeIcon4.png',
						url: '../reportForm/reportForm',
						icon:false
					}, {
						title: '房东账单',
						imgUrl: '../../static/homeIcon5.png',
						url: '../billManage/billManage?billType=' + 1,
						icon:false
					},
					{
						title: '房东',
						imgUrl: '../../static/homeIcon7.png',
						url: '../landlordManage/landlordManage',
						icon:false
					},
					{
						title: '记事',
						imgUrl: '../../static/homeIcon8.png',
						url: '../memo/memo',
						icon:true
					},
					{
						title: '帮助',
						imgUrl: '../../static/homeIcon6.png',
						url: '../help/help',
						icon:false
					}
				],
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				noteNum:''
			};
		},
		onLoad() {
			this.checkLoginStatus().then(res => {
				this.loginFlag = res;
			});
		},
		onShow(option) {
			if(this.$store.state.landladyInfo.id){
				this.getNoteNum();
				this.getMoneyInfo();
				this.getMessageTotal(_this.$store.state.landladyInfo.id)
			}
		},
		onShareAppMessage(res) {
			return {
				title: this.$store.state.landladyInfo.userName + '邀请您体验收租神器',
				imageUrl: 'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/share1.jpg',
				path: '/pages/home/home'
			}
		},
		methods: {
			getNoteNum(){
				this.$request.post('/note/getCount',{
					landlordId:this.$store.state.landladyInfo.id
				}).then((res)=>{
					this.noteNum = res.data.data
				})
			},
			bindload(e){
				console.log('组件加载成功',e)
			},
			binderror(e){
				console.log('组件加载失败',e)
			},
			swiperTarget(url) {
				uni.navigateTo({
					url
				})
			},
			showNextOne() {
				this.stepOne = false;
				this.stepTwo = true;
			},
			showNextTwo() {
				this.stepTwo = false;
				this.stepThree = true;
			},
			showNextThree() {
				console.log('wobedianjile')
				this.stepThree = false;
				this.stepFour = true;
			},
			showNextFour() {
				this.stepFour = false;
				this.$request.post('/user/updateByOpenId', {
					openId: this.$store.state.landladyInfo.openId,
					isNovice: 1
				}).then((res) => {
					uni.showToast({
						title: '已完成新手指导',
						icon: 'none'
					})
				})
			},
			switchPage(url) {
				// if(!this.$store.state.landladyInfo.id){
				// 	return
				// }
				uni.navigateTo({
					url
				})
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
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
								_this.getUserInfo();
							}
						},
						complete() {
							reslove(!_this.$store.state.isloginStatus);
						}
					});
				});
			},
			getLandLadyInfo(userInfo) {
				let _this = this;
				_this.$request
					.post('user/findByOpenId', userInfo)
					.then(res => {
						console.log(res);
						_this.init = true;
						if (res.data.data.isNovice == 0) {
							_this.stepOne = true;
						}
						_this.$store.commit('landladyInfo', res.data.data);
						_this.getNoteNum();
						_this.getMoneyInfo();
						_this.getMessageTotal(_this.$store.state.landladyInfo.id)
					})
					.catch(err => {});
			},
			getMessageTotal(id) {
				this.$request.post('userMessage/messageList', {
					addresseeId: id
				}).then((res) => {
					let result = res.data.data
					let num = parseInt(result.billUnreadCount) + parseInt(result.tenantUnreadCount) + parseInt(result.systemUnreadCount)
					if(num > 0){
						uni.setTabBarBadge({
							index: 1,
							text: num + '',
						})
					}
				})
			},
			getMoneyInfo() {
				let _this = this;
				_this.$request
					.post('user/money', {
						id: _this.$store.state.landladyInfo.id
					})
					.then(res => {
						console.log(res);
						let data = res.data.data;
						_this.mouthIncome = data.monthIncome;
						_this.billReceived = data.monthAllIncome;
						_this.billDuein = data.monthUnIncome;
						_this.todayReceived = data.todaySumTotal;
					});
			},
			getUserInfo() {
				let self = this;
				self.loginFlag = false;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes, '1111');
						self.$store.commit('openCode', loginRes.code);
						// 获取用户信息
						self.$request.post('/wx/login', {
							code: loginRes.code
						}).then(res => {
							self.$store.commit('isloginStatus', true);
							self.$store.commit('userOpenId', res.data.data.openid);
							self.$store.commit('sessionKey', res.data.data.session_key);
							console.log(res);
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									if (infoRes.userInfo) {
										console.log(infoRes);
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
											unionId:res.data.data.unionid,
											openId: res.data.data.openid,
											userName: infoRes.userInfo.nickName,
											userImg: infoRes.userInfo.avatarUrl,
											userSex: self.gender
										};
										self.getLandLadyInfo(userInfo);
									}
								},
								fail: function(res) {
									uni.showToast({
										title: '微信授权不成功！',
										icon:'none',
										duration: 2000
									});
								}
							});
						});
					},
					fail: function(res) {}
				});
			},
			cancleLogin(e) {
				this.loginFlag = false;
			},
			//点击指示点切换
			chuangEvent(e) {
				this.swiperCurrent = e.currentTarget.id
			},
			//点击图片触发事件
			swipclick(e) {
				console.log(this.data.swiperCurrent);
				uni.switchTab({
					url: this.data.links[this.data.swiperCurrent]
				});
			}
		}
	};
</script>

<style>
	.home {
		width: 100%;
		height: 100vh;
		position: relative;
	}

	.mouth {
		height: 400rpx;
		background-color: #f09a42;
	}

	.mouthIncome {
		width: 100%;
		height: 48%;
		background-color: #f09a42;
		color: #ffffff;
		padding: 30rpx 56rpx;
		text-align: center;
	}

	.mouthIncomeNum {
		margin-top: 20rpx;
		text-align: center;
		font-size: 82rpx;
		font-family: PingFang-SC-Heavy;
		font-weight: 800;
	}

	.mouthIncomeText {
		font-size: 32rpx;
		text-align: center;
		font-family: PingFang-SC-Regular;
	}

	.payment {
		height: 60%;
		display: flex;
		justify-content: space-between;
		text-align: center;
		padding: 0 20rpx;
		color: #ffffff;
		font-size: 36rpx;
		padding: 60rpx 60rpx;
	}

	.paymentText {
		margin-bottom: 10rpx;
		font-size: 26rpx;
	}

	.bannerBox {
		width: 100%;
		background-color: #fff;
		border-radius: 25rpx;
		position: absolute;
		top: 380rpx;
		left: 0rpx;
	}

	.bannerTop {
		height: 30%;
		display: flex;
		padding: 60rpx 20rpx 20rpx 20rpx;
		flex-wrap: wrap;
	}

	.banner {
		position: relative;
	}

	.bannerTop view {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* margin-bottom: 40rpx; */
	}
	.bannerItem{
		position: relative;
	}
	.bannerIcon{
		box-sizing: content-box;
		/* min-height: 36rpx; */
		min-width: 36rpx;
		text-align: center;
		position: absolute;
		top: -14rpx;
		right: -30rpx;
		background-color: #EA4E3D;
		border-radius: 50%;
		color: #FFFFFF;
		font-size: 26rpx;
		border: 2rpx solid #FFFFFF;
	}
	.bannerImg {
		max-width: 88rpx;
		max-height: 88rpx;
		margin-bottom: 17rpx;
	}

	.bannerText {
		color: #333333;
		font-size: 28rpx;
		margin-bottom: 40rpx;
		font-weight: 600;
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
		font-weight: bold;
	}

	.deleteImg {
		width: 25rpx;
		height: 25rpx;
		position: absolute;
		top: 200rpx;
		right: 20rpx;
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
		width: 414rpx !important;
		height: 80rpx !important;
		background-color: #F19033;
		margin: 0 auto;
		line-height: 80rpx;
		color: #FFFFFF;
		border-radius: 40rpx;
		font-size: 30rpx;
	}

	/* 轮播图 */
	.swiper {
		width: 643rpx;
		height: 191rpx;
		padding: 0rpx 54rpx;
		border-radius: 12rpx;
	}
	
	.slide-image {
		width: 100%;
		height: 100%;
		background-size: 100% 100%;
	}

	.banner {
		width: 100%;
	}

	.radius {
		border-radius: 12rpx;
	}

	.noticeBox {
		width: 100%;
		height: 130rpx;
		background-color: #FAFAFA;
		margin-top: 60rpx;
		padding: 0 60rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.noticeBox .leftImg {
		width: 73rpx;
		height: 69rpx;
		margin-right: 30rpx;
	}

	.noticeContent {
		height: 80rpx;
		width: calc(100% - 110rpx);
		margin-right: auto;
		color: #333333;
		font-size: 28rpx;
		padding-left: 30rpx;
		position: relative;
		/* margin-top: -8rpx; */
		/* animation: notice 2s linear; */
		/* overflow-y: hidden; */
	}

	.noticeContentSwiper {
		width: 100%;
		height: 100%;
	}

	.noticeContent::before {
		content: "";
		width: 6rpx;
		height: 6rpx;
		background-color: #333333;
		border-radius: 50%;
		position: absolute;
		top: 16rpx;
		left: 0;
	}

	.noticeContent::after {
		content: "";
		width: 6rpx;
		height: 6rpx;
		background-color: #333333;
		border-radius: 50%;
		position: absolute;
		bottom: 18rpx;
		left: 0;
	}

	.noticeBox .rightImg {
		width: 30rpx;
		height: 28rpx;
	}

	/* @keyframes notice {
		 0%  {transform: translateY(100%);}
	    30%  {transform: translateY(0);}
	    70%  {transform: translateY(0);}
	   100%  {transform: translateY(-100%);}
	} */


	.dots {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 20rpx;
		display: flex;
		justify-content: center;
	}

	.dots .dot {
		width: 20rpx;
		height: 4rpx;
		background: rgba(255, 255, 255, 1);
		opacity: 0.4;
		border-radius: 2rpx;
		margin: 0 6rpx;
	}

	.dots .dot.active {
		background: #FFFFFF;
		opacity: 1;
	}

	.guideMask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000000;
		opacity: 0.6;
		z-index: 990;
	}

	.guide1 {
		width: 670rpx;
		height: 318rpx;
		position: absolute;
		top: 28rpx;
		left: 40rpx;
		z-index: 991;
	}

	.guide2 {
		width: 423rpx;
		height: 617rpx;
		position: absolute;
		top: 356rpx;
		left: 185rpx;
		z-index: 991;
	}

	.guide6 {
		width: 469rpx;
		height: 106rpx;
		position: absolute;
		top: 430rpx;
		left: 48rpx;
		z-index: 991;
	}

	.guide3 {
		width: 442rpx;
		height: 572rpx;
		position: absolute;
		top: 546rpx;
		left: 130rpx;
		z-index: 991;
	}

	.guide4 {
		width: 467rpx;
		height: 586rpx;
		position: absolute;
		top: 546rpx;
		left: 172rpx;
		z-index: 991;
	}

	.guide5 {
		width: 94rpx;
		height: 94rpx;
		position: absolute;
		z-index: 991;
		top: 436rpx;
		right: 64rpx;
	}

	.guide7 {
		width: 382rpx;
		height: 468rpx;
		position: absolute;
		top: 658rpx;
		left: 194rpx;
		z-index: 991;
	}

	.guide8 {
		width: 94rpx;
		height: 94rpx;
		position: absolute;
		z-index: 991;
		top: 616rpx;
		right: 64rpx;
	}
	.officalBox{
		margin-top: 60rpx;
		padding: 0 53rpx;
	}
</style>
