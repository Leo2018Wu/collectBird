<template>
	<view class="" v-if="init">
		<choose-list v-if="listShow" v-on:close="hideList" :currentChooseIndex="chooseIndex" :list="list" :title="'选择收租周期'" v-on:emitClick="returnEmit"></choose-list>
		<view class="roomDetail" v-if="!isEditRoom">
			<view v-if="isWholeRent" class="communityName">{{ houseInfo.communityName }}-{{ houseInfo.roomNo }}-整租</view>
			<view v-if="!isWholeRent" class="communityName">{{ houseInfo.communityName }}-{{ houseInfo.roomNo }}-卧室{{ bedRoomNo }}</view>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1">
					<evan-form-item label="租金" prop="rentPrice" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.rentPrice" placeholder="元/月" @input="myInput1"/>
						</template>
					</evan-form-item>
					<evan-form-item label="收租周期" prop="rentCycle" :fontBold="true">
						<template v-slot:main>
							<input
								class="form-input"
								disabled="true"
								@click="showList()"
								placeholder-class="form-input-placeholder"
								v-model="info.rentCycle"
								placeholder="请选择收租周期"
							/>
						</template>
						<template v-slot:tip>
							<view class="inputSpan"></view>
							<!-- <image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image> -->
						</template>
					</evan-form-item>
				</view>
				<view class="section2">
					<evan-form-item label="电费(元/度)" prop="elecCost" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" type="number" maxlength="4" placeholder-class="form-input-placeholder" v-model="info.elecCost" placeholder="元/度" @input="myInput2" />
						</template>
					</evan-form-item>
					<evan-form-item label="水费(元/月)" prop="waterCost" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" type="number" maxlength="4" placeholder-class="form-input-placeholder" v-model="info.waterCost" placeholder="元/月" @input="myInput3" />
						</template>
					</evan-form-item>
					<evan-form-item label="宽带费(元/月)" prop="netCost" :fontBold="true" :border="false">
						<template v-slot:main>
							<input class="form-input" type="number" maxlength="4" placeholder-class="form-input-placeholder" v-model="info.netCost" placeholder="元/月" @input="myInput4" />
						</template>
					</evan-form-item>
				</view>
			</evan-form>
			<view class="operationBox">
				<view class="saveBtn" @click="save(false)">保存</view>
				<!-- <view class="saveBtn1" @click="showPublishInfo" v-if="newHouseInfo.roomList[0].rentStatus == 2">招租信息</view>
				<view class="saveBtn1" v-else @click="save(true)">保存并发布</view> -->
			</view>
		</view>
		<view class="roomDetail" v-if="isEditRoom">
			<view v-if="isWholeRent" class="communityName">{{ newHouseInfo.roomList[0].communityName }}-{{ newHouseInfo.houseNo }}-整租</view>
			<view v-if="!isWholeRent" class="communityName">{{ newHouseInfo.roomList[0].communityName }}-{{ newHouseInfo.houseNo }}-卧室{{ bedRoomNo }}</view>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1">
					<evan-form-item label="租金" prop="rentPrice" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.rentPrice" placeholder="元/月" @input="myInput1" />
						</template>
					</evan-form-item>
					<evan-form-item label="收租周期" prop="rentCycle" :fontBold="true">
						<template v-slot:main>
							<input
								class="form-input"
								disabled="true"
								placeholder-class="form-input-placeholder"
								v-model="info.rentCycle"
								placeholder="请选择收租周期"
								@click="showList"
							/>
						</template>
						<template v-slot:tip>
							<view class="inputSpan"></view>
						</template>
					</evan-form-item>
				</view>
				<view class="section2">
					<evan-form-item label="电费(元/度)" prop="elecCost" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" maxlength="4" placeholder-class="form-input-placeholder" v-model="info.elecCost" placeholder="元/度" @input="myInput2" />
						</template>
					</evan-form-item>
					<evan-form-item label="水费(元/月)" prop="waterCost" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" maxlength="4" placeholder-class="form-input-placeholder" v-model="info.waterCost" placeholder="元/月" @input="myInput3" />
						</template>
					</evan-form-item>
					<evan-form-item label="宽带费(元/月)" prop="netCost" :fontBold="true">
						<template v-slot:main>
							<input class="form-input" maxlength="4" placeholder-class="form-input-placeholder" v-model="info.netCost" placeholder="元/月" @input="myInput4" />
						</template>
					</evan-form-item>
				</view>
			</evan-form>
			<view class="operationBox" :class="{ oneButton: newHouseInfo.roomList[0].rentStatus == 1 }">
				<view class="saveBtn" @click="save(false)">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { moneyLimit } from '../../util/index.js'
import chnToNumber from '../../util/index';
import evanFormItem from '../../components/evan-form/evan-form-item.vue';
import evanForm from '../../components/evan-form/evan-form.vue';
import chooseList from '../../components/chooseList.vue';
export default {
	components: {
		evanFormItem,
		evanForm,
		chooseList
	},
	data() {
		return {
			init: false,
			id: null, //处于编辑状态的房间id
			chooseIndex: null,
			list: [
				//要展示的数据
				'押一付一',
				'押二付一',
				'押三付一',
				'押三付二'
			],
			initValue: '',
			listShow: false,
			rentCycleList: [1, 1],
			isWholeRent: false,
			bedRoomNo: '',
			houseInfo: {},
			newHouseInfo: {}, //添加房号之后更新房屋信息
			isEditRoom: false,
			info: {
				rentPrice: '',
				rentCycle: '',
				elecCost: '',
				waterCost: '',
				netCost: ''
			},
			rules: {
				rentPrice: {
					required: true,
					message: '请输入租金'
				},
				rentCycle: {
					required: true,
					message: '请输入收租周期'
				},
				elecCost: {
					required: true,
					message: '请输入电费'
				},
				waterCost: {
					required: true,
					message: '请输入水费'
				},
				netCost: {
					required: true,
					message: '请输入宽带费'
				}
			}
		};
	},
	onLoad(options) {
		console.log(options)
		setTimeout(() => {
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules);
			});
		}, 800);
		this.houseInfo = JSON.parse(options.houseInfo);
		this.isWholeRent = options.isWholeRent;
		if (options.roomNo) {
			this.bedRoomNo = options.roomNo;
		}
	},
	onShow() {
		let _this = this;
		this.getRentCycleList();
		_this.getHouseInfo(this.houseInfo.houseId);
	},
	methods: {
		myInput1(e){
			this.info.rentPrice = moneyLimit(e.detail.value)
		},
		myInput2(e){
			this.info.elecCost = moneyLimit(e.detail.value)
		},
		myInput3(e){
			this.info.waterCost = moneyLimit(e.detail.value)
		},
		myInput4(e){
			this.info.netCost = moneyLimit(e.detail.value)
		},
		showList() {
			this.listShow = true;
		},
		hideList() {
			this.listShow = false;
		},
		returnEmit(e) {
			this.rentCycleList = chnToNumber.chnToNumber(e.newVal);
			this.info.rentCycle = e.newVal;
			this.chooseIndex = e.index;
			this.listShow = false;
		},
		//查询以保存的房号信息
		getHouseInfo(id) {
			let _this = this
			this.$request
				.post('/house/findById', {
					id
				})
				.then(res => {
					if (res.data.data.roomList) {
						let arr = [];
						if(_this.isWholeRent == 0){
							res.data.data.roomList =  res.data.data.roomList.filter(item => item.roomNo == _this.bedRoomNo)
						}else{
							res.data.data.roomList =  res.data.data.roomList.filter(item => item.roomNo == 'A'.toUpperCase())
						}
						if (res.data.data.roomList.length != 0) {
							//处于编辑房间状态
							let depositNumIndex = parseInt(res.data.data.roomList[0].rentNum) - 1;
							this.chooseIndex = depositNumIndex;
							this.id = res.data.data.roomList[0].id;
							this.isEditRoom = true;
							this.info.rentPrice = res.data.data.roomList[0].roomPrice;
							this.rentCycleList[0] = res.data.data.roomList[0].rentNum; //付月租数量
							this.rentCycleList[1] = res.data.data.roomList[0].depositNum; //押金数量
							this.info.elecCost = res.data.data.roomList[0].eleUnitPrice ? res.data.data.roomList[0].eleUnitPrice : 1;
							this.info.waterCost = res.data.data.roomList[0].waterUnitPrice ? res.data.data.roomList[0].waterUnitPrice : 30;
							this.info.netCost = res.data.data.roomList[0].netCost ? res.data.data.roomList[0].netCost : 30;
							this.info.rentCycle = this.list[depositNumIndex];
						}
					}
					this.newHouseInfo = res.data.data;
					console.log(this.newHouseInfo)
					this.init = true;
				});
		},
		getRentCycleList() {
			this.$request
				.post('/dict/findByParentName', {
					name: 'RENT_CYCLE'
				})
				.then(res => {
					this.list = [];
					res.data.data.forEach(item => {
						this.list.push(item.name);
					});
				});
		},
		blur() {
			this.listShow = false;
		},
		focus(e) {
			this.listShow = true;
		},
		change(e) {
			this.rentCycleList = chnToNumber.chnToNumber(e.newVal);
			this.info.rentCycle = e.newVal;
		},
		showPublishInfo() {
			uni.navigateTo({
				url: '../roomPublish/roomPublish?houseId=' + this.houseInfo.houseId + '&roomId=' + this.newHouseInfo.roomList[0].id
			});
		},
		save(isPublish) {
			let par = this.newHouseInfo.roomList[0];
			par.roomPrice = this.info.rentPrice;
			par.eleMeterReading = '0';
			par.waterMeterReading = '0';
			par.eleUnitPrice = this.info.elecCost;
			par.waterUnitPrice = this.info.waterCost;
			par.netCost = this.info.netCost;
			par.depositNum = this.rentCycleList[1];
			par.rentNum = this.rentCycleList[0];
			let urlPar = this.isEditRoom ? 'room/update' : '/room/addRoom';
			let _this = this;
			this.$refs.form.validate(res => {
				if (res) {
					_this.$request
						.post(urlPar, par)
						.then(data => {
							uni.showToast({
								title: '房间保存成功',
								duration: 1500,
								success() {
									uni.navigateBack();
								}
							});
						})
						.catch(err => {
							console.log(err);
						});
				}
			});
		}
	}
};
</script>

<style scoped>
.roomDetail {
	width: 100%;
	height: 100vh;
	background-color: #fafafa;
	font-size: 30rpx;
}
.communityName {
	padding: 34rpx 40rpx;
	font-size: 32rpx;
	margin-bottom: 17rpx;
	background-color: #ffffff;
	font-weight: bold;
}
.section2 {
	padding: 0 40rpx;
	background-color: #ffffff;
}
.section1 {
	padding: 0 40rpx;
	margin-bottom: 17rpx;
	background-color: #ffffff;
}
.inputContainer {
	width: 100%;
	height: 94rpx;
	line-height: 94rpx;
	display: flex;
	align-items: center;
	border-bottom: 3rpx solid #ebebeb80;
}
.inputBarBox {
	width: 100%;
	height: 100%;
}
.inpArrow {
	width: 30rpx;
	height: 56rpx;
	margin-left: 22rpx;
}
.inputSpan {
	margin-left: 22rpx;
	width: 0;
	height: 0;
	border-top: 8px #dbdbdb solid;
	border-left: 8px transparent solid;
	border-bottom: 8px transparent solid;
	border-right: 8px transparent solid;
}
.saveBtn1 {
	color: #ffffff;
	background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
}
.saveBtn {
	color: #ffa344;
	border: 1rpx solid #ffa344;
	background: #ffffff;
}
.operationBox {
	position: fixed;
	bottom: 100rpx;
	width: calc(100% - 132rpx);
	margin-left: 66rpx;
	display: flex;
	justify-content: center;
}
.operationBox .saveBtn,
.operationBox .saveBtn1 {
	width: 257rpx;
	height: 74rpx;
	border-radius: 37rpx;
	text-align: center;
	line-height: 74rpx;
}
.oneButton .saveBtn {
	background-color: #ffa344;
	color: #ffffff;
	margin: 0 auto;
}
</style>
