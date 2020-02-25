<template>
	<view class="billDetail" v-if="init">
		<view class="section0">
			<view class="profitContainer">
				<view class="profitBox">
					<view class="profitBar">{{billType == 0 ? '应收' : '应付'}}(元)</view>
					<span>{{ billInfo.totalAmount}}</span>
				</view>
				<view v-if="billInfo.billStatus == 4" class="profitBox">
					<view class="profitBar">{{billType == 0 ? '实收' : '实付'}}(元)</view>
					<span>{{ billInfo.totalAmount ? billInfo.totalAmount : '0' }}</span>
				</view>
			</view>
			<view v-if="billType == 0" class="houseAddr">{{ houseAddrInfo.communityName }}-{{ houseAddrInfo.houseNo }}-{{ houseAddrInfo.roomNo }}</view>
			<view v-else class="houseAddr">{{ ownerInfo.communityName }}-{{ ownerInfo.houseNo }}</view>
		</view>
		<view class="section1">
			<view class="billStatus">
				<image v-if="billInfo.billStatus == 4 && billType == 0" class="billStatusBg" src="../../static/hasCheck.png" mode="aspectFit"></image>
				<image v-if="billInfo.billStatus == 4 && billType == 1" class="billStatusBg" src="../../static/hasCheck1.png" mode="aspectFit"></image>
				<span class="billTitle">账单状态</span>
				<span v-if="billInfo.billStatus != 4" class="statusDes0">{{billType == 0 ? '未到账' : '未交租'}}</span>
				<span v-if="billInfo.billStatus == 4" class="statusDes1">{{billType == 0 ? '已到账' : '已交租'}}</span>
			</view>
			<view class="billDateBox">
				<view class="billDateLi">
					<span class="billDateTitle">{{billType == 0 ? '收租日期' : '交租日期'}}</span>
					<span>{{payRentDate }}</span>
				</view>
				<view class="billDateLi">
					<span class="billDateTitle">缴费周期</span>
					<span class="billDate">{{ startDate }} ~ {{ endDate }}</span>
				</view>
				<view class="billDateLi" v-if="billInfo.billStatus == 4">
					<span class="billDateTitle">{{billType == 0 ? '到账日期' : '付款日期'}}</span>
					<span>{{ arrivalDate }}</span>
				</view>
				<view class="billDateLi" v-if="billInfo.billStatus == 4">
					<span class="billDateTitle">{{billType == 0 ? '收款方式' : '付款方式'}}</span>
					<span class="billDate">现金</span>
				</view>
			</view>
			<view class="billDateBox">
				<view class="billDateLi">
					<span class="billDateTitle">租金</span>
					<span>{{ !billInfo.total ? 0 : billInfo.total }}</span>
				</view>
				<view class="billDateLi" v-if="billInfo.depositAmount">
					<span class="billDateTitle">押金</span>
					<span class="billDate">{{ !billInfo.depositAmount ? 0 : billInfo.depositAmount }}</span>
				</view>
			</view>
			<view v-if="billType == 0">
				<view class="costDetail">费用明细</view>
				<!-- 	<view class="electricBox">
					<view class="elecRight">
						<view class="unitPrice">
							{{ electricityInfo.itemName }}
							<span>{{ electricityInfo.unitPrice }}元/度</span>
						</view>
						<view v-if="electricityInfo.itemType == 1" class="eleCostTotal">
							{{ quantity }}<span>度</span>({{ electricityInfo.currentNum ? electricityInfo.currentNum : '0' }}~{{
								electricityInfo.prevNum ? electricityInfo.prevNum : ''
							}}）
						</view>
						<view v-if="electricityInfo.itemType == 1">抄表日期: {{ electricityInfo.noteDate ? electricityInfo.noteDate.substr(0,10) : '暂无抄表日期' }}</view>
					</view>
					<view class="priceTotal">{{ electricityInfo.amount }}</view>
				</view> -->
				<view class="waterBox">
					<view class="waterOuter eleOuter">
						<span class="eleBar">{{electricityInfo.itemName}}</span>
						<span class="eleInfo" @click="showSureModal">详情</span>
						<span class="priceTotal">{{electricityInfo.amount}}元</span>
					</view>
				</view>
				<view class="waterBox" v-for="(item,index) in billInfo.items" :key="index">
					<view class="waterOuter">
						<span class="waterBar">{{item.itemName}}</span>
						<span class="priceTotal">{{item.amount}}元</span>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="remarks">暂无备注</view> -->
		<view class="remarks">{{ billInfo.remarks ? billInfo.remarks : '无备注' }}</view>
		<view v-if="billType == 0">
			<view class="section3" v-if="billInfo.billStatus == 4">
				<view class="sendBillBox">
					<image class="sendIcon" src="../../static/sendBill.png" mode="aspectFit"></image>
					<view>发送账单</view>
				</view>
			</view>
			<view class="section2" v-else>
				<!-- v-if="!billInfo.depositAmount" -->
				<view class="leftBtnBox">
					<view class="sendBillBox" @click="deleteBill">
						<image class="sendIcon" src="../../static/delete_btn.png" mode="aspectFit"></image>
						<view>删除</view>
					</view>
					<view class="sendBillBox" @click="openMeterRead">
						<image class="sendIcon" src="../../static/eleWater.png" mode="aspectFit"></image>
						<view>抄表</view>
					</view>
					<view class="sendBillBox">
						<image class="sendIcon" src="../../static/sendBill.png" mode="aspectFit"></image>
						<view>发送账单</view>
					</view>
				</view>
				<view class="sureBtn" @click="checkMoney">到账</view>
			</view>
		</view>
		<view class="" v-if="billType == 1">
			<view class="sureBtnNew" v-if="billInfo.billStatus != 4"  @click="checkMoney">交租</view>
			<view class="sureBtnNew" v-if="billInfo.billStatus == 4">已交租</view>
		</view>
		<tip-modal v-if="isShowTipModal" :title="'删除账单'" :describition="'是否确认删除账单?'" v-on:emitCancel="hideTipModal"
		 v-on:emitSure="returnSure"></tip-modal>
		<cover-view v-if="isShowSureModal" class="modalMask" @click="gotIt()" @catchtouchmove='true'>
			<cover-view class="modelContainer">
				<cover-view class="modalSureTitle">电费详情</cover-view>
				<cover-view class="modalContent">单价：{{ electricityInfo.unitPrice }}元/度</cover-view>
				<cover-view class="modalContent">度数：{{ quantity }}<span>度</span>({{ electricityInfo.currentNum ? electricityInfo.currentNum : '0' }}~{{
								electricityInfo.prevNum ? electricityInfo.prevNum : '0'
							}}）</cover-view>
				<cover-view class="modalContent">抄表日期： {{ electricityInfo.noteDate ? electricityInfo.noteDate.substr(0,10) : '暂无抄表日期' }}</cover-view>
				<cover-view class="btnBox">
					<cover-view class="modalSure" @click="gotIt()">知道了</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
		<!-- 提示未抄表弹窗 -->
		<view class="modal" v-show="isShowMeterRead" @click="cancle"></view>
		<view class="modalBox" v-show="isShowMeterRead">
			<view class="modalTitle">尚未抄表，是否抄表后再确认到账？</view>
			<view class="modalContent">
				<view class="button">
					<view class="btn_cancle" @click="submit" data-statu="close">是</view>
					<view class="modalLine"></view>
					<view class="btn_ok active" @click="cancle" data-statu="open">否</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue'
	import dateForm from '../../util/index.js';
	export default {
		components: {
			tipModal
		},
		data() {
			return {
				isShowSureModal: false,
				ownerInfo: {},
				billType: '',
				isShowTipModal: false,
				init: false,
				billId: null,
				houseAddrInfo: {},
				billInfo: {},
				electricityInfo: {},
				isShowMeterRead: false,
				startDate: '',
				endDate: '',
				payRentDate: '',
				quantity: ''
			};
		},
		onShow() {
			this.getBillDetail(this.billId);
		},
		onLoad(option) {
			console.log(this)
			this.billType = option.billType;
			this.billId = option.billId;
			if (option.tenantId) {
				this.getAddr(option.tenantId);
			}
			if (option.ownerId) {
				this.getOwnerInfo(option.ownerId)
			}
		},
		methods: {
			showSureModal() {
				this.isShowSureModal = true
			},
			gotIt() {
				this.isShowSureModal = false
			},
			deleteBill() {
				this.showTipModal()
			},
			hideTipModal() {
				this.isShowTipModal = false;
			},
			showTipModal() {
				this.isShowTipModal = true;
			},
			returnSure() {
				this.$request.post('/bill/delete', {
					id: this.billId
				}).then((res) => {
					console.log(res)
					if (res.data.code == 200) {
						this.isShowTipModal = false;
						uni.showToast({
							title: '删除成功',
							duration: 800
						})
						let pages = getCurrentPages();
						if (pages.length > 1) {
							let beforePage = pages[pages.length - 2];
							if (beforePage.route == "pages/billManage/billManage") {
								beforePage.$vm.updateData()
							}
						}
						setTimeout(() => {
							uni.navigateBack();
						}, 1500)
					}
				})
			},
			getBillDetail(id) {
				let _this = this;
				_this.$request
					.post('/bill/findById', {
						id
					})
					.then(res => {
						console.log(res)
						_this.billInfo = res.data.data;
						console.log(_this.billInfo);
						let tempArr = []
						_this.billInfo.items.forEach((item, index) => {
							if (item.itemName == '电费') {
								_this.electricityInfo = _this.billInfo.items[index];
							} else {
								tempArr.push(item)
							}
						})
						_this.billInfo.items = tempArr
						_this.startDate = dateForm.dateForm(_this.billInfo.startDate);
						_this.endDate = dateForm.dateForm(_this.billInfo.endDate);
						_this.payRentDate = dateForm.dateForm(_this.billInfo.payRentDate);
						_this.billInfo.depositAmount = parseFloat(_this.billInfo.depositAmount).toFixed(2);
						if (isNaN(_this.billInfo.depositAmount)) {
							_this.billInfo.depositAmount = 0
						}
						_this.billInfo.total = parseFloat(_this.billInfo.total).toFixed(2);
						if (Number(_this.electricityInfo.currentNum) > Number(_this.electricityInfo.prevNum)) {
							_this.quantity = (+_this.electricityInfo.currentNum) - (+_this.electricityInfo.prevNum)
						} else {
							_this.quantity = ''
						}
						_this.init = true;
					});
			},
			getOwnerInfo(id) {
				this.$request.post('/owner/findById', {
					id
				}).then((res) => {
					this.ownerInfo = res.data.data
				})
			},
			getAddr(tenantId) {
				let _this = this;
				_this.$request
					.post('/bill/findByTenantId', {
						tenantId
					})
					.then(res => {
						console.log(res);
						_this.houseAddrInfo = res.data.data[0];
					});
			},
			checkMoney() {
				console.log('你好')
				let _this = this;
				if(this.billType == 1){
					this.ll()
				}
				if (_this.electricityInfo.itemName == '电费') {
					if (_this.electricityInfo.currentNum == '' || _this.electricityInfo.currentNum == null || _this.electricityInfo.currentNum ==
						'0') {
						_this.isShowMeterRead = true;
					} else {
						this.ll();
					}
				}
			},
			openMeterRead() {
				if (this.billInfo.sortNo == 1) {
					uni.showToast({
						title: '该账单为首期，无需抄表。',
						icon: 'none',
						duration: 1500
					})
				} else {
					uni.navigateTo({
						url: '../meterRead/meterRead?billInfo=' + JSON.stringify(this.billInfo) + '&electricityInfo=' + JSON.stringify(
							this.electricityInfo)
					});
				}
			},
			cancle(e) {
				this.isShowMeterRead = false;
				this.ll();
			},
			submit(e) {
				this.isShowMeterRead = false;
				this.openMeterRead()
			},
			ll() {
				let _this = this;
				let par = this.billInfo
				par.items.push(this.electricityInfo)
				par.billStatus = 4
				_this.$request
					.post('/bill/update', par)
					.then(res => {
						console.log(res);
						if (res.data.code == '200') {
							uni.showToast({
								title: _this.billType == 0 ? '到账成功' : '交租成功'
							});
						}
						_this.getBillDetail(_this.billId);
						let pages = getCurrentPages();
						if (pages.length > 1) {
							let beforePage = pages[pages.length - 2];
							if (beforePage.route == "pages/billManage/billManage") {
								beforePage.$vm.updateData()
							}
						}
					});
			}
		}
	};
</script>

<style scoped>
	.billDetail {
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
		font-size: 30rpx;
		margin-top: 10rpx;
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
		border: none !important;
	}

	.waterOuter {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-top: 1rpx solid #ebebeb;
		height: 94rpx;
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
		margin-right: auto;
	}

	.remarks {
		width: calc(100% - 34rpx);
		margin: 14rpx 0 0 17rpx;
		height: 93rpx;
		line-height: 93rpx;
		padding-left: 26rpx;
		color: #999999;
		font-size: 30rpx;
		background-color: #ffffff;
		border-radius: 5rpx;
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
	.sureBtnNew{
		width: 228rpx;
		height: 76rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		border-radius:18rpx;
		color: #FFFFFF;
		font-size: 34rpx;
		margin: 140rpx auto 0 auto;
	}

	.sendBillBox {
		height: 82rpx;
		width: fit-content;
		text-align: center;
		font-size: 28rpx;
	}

	.leftBtnBox {
		width: calc(100% - 258rpx);
		display: flex;
		justify-content: space-around;
	}

	/* .sendBillBox:first-of-type {
		margin-right: 82rpx;
	} */

	.sendIcon {
		width: 40rpx;
		height: 40rpx;
		margin: 0 auto;
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

	.modalBox {
		width: 540rpx;
		height: 362rpx;
		overflow: hidden;
		position: fixed;
		top: 28%;
		left: 15%;
		z-index: 1001;
		background: rgba(255, 255, 255, 1);
		border-radius: 25rpx;
	}

	.modalContent {
		height: 30%;
	}

	.modalTitle {
		height: 65%;
		padding: 80rpx;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
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
		line-height: 100rpx;
		margin-top: 20rpx;
	}

	.modalLine {
		width: 1rpx;
		height: 108rpx;
		background-color: rgba(238, 238, 238, 1);
		position: absolute;
		top: 0%;
		left: 50%;
	}

	.active {
		color: #ffa044;
	}

	.btn_cancle,
	.btn_ok {
		width: 49%;
		text-align: center;
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
</style>
