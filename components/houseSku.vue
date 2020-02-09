<template>
	<view>
		<view class="itemBox" @click="myClick">
			<image class="houseImg" :src="houseInfoList.communityImgs[0]" mode="aspectFill"></image>
			<view class="itemRight">
				<view class="houseName textOverFlow">{{houseInfoList.communityName}}</view>
				<view class="addressBox">
					<image src="../static/addressIcon.png" mode="aspectFit"></image>
					<span class="textOverFlow">{{houseInfoList.communityAddress}}</span>
				</view>
				<view class="iconList">
					<view class="iconItem color0">{{houseInfoList.houseNum}}套</view>
					<view class="iconItem color1">{{houseInfoList.roomNum}}间</view>
					<view class="iconItem color2">闲置{{houseInfoList.idleRoom}}间</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			
		},
		props:{
			houseInfoList:{
				type:Object,
				"default":{
					communityImgs:['../static/el.jpg'],
					communityName:"新德公寓",
					communityAddress:"上海市浦东新区盛荣路",
					houseNum:1,
					roomNum:4,
					idleRoom:3
				}
			},
			isDetail:{
				type:Boolean,
				"default":false
			}
		},
		onLoad(){
			let _this  = this
			
			console.log(_this.houseInfoList)
		},	
		methods: {
			myClick(){
				this.$emit('myClick',this.houseInfoList)
			}
		}
	}
</script>

<style scoped>
	.itemBox{
		width: 100%;
		padding: 15rpx 0 27rpx 0;
		border-radius:12rpx;
		display: flex;
		justify-content: flex-start;
		background-color: #FFFFFF;
	}
	.houseImg{
		width: 234rpx;
		height: 176rpx;
		border-radius: 8rpx;
		margin: 0 27rpx 0 14rpx;
	}
	.itemRight{
		font-size: 32rpx;
		font-weight: bold;
		max-width: 380rpx;
		height: 176rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		/* margin-top: 15rpx; */
	}
	
	.addressBox{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #ABAAAA;
		font-size: 22rpx;
		font-weight: normal;
	}
	.addressBox image{
		width: 22rpx;
		height: 22rpx;
		margin-right: 7rpx;
	}
	.iconList{
		display: flex;
	}
	.iconItem{
		padding: 8rpx 25rpx;
		border-radius: 5rpx;
		font-size: 22rpx;
		margin-right: 10rpx;
	}
	.color0{
		background-color: #FFF2E5;
		color: #FFA344;
	}
	.color1{
		background-color: #E6F0FF;
		color: #4F93F5;
	}
	.color2{
		background-color: #FFECEC;
		color: #EB5E61;
		margin-right: 0;
	}
	.hiddeLi{
		display: none;
	}
</style>
