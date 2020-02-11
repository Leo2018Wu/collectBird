<template>
	<view class="help">
		<view class="containerItem" v-for="(item,index) in list" :key="index">
			<view class="containerIn" @click="showRenterList(index)">
				<view class="question">{{item.question}}</view>
				<view class="rightPart">
					<view :class="[isShow && currentIndex == index ? 'tips1' : 'tips0']"></view>
					<!-- <image class="rightPartImg1" :class="{active:isShowImg && currentIndex == index}" src="../../static/down_s.png" mode=""></image>
					<image class="rightPartI mg2" :class="{active:!isShowImg && currentIndex == index}" src="../../static/up_s.png" mode=""></image> -->
				</view>
			</view>
			<view class="detail" :class="{active:isShow && currentIndex == index}">
				<view class="" v-for="(p,index) in item.detail" :key="index">
					<view class="detailItem">
						<view class="dot"></view>
						<view class="detailText">{{p}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				currentIndex:0,
				list:[
					{
						question:"收租鸟是什么?",
						detail:['收租鸟是一款出租房屋管理工具，方便房东通过简单高效的操作完成例如房源、租客、账单等管理需求，轻松处理收租全流程。']
					},
					{
						question:"如何添加房源?",
						detail:[
							'首页>房源管理>添加房源，录入小区名、详细地址、上传小区照片（非必须），点击【保存】即可完成房源信息录入。',
							'点击【继续添加房号】可以继续完善房号信息。'
							]
					},
					{
						question:"如何添加房号?",
						detail:[
							'首页>房源管理>选择某个小区>添加房号，其中选择户型后会自动生成对应数量卧室，选择整租，将只有一个卧室显示。',
							'点击某个卧室，可以继续完善卧室信息。'
							]
					},
					{
						question:"如何添加房间?",
						detail:['房间根据房屋户型自动生成，暂时不支持单独添加。']
					},
					{
						question:"如何添加租客?",
						detail:['首页>房源管理>选择房源，标识为[闲置]的卧室可以添加租客。']
					},
					{
						question:"如何查看账单?",
						detail:[
							'首页>账单管理，可以根据状态查看已生成账单和历史账单。',
							'在房号页面和租客页面，都会有账单提醒。'
							]
					},
					{
						question:"账单如何生成?",
						detail:[
							'账单生成时间根据签约的起租日自动推算，根据下期交租日提前7天生成。',
							'第一笔账单，会在签约完成时生成。'
						]
					}
				]
			}
		},
		methods: {
			showRenterList(index){
				console.log(index)
				this.currentIndex = index;
				this.isShow = !this.isShow;
			}
		}
	}
</script>

<style>
	.help{
		height: 100hv;
		width: 100%;
		border-top: 1rpx solid #DBDBDB;
	}
	.containerItem{
		/* height: 311rpx; */
		width: 100%;
		padding: 0rpx 36rpx;
	}
	.containerIn{
		width: 678rpx;
		height: 109rpx;
		border-bottom: 1rpx solid rgba(236,236,236,1);
		display: flex;
		justify-content:space-between;
		align-items:center;
	}
	.question{
		font-size:32rpx;
		font-family:PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:36rpx;
	}
	.rightPart{
		width: 24rpx;
		height: 24rpx;
		position: relative;
	}
	.detail{
		width: 100%;
		display: none;
		padding: 23rpx 0rpx;
		border-bottom: 1rpx solid #ECECEC;
	}
	.detailItem{
		position: relative;
		margin-top: 20rpx;
	}
	.dot{
		width:12rpx;
		height:12rpx;
		background:rgba(51,51,51,1);
		border-radius:50%;
		margin-right: 19rpx;
		margin-top: 16rpx;
		display: inline-block;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}
	.detailText{
		font-size:30rpx;
		font-family:PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:40rpx;
		display: inline-block;
		margin-left: 30rpx;
	}
	
	.active{
		display: block;
	}
	.tips0{
		width: 24rpx;
		height: 24rpx;
		background-image: url(../../static/down_s.png);
		background-repeat:no-repeat;
		background-position: 50% 50%;
		background-size: 24rpx 24rpx;
	}
	.tips1{
		width: 24rpx;
		height: 24rpx;
		background-image: url(../../static/up_s.png);
		background-repeat:no-repeat;
		background-position: 50% 50%;
		background-size: 24rpx 24rpx;
	}
</style>
