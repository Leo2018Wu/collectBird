<template>
	<view class="facBar">
		<view class="iconImg">
		</view>
		<view class="textOverFlow">
			{{title}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			title:{
				type:String,
				"default":"家居礼包"
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.facBar{
		text-align: center;
		font-size: 25rpx;
		
	}
	.iconImg{
		width: 46rpx;
		height: 46rpx;
		background-color: #ACACAC;
		margin: 0 auto 19rpx auto;
	}
</style>
