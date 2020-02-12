<template>
    <view class="reportForm">
		<view class="sectionOne">
			<view class="secDate" @click="showPicker">
				2020年2月
			</view>
			<view class="secProfit">
				纯利润10000
			</view>
		</view>
		<view class="pickerMask" v-if="visible" @click="pickerCancel"></view>
		<view class="pickerBox" v-if="visible">
			<view class="pickerTop">
				<view class="pickerCancel" @click="pickerCancel">取消</view>
				<view>选择时间</view>
				<view class="pickerSure" @click="pickerSure">确定</view>
			</view>
			<view class="pickerTypeList">
				<view class="pickerLiOut">
					<view class="pickerTypeLi" :class="{pickerTypeLiActive : pickerTypeCurIndex == index}" v-for="(item,index) in pickerTypeList" @click="choosePickerType(index)" :key="index">
						{{item}}
					</view>
				</view>
			</view>
			<picker-view v-if="pickerTypeCurIndex == 0" indicator-class="indicatorClass" :value="monthValue" @change="bindChange">
			    <picker-view-column>
			        <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
			    </picker-view-column>
			    <picker-view-column>
			        <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
			    </picker-view-column>
			</picker-view>
			<picker-view v-if="pickerTypeCurIndex == 1" indicator-class="indicatorClass" :value="seasonValue" @change="bindChange">
			    <picker-view-column>
						<view class="item" v-for="(item,index) in seasons" :key="index">{{item}}</view>
			    </picker-view-column>
			</picker-view>
			<picker-view v-if="pickerTypeCurIndex == 2" indicator-class="indicatorClass" :value="yearValue" @change="bindChange">
			    <picker-view-column>
						<view class="item" v-for="(item,index) in years" :key="index">{{item}}</view>
			    </picker-view-column>
			</picker-view>
		</view>
        
    </view>
</template>

<script>
	export default {
	    data: function () {
	        const date = new Date()
	        const years = []
	        const year = date.getFullYear()
	        const months = []
	        const month = date.getMonth() + 1
			const seasons = []
			const seasonsArr = ['01','03','04','06','07','09','10','12']
	        for (let i = 2015; i <= 2032; i++) {
	            years.push(i)
				seasonsArr.forEach((item,index) =>{
					if(index % 2 == 0){
						let par = i+'.'+seasonsArr[index]+'~'+i+'.'+seasonsArr[index+1]
						seasons.push(par)
					}
				})
					
	        }
	        for (let i = 1; i <= 12; i++) {
	            months.push(i)
	        }
	        return {
				pickerTypeCurIndex:0,
				pickerTypeList:['月','季','年'],
	            years,
	            year,
	            months,
	            month,
				seasons,
				seasonIndex:0,
	            monthValue: [year - 2015, month - 1],
				yearValue:[year - 2015],
	            visible: false,
	        }
	    },
		computed:{
			seasonValue(){
				let arr = [(this.year - 2015) * 4 + this.seasonIndex]
				return arr
			}
		},
		onLoad(){
			this.getSeasonIndex()
		},
	    methods: {
			showPicker(){
				this.visible = true;
			},
			pickerCancel(){
				this.visible = false;
			},
			pickerSure(){
				this.visible = false;
			},
			getSeasonIndex(){
				switch (this.month) {
					case 1:
					case 2:
					case 3:
						this.seasonIndex = 0
					break;
					case 4:
					case 5:
					case 6:
						this.seasonIndex = 1
					break;
					case 7:
					case 8:
					case 9:
						this.seasonIndex = 2
					break;
					case 10:
					case 11:
					case 12:
						this.seasonIndex = 3
					break;		
					default:
					break;
				}
			},
			choosePickerType(index){
				this.pickerTypeCurIndex = index
			},
	        bindChange: function (e) {
	            const val = e.detail.value
	            this.year = this.years[val[0]]
	            this.month = this.months[val[1]]
	            // this.day = this.days[val[2]]
	        }
	    }
	}
</script>

<style>
	.reportForm{
		width: 100%;
		height: 100%;
		min-height: 100vh;
	}
	.sectionOne{
		width: calc(100% - 60rpx);
		margin: 30rpx 0 38rpx 30rpx;
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333333;
	}
	.secDate{
		width: fit-content;
		height: 56rpx;
		display: flex;
		align-items: center;
		padding:0 24rpx;
		font-size: 36rpx;
		border:1px solid #DBDBDB;
		border-radius:28px;
		background-color: #F5F5F5;
	}
	.pickerMask{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #000000;
		opacity: 0.3;
	}
	.pickerBox{
		position: fixed;
		bottom: 0;
		z-index: 99;
		background: #FFFFFF;
		width: 100%;
		height: 740rpx;
	}
	.pickerTop{
		width: calc(100% - 60rpx);
		height: 90rpx;
		
		margin-left: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 36rpx;
		color: #333333;
		font-weight: 500;
	}
	.pickerCancel{
		font-size: 32rpx;
		color: #999999;
	}
	.pickerSure{
		font-size: 32rpx;
		color: #FFA044;
	}
	.pickerTypeList{
		width: 100%;
		border-top: 1rpx solid #EEEEEE;
	}
	.pickerTypeLi{
		width: 120rpx;
		height: 54rpx;
		line-height: 54rpx;
		text-align: center;
		color: #FFA044;
		font-size: 28rpx;
		font-weight: 500;
	}
	.pickerTypeLi:first-of-type ,.pickerTypeLi:last-of-type{
		border-left: 1rpx solid #FFA044;
		border-right: 1rpx solid #FFA044;
	}
	.pickerTypeLi:first-of-type{
		border-top-left-radius: 5rpx;
		border-bottom-left-radius: 5rpx;
	}
	.pickerTypeLi:last-of-type{
		border-top-right-radius: 5rpx;
		border-bottom-right-radius: 5rpx;
	}
	.pickerLiOut{
		display: flex;
		width: fit-content;
		margin: 60rpx auto 0 auto;
		border-top: 1rpx solid #FFA044;
		border-bottom: 1rpx solid #FFA044;
		border-radius: 5rpx;
	}
	.pickerTypeLiActive{
		background-color: #FFA044;
		color: #FFFFFF;
	}
	.seasonsPicker{
		width: 60%;
		height: 300rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	picker-view{
		width: 100%;
		height: 480rpx;
		position: fixed;
		bottom: 0;
	}
	.indicatorClass{
		background-color: #FAFAFA;
		z-index: -1;
	}
	.item{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
