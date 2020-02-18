<template>
	<view>
		<view class="section" @click="emit()">
			<!-- <image v-if="userInfo.userImg" class="renterAvatar" :src="userInfo.userImg" mode="aspectFill"></image> -->
			<image v-if="userInfo.tenantSex == 0" class="renterAvatar" src="../static/defaultMale.png" mode="aspectFill"></image>
			<image v-else class="renterAvatar" src="../static/defaultFemale.png" mode="aspectFill"></image>
			<view class="renterInfo">
				<view class="infoTop">
					<span>{{userInfo.tenantName}}</span>
					<image class="renterSex" v-if="userInfo.tenantSex == 0" src="../static/male.png" mode="aspectFit"></image>
					<image class="renterSex" v-else src="../static/female.png" mode="aspectFit"></image>
				</view>
				<view class="infoBottom textOverFlow">
					{{userInfo.tenantPhone}}
				</view>
			</view>
			<image class="renterArrow" src="../static/right_arrow.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
	
		},
		props:{
			userInfo:{
				type:Object,
				"default":{
					userImg:'../static/el.jpg',
					userName:"小铭",
					userSex:"0",
					phoneNumber:"1111111111"
				}
			}
		},
		onLoad() {
			console.log(this.userInfo)
		},
		methods:{
			emit(){
				console.log('sssssssssss',this.userInfo)
				this.$emit('emitUserId',this.userInfo)
			}
		}
	}
</script>

<style scoped>
	.section{
		display: flex;
	}
	.renterInfo{
		width: calc(100% - 140rpx);
	}
	.renterAvatar{
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}
	.infoTop{
		display: flex;
		align-items: center;
		font-size: 34rpx;
	}
	.renterSex{
		width: 29rpx;
		height: 29rpx;
		margin-left: 19rpx;
	}
	.renterArrow{
		justify-self: flex-end;
		align-self: center;
		width: 30rpx;
		height: 56rpx;
	}
	.infoBottom{
		font-size: 30rpx;
		color: #888888;
	}
</style>
