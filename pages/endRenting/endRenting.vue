<template>
	<view class="endRenting" v-if="init">
		<view class="section0">
			<view class="profitContainer">
				<view class="profitBox">
					<view class="profitBar">应退(元)</view>
					<span>-{{endRentingInfo.totalAmount}}</span>
				</view>
				<view v-if="endRentingInfo.billStatus == 4" class="profitBox">
					<view class="profitBar">实退(元)</view>
					<span>-{{endRentingInfo.totalAmount}}</span>
				</view>
			</view>
			<view class="houseAddr">{{houseAddr}}<span @click="editBill">修改</span></view>
		</view>
		<view class="section1">
			<view class="billStatus">
				<image v-if="endRentingInfo.billStatus == 4" class="billStatusBg" src="../../static/hasCheck.png" mode="aspectFit"></image>
				<span class="billTitle">账单状态</span>
				<span v-if="endRentingInfo.billStatus != 4" class="statusDes0">未清算</span>
				<span v-if="endRentingInfo.billStatus == 4" class="statusDes1">已清算</span>
			</view>
			<view class="billDateBox">
				<view class="billDateLi">
					<span class="billDateTitle">到租日期</span>
					<span>{{ endRentingInfo.payRentDate}}</span>
				</view>
				<view class="billDateLi">
					<span class="billDateTitle">清算日期</span>
					<span class="billDate">{{ arrivalDate }}</span>
				</view>
			</view>
			<view class="billDateBox">
				<view class="billDateLi">
					<span class="billDateTitle">应退押金</span>
					<span>{{ endRentingInfo.depositAmount}}</span>
				</view>
			</view>
			<view class="costDetail">费用明细</view>
			<!-- 	<view class="waterBox">
				<view class="waterOuter eleOuter">
					<span class="eleBar">电费</span>
					<span class="eleInfo" @click="showSureModal">详情</span>
					<span class="priceTotal">{{electricityInfo.amount}}元</span>
				</view>
			</view> -->
			<!-- 	<view class="waterBox" v-if="hasCommonEle">
				<view class="waterOuter">
					<span class="waterBar">均摊电费</span>
					<span class="priceTotal">{{commEleCost.amount}}元</span>
				</view>
			</view> -->
			<view class="waterBox" v-for="(item,index) in endRentingInfo.items" :key="index">
				<view class="waterOuter" :class="{'eleOuter':item.itemName == 1}">
					<span class="waterBar" :class="{'myRight':item.itemName != 1 && item.itemName != 2}">{{item.itemName == 1 ? '个人电费' : (item.itemName == 2 ? '均摊电费' : (item.itemName == 3 ? '水费' : '网费'))}}</span>
					<span class="eleInfo" v-if="item.itemName == 1" @click="showSureModal">详情</span>
					<span class="eleInfo" v-if="item.itemName == 2" @click="showSureModal1">详情</span>
					<span class="priceTotal"><span v-if="item.amount != 0">-</span>{{item.amount}}元</span>
				</view>
			</view>
			<view class="remarks">
				<view class="remarksDivide">备注</view>
				{{ endRentingInfo.remarks ? endRentingInfo.remarks  : ''}}
			</view>
		</view>
		<view class="section3" v-if="endRentingInfo.billStatus == 4">
			<view class="sendBillBox">
				<image class="sendIcon" src="../../static/sendBill.png" mode="aspectFit"></image>
				<view>发送账单</view>
			</view>
		</view>
		<view class="section2" v-else>
			<view class="sureBtn" @click="checkMoney">清算退租</view>
			<cover-view v-if="isShowSureModal" class="modalMask" @click="gotIt()" @catchtouchmove='true'>
				<cover-view class="modelContainer">
					<cover-view class="modalSureTitle">电费详情</cover-view>
					<cover-view class="modalContent">单价：{{ electricityInfo.unitPrice  ? electricityInfo.unitPrice : '1'}}元/度</cover-view>
					<cover-view class="modalContent">度数：{{ quantity ? quantity : 0 }}<span>度</span>({{ electricityInfo.currentNum ? electricityInfo.currentNum : '0' }}~{{
									electricityInfo.prevNum ? electricityInfo.prevNum : '0'
								}}）</cover-view>
					<cover-view class="modalContent">抄表日期： {{ electricityInfo.noteDate ? electricityInfo.noteDate : '暂无抄表日期' }}</cover-view>
					<cover-view class="btnBox">
						<cover-view class="modalSure" @click="gotIt()">知道了</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>

			<cover-view v-if="isShowSureModal1" class="modalMask" @click="gotIt()" @catchtouchmove='true'>
				<cover-view class="modelContainer">
					<cover-view class="modalSureTitle">均摊电费详情</cover-view>
					<cover-view class="modalContent">单价：{{ commEleCost.unitPrice ? commEleCost.unitPrice : '1' }}元/度</cover-view>
					<cover-view class="modalContent">度数：{{ commonQuantity ? commonQuantity : 0}}<span>度</span>({{ commEleCost.currentNum ? commEleCost.currentNum : '0' }}~{{
									commEleCost.prevNum ? commEleCost.prevNum : '0'
								}}）</cover-view>
					<cover-view class="modalContent">均摊人数： {{ billInfo.tenantNum }}</cover-view>
					<cover-view class="modalContent">抄表日期： {{ commEleCost.noteDate ? commEleCost.noteDate : '暂无抄表日期' }}</cover-view>
					<cover-view class="btnBox">
						<cover-view class="modalSure" @click="gotIt()">知道了</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			const date = this.$getDate()
			return {
				remarks: '',
				isShowSureModal1: false,
				houseAddr: '',
				arrivalDate: date,
				tenantId: null,
				init: false,
				isShowSureModal: false,
				hasCommonEle: false,
				endRentingInfo: {},
				electricityInfo: {},
				commEleCost: {},
			}
		},
		onLoad(options) {
			if (options.tenantId) {
				this.tenantId = options.tenantId
				// this.tenantId = 'de9d29f2-9255-41b3-9e40-0c4f0422acec'
				this.getEndRentInfo(this.tenantId)
			}
			if (options.billId) {
				this.billId = options.billId
				this.getBill(options.billId)
			}
			this.houseAddr = options.houseAddr

		},
		methods: {
			updateData(billId) {
				console.log('你好', )
				this.getBill(billId);
			},
			editBill() {
				uni.navigateTo({
					url: '../editBill/editBill?billId=' + this.endRentingInfo.id + '&billType=' + this.endRentingInfo.billType +
						'&titleContent=' +
						this.houseAddr
				})
			},
			getBill(id) {
				let _this = this;
				_this.$request.post('/bill/findById', {
					id
				}).then((res) => {
					_this.init = true;
					_this.endRentingInfo = res.data.data;
					_this.endRentingInfo.payRentDate = res.data.data.payRentDate.split(' ')[0];
					_this.remarks = res.data.data.remarks;
					if (_this.endRentingInfo.items) {
						_this.endRentingInfo.items.forEach((item, index) => {
							if (item.itemName == 1) {
								_this.electricityInfo = _this.billInfo.items[index];
								if(_this.electricityInfo.noteDate){
									_this.electricityInfo.noteDate = _this.electricityInfo.noteDate.split(" ")[0]
								}
							} else if (item.itemName == 2) {
								_this.hasCommonEle = true;
								_this.commEleCost = _this.endRentingInfo.items[index];
								if(_this.commEleCost.noteDate){
									_this.commEleCost.noteDate = _this.commEleCost.noteDate.split(" ")[0]
								}
							}
							if (Number(_this.electricityInfo.currentNum) > Number(_this.electricityInfo.prevNum)) {
								_this.quantity = (+_this.electricityInfo.currentNum) - (+_this.electricityInfo.prevNum)
							} else {
								_this.quantity = ''
							}
							if (Number(_this.commEleCost.currentNum) > Number(_this.commEleCost.prevNum)) {
								_this.commonQuantity = (+_this.commEleCost.currentNum) - (+_this.commEleCost.prevNum)
							} else {
								_this.commonQuantity = ''
							}
						})
					}
				})
			},
			checkMoney() {
				let par = this.endRentingInfo;
				par.billStatus = 6;
				par.arrivalDate = this.arrivalDate + ' 00:00:00';
				par.payRentDate = this.endRentingInfo.payRentDate + ' 00:00:00';
				this.$request.post('/bill/update', par).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '退租成功，欢迎下次入住！',
							icon: 'none',
							duration: 1500,
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					}
				})
			},
			showSureModal1() {
				this.isShowSureModal1 = true
			},
			showSureModal() {
				this.isShowSureModal = true
			},
			gotIt() {
				this.isShowSureModal = false
				this.isShowSureModal1 = false
			},
			getEndRentInfo(tenantId) {
				let _this = this;
				_this.$request.post('/roomUser/withdrawalTenant', {
					tenantId
				}).then((res) => {
					_this.init = true;
					_this.endRentingInfo = res.data.data;
					_this.tenantId = null;
					_this.endRentingInfo.payRentDate = res.data.data.payRentDate.split(' ')[0];
					_this.endRentingInfo.items.forEach((item, index) => {
						if (item.itemName == 1) {
							_this.electricityInfo = _this.endRentingInfo.items[index];
						} else if (item.itemName == 2) {
							_this.hasCommonEle = true;
							_this.commEleCost = _this.endRentingInfo.items[index];
						}
					})
				})
			}
		}
	}
</script>

<style scoped>
	.endRenting {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		padding-bottom: 140rpx;
		background-color: #fafafa;
	}

	.section0 {
		width: 100%;
		/* height: 234rpx; */
		background-color: #f09a42;
		color: #ffffff;
		padding: 18rpx 40rpx 20rpx 40rpx;
		font-size: 34rpx;
	}

	.profitContainer {
		display: flex;
		justify-content: space-between;
	}

	.profitBox {
		width: fit-content;
	}

	.profitBar {
		margin-bottom: 20rpx;
	}

	.profitBox span {
		font-size: 60rpx;
		font-weight: bold;
	}

	.houseAddr {
		width: 100%;
		height: 58rpx;
		font-size: 30rpx;
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.houseAddr span {
		width: 112rpx;
		height: 58rpx;
		background: #E4892D;
		border-radius: 28rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 58rpx;
	}

	.section1 {
		padding: 17rpx;
	}

	.billStatus,
	.billDateLi {
		height: 93rpx;
		width: 100%;
		padding: 24rpx;
		border-radius: 5rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		font-size: 30rpx;
		margin-bottom: 17rpx;
	}

	.billDateLi {
		margin-bottom: 0;
		height: 100%;
	}

	.billDateLi:not(:last-of-type)::after {
		content: '';
		width: calc(100% - 48rpx);
		height: 1rpx;
		background-color: #ebebeb;
		position: absolute;
		bottom: 0rpx;
		left: 24rpx;
	}

	.billStatusBg {
		position: absolute;
		width: 140rpx;
		height: 140rpx;
		top: -16rpx;
		right: 160rpx;
		z-index: 10;
	}

	.billTitle {
		margin-right: auto;
	}

	.billDateTitle {
		color: #999999;
		margin-right: auto;
	}

	.statusDes1 {
		color: #37bf6a;
	}

	.statusDes0 {
		color: #eb5e61;
	}

	.billDateBox {
		margin-bottom: 14rpx;
		border-radius: 5rpx;
	}

	.section3 {
		height: 128rpx;
		width: 100%;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.sendBillBox {
		height: 82rpx;
		width: fit-content;
		text-align: center;
	}

	.sendIcon {
		width: 40rpx;
		height: 40rpx;
		margin: 0 auto;
	}

	.section2 {
		margin-top: 14rpx;
		height: 128rpx;
		width: 100%;
		padding: 0rpx 40rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.leftBtnBox {
		width: calc(100% - 258rpx);
		display: flex;
		justify-content: space-around;
	}

	.sureBtn {
		width: 218rpx;
		height: 92rpx;
		background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		border-radius: 18rpx;
		color: #ffffff;
		font-size: 34rpx;
		text-align: center;
		line-height: 92rpx;
		/* margin-left: 82rpx; */
	}

	.costDetail {
		padding: 25rpx;
		font-size: 30rpx;
	}

	.electricBox {
		padding: 32rpx 26rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #999999;
		font-size: 26rpx;
		border-radius: 5rpx;
	}

	.elecRight {
		margin-right: auto;
	}

	.priceTotal {
		font-size: 30rpx;
		color: #444444;
	}

	.unitPrice {
		width: 100%;
		text-align: left;
		color: #333333;
		font-size: 30rpx;
	}

	.unitPrice span {
		margin-left: 20rpx;
		color: #999999;
		font-size: 26rpx;
	}

	.eleCostTotal {
		margin: 22rpx 0;
	}

	.waterBox {
		padding: 0 26rpx;
		background-color: #ffffff;
		border-radius: 5rpx;
	}

	.eleOuter {
		border-top: none !important;
	}

	.waterOuter {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-top: 1rpx solid #ebebeb;
		height: 94rpx;
	}

	.eleCommOuter {
		padding: 0 17rpx;
		background-color: #FAFAFA;
	}

	.eleInfo {
		width: 96rpx;
		height: 42rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #999999;
		color: #999999;
		font-size: 28rpx;
		margin-right: auto;
		border-radius: 5rpx;
	}

	.eleBar {
		font-size: 30rpx;
		color: #333333;
	}

	.waterBar {
		font-size: 30rpx;
		color: #333333;
	}

	.myRight {
		margin-right: auto;
	}

	/* //确定弹窗 */
	.modelContainer {
		width: 620rpx;
		/* height: fit-content; */
		background-color: #FFFFFF;
		border-radius: 25rpx;
		margin: 280rpx 0 0 65rpx;
		padding-top: 40rpx;
		text-align: center;
	}

	.modalSureTitle {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}

	.modalContent {
		font-size: 28rpx;
		text-align: left;
		color: #999999;
		width: calc(100% - 130rpx);
		height: fit-content;
		margin: 0 0 28rpx 65rpx;
		white-space: normal;
		line-height: 36rpx;
	}

	.btnBox {
		border-top: 2rpx solid rgba(217, 217, 220, 0.6);
		width: 100%;
		height: 120rpx;
	}

	.btnBox .modalSure {
		width: 220rpx;
		height: 74rpx;
		margin: 23rpx auto 0 auto;
		line-height: 74rpx;
		background: #FFA044;
		box-shadow: 0px 8px 19px 2px rgba(242, 166, 69, 0.4);
		border-radius: 37px;
		color: #FFFFFF;
		font-size: 34rpx;
	}

	.modalMask {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* end */
	.remarksDivide {
		padding: 28rpx 0;
		font-size: 34rpx;
		color: #999999;
		border-bottom: 2rpx solid #EBEBEB;
		margin-bottom: 28rpx;
	}

	.remarks {
		/* width: calc(100% - 34rpx); */
		margin-top: 14rpx;
		/* min-height: 93rpx; */
		height: fit-content;
		/* line-height: 93rpx; */
		padding: 0 0 28rpx 30rpx;
		color: #999999;
		font-size: 30rpx;
		background-color: #ffffff;
		border-radius: 5rpx;
	}
</style>
