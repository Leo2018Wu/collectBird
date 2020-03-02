<template>
	<view class="meterReading">
		<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
			<view class="section0 divideBottom whiteBg">
				<evan-form-item label="抄表日期" prop="readDate" fontBold="true" :border="false">
					<template v-slot:main>
						<picker class="form-input" mode="date" data-type="start" :value="readDate" :start="startDate" @change="bindDateChange">{{ readDate }}</picker>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</view>
			<view class="divideBar">个人电费</view>
			<view class="section1 whiteBg divideBottom">
				<view class="formOuter">
					<evan-form-item label="上期读数" prop="preNum">
						<template v-slot:main>
							<input class="form-input inputColor" type="digit"  placeholder-class="form-input-placeholder" v-model="info.preNum"
							 placeholder="0.00" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="本期读数" prop="curNum">
						<template v-slot:main>
							<input class="form-input inputColor" type="digit" placeholder-class="form-input-placeholder" @input="inputChangeHandle"  v-model="info.curNum"
							 placeholder="0.00" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="费用" prop="eleCost" :border="false">
						<template v-slot:main>
							<input class="form-input inputColor" disabled="true" type="digit" placeholder-class="form-input-placeholder" v-model="amount"
							 placeholder="0.00" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
				</view>
				
			</view>
			<view class="" v-if="hasCommonEle">
				<view class="divideBar">均摊电费</view>
				<view class="section2 whiteBg">
					<view class="formOuter">
						<evan-form-item label="上期读数" prop="commPreNum">
							<template v-slot:main>
								<input class="form-input inputColor" type="digit" placeholder-class="form-input-placeholder" v-model="info.commPreNum"
								 placeholder="0.00" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
						</evan-form-item>
						<evan-form-item label="本期读数" prop="commCurNum">
							<template v-slot:main>
								<input class="form-input inputColor" type="digit" placeholder-class="form-input-placeholder" @input="inputChangeHandleComm"  v-model="info.commCurNum"
								 placeholder="0.00" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
						</evan-form-item>
						<evan-form-item label="总电费" prop="commEleCost">
							<template v-slot:main>
								<input class="form-input inputColor" disabled="true" type="digit" placeholder-class="form-input-placeholder" v-model="commEleCost"
								 placeholder="0.00" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
						</evan-form-item>
						<view class="eleCommonBottom">
							<span>均摊人数</span>
							<view class="eleNumBox">
								<number-box :valNum="tenantNum" v-on:emitVal='returnVal'></number-box>
							</view>
						</view>
						<evan-form-item label="均摊电费" prop="commEleCostPer" :border="false">
							<template v-slot:main>
								<input class="form-input inputColor" disabled="true" type="digit" placeholder-class="form-input-placeholder" v-model="commEleCostPer"
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
		<cover-view class="btnBoxxx">
			<cover-view class="submitBtn" @click="submit">完成</cover-view>
		</cover-view>
		
	</view>
</template>

<script>
	import numberBox from '../../components/numberBox.vue'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm,
			numberBox
		},
		
		data() {
			const currentDate = this.$getDate();
			return {
				init:false,
				billInfo:{},
				hasCommonEle:false,
				eleInfo:{},
				commEleInfo:{},
				date: currentDate,
				tenantNum:'',
				info:{
					preNum:'0',
					curNum:'',
					commPreNum:'',
					commCurNum:'',
				},
				rules:{
					curNum:{
						required:true,
						message:'请输入私人电费本期读数'
					},
					preNum:{
						required:true,
						message:'请输入私人电费上期读数'
					},
					commPreNum:{
						required:false,
						message:'请输入均摊电费上期读数'
					},
					commCurNum:{
						required:true,
						message:'请输入均摊电费本期读数'
					},
				}
			}
		},
		computed:{
			amount() {
				let _this = this
				console.log(this.info.curNum,this.info.preNum)
				return parseInt((this.info.curNum - this.info.preNum) * this.eleInfo.unitPrice) <= 0  ? '0.00' : (this.info.curNum - this.info.preNum) * this.eleInfo.unitPrice+
					'.00';
				},
			commEleCost(){
				let _this = this
				console.log(this.info.commCurNum,this.info.commPreNum,this.commEleInfo.unitPrice)
				return parseInt((this.info.commCurNum - this.info.commPreNum) * this.commEleInfo.unitPrice)  <= 0 ? '0.00' : (this.info.commCurNum - this.info.commPreNum) * this.commEleInfo.unitPrice+
					'.00';
			},
			commEleCostPer(){
				return (this.commEleCost / this.tenantNum).toFixed(2)
			},
			readDate(){
				if(this.eleInfo.noteDate){
					return this.eleInfo.noteDate.substr(0,10)
				}else{
					return this.date
				}
			}
		},
		onLoad(options) {
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			this.getBillInfo(options.billId)
		},
		methods: {
			inputChangeHandle(e) {
				this.info.curNum = e.detail.value
				if (+e.detail.value < +this.info.curNum) {
					uni.showToast({
						title: '本期读数不能小于上期读数!',
						icon: 'none'
					});
					return;
				} 
			},
			inputChangeHandleComm(e) {
				this.info.commCurNum = e.detail.value;
				if (+e.detail.value < +this.info.commCurNum) {
					uni.showToast({
						title: '本期读数不能小于上期读数!',
						icon: 'none'
					});
					return;
				} 
			},
			submit(){
				let _this = this;
				console.log(this.info.commCurNum)
				
				this.$refs.form.validate(res => {
					if(res){
						_this.billInfo.items.forEach((item,index)=>{
							if (item.itemName == '1') {
								_this.billInfo.items[index].prevNum = _this.info.preNum;
								_this.billInfo.items[index].currentNum = _this.info.curNum;
								_this.billInfo.items[index].amount = _this.amount;
								_this.billInfo.items[index].noteDate = _this.readDate + ' 00:00:00';
							} else if(item.itemName == '2'){
								_this.billInfo.items[index].prevNum = _this.info.commPreNum;
								_this.billInfo.items[index].currentNum = _this.info.commCurNum;
								_this.billInfo.items[index].amount = _this.commEleCostPer;
								_this.billInfo.items[index].noteDate = _this.readDate + ' 00:00:00';
							}
						})
						_this.billInfo.tenantNum = _this.tenantNum;
						console.log(_this.billInfo)
						_this.$request.post('/bill/updateItems', _this.billInfo).then(res => {
							console.log('请求反回', res);
							if (res.data.code == 200) {
								uni.showToast({
									title:'抄表成功',
									duration:1500
								})
								setTimeout(()=>{
									uni.navigateBack({
										delta: 1
									});
								},1500)
							}
						});
					}
				})
			},
			returnVal(e){
				this.tenantNum = e;
			},
			getBillInfo(id){
				let _this = this;
				_this.$request
					.post('/bill/findById', {
						id
					})
					.then(res => {
						this.init = true;
						this.billInfo = res.data.data;
						this.tenantNum = res.data.data.tenantNum;
						this.billInfo.items.forEach((item, index) => {
							if (item.itemName == '1') {
								_this.eleInfo = _this.billInfo.items[index];
								_this.info.preNum = _this.eleInfo.prevNum;
								_this.info.curNum = _this.eleInfo.currentNum ? _this.eleInfo.currentNum : _this.eleInfo.prevNum;
								console.log(this.eleInfo.prevNum)
							} else if(item.itemName == '2'){
								_this.hasCommonEle = true;
								_this.commEleInfo = _this.billInfo.items[index];
								_this.info.commPreNum = _this.commEleInfo.prevNum;
								_this.info.commCurNum = _this.commEleInfo.currentNum ? _this.commEleInfo.currentNum : _this.commEleInfo.prevNum;
								console.log(this.commEleInfo)
							}
						})
					});
			},
			bindDateChange(e){
				console.log(e)
				this.eleInfo.noteDate = e.detail.value
			},
		}
	}
</script>

<style scoped>
	.meterReading {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FAFAFA;
	}

	.whiteBg {
		background: #FFFFFF;
	}

	.divideBottom {
		border-bottom: 14rpx solid #FAFAFA;
	}

	.form-container {
		width: calc(100% - 34rpx);
		margin-left: 17rpx;
		color: #333333;
	}

	.section0 {
		padding: 0 40rpx;
	}

	.section1,
	.section2,
	.section3,
	.section4 {
		width: calc(100% - 34rpx);
		margin-left: 17rpx;
		/* padding: 0 17rpx; */
		/* padding: 0 40rpx; */
		border-radius: 5rpx;
	}

	.divideBar {
		padding: 20rpx 0 26rpx 40rpx;
		font-size: 34rpx;
		color: #333333;
		font-weight: bold;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
	.eleCommonBottom {
		height: 112rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 34rpx;
		color: #333;
	}
	
	.eleNumBox {
		width: 190rpx;
		height: 50rpx;
	}
	.submitBtn{
		width:257rpx;
		height:74rpx;
		line-height: 74rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		background:#FFA044;
		border-radius:37rpx;
	}
	.formOuter{
		padding: 0 25rpx;
		border-radius: 5rpx;
	}
	.btnBoxxx{
		height: 128rpx;
		width: 100%;
		padding: 0rpx 40rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		position: fixed;
		bottom: 0;
		left: 0;
	}
</style>
