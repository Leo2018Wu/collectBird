<template>
	<view>
		<span :style="{backgroundColor:bgColor,color:fontColor}" class="iconItem">{{title}}</span>
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
				"default":"添加房源"
			},
			bgColor:{
				type:String,
				"default":"#FFF2E5"
			},
			fontColor:{
				type:String,
				"default":"#FFA344"
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.iconItem{
		display: inline-block;
		padding: 4rpx 25rpx;
		border-radius: 5rpx;
		font-size: 26rpx;
	}
	
</style>
