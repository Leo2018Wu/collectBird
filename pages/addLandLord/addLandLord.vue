<template>
	<view class="addLandLord">
		<view class="section1 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form1" :model="info1">
				<evan-form-item label="姓名" prop="name">
					<template v-slot:main>
						<input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="房东姓名" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="电话" prop="tel">
					<template v-slot:main>
						<input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.tel" placeholder="房东电话" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
		</view>
		<view class="section2 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form2" :model="info2">
				<evan-form-item label="起租日期" prop="startDate">
					<template v-slot:main>
						<picker class="form-input" mode="date" data-type="start" :value="date" :start="startDate" @change="bindDateChange">{{ date }}</picker>
						<!-- <input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.startDate"
						 placeholder="请选择" /> -->
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="到租日期" prop="startDate">
					<template v-slot:main>
						<picker class="form-input" mode="date" data-type="end" :value="endDate" :start="startDate" @change="bindDateChange">{{ endDate }}</picker>
						<!-- <input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.startDate"
						 placeholder="请选择" /> -->
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="收租周期" prop="rentCycle">
					<template v-slot:main>
						<!-- <choose-list v-if="listShow" :currentChooseIndex="chooseIndex" v-on:close="hideList" :list="list" :title="'选择收租周期'"
						 v-on:emitClick="returnEmit"></choose-list> -->
						<input class="form-input" disabled="true" placeholder-class="form-input-placeholder" v-model="info2.rentCycle"
						 placeholder="请选择收租周期" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="每期租金" prop="rentUnitPrice">
					<template v-slot:main>
						<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info2.rentUnitPrice"
						 placeholder="0.00" @input="espInput" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="押金" prop="deposit">
					<template v-slot:main>
						<input class="form-input" placeholder-class="form-input-placeholder" v-model="info2.deposit" placeholder="0.00" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
			<view class="section3 whiteBg"><textarea class="secTip textOverFlow" placeholder="备注" v-model="remarks"
				 placeholder-class="textPlaceholder"></textarea></view>
		</view>
		<view class="sureBtn" @click="save">保存</view>
	</view>
</template>

<script>
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm
		},
		data() {
			const currentDate = this.getDate();
			return {
				endDate:currentDate,
				date: currentDate,
				info1: {
					name: '',
					tel: '',
				},
				info2:{
					rentCycle:'',
					rentUnitPrice:'',
					deposit:''
				},
				rules2:{
					rentCycle:{
						required:true,
						message:'请选择交租周期'
					},
					rentUnitPrice:{
						required:true,
						message:'请输入每期租金'
					},
					deposit:{
						required:true,
						message:'请输入押金'
					}
				},
				rules1: {
					name: {
						required: true,
						message: '请输入房东姓名'
					},
					tel: [{
							required: true,
							message: '请输入房东电话'
						},
						{
							validator: (rules1, tel, callback) => {
								if (this.$validate.isMobilePhone(tel)) {
									callback();
								} else {
									callback(new Error('手机号格式不正确'));
								}
							}
						}
					],
				},
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.$refs.form1.setRules(this.rules1)
				this.$refs.form2.setRules(this.rules2)
			})
		},
		methods: {
			save(){
				let _this = this;
				_this.$refs.form1.validate(res1 => {
					if(res1){
						_this.$refs.form2.validate(res2 => {
							if(res2){}
						})
					}
				})
				
			},
			bindDateChange(e) {
				console.log(e)
				let type = e.currentTarget.dataset.type;
				if(type == 'start'){
					this.date = e.detail.value;
				}else{
					
					let time1 = new Date((this.date).replace(/\-/g,'/'))
					let time2 = new Date((e.detail.value).replace(/\-/g,'/'))
					if(Date.parse(time1) > Date.parse(time2)){
						uni.showToast({
							title:'选择到租日期必须必起租日期大',
							icon:'none',
							duration:1500
						})
					}else{
						this.endDate = e.detail.value;
					}
				}
				
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
		}
	}
</script>

<style scoped>
	.addLandLord {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
		padding-top: 30rpx;
	}

	.whiteBg {
		background-color: #FFFFFF;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}

	.form-input {
		font-size: 34rpx;
	}

	.section1,.section2,section3 {
		padding: 0 40rpx;
		font-size: 32rpx;
		color: #333333;
		margin-bottom: 17rpx;
	}
	.secTip {
		width: 100%;
		height: 180rpx;
		padding: 32rpx 0 30rpx 0;
		font-size: 34rpx;
		color: #333333;
		margin-top: 17rpx;
	}
	.textPlaceholder {
		padding: 32rpx 0 30rpx 0;
		color: #999999;
		font-size: 34rpx;
	}
	.sureBtn {
		width: 257rpx;
		height: 74rpx;
		line-height: 74rpx;
		text-align: center;
		border-radius: 37rpx;
		color: #FFFFFF;
		background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		font-size: 32rpx;
		margin: 124rpx auto 72rpx auto;
	}
</style>
