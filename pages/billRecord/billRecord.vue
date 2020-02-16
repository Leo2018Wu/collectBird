<template>
	<view class="billRecord">
		<view class="section1">
			<renter-info-bar :userInfo="userInfo" v-on:emitUserId="getEmit"></renter-info-bar>
		</view>
		<!-- <view class="addBar">
			<add-bar :title="'新账单'"></add-bar>
		</view> -->
		<view class="section2" v-if="latestBill.length != 0">
			<view class="billBarName">最新账单</view>
			<view class="content" @click="showBillDetail(item.id)" v-for="(item,index) in latestBill" :key="index">
				<view class="inner">
					<view class="contentRight" >
					<view class="billTitle">{{item.startDate.substr(0,10)}}账单</view>
					<view class="checkDate textOverFlow active">收租日期：{{item.payRentDate.substr(0,10)}}</view>
				</view>
				<view>{{item.total}}</view>
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
					<view class="checkDate textOverFlow">到账日期：{{item.payRentDate.substr(0,10)}}</view>
				</view>
				<view>{{item.total}}</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import renterInfoBar from '../../components/renterInfoBar.vue'
	import addBar from '../../components/addBar.vue'
	export default {
		components:{
			renterInfoBar,
			addBar
		},
		data() {
			return {
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
			console.log(this.userInfo)
			this.communityInfo = JSON.parse(options.commInfo)
			this.getBillRecord(this.userInfo.id)
		},
		onShow(){
			this.$request.post('/roomUser/findById',{
				tenantId:this.userInfo.id
			}).then((res)=>{
				this.userInfo = res.data.data
			})
		},
		methods: {
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
					url:'../billDetail/billDetail?billId='+id
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
					res.data.data.forEach((item,index) => {
						if(item.billStatus != 4){
							arr1.push(item)
						}else{
							arr2.push(item)
						}
						this.latestBill = arr1;
						this.returnBillRecord = arr2;
						console.log(this.latestBill)
						console.log(this.returnBillRecord)
					});
					// _this.checkIsHaveLatestBill(_this.returnBillRecord[0].endDate)
				}).catch(err=>{
					
				})
			},
		},
	
	}
</script>

<style scoped>
	.billRecord{
		width: 100%;
		height: 100vh;
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
		font-size: 30rpx;
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
				border-bottom: 3rpx solid #EBEBEB80;
	}
	.content{
		background-color: #FFFFFF;
		height: 128rpx;
		font-size: 30rpx;
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
		font-size: 24rpx;
		font-weight: bold;
	}
	.active{
		color: #FFA344;
	}
</style>
