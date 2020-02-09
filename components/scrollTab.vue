<template>
	<view>
		<scroll-view class="scrollView" scroll-x="true" >
			<span :class="{active : currentIndex == index}"  @click="choose(item,index)" class="tabLi" v-for="(item,index) in list" :key="index">{{item}}</span>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex:null
			}
		},
		props:{
			list:{
				type:Array,
				"default":['A','B','C','D','E','F',
				'G','H','I','J','K','L'
				,'M','N','O','P','Q','R','S'
				,'T','U','V','W','X','Y','Z']
			}
		},
		methods: {
			choose(item,index){
				item = this.currentIndex == index ? null : item;
				this.currentIndex = this.currentIndex == index ? null : index;
				this.$emit('return-tab',item)
			}
		}
	}
</script>

<style scoped>
	.scrollView{
		width: 100%;
		height: 52rpx;
	}
	.tabLi{
		display: inline-block;
		width: 104rpx;
		border-radius: 26rpx;
		text-align: center;
		line-height: 52rpx;
		font-size: 28rpx;
		background-color: #FAFAFA;
		margin-right: 10rpx;
	}
	.active{
		background-color: #FFF2E5;
		color: #FFA344;
	}
</style>
