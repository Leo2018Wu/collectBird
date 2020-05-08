<template>
	<view v-if="init">
		<view class="postDate">
			<view>{{showDate[1]}}月{{showDate[2]}}日</view>
			<view class="addr textOverFlow">{{postInfo.communityName}}-{{postInfo.buildingNo}}号{{postInfo.houseNo}}-卧{{postInfo.roomNo}}</view>
		</view>
		<view class="main">
			<view class="postIcon" :class="{blue:postInfo.accType == 1}">
				<image :src="'../../static/billFlowIcon0'+postInfo.conType+'.png'" mode="aspectFit"></image>
			</view>
			<view class="postRight">
				<view>{{name}}</view>
				<input type="number" v-model="price" @input="checkInput"/>
			</view>
		</view>
		<view class="textArea">
			<textarea class="secTip textOverFlow" v-model="remarks"
			 placeholder-class="textPlaceholder" placeholder="暂无备注"></textarea>
		</view>
		<view class="btnBox" v-if="!(postInfo.conType == 1 || postInfo.conType == 2 || postInfo.conType == 18 || postInfo.conType == 19)">
			<view class="del" @click="del">删除</view>
			<view class="save" @click="save">保存</view>
		</view>
	</view>
</template>

<script>
	import {moneyLimit} from '../../util/index.js'
	export default {
		data() {
			return {
				flowType:[
					{name:'租金',num:1},
					{name:'租金',num:2},
					{name:'租金',num:3},
					{name:'押金',num:4},
					{name:'电费',num:5},
					{name:'公摊电费',num:6},
					{name:'水费',num:7},
					{name:'网费',num:8},
					{name:'装修',num:9},
					{name:'维修',num:10},
					{name:'家电',num:11},
					{name:'中介费',num:12},
					{name:'推广费',num:13},
					{name:'工资',num:14},
					{name:'定金',num:15},
					{name:'物业费',num:16},
					{name:'停车费',num:17},
					{name:'退租',num:18},
					{name:'其他',num:99},
				],
				name:'',
				price:'',
				init:false,
				showDate:'',
				remarks:'',
				postInfo:{}
			}
		},
		computed:{
			
		},
		onLoad(options) {
			this.getPost(options.id)
		},
		methods: {
			checkInput(e){
				this.price = moneyLimit(e.detail.value)
			},
			save(){
				let _this = this
				_this.postInfo.amount = Math.abs(parseInt(_this.price))  
				_this.postInfo.remarks = _this.remarks
				_this.$request.post('/account/update',_this.postInfo).then((res)=>{
					if(res.data.code == 200){
						uni.showToast({
							title: '编辑成功',
							duration: 800
						})
						_this.refreshLastPage()
					}
				})
			},
			del(){
				let _this = this
				_this.$request.post('/account/delete',_this.postInfo).then((data)=>{
					if (data.data.code == 200) {
						uni.showToast({
							title: '删除成功',
							duration: 800
						})
						_this.refreshLastPage()
					}
				})
			},
			refreshLastPage(){
				let pages = getCurrentPages();
				if (pages.length > 1) {
					let beforePage = pages[pages.length - 2];
					beforePage.$vm.updateData()
				}
				setTimeout(() => {
					uni.navigateBack();
				}, 1500)
			},
			getPost(id){
				this.$request.post('/account/find',{
					id,
					landlordId:this.$store.state.landladyInfo.id
				}).then((res)=>{
					console.log(res)
					this.postInfo = res.data.data
					this.remarks = res.data.data.remarks
					this.price =  this.postInfo.accType == 1 ? this.postInfo.amount : -this.postInfo.amount
					this.showDate = res.data.data.accTime.split(" ")[0].split('-')
					this.name = this.flowType.filter(p=>p.num == res.data.data.conType)[0].name
					this.init = true
				})
			}
		}
	}
</script>

<style scoped>
	.postDate{
		width: 100%;
		padding: 40rpx 30rpx 20rpx 30rpx;
		color: #9A9A9A;
		font-size: 26rpx;
		display: flex;
		justify-content: flex-start;
	}
	.main{
		width: 100%;
		height: 110rpx;
		padding: 0 42rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #333333;
		font-size: 30rpx;
	}
	.addr{
		margin-left: auto;
	}
	.postIcon{
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background-color: #EB5E61;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 30rpx;
	}
	.postIcon image{
		width: 46rpx;
		height: 46rpx;
	}
	.postRight{
		width: calc(100% - 100rpx);
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #F5F5F5;
	}
	input{
		text-align: right;
	}
	.textArea{
		width: 100%;
		padding: 40rpx 32rpx 0 32rpx;
	}
	.secTip{
		width: 100%;
		height: 188rpx;
		font-size: 32rpx;
		color: #333333;
		margin-top: 20rpx;
		padding-bottom: 30rpx;
	}
	.blue{
		background-color: #5396FF;
	}
	.btnBox{
		width: calc(100% - 172rpx);
		height: 82rpx;
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 126rpx;
		left: 86rpx;
	}
	.btnBox view{
		width: calc((100% - 64rpx) / 2);
		height: 100%;
		text-align: center;
		line-height: 82rpx;
		font-size: 34rpx;
		border-radius: 41rpx;
	}
	.del{
		border:2rpx solid #D2D2D2;
		color: #656565;
	}
	.save{
		background:linear-gradient(-90deg,rgba(234,185,93,1) 0%,rgba(228,158,84,1) 100%);
		color: #FFFFFF;
	}
</style>
