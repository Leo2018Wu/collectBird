<template>
	<view class="houseSkuNew">
		<view class="contentBox" :style="{paddingLeft:paddingSelf+'rpx',paddingRight:paddingSelf+'rpx'}" @click="myClick">
			<view>{{item.communityName}}</view>
			<view class="bottomBox">
				<view class="communityBox">
					<view class="topItem"><span>{{item.houseNum}}</span>套</view>
					<view class="bottomItem">在租房源</view>
				</view>
				<view class="communityBox">
					<view class="topItem"><span>{{item.roomNum}}</span>间</view>
					<view class="bottomItem">在租房间</view>
				</view>
				<view class="communityBox">
					<view class="topItem"><span>{{item.idleRoom}}</span>间</view>
					<view class="bottomItem">闲置房间</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				"default":{
					communityName:"新德公寓",
					houseNum:1,
					roomNum:4,
					idleRoom:3
				}
			},
			paddingSelf:{
				type:Number,
				default:40,
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			// filterHouse(type){
			// 	this.$emit('myFilter',type)
			// },
			myClick(){
				this.$emit('myClick',this.item)
			}
		}
	}
</script>

<style scoped>
	.contentBox{
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		text-align: center;
		font-size: 34rpx;
		font-weight: bold;
		border: 1rpx solid #E7E7E7;
		border-radius: 12rpx;
		padding: 30rpx 40rpx 26rpx 40rpx;
	}
	.bottomBox{
		margin-top: 30rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.communityBox{
		height: 100%;
		width: fit-content;
		text-align: center;
		font-size: 24rpx;
		font-weight: normal;
	}
	.communityBox .bottomItem{
		color: #999999;
	}
	.topItem{
		color: #333333;
	}
	.topItem span{
		font-size: 50rpx;
		font-weight: bold;
		color: #333333;
	}
	.communityBox:last-of-type span{
		color: #EB5E61;
	}
</style>
