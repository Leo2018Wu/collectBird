<template>
	<view class="editBill">
		<view class="billTitle whiteBg divideBottom">{{titleContent}}-账单</view>
		<view class="form-container whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1 divideBottom">
					<evan-form-item label="收租日期" prop="date">
						<template v-slot:main>
							<picker class="form-input" disabled="true" mode="date" data-type="start" :value="date" :start="startDate" @change="bindDateChange">{{ date }}</picker>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="缴费周期" prop="rentCycle" :border="fales">
						<template v-slot:main>
							<view  class="form-input"><span>{{date}}</span>~<span>{{endCycleDate}}</span></view>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
				</view>
				<view class="section2" :class="{divideBottom : billType == 1}">
					<evan-form-item label="月租金" prop="rentUnitPrice" :border="billInfo.depositAmount">
						<template v-slot:main>
							<input class="form-input" type="digit" placeholder-class="form-input-placeholder" v-model="info.rentUnitPrice"
							 placeholder="0.00" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<view v-if="billInfo.depositAmount">
						<evan-form-item label="押金" prop="deposit"  :border="fales">
							<template v-slot:main>
								<input class="form-input"  type="digit" placeholder-class="form-input-placeholder" v-model="info.deposit"
								 placeholder="0.00" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
						</evan-form-item>
					</view>
				</view>
				<view v-if="billType == 0">
					<view class="billItems">费用明细</view>
					<view class="section3 divideBottom">
						<view v-for="(item,index) in billInfo.items" :key="index" ref="formItem">
							<evan-form-item :label="item.itemName == 1 ? '电费' :(item.itemName == 2 ? '均摊电费' : (item.itemName == 3 ? '水费' : '网费')) " prop="eleCost" >
								<template v-slot:main>
									<input class="form-input" :disabled="item.itemName == '1' || item.itemName== '2'" @click="goMeterRead(item)" type="digit" placeholder-class="form-input-placeholder" v-model="item.amount" :data-type="item.itemName" @input="getValue" 
									 placeholder="0.00" />
								</template>
								<template v-slot:tip>
									<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
								</template>
							</evan-form-item>
						</view>
					</view>
				</view>
			</evan-form>
			<view class="section4 whiteBg">
				<view class="remarkTitle">备注</view>
				<textarea class="secTip textOverFlow" v-model="remarks"
				 placeholder-class="textPlaceholder"></textarea></view>
		<!-- 	<view class="section4 whiteBg"><textarea class="secTip textOverFlow" placeholder="备注" v-model="remarks"
				 placeholder-class="textPlaceholder"></textarea></view> -->
		</view>
		<view class="saveBtn" @click="save">保存</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm,
		},
		data() {
			const currentDate = this.$getDate();
			return {
				titleContent:'',
				billType:'',
				billInfo:{},
				billId:null,
				eleCost:'',
				netCost:'',
				waterCost:'',
				commeleCost:'',
				date: currentDate,
				// endCycleDate:'2020-09-09',
				remarks:'',
				info:{
					rentUnitPrice:'',
					deposit:'',
				},
				rules:{
					rentUnitPrice:{
						required:true,
						message:'请输入月租金'
					},
					deposit:{
						required:true,
						message:'请输入押金'
					},
				}
			}
		},
		computed:{
			endCycleDate(){
				let _this = this
				let tempDate = moment(this.date)
							.add(_this.billInfo.rentMonthNum, 'month')
							.subtract(1, 'days');
				return  this.$getDate(tempDate)
			}
		},
		onShow(){
			this.getBillInfo(this.billId)
		},
		onLoad(options) {
			console.log(options)
			this.titleContent = options.titleContent;
			this.billType = options.billType;
			this.billId = options.billId;
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
				console.log(this.$refs.form)
			})
			
		},
		methods: {
			getValue(e){
				console.log(e)
				let type = e.currentTarget.dataset.type
				if(type == '3'){
					this.waterCost = e.detail.value
				}else if(type == '4'){
					this.netCost = e.detail.value
				}
			},
			goMeterRead(item){
				if(item.itemName == '1' || item.itemName == '2'){
					uni.navigateTo({
						url:'../MeterReading/MeterReading?billId='+this.billId
					})
				}
			},
			save(){
				let _this = this
				this.$refs.form.validate(res => {
					if(res){
						_this.billInfo.payRentDate = _this.date + ' 00:00:00';
						_this.billInfo.startDate = _this.date + ' 00:00:00';
						_this.billInfo.endDate = _this.endCycleDate + ' 00:00:00';
						_this.billInfo.total = _this.billType == 0 ? _this.info.rentUnitPrice : (Number(_this.info.rentUnitPrice) < 0 ? -Number(_this.info.rentUnitPrice) : Number(_this.info.rentUnitPrice));
						_this.billInfo.remarks = _this.remarks;
						if(_this.info.deposit){
							_this.billInfo.depositAmount = _this.billType == 0 ? _this.info.deposit : (Number(_this.info.deposit) < 0 ? -Number(_this.info.deposit) : Number(_this.info.deposit)) 
						}
						_this.billInfo.items.forEach((item,index)=>{
							console.log(item)
							if(item.itemName == '1'){
								console.log(_this.eleCost)
								_this.billInfo.items[index].amount = _this.eleCost
							}else if(item.itemName == '3'){
								_this.billInfo.items[index].amount = _this.waterCost
							}else if(item.itemName == '4'){
								_this.billInfo.items[index].amount = _this.netCost
							}else{
								_this.billInfo.items[index].amount = _this.commeleCost
							}
						})
						if(_this.billType == 1){
							_this.billInfo.items = null
						}
						_this.$request.post('/bill/update',_this.billInfo).then((result)=>{
							if(result.data.code == '200'){
								uni.showToast({
									title:'编辑成功',
									duration:1500
								})
								setTimeout(()=>{
									uni.navigateBack()
								},1500)
							}
						})
					}
				})
			},
			getBillInfo(id){
				let _this = this;
				_this.$request
					.post('/bill/findById', {
						id
					})
					.then(res => {
						console.log(res)
						_this.billInfo = res.data.data;
						_this.date =_this.billInfo.payRentDate.substr(0,10);
						_this.startCycleDate = _this.billInfo.startDate.substr(0,10);
						_this.endCycleDate = _this.billInfo.endDate.substr(0,10);
						_this.info.rentUnitPrice = _this.billType == 0 ?  _this.billInfo.total : '-'+_this.billInfo.total;
						_this.info.deposit = _this.billType == 0 ? _this.billInfo.depositAmount : '-'+_this.billInfo.depositAmount;
						_this.remarks = _this.billInfo.remarks;
						_this.billInfo.items.forEach((item,index)=>{
							if(item.itemName == '1'){
								_this.eleCost = item.amount
							}else if(item.itemName == '3'){
								_this.waterCost = item.amount
							}else if(item.itemName == '4'){
								_this.netCost = item.amount
							}else{
								_this.commeleCost = item.amount
							}
						})
					});
			},
			bindDateChange(e){
				console.log(e)
				this.date = e.detail.value
			},
		}
	}
</script>

<style scoped>
	.editBill {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
	}

	

	.billTitle {
		width: 100%;
		height: 94rpx;
		line-height: 90rpx;
		color: #444444;
		font-size: 32rpx;
		font-weight: bold;
		padding-left: 40rpx;
	}
	.whiteBg {
		background: #FFFFFF;
	}
	.divideBottom{
		border-bottom: 14rpx solid #FAFAFA;
	}

	.form-container {
		width: calc(100% - 34rpx);
		margin-left: 17rpx;
		color: #333333;
	}
	.section1,.section2,.section3,.section4{
		padding: 0 24rpx;
		border-radius: 5rpx;
	}

	.form-input {
		font-size: 34rpx;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
	.billItems{
		width: 100%;
		padding: 36rpx 0 26rpx 26rpx;
		color: #444444;
		font-size: 32rpx;
		font-weight: bold;
		background-color: #FAFAFA;
	}
	.secTip{
		width: 100%;
		min-height: 94rpx;
		/* padding: 20rpx 0; */
		font-size: 32rpx;
		color: #333333;
		margin-top: 20rpx;
	}
	.textPlaceholder {
		padding: 20rpx 0;
		color: #999999;
		font-size: 32rpx;
	}
	.saveBtn{
		width:257rpx;
		height:74rpx;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		border-radius:37rpx;
		margin: 128rpx auto 0 auto;
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 74rpx;
	}
	textarea{
		height: 94rpx;
	}
	.remarkTitle{
		padding: 28rpx 0;
		font-size: 34rpx;
		color: #999999;
		border-bottom: 2rpx solid #EBEBEB;
	}
</style>
