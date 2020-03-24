<template>
	<view class="keepUsing">
		<view class="infoBar">
			<view class="userType">您是{{userStatus}}用户</view>
			<view class="houseMax"><span>{{userStatus == '新' ? '不限' : roomLimitNum}}</span>(容量)</view>
			<view>有效期截止：{{trialDate[0]}}年{{trialDate[1]}}月{{trialDate[2]}}日</view>
			<image class="crown" src="../../static/buyCrown.png" mode="aspectFit"></image>
			<view class="vipTip" v-if="userStatus == '老'">
				<image class="vipIcon" src="../../static/vipTip.png" mode="aspectFit"></image>
				<view>会员</view>
			</view>
		</view>
		<view class="chooseBar">选择购买</view>
		<view class="chooseItem divideBottom">
			<view class="itemName">房号扩容</view>
			<view class="numberBox">
				<number-box :noBorder='true' v-on:emitVal='returnVal' :valNum="1"></number-box>
			</view>
		</view>
		<view class="chooseItem" v-if="userStatus == '老'">
			<view class="itemName">时间周期</view>
			<view class="chooseBox" @click="showList">
				<view class="pleChoose">{{listValue ? listValue : '请选择'}}</view>
				<image src="../../static/triangle.png" mode=""></image>
			</view>
		</view>
		<view class="btnBox">
			<view class="joinClub" @click="showQrcode">加入体验群</view>
			<view class="contactBuy" @click="showContact">联系购买</view>
		</view>
		<view class="skuBox" v-if="userStatus == '老'">
			<view class="skuItem active">
				<view>{{listValue == '暂不续约' || listValue == '' ? '暂不续约' : '购买'+listValue }}</view>
				<view class="itemPrice"><span>￥</span>{{totalPrice}}</view>
				<view class="itemOldPrice">原价{{oldPrice}}元/套/月</view>
				<view class="itemSalePrice">特价{{actualPrice}}元/套/月</view>
				<view class="gift">赠送{{awardNum}}个月</view>
			</view>
		</view>
		<view class="skuBoxNew" v-else>
			<view class="skuItemNew" :class="{active : currentIndex == index}" @click="chooseSku(index)" v-for="(item,index) in [2700,5400]"
			 :key="index">
				<view>购买{{index+1}}年</view>
				<view v-if="index == 0" class="itemPrice"><span>￥</span>{{totalPrice}}</view>
				<view v-if="index == 0" class="itemOldPrice">原价{{oldPrice}}元/套/月</view>
				<view v-if="index == 0" class="itemSalePrice">特价{{actualPrice}}元/套/月</view>
				<view v-if="index == 0" class="gift">赠送{{awardNum}}个月</view>

				<view v-if="index == 1" class="itemPrice"><span>￥</span>{{totalPriceNew}}</view>
				<view v-if="index == 1" class="itemOldPrice">原价{{oldPrice}}元/套/月</view>
				<view v-if="index == 1" class="itemSalePrice">特价{{actualPriceNew}}元/套/月</view>
				<view v-if="index == 1" class="gift">赠送{{awardNumNew}}个月</view>
			</view>
		</view>
		<choose-list v-if="listShow" :currentChooseIndex="chooseIndex" v-on:close="hideList" :list="list" :title="'选择时间周期'"
		 v-on:emitClick="returnEmit"></choose-list>
		<cover-view class="modalMask" v-if="showQrCodeBox || showContactBox" @click="hideModal">
			<cover-view class="qrCodeBox" v-if="showQrCodeBox">
				<cover-image src="https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/qrcode.jpg" mode="aspectFit"></cover-image>
				<cover-view class="divideBorder"></cover-view>
				<cover-view class="savtCode" @click="saveCode">保存二维码</cover-view>
			</cover-view>
			<cover-view class="contactBox" v-if="showContactBox">
				<cover-view class="contactTitle">通过微信联系我们</cover-view>
				<cover-view class="name">jayne_zou</cover-view>
				<cover-view class="divideBorder"></cover-view>
				<cover-view class="savtCode" @click="copyWechat">复制微信号</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import chooseList from '../../components/chooseList.vue'
	import numberBox from '../../components/numberBox.vue'
	var basePrice = 4;
	export default {
		components: {
			numberBox,
			chooseList
		},
		data() {
			return {
				currentIndex: 0,
				list: ['1年', '2年', '暂不续约'],
				listShow: false,
				chooseIndex: null,
				showQrCodeBox: false,
				showContactBox: false,
				listValue: '',
				awardNum: 0,
				oldPrice: basePrice,
				currentMonthNum: 0,
				houseLimitNum: 0,
				trialDate: [],
				roomLimitNum: '',
				userStatus: '',
				currentMonthNumNew:'',
				awardNumNew:''
			}
		},
		computed: {
			totalPrice() {
				let monthPar = this.currentMonthNum ? this.currentMonthNum : 1;
				let limitPar = this.houseLimitNum ? this.houseLimitNum : 1;
				return (monthPar * basePrice * limitPar).toFixed(2)
			},
			totalPriceNew(){
				let monthPar = this.currentMonthNumNew;
				let limitPar = this.houseLimitNum ? this.houseLimitNum : 1;
				return (monthPar * basePrice * limitPar).toFixed(2)
			},
			actualPrice() {
				let monthPar = this.currentMonthNum ? this.currentMonthNum : 1;
				return ((basePrice * monthPar) / (monthPar + this.awardNum)).toFixed(2)
			},
			actualPriceNew(){
				let monthPar = this.currentMonthNumNew;
				return ((basePrice * monthPar) / (monthPar + this.awardNumNew)).toFixed(2)
			}
		},
		onLoad(options) {
			this.trialDate = options.trialDate.split('-');
			this.roomLimitNum = options.roomLimitNum;
			console.log(basePrice)
			if (this.$store.state.landladyInfo.userStatus == 1) {
				uni.setNavigationBarTitle({
					title: '购买'
				})
			}
			this.userStatus = this.$store.state.landladyInfo.userStatus == 1 ? '新' : '老'; /*1-新用户 2-老用户*/
			if (this.userStatus == '新') {
				console.log('你好')
				this.currentMonthNum = 12;
				this.currentMonthNumNew = 24;
				this.awardNumNew = 6;
				this.awardNum = 2;
			}
		},
		methods: {
			chooseSku(index) {
				console.log('sdsadsafasf')
				this.currentIndex = index;
				// if (index == 1) {
				// 	this.currentMonthNum = 24;
				// 	this.awardNum = 6;
				// }
			},
			returnVal(e) {
				this.houseLimitNum = e
			},
			returnEmit(e) {
				console.log(e)
				this.chooseIndex = e.index;
				this.listValue = e.newVal;
				switch (e.index) {
					case 0:
						this.currentMonthNum = 12;
						this.awardNum = 2;
						break;
					case 1:
						this.currentMonthNum = 24;
						this.awardNum = 6;
						break;
					case 2:
						this.currentMonthNum = 0;
						this.awardNum = 0;
						break;
					default:
						break;
				}
			},
			hideList() {
				this.listShow = false;
			},
			showList() {
				this.listShow = true;
			},
			saveCode() {
				wx.getSetting({
					success(res) {
						console.log(res.authSetting)
						if (res.authSetting['scope.writePhotosAlbum'] == false) {
							wx.openSetting({
								success(res) {}
							})

						} else {
							uni.saveImageToPhotosAlbum({
								filePath: 'static/qrcode.jpg',
								success: function() {
									uni.showToast({
										title: '二维码已保存到本地',
										icon: 'none',
										duration: 1500
									})
								},
								fail(e) {
									console.log(e)
								},
								complete() {
									console.log('save compelete');
								}
							});
						}
					}
				})

			},
			copyWechat() {
				uni.setClipboardData({
					data: 'jayne_zou',
					success() {
						uni.showToast({
							title: '微信号已复制',
							duration: 1500
						})
					},
				})
			},
			showQrcode() {
				this.showQrCodeBox = true;
			},
			showContact() {
				this.showContactBox = true;
			},
			hideModal() {
				this.showQrCodeBox = false;
				this.showContactBox = false;
			}
		}
	}
</script>

<style scoped>
	.keepUsing {
		width: 100%;
		height: 100vh;
		padding: 22rpx 32rpx 0 32rpx;
	}

	cover-view {
		line-height: unset;
	}

	.infoBar {
		width: 100%;
		padding: 30rpx 0 40rpx 30rpx;
		background: linear-gradient(264deg,rgba(240, 153, 66, 1) 0%, rgba(244, 183, 74, 1) 100% );
		box-shadow: 0px 15rpx 22rpx 2rpx rgba(240, 159, 68, 0.25);
		color: #FFFFFF;
		font-size: 28rpx;
		border-radius: 20rpx;
		position: relative;
	}
	.crown{
		width: 172rpx;
		height: 186rpx;
		position: absolute;
		z-index: 99;
		right: 0;
		top: 60rpx;
		filter:opacity(0.07);
	}

	.userType {
		font-size: 44rpx;
		font-weight: bold;
		margin-bottom: 26rpx;
	}

	.houseMax {
		margin-bottom: 10rpx;
	}

	.houseMax span {
		font-size: 44rpx;
		font-weight: bold;
	}

	.chooseBar {
		margin: 60rpx 0 40rpx 0;
		font-size: 34rpx;
		color: #333333;
		font-weight: bold;
	}

	.chooseItem {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border: 1rpx solid #E4E3E3;
		border-radius: 5rpx;
	}

	.divideBottom {
		margin-bottom: 14rpx;
	}

	.itemName {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
		margin-right: auto;
	}

	.numberBox {
		width: 138rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chooseBox {
		min-width: fit-content;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.pleChoose {
		margin-right: 18rpx;
	}

	.chooseBox image {
		width: 24rpx;
		height: 24rpx;
	}

	.pleChoose {
		font-size: 34rpx;
		color: #999999;
	}

	.btnBox {
		width: 100%;
		height: 104rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		font-size: 34rpx;
		box-shadow: 0px -5rpx 16rpx 0px rgba(0, 0, 0, 0.04);
	}

	.btnBox view {
		width: 50%;
		height: 100%;
		display: inline-block;
		line-height: 104rpx;
		text-align: center;
	}

	.joinClub {
		color: #B9B9B9;
	}

	.contactBuy {
		background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		color: #FFFFFF;
	}

	.skuBox,
	.skuBoxNew {
		width: 100%;
		margin-top: 64rpx;
	}

	.skuBoxNew {
		display: flex;
		justify-content: space-between;
	}

	.skuItem {
		width: 330rpx;
		padding: 32rpx 0;
		font-size: 30rpx;
		color: #62615B;
		text-align: center;
		border: 2rpx solid #E4E3E3;
		border-radius: 5rpx;
		position: relative;
		margin: 0 auto;
	}

	.skuItemNew {
		width: calc((100% - 25rpx) / 2);
		padding: 32rpx 0;
		font-size: 30rpx;
		color: #62615B;
		text-align: center;
		border: 2rpx solid #E4E3E3;
		border-radius: 5rpx;
		position: relative;
	}

	.itemPrice {
		font-size: 48rpx;
		font-weight: bold;
		color: #A87058;
	}

	.itemPrice span {
		font-size: 33rpx;
	}

	.itemOldPrice {
		font-size: 22rpx;
		color: #9F9F9F;
		font-weight: bold;
		text-decoration: line-through;
		margin: 10rpx 0 20rpx 0;
	}

	.itemSalePrice {
		width: fit-content;
		margin: 0 auto;
		background: rgba(246, 185, 94, 1);
		border-radius: 19rpx;
		font-size: 22rpx;
		color: #ffffff;
		padding: 6rpx 24rpx;
	}

	.active {
		background-color: #FFF6E8;
		border: 1rpx solid rgba(239, 186, 110, 1);
		box-shadow: 0px 2rpx 9rpx 1rpx rgba(248, 190, 106, 0.14);
	}

	.gift {
		/* width: fit-content; */
		height: 38rpx;
		line-height: 38rpx;
		padding: 0 16rpx;
		background: linear-gradient(-90deg, rgba(58, 58, 60, 1) 0%, rgba(100, 100, 100, 1) 100%);
		box-shadow: 4rpx 6rpx 12rpx 1rpx rgba(60, 60, 62, 0.13);
		border-radius: 0px 15rpx 0px 15rpx;
		position: absolute;
		top: -24rpx;
		left: 0rpx;
		color: #E6BB75;
		font-size: 22rpx;
	}

	.modalMask {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.qrCodeBox {
		width: 514rpx;
		height: 516rpx;
		border-radius: 20rpx;
		color: #FFA044;
		font-size: 30rpx;
		text-align: center;
		position: absolute;
		top: 254rpx;
		left: 118rpx;
		z-index: 999;
		background-color: #FFFFFF;
		opacity: 1;
	}

	.contactBox {
		width: 514rpx;
		border-radius: 20rpx;
		color: #FFA044;
		font-size: 30rpx;
		text-align: center;
		position: absolute;
		top: 372rpx;
		left: 118rpx;
		z-index: 999;
		background-color: #FFFFFF;
		padding-top: 60rpx;
		opacity: 1;
	}

	.qrCodeBox cover-image {
		width: 346rpx;
		height: 346rpx;
		margin: 46rpx auto 14rpx auto;
	}

	.divideBorder {
		width: 100%;
		height: 2rpx;
		background-color: #F6F6F6;
	}

	.savtCode {
		height: 108rpx;
		width: 100%;
		line-height: 108rpx;
		font-size: 30rpx;
		color: #FFA044;
	}

	.contactTitle {
		font-size: 36rpx;
		color: #333333;
		margin-bottom: 44rpx;
	}

	.name {
		margin-bottom: 54rpx;
		font-size: 34rpx;
		color: #6B6B6B;
	}
	.vipTip{
		position: absolute;
		z-index: 100;
		padding: 12rpx 30rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		right: 0;
		top: 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background:rgba(255,175,95,0.5);
		border-radius: 26px 0px 0px 26px;;
	}
	.vipTip image{
		width: 25rpx;
		height: 25rpx;
		margin-right: 10rpx;
	}
</style>
