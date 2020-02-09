<template>
	<view class="addHouse" @click="myClick()">
		<image src="../static/addHouse.png" mode="aspectFit"></image>
		<view>{{title}}</view>
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
			}
		},
		methods: {
			myClick(){
				this.$emit('addCommunity')
			}
		}
	}
</script>

<style scoped>
	.addHouse{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 34rpx;
		color: #FFA344;
	}
	.addHouse image{
		width: 34rpx;
		height: 34rpx;
		margin-right: 10rpx;
	}
</style>
