<template>
	<view class="chooseContainer" @click="aa">
		<cover-view class="mask"  @catchtouchmove="true"></cover-view>
			<cover-view class="list" @catchtouchmove="true">
				<cover-view class="title">
					{{title}}
				</cover-view>
				<cover-view class="chooseLi" :class="{active: currentChooseIndex == index}" v-for="(item,index) in list" :key="index" @click="chooseLi(item,index)">
					<cover-view style="height: 100%;line-height: 98rpx;"  :class="{inline: needTip && index == 3,textLeft:needTip && index == 3}">{{item}}</cover-view>
					<cover-view class="inline" style="color: #FFA044;font-size:26rpx;text-align:left" v-if="needTip && index == 3">(赠送2个月)</cover-view>
					<cover-view v-if="index < list.length-1" class="divide"></cover-view>
					<cover-image v-if="currentChooseIndex == index" src="../static/true-icon.png" mode="aspectFit"></cover-image>
				</cover-view>
			</cover-view>
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
			needTip:{
				type:Boolean,
				"default":false
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
		z-index: 999;
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		/* width: 100%;
		height: 100%; */
		background-color: #000000;
		opacity: 0.3;
	}
	.list{
		text-align: center;
		width: 600rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		position: fixed;
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
		position: relative;
		/* border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx; */
	}
	.title::before{
		content: '';
		width: 20rpx;
		height: 20rpx;
		background-color: #F09A42;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
	}
/* 	.title::after{
		content: '';
		width: 20rpx;
		height: 20rpx;
		background-color: #F09A42;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 999;
	} */
	.chooseLi{
		font-size: 30rpx;
		height: 97rpx;
		/* border-bottom: 1rpx solid #F6F6F6; */
		line-height: 98rpx;
		color: #888888;
		position: relative;
	}
	.chooseLi .inline{
		display: inline-block;
		height: 100%;
		line-height: 98rpx;
		width: 50%;
	}
	.chooseLi .inline:first-of-type{
		width: 54%;
	}
	.chooseLi .inline:last-of-type{
		width: 46%;
	}
	.divide{
		width: 100%;
		height: 2rpx;
		background-color: #F6F6F6;
		position: absolute;
		bottom: 0;
		left: 0;
	}
	
	.active{
		background-color: #FBFBFB;
		color: #F09A42;
	}
	.chooseLi:last-of-type{
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	.chooseLi cover-image{
		width: 33rpx;
		height: 23rpx;
		position: absolute;
		top: 36rpx;
		right: 37rpx;
	}
	.textLeft{
		text-align: right;
	}
</style>
