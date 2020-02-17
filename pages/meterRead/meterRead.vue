<template>
	<view class="meterRead">
		<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info"></evan-form>
		<view class="electricity">
			<view class="electricityTxt">电费</view>
			<view class="electricityDetail">
				<view class="left">抄表日期</view>
				<!-- <view class="date">{{ date }}</view> -->
				<view class="date">
					<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
						<evan-form-item prop="date">
							<template v-slot:main>
								<picker class="form-input" mode="date" :value="date" @change="bindDateChange">{{ date }}</picker>
								<!-- <input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info.date" /> -->
							</template>
						</evan-form-item>
					</evan-form>
				</view>
				<view class="right">
					<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
				</view>
			</view>
		</view>
		<view class="text">
			<view class="">上期读数</view>
			<view class="">本期读数</view>
			<view class="">费用</view>
		</view>
		<view class="money">
			<!-- <evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<evan-form-item label="租期" prop="keepDate" :border="false">
					<template v-slot:main>
						<input class="form-input" placeholder-class="form-input-placeholder" v-model="keepDate" placeholder="请选择" />
					</template>
				</evan-form-item>
			</evan-form> -->

			<view class="" style="width:33.33%"><input type="text" value="" v-model="prevNum" /></view>
			<view class="" style="width:30%"><input type="text" value="" v-model="currentNum" /></view>
			<view class="" style="width:9%"><input type="text" value="" v-model="amount" /></view>
			<!-- <view class="" style="width:33.33%">{{ last }}</view>
			<view class="" style="width:30%">{{ isthis }}</view>
			<view class="" style="width:8%">{{ money }}</view> -->
		</view>
		<view class="button" @click="submit">完成</view>
	</view>
</template>

<script>
import chooseList from '../../components/chooseList.vue';
import chnToNumber from '../../util/index';
import moment from 'moment';
import evanFormItem from '../../components/evan-form/evan-form-item.vue';
import evanForm from '../../components/evan-form/evan-form.vue';
export default {
	components: {
		evanFormItem,
		evanForm,
		chooseList
	},
	data() {
		const currentDate = this.getDate();
		return {
			date: currentDate,
			prevNum: '100',
			currentNum: '100',
			amount: '100',
			info: {
				date: ''
			},
			billInfo: {}
		};
	},
	onLoad(option) {
		console.log(option);
		console.log('onLoad', option);
		this.billInfo = JSON.parse(option.billInfo);
		console.log(this.billInfo);
	},
	methods: {
		bindDateChange(e) {
			console.log('nihaoa', e);
			this.date = e.detail.value;
		},
		getDate(value) {
			let date;
			if (value) {
				date = new Date(value);
			} else {
				date = new Date();
			}
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		submit() {
			let _this = this;
			// let item = [
			// 	{
			// 		itemName: '电费',
			// 		date: _this.date,
			// 		prevNum: _this.prevNum,
			// 		currentNum: _this.currentNum,
			// 		money: _this.money
			// 	}
			// ];
			_this.billInfo.items.map( v =>{
				if(v.itemName == "net"){
					v.noteDate = _this.date;
					v.prevNum= _this.prevNum
					v.currentNum =  _this.currentNum
					v.amount = _this.amount
				}
			})
			_this.billInfo.items = [..._this.billInfo.items]
			
			// _this.billInfo = { ..._this.billInfo, item: item };
			// _this.billInfo = { ..._this.billInfo };
			console.log('传参数', _this.billInfo);
			_this.$request.post('/bill/undate', _this.billInfo).then(res => {
				console.log('请求反回', res);
				if (res) {
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				}
			});
		}
	}
};
</script>

<style>
.meterRead {
	height: 100vh;
	width: 100%;
	background-color: #fafafa;
	position: relative;
}
.electricity {
	height: 177rpx;
	width: 100%;
	padding: 33rpx 60rpx 33rpx 41rpx;
	margin-bottom: 17rpx;
}
.electricityTxt {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
}
.electricityDetail {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	margin-top: 10rpx;
}
.left {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.rightPartImg {
	width: 24rpx;
	height: 24rpx;
}
.right {
	position: absolute;
	top: 36rpx;
	right: -31rpx;
}
.date {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
}
.text,
.money {
	padding: 0rpx 45rpx;
	width: 100%;
	height: 94rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
}
.money {
	padding: 0rpx 48rpx 0rpx 70rpx;
	color: rgba(153, 153, 153, 1);
}
.text {
	color: rgba(51, 51, 51, 1);
	border-bottom: 3rpx solid rgba(235, 235, 235, 1);
}
.button {
	position: absolute;
	bottom: 89rpx;
	left: 246rpx;
	width: 257rpx;
	height: 74rpx;
	background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
	border-radius: 37rpx;
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	text-align: center;
	line-height: 74rpx;
}
</style>
