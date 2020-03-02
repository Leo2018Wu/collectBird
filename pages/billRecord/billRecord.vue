<template>
	<view class="billRecord">
		<view class="section1">
			<renter-info-bar :userInfo="userInfo" v-on:emitUserId="getEmit"></renter-info-bar>
		</view>
		<!-- <view class="addBar">
			<add-bar :title="'新账单'"></add-bar>
		</view> -->
		<view class="noLatestBill" v-if="latestBill.length == 0">暂无最新账单</view>
		<view class="section2" v-if="latestBill.length != 0">
			<view class="billBarName">最新账单</view>
			<view class="content" @click="showBillDetail(item.id)" v-for="(item,index) in latestBill" :key="index">
				<view class="inner">
					<view class="contentRight" >
					<view class="billTitle">{{item.startDate.substr(0,10)}}账单</view>
					<view class="checkDate textOverFlow active">收租日期：{{item.payRentDate.substr(0,10)}}</view>
				</view>
				<view>{{item.totalAmount}}</view>
				</view>
			</view>
		</view>
		<view class="section2" v-if="returnBillRecord.length != 0">
			<view class="billBarName">历史账单</view>
			<view class="content" @click="showBillDetail(item.id)" v-for="(item,index) in returnBillRecord" :key="index">
				<view class="inner">
				<image v-if="item.billStatus  == 4 " class="checkBg" src="../../static/hasCheck.png" mode="aspectFit"></image>
					<view class="contentRight" >
					<view class="billTitle">租金收入</view>
					<view class="checkDate textOverFlow">到账日期：{{item.arrivalDate.substr(0,10)}}</view>
				</view>
				<view>{{item.totalAmount}}</view>
				</view>
			</view>
		</view>
		<tip-modal v-if="isShowTipModal" :oneButton="true" :title="'提示'" :describition="'您有未确认账单，请先确认。'" v-on:emitCancel="hideTipModal"></tip-modal>
		<view class="latestBillBox">
			<view class="latestBill" @click="getLatestBill">生成最新账单</view>
		</view>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue'
	import moment from 'moment'
	import renterInfoBar from '../../components/renterInfoBar.vue'
	import addBar from '../../components/addBar.vue'
	export default {
		components:{
			renterInfoBar,
			addBar,
			tipModal
		},
		data() {
			return {
				isShowTipModal:false,
				userInfo:{},
				// isHaveLatestBill:false,
				returnBillRecord:[],
				latestBill:[],
				roomId:'',
				communityInfo:{}
			}
		},
		onLoad(options) {
			this.roomId = options.roomId;
			this.userInfo = JSON.parse(options.userInfo) 
			this.communityInfo = JSON.parse(options.commInfo)
		},
		onShow(){
			this.getBillRecord(this.userInfo.id)
			this.getRenterInfo(this.userInfo.id)
		},
		methods: {
			hideTipModal(){
				this.isShowTipModal = false
			},
			getLatestBill(){
				if(this.latestBill.length != 0){
					this.isShowTipModal = true
				}else{
					// let par = this.returnBillRecord[0]
					let par = {
						landlordId:this.$store.state.landladyInfo.id,
						billType:0,
						tenantId:this.userInfo.id
					}
					this.$request.post('/bill/createBill',par).then((res)=>{
						if(res.data.code == 200){
							this.getBillRecord(this.userInfo.id)
							uni.showToast({
								title:'最新账单已生成'
							})
						}
					})
				}
			},
			getRenterInfo(id){
				this.$request.post('/roomUser/findByTenantId',{
					tenantId:id
				}).then((res)=>{
					this.userInfo = res.data.data
				})
			},
			updateData(){
				
			},
			getEmit(e){
				console.log(e)
				uni.navigateTo({
					url:'../addRenter/addRenter?commInfo='+JSON.stringify(this.communityInfo)
					+'&roomId='+this.roomId+'&userId='+this.userInfo.id
				})
			},
			showBillDetail(id){
				uni.navigateTo({
					url:'../billDetail/billDetail?billId='+id+'&tenantId='+this.userInfo.id
				})
			},
			// checkIsHaveLatestBill(endDate){
			// 	this.isHaveLatestBill = moment(endDate).isAfter(new Date())
			// 	if(this.isHaveLatestBill){
			// 		const res =	this.returnBillRecord.shift()
			// 		this.latestBill.push(res)
			// 	}
			// },
			getBillRecord(id){
				let _this = this;
				let arr1 = [];
				let arr2 = [];
				_this.$request.post("/bill/findByTenantId",{
					tenantId:id
				}).then((res)=>{
					if(res.data.data.length == 0){
						this.latestBill = [];
						this.returnBillRecord = [];
					}
					res.data.data.forEach((item,index) => {
						if(item.billStatus != 4){
							arr1.push(item)
						}else{
							arr2.push(item)
						}
						this.latestBill = arr1;
						this.returnBillRecord = arr2;
					});
				}).catch(err=>{
					
				})
			},
		},
	
	}
</script>

<style scoped>
	.billRecord{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		padding-bottom: 140rpx;
		background-color: #FAFAFA;
	}
	.section1{
		padding: 33rpx 40rpx;
		margin-bottom: 14rpx;
		background-color: #FFFFFF;
	}
	.addBar{
		width: 100%;
		padding: 36rpx 0;
		margin-bottom: 14rpx;
		background-color: #FFFFFF;
	}
	.section2{
		background-color: #FFFFFF;
	}
	.billBarName{
		width: 100%;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color:#BBBBBB;
		text-align: right;
		background-color: #FAFAFA;
	}
	.inner{
			position: relative;
			border-radius: 5rpx;
		display: flex;
		justify-content: flex-start;
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		padding: 26rpx 0;
	}
	.content:not(:last-child){
		border-bottom: 1rpx solid #EBEBEB;
	}
	.content{
		background-color: #FFFFFF;
		height: 128rpx;
		font-size: 32rpx;
		margin-bottom: 14rpx;
	}
	.checkBg{
		width: 96rpx;
		height: 96rpx;
		position: absolute;
		top:19rpx;
		right: 144rpx;
	}
	.contentRight{
		margin-right: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.checkDate{
		color: #999999;
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 6rpx;
	}
	.active{
		color: #FFA344;
	}
	.noLatestBill{
		width: 100%;
		color: #BBBBBB;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin: 50rpx 0;
	}
	.latestBill{
		width:378rpx;
		height:74rpx;
		font-size: 34rpx;
		line-height: 74rpx;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		border-radius:37rpx;
		color: #FFFFFF;
		text-align: center;
	}
	.latestBillBox{
		width: 100%;
		height: 128rpx;
		box-shadow:0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
	}
</style>
