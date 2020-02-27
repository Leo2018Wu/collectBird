<template>
	<view>
		<view class="numberBox">
			<view class="one" @click="del"></view>
			<view class="two">
				<input type="number" v-model="trVal" @input="getValue"/>
			</view>
			<view class="three" @click="add"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			valNum:{
				type:Number,
				default:3
			},
			maxNum:{
				type:Number,
				default:99
			},
			miuNum:{
				type:Number,
				default:0
			}
		},
		computed:{
			trVal(){
				return this.valNum
			}
		},
		data() {
			return {
			};
		},
		onLoad(){
		},
		methods:{
			getValue(e){
				this.valNum = e.detail.value ? e.detail.value : this.miuNum;
				this.emitVal()
			},
			del(){
				console.log('我被点击了')
				if(this.valNum != 0){
					if( this.valNum > this.miuNum){
						this.valNum--;
						this.emitVal()
					}
				}
			},
			add(){
				if(this.valNum < this.maxNum){
					this.valNum++;
					this.emitVal()
				}
			},
			emitVal(){
				this.$emit('emitVal',this.valNum)
			}
		}
	}
</script>

<style scoped>
	.numberBox{
		width: 100%;
		height: 100%;
		border: 1rpx solid #C6C6C6;
		border-radius: 5rpx;
		text-align: center;
		display: flex;
	}
	.one,.three{
		width: 24%;
		height: 42rpx;
		position: relative;
	}
	.two{
		width: calc(52% - 2rpx);
		height: 100%;
		color: #FFA549;
		font-size: 34rpx;
		border-left: 1rpx solid #C6C6C6;
		border-right: 1rpx solid #C6C6C6;
	}
	.one::after,.three::before{
		content: '';
		width: 25rpx;
		height: 2rpx;
		background-color: #999999;
		position: absolute;
		left: 50%;
		top: 23rpx;
		transform: translateX(-50%);
	}
	.three::after{
		content: '';
		width: 2rpx;
		height: 26rpx;
		background-color: #999999;
		position: absolute;
		left: 50%;
		top: 10rpx;
		transform: translateX(-50%);
	}
</style>
