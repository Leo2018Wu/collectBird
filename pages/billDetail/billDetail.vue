<template>
	<view class="billDetail" v-if="init">
		<view class="section0">
			<view class="profitContainer">
				<view class="profitBox">
					<view class="profitBar">应收(元)</view>
					<span>{{billInfo.total}}</span>
				</view>
				<view v-if="billInfo.billStatus == 4" class="profitBox">
					<view class="profitBar">实收(元)</view>
					<span>{{billInfo.total}}</span>
				</view>
			</view>
			<view class="houseAddr">新德公寓-202-快乐时光</view>
		</view>
		<view class="section1">
			<view class="billStatus">
				<image v-if="billInfo.billStatus == 4" class="billStatusBg" src="../../static/hasCheck.png" mode="aspectFit"></image>
				<span class="billTitle">账单状态</span>
				<span v-if="billInfo.billStatus != 4" class="statusDes0">未到账</span>
				<span v-if="billInfo.billStatus == 4" class="statusDes1">已到账</span>
			</view>
			<view class="billDateBox">
				<view class="billDateLi">
					<span class="billDateTitle">收租日期</span>
					<span>{{billInfo.startDate}}</span>
				</view>
				<view class="billDateLi">
					<span class="billDateTitle">缴费周期</span>
					<span class="billDate">{{billInfo.startDate}} ~ {{billInfo.endDate}}</span>
				</view>
					<view class="billDateLi" v-if="billInfo.billStatus == 4">
						<span class="billDateTitle">到账日期</span>
						<span>{{billInfo.payRentDate}}</span>
					</view>
					<view class="billDateLi" v-if="billInfo.billStatus == 4">
						<span class="billDateTitle">收款方式</span>
						<span class="billDate">现金</span>
					</view>
			</view>
			<view class="billDateBox">
				<view class="billDateLi">
					<span class="billDateTitle">租金</span>
					<span>{{billInfo.total}}</span>
				</view>
				<view class="billDateLi">
					<span class="billDateTitle">押金</span>
					<span class="billDate">{{billInfo.total}}</span>
				</view>
			</view>
			
			<!-- <view class="costDetail">费用明细</view>
			<view class="electricBox" v-for="(item,index) in billInfo.items" :key="index">
				<view class="elecRight" >
					<view  class="unitPrice">
						{{item.itemName}}<span>1.00元/度</span>
					</view>
					<view v-if="item.type == 1" class="eleCostTotal">{{item.quantity}}{{"度" | addSpace}} ({{item.currentNum}}-{{item.prevNum}}）</view>
					<view v-if="item.type == 1">抄表日期: {{item.noteDate}}</view>
				</view>
				<view class="priceTotal">{{item.amout}}</view>
			</view> -->
			
			<!-- <view class="waterBox">
				<view class="waterOuter">
					<span class="waterBar">水费</span>
					<span class="priceTotal">30.00</span>
				</view>
			</view> -->
		</view>
		<view class="remarks">暂无备注</view>
		<view class="section3" v-if="billInfo.billStatus == 4">
			<view class="sendBillBox">
				<image class="sendIcon" src="../../static/sendBill.png" mode="aspectFit"></image>
				<view>发送账单</view>
			</view>
		</view>
		<view class="section2" v-else>
			<view class="sendBillBox" >
				<image class="sendIcon" src="../../static/eleWater.png" mode="aspectFit"></image>
				<view>抄表</view>
			</view>
			<view class="sendBillBox">
				<image class="sendIcon" src="../../static/sendBill.png" mode="aspectFit"></image>
				<view>发送账单</view>
			</view>
			<view  class="sureBtn" @click="checkMoney">到账</view>
		</view>
	</view>
</template>

<script>
	import dateForm from '../../util/index.js'
	export default {
		data() {
			return {
				init:false,
				billId:null,
				billInfo:{}
			}
		},
		onLoad(option) {
			console.log(option)
			this.billId = option.billId
			this.getBillDetail(option.billId)
		},
		methods: {
			getBillDetail(id){
				let _this = this;
				_this.$request.post('/bill/findById',{
					id
				}).then((res) =>{
					_this.billInfo = res.data.data
					_this.billInfo.startDate = dateForm.dateForm(_this.billInfo.startDate)
					_this.billInfo.endDate = dateForm.dateForm(_this.billInfo.endDate)
					_this.billInfo.payRentDate = dateForm.dateForm(_this.billInfo.payRentDate)
					_this.init = true;
				})
			},
			checkMoney(){
				let _this = this;
				_this.$request.post('/bill/updateStatus',{
					id:_this.billId,
					billStatus:'4',
				}).then((res) =>{
					console.log(res)
					if(res.data.code == '200'){
						uni.showToast({
							title:'到账成功'
						})
					}
					_this.getBillDetail(this.billId)
				})
			}
		},
		
	}
</script>

<style scoped>
	.billDetail{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FAFAFA;
	}
	.section0{
		width: 100%;
		/* height: 234rpx; */
		background-color: #F09A42;
		color: #FFFFFF;
		padding: 18rpx 40rpx 20rpx 40rpx;
		font-size: 34rpx;
	}
	.profitContainer{
		display: flex;
		justify-content: space-between;
	}
	.profitBox{
		width: fit-content;
	}
	.profitBar{
		margin-bottom: 20rpx;
	}
	.profitBox span{
		font-size: 60rpx;
		font-weight: bold;
	}
	.houseAddr{
		font-size: 30rpx;
		margin-top: 10rpx;
	}
	.section1{
		padding: 17rpx;
	}
	.billStatus,.billDateLi{
		height: 93rpx;
		width: 100%;
		padding: 24rpx;
		border-radius: 5rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		font-size: 30rpx;
		margin-bottom: 17rpx;
	}
	.billDateLi{
		margin-bottom:0;
		height: 100%;
	}
	.billDateLi:not(:last-of-type)::after{
		content: "";
		width: calc(100% - 48rpx);
		height: 4rpx;
		background-color: #EBEBEB80;
		position: absolute;
		bottom: -2rpx;
		left: 24rpx;
	}
	.billStatusBg{
		position: absolute;
		width: 140rpx;
		height: 140rpx;
		top: -16rpx;
		right: 160rpx;
		z-index: 10;
	}
	.billTitle{
		margin-right: auto;
	}
	.billDateTitle{
		color: #999999;
		margin-right: auto;
	}
	
	.statusDes1{
		color: #37BF6A;
	}
	.statusDes0{
		color: #EB5E61;
	}
	.billDateBox{
		margin-bottom: 14rpx;
		border-radius: 5rpx;
	}
	.costDetail{
		padding: 25rpx;
		font-size: 30rpx;
	}
	.electricBox{
		padding:  32rpx 26rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #999999;
		font-size: 26rpx;
		border-radius: 5rpx;
	}
	.elecRight{
		margin-right: auto;
	}
	.priceTotal{
		font-size: 30rpx;
		color: #444444;
	}
	.unitPrice{
		width: 100%;
		text-align: right;
		color: #333333;
		font-size: 30rpx;
	}
	.unitPrice span{
		margin-left: 20rpx;
		color: #999999;
		font-size: 26rpx;
	}
	.eleCostTotal{
		margin: 22rpx 0;
	}
	.waterBox{
		padding: 0 26rpx;
		background-color: #FFFFFF;
		border-radius: 5rpx;
	}
	.waterOuter{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-top: 3rpx solid #EBEBEB80;
		height: 94rpx;
	}
	.waterBar{
		font-size: 30rpx;
		color: #333333;
		margin-right: auto;
	}
	.remarks{
		width: calc(100% - 34rpx);
		margin: 14rpx 0 0 17rpx;
		height: 93rpx;
		line-height: 93rpx;
		padding-left: 26rpx;
		color: #999999;
		font-size: 30rpx;
		background-color: #FFFFFF;
		border-radius: 5rpx;
	}
	.section2{
		margin-top: 14rpx;
		height: 128rpx;
		width: 100%;
		padding-right: 40rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		box-shadow:0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.section3{
		height: 128rpx;
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		justify-content:center;
		align-items: center;
		box-shadow:0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.sureBtn{
		width: 218rpx;
		height: 92rpx;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		border-radius:18rpx;
		color: #FFFFFF;
		font-size: 34rpx;
		text-align: center;
		line-height: 92rpx;
		margin-left: 82rpx;
	}
	.sendBillBox{
		height: 82rpx;
		width: fit-content;
		text-align: center;
		font-size: 28rpx;
	}
	.sendBillBox:first-of-type{
		margin-right: 82rpx;
	}
	.sendIcon{
		width: 40rpx;
		height: 40rpx;
		margin: 0 auto;
	}
</style>
