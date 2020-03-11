<template>
	<view class="helpDetail">
		<view class="helpTitle">{{title}}</view>
		<view class="helpBox">
			<view class="helpLi" v-for="(item,index) in helpList[curIndex][idx]" :key="index">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				curIndex:null,
				idx:null,
				helpList:[
					[
						['首页→房源管理→添加房源，录入小区名、详细地址、上传小区照片（非必须），点击【保存】即可完成房源信息录入。','点击【继续添加房号】可以继续完善房号信息。'],
						['首页→房源管理→选择某个小区→添加房号，其中选择户型后会自动生成对应数量卧室，选择整租，将只有一个卧室显示。','点击某个卧室，可以继续完善卧室信息。'],
						['房间根据房屋户型自动生成，暂时不支持单独添加。']
					],
					[
						['首页→房源管理→选择房源，标识为【闲置】的卧室可以添加租客。'],
						['首页→租客管理，可以查看所有租客列表，点击可以查看详情，编辑租客信息。']
					],
					[
						['首页→账单管理，可以根据状态查看已生成账单和历史账单。在房号页面和租客页面，都会有账单提醒。'],
						['账单生成时间根据签约的起租日自动推算，根据下期交租日提前7天生成第一笔账单，会在签约完成时生成。']
					],
					[
						['报表可以查看某个二房东某个阶段的收支总额以及构成，目前可以按季度，按月份，按年查看。'],
						['净利润=所有收入-所有支出，其中租客押金和房东押金，不参与计算。']
					],
					[
						['收租鸟承诺对用户数据，以及房东录入数据采取严格的保密措施，对核心数据采取加密处理。'],
						['收租鸟的每位用户均享有60天的试用期，试用期间，功能全部开放。']
					]
				]
			}
		},
		onLoad(options) {
			console.log(options)
			this.title = options.title;
			this.curIndex = options.index;
			this.idx = options.idx;
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.helpDetail{
		padding: 0 36rpx;
		color: #333333;
	}
	.helpTitle{
		padding: 38rpx 0;
		font-size: 32rpx;
		font-weight: bold;
		border-bottom: 1rpx solid #ECECEC;
	}
	.helpLi{
		width: 100%;
		font-size: 30rpx;
		position: relative;
		padding-left: 32rpx;
	}
	.helpBox{
		padding: 42rpx 0;
		border-bottom: 1rpx solid #ECECEC;
	}
	.helpLi:not(:last-of-type){
		margin-bottom: 18rpx;
	}
	.helpLi::before{
		content: '';
		width: 12rpx;
		height: 12rpx;
		border-radius: 100%;
		background-color: #333333;
		position: absolute;
		top: 16rpx;
		left: 0;
	}
</style>
