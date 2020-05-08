<template>
	<view class="addPosting">
		<view class="navBox">
			<view class="navLi" :class="{navActive:navIndex == index}" v-for="(item,index) in navList" :key="index" @click="chooseNav(index)">
				{{item.name}}
			</view>
		</view>
		<view class="flowBox">
			<view class="flowLi" v-for="(item,index) in showFlow" :key="index" @click="chooseFlow(index,item)">
				<view class="flowImg" :class="{flowActive:flowIndex == index}">
					<image v-if="flowIndex == index" :src="'../../static/billFlowIcon0'+item.num+'.png'" mode="aspectFit"></image>
					<image v-else :src="'../../static/billFlowIcon'+item.num+'.png'" mode="aspectFit"></image>
				</view>
				<view>{{item.name}}</view>
			</view>
		</view>
		<view class="formContainer">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<evan-form-item label="关联房源" prop="community">
					<template v-slot:main>
						<input class="form-input" style="padding-left:40rpx" disabled="true" placeholder-class="form-input-placeholder" v-model="info.community"
						 placeholder="请选择" @click="showBox"/>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="发生时间" prop="startDate">
					<template v-slot:main>
						<picker class="form-input" mode="date" :value="date" :start="startDate" @change="bindDateChange">{{ date }}</picker>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="金额" prop="price">
					<template v-slot:main>
						<input class="form-input" type="digit" maxlength="6" placeholder-class="form-input-placeholder" v-model="info.price"
						 placeholder="0.00" @input="checkInput"/>
					</template>
				</evan-form-item>
			</evan-form>
			<view class="remarks">
				<view class="remarkTitle">备注</view>
				<textarea class="secTip textOverFlow" v-model="remarks"
				 placeholder-class="textPlaceholder"></textarea>
			</view>
		</view>
		<view class="submit" @click="sumbit">确定</view>
		<view class="mask" @catchtouchmove="true" v-if="isShowBox" @click="hideBox()"></view>
		<view class="chooseBox" @catchtouchmove="true" v-show="isShowBox">
			<mix-tree :list="list" @treeItemClick="treeItemClick"></mix-tree>
		</view>
		
	</view>
</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	import {moneyLimit} from '../../util/index.js'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';

	export default {
		components: {
			evanFormItem,
			evanForm,
			mixTree
		},
		data() {
			const currentDate = this.$getDate();
			return {
				remarks:'',
				findRoomId:'',
				findRoomNo:'',
				findComm:{},
				findHouse:{},
				flowNum:null,
				isShowBox:false,
				list:[],
				info:{
					community:'',
					price:''
				},
				rules:{
					community: {
						required: true,
						message: '请选择关联房源'
					},
					price: {
						required: true,
						message: '请输入金额'
					}
				},
				date:currentDate,
				flowIndex:null,
				navIndex:1,
				navList:[
					{name:'支出',type:2},
					{name:'收入',type:1}
				],
			}
		},
		computed:{
			showFlow(){
				if(this.navIndex == 0){
					return [
						{name:'租金',num:3},
						{name:'押金',num:4},
						{name:'装修',num:9},
						{name:'维修',num:10},
						{name:'家电',num:11},
						{name:'中介费',num:12},
						{name:'推广费',num:13},
						{name:'工资',num:14},
						// {name:'退租',num:18},
						{name:'其他',num:99},
					]
				}else{
					return [
						{name:'租金',num:3},
						{name:'押金',num:4},
						{name:'定金',num:15},
						{name:'水费',num:7},
						{name:'电费',num:5},
						{name:'宽带费',num:8},
						{name:'物业费',num:16},
						// {name:'公摊电费',num:6},
						{name:'停车费',num:17},
						{name:'其他',num:99},
					]	
				}
			}
			
		},
		onLoad() {
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			this.getReportPickerList()
		},
		methods: {
			sumbit(){
				let _this = this
				if(!this.flowNum){
					uni.showToast({
						title:'请选择记账类型',
						icon:'none'
					})
					return
				}
				_this.$refs.form.validate(res => {
					if (res) {
						_this.$request.post('/account/insert',{
							"landlordId": _this.$store.state.landladyInfo.id,
							"accType": _this.navIndex == 0 ? 2 : 1, // 收支类型 1-收入 2-支出
							"conType": _this.flowNum, // 消费类型
							"communityId": _this.findComm[0].id,
							"communityName": _this.findComm[0].communityName,
							"houseId": _this.findHouse[0].id,
							"buildingNo": _this.findHouse[0].buildingNo,
							"houseNo": _this.findHouse[0].houseNo,
							"roomId": _this.findRoomId,
							"roomNo": _this.findRoomNo.substr(1,1), // 房间号
							"accTime": _this.date+' 00:00:00', // 发生时间
							"amount": _this.info.price, // 金额
							"remarks": _this.remarks 
						}).then(data=>{
							if (data.data.code == 200) {
								uni.showToast({
									title: '记账成功',
									duration: 800
								})
								let pages = getCurrentPages();
								if (pages.length > 1) {
									let beforePage = pages[pages.length - 2];
									if (beforePage.route == "pages/billManage/billManage") {
										beforePage.$vm.updateData()
									}
								}
								setTimeout(() => {
									uni.navigateBack();
								}, 1500)
							}
						})
					}
				})
			},
			//点击最后一级时触发该事件
			treeItemClick(e) {
				let _this = this
				this.findRoomId = e.id
				this.findRoomNo = e.name
				if(e.parentId.length == 0){
					uni.showToast({
						title:'该房源下暂无房间，不能添加记账',
						icon:'none'
					})
				}else{
					_this.findComm = _this.list.filter(item=>item.id == e.parentId[0])
					_this.findHouse = _this.findComm[0].houseList.filter(item=>item.id == e.parentId[1])
					let name = _this.findComm[0].communityName + '-' + _this.findHouse[0].buildingNo+ '号'+_this.findHouse[0].houseNo+'-'+e.name
					_this.info.community = name
				}
				this.hideBox()
			},
			hideBox(){
				this.isShowBox = false
			},
			showBox(){
				this.isShowBox = true
			},
			getReportPickerList() {
				let _this = this
				this.$request.post('report/findCommunityAndHouse', {
					id:this.$store.state.landladyInfo.id
				}).then((res) => {
					res.data.data.forEach((item,index) =>{
						item.name = item.communityName;
						item.children =JSON.parse(JSON.stringify(item.houseList)) 
						if(item.children.length != 0){
							item.children.map(p=>{
								p.name = p.buildingNo+'号'+p.houseNo
								p.children = JSON.parse(JSON.stringify(p.roomList))
								if(p.children.length != 0){
									p.children.map(item=>item.name = '卧'+item.roomNo)
								}
							})
						}
					})
					_this.list = res.data.data;
				})
			},
			checkInput(e){
				this.info.price = moneyLimit(e.detail.value)
			},
			bindDateChange(e){
				this.date = e.detail.value
			},
			chooseFlow(index,item){
				this.flowIndex = index
				this.flowNum = item.num
			},
			chooseNav(index){
				this.navIndex = index
				this.flowNum = null
				this.flowIndex = null
				this.info.community = ""
				this.info.price = ""
			}
		}
	}
</script>

<style scoped>
	.addPosting{
		padding: 92rpx 0 60rpx 0;
	}
	.navBox{
		position: fixed;
		top: 0;
		width: 100%;
		height: 92rpx;
		background-color: #F09A42;
		color: #FFFFFF;
		font-size: 36rpx;
		display: flex;
		justify-content: center;
	}
	.navLi{
		width: 106rpx;
		height: 100%;
		text-align: center;
		line-height: 92rpx;
	}
	.navLi:first-of-type{
		margin-right: 20rpx;
	}
	.navActive{
		border-bottom: 4rpx solid #FFFFFF;
	}
	.flowActive{
		background-color: #F09A42 !important;
	}
	.flowBox{
		width: 100%;
		padding: 40rpx 62rpx 18rpx 62rpx;
		border-bottom: 1rpx solid #F5F5F8;
		display: flex;
		flex-wrap: wrap;
	}
	.flowLi{
		width: fit-content;
		height: fit-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 26rpx;
		color: #333333;
		margin-bottom: 48rpx;
	}
	.flowImg{
		width: 110rpx;
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: #F5F5F5;
		margin-bottom: 30rpx;
	}
	.flowLi:not(:nth-of-type(4n)){
		margin-right: 62rpx;
	}
	.flowLi image{
		width: 64rpx;
		height: 64rpx;
	}
	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
	
	.form-input {
		font-size: 34rpx;
	}
	.formContainer{
		width: 100%;
		padding: 0 62rpx;
	}
	.submit{
		width:286rpx;
		height:86rpx;
		background:rgba(255,160,68,1);
		border-radius:10rpx;
		text-align: center;
		line-height: 86rpx;
		color: #FFFFFF;
		font-weight: bold;
		font-size: 34rpx;
		margin: 140rpx auto 0 auto;
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		background-color: #000000;
		opacity: 0.3;
	}
	.chooseBox{
		width: 100%;
		padding-top: 30rpx;
		height: calc(100vh - 600rpx);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		background-color: #FFFFFF;
		overflow-y: scroll;
		transition: 0.6s;
	}
	.remarkTitle{
		color: #333333;
		font-size: 34rpx;
		padding-top: 44rpx;
	}
	.secTip{
		width: 100%;
		height: 158rpx;
		font-size: 32rpx;
		color: #333333;
		margin-top: 20rpx;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #ebebeb;
	}
	.textPlaceholder {
		padding: 20rpx 0;
		color: #999999;
		font-size: 32rpx;
	}
</style>
