<template>
	<view class="chooseContainer" @click="aa">
		<view class="mask"></view>
			<view class="list">
				<view class="title">
					{{title}}
				</view>
				<view class="chooseLi" :class="{active: currentChooseIndex == index}" v-for="(item,index) in list" :key="index" @click="chooseLi(item,index)">
					{{item}}
					<image v-if="currentChooseIndex == index" src="../static/true-icon.png" mode="aspectFit"></image>
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		props:{
			title:{
				type:String,
				"default":'选择户型'
			},
			list:{
				type:Array,
				"default":[]
			},
			currentChooseIndex:null
		},
		// computed:{
		// 	currentIndex(){
		// 		return this.currentChooseIndex
		// 	}
		// },
		
		data() {
			return {
				// currentIndex:null,
			};
		},
		methods:{
			aa(){
				this.$emit('close')
			},
			chooseLi(item,index){
				this.currentIndex = index;
				let data = {
					newVal : item,
					index
				}
				this.$emit('emitClick',data)
			}
		}
	}
</script>

<style scoped>
	.chooseContainer{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 99;
	}
	.mask{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #000000;
		opacity: 0.3;
	}
	.list{
		text-align: center;
		width: 600rpx;
		height: fit-content;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		position: absolute;
		z-index: 100;
		top: 50%;
		left: 75rpx;
		transform: translateY(-50%);
	}
	.title{
		color: #FFFFFF;
		background-color: #F09A42;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		font-weight: bold;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.chooseLi{
		font-size: 30rpx;
		height: 97rpx;
		border-bottom: 1rpx solid #F6F6F6;
		line-height: 98rpx;
		color: #888888;
		position: relative;
	}
	.active{
		background-color: #FBFBFB;
		color: #F09A42;
	}
	.chooseLi:last-of-type{
		border-bottom: none;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	.chooseLi image{
		width: 33rpx;
		height: 23rpx;
		position: absolute;
		top: 36rpx;
		right: 37rpx;
	}
</style>
