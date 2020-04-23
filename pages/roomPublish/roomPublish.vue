<template>
	<view class="roomPublish">
		<view>
			<tip-modal v-if="isShowTipModal" :title="'提醒'" :describition="'上传房源图片将有效提高出租率，是否上传？'" :leftBtn="'否'" :rightBtn="'是'" v-on:emitCancel="returnCancel" v-on:emitSure="returnSure"></tip-modal>
			<choose-list v-if="listShow" v-on:close="hideList" :currentChooseIndex="chooseIndex" :list="list" :title="listTitle" v-on:emitClick = "returnEmit"></choose-list>
			<view class="bannerBox">
				<!-- roomImgs -->
				<view v-if="imgUrl.length == 0" class="mask"></view>
				<swiper v-if="imgUrl.length !=0" class="swiper" :indicator-dots="false" autoplay="true" interval="5000" duration="1000" @change="swiperChange">
					<block v-for="(item, index) in imgUrl" :key="index">
						<swiper-item>
							<image :src="item" class="slide-image" mode="aspectFill"/>
						</swiper-item>
					</block>
				</swiper>
				<view v-if="imgUrl.length !=0" class="dots">
					{{swiperCurrent}}/{{imgUrl.length}}
				</view>
				<view v-else>
					<span class="babb">上传图片</span>
					<image class="bannerImg" src="https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/el.jpg" mode="aspectFill"></image>
					<image class="uploadimg" src="../../static/upload1.png" mode="aspectFit" @click="chooseImg"></image>
				</view>
				<view class="changeBtn" @click="deleteImg" v-if="imgUrl.length !=0">修改</view>
			</view>
			<view class="section1">
				<view class="infoItem">
					<view class="itemName">小区名称</view>
					<view class="itemContent">{{houseInfo.communityName}}</view>
				</view>
				<view class="infoItem">
					<view class="itemName">出租类型</view>
					<view class="itemContent">{{houseInfo.rentType ==0 ? '整租' : '合租'}}</view>
				</view>
				<view class="infoItem">
					<view class="itemName">楼栋号</view>
					<view class="itemContent">{{houseInfo.buildingNo}}栋{{houseInfo.houseNo}}号</view>
				</view>
				<view class="infoItem">
					<view class="itemName">户型</view>
					<view class="itemContent">{{houseInfo.bedroomNum}}室1厅1卫</view>
				</view>
			</view>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1">
					<evan-form-item label="楼层" prop="totalFloor" :fontBold="true">
						<template v-slot:main>
							<view class="floorBox">
								<view class="floorItem">
									<input class="form-input" type="number" maxlength="2" placeholder-class="form-input-placeholder" @input="getFloor" v-model="info.floor" placeholder="请输入" />
									<span class="floorDesc">层</span>
								</view>
								<view class="floorItem">
									<input class="form-input" type="number" maxlength="2" placeholder-class="form-input-placeholder" @input="getTotalFloor" v-model="info.totalFloor" placeholder="请输入" />
									<view class="floorDesc">总楼层</view>
								</view>
							</view>
						</template>
					</evan-form-item>
					<evan-form-item label="朝向" prop="orientation" :fontBold="true">
							<template v-slot:main>
								<input  class="form-input" disabled="true" placeholder-class="form-input-placeholder"  v-model="info.orientation" placeholder="请选择" @click="showList(1)"/>
							</template>
							<template v-slot:tip>
								<view class="inputSpan"></view>
							</template>
					</evan-form-item>
					<evan-form-item label="面积(平米)" prop="area" :fontBold="true" :border="false">
						<template v-slot:main>
							<input class="form-input" type="number" maxlength="3" placeholder-class="form-input-placeholder" v-model="info.area" placeholder="请输入" />
						</template>
					</evan-form-item>
					<view class="listBox">
						<view class="liName">装修</view>
						<view class="liInner">
							<view :class="{liActive:descIndex == index}" class="li" v-for="(item,index) in drawStyleList" @click="chooseDec(index)" :key="index">{{item}}</view>
						</view>
					</view>
					<view class="listBox">
						<view class="liName">电梯房</view>
						<switch :checked="hasEleFloor" @change="changeType" color="#F09A42" />
					</view>
					<view class="listBox" style="border-bottom: 1rpx solid #EBEBEB;">
						<view class="liName">租期</view>
						<view class="liInner1">
							<view :class="{liActive:item.isChecked == 1}" class="li" v-for="(item,index) in rentDateList" @click="chooseKeepDate(index)" :key="index">{{item.name}}</view>
						</view>
					</view>
					<evan-form-item label="看房时间" prop="seeTheApartment" :fontBold="true">
							<template v-slot:main>
								<input  class="form-input" disabled="true" placeholder-class="form-input-placeholder"  v-model="info.seeTheApartment" placeholder="请选择" @click="showList(2)"/>
							</template>
							<template v-slot:tip>
								<view class="inputSpan"></view>
							</template>
					</evan-form-item>
					<evan-form-item label="入住时间" prop="checkInTime" :fontBold="true">
							<template v-slot:main>
								<picker class="form-input" mode="date" data-type="start" :value="info.checkInTime" :start="startDate" @change="bindDateChange">{{ info.checkInTime }}</picker>
								<!-- <input  class="form-input" disabled="true" placeholder-class="form-input-placeholder"  v-model="info.checkInTime" placeholder="请选择" @click="showList(3)"/> -->
							</template>
							<template v-slot:tip>
								<view class="inputSpan"></view>
							</template>
					</evan-form-item>
					<view class="listBox" style="border-top: none;">
						<view class="liName">配套设施</view>
					</view>
					<view class="facilityBox">
						<view class="facilityLi" :class="{liActive:item.isChecked == 1}" v-for="(item,index) in facilities"  @click="chooseFac(index)" :key="index">{{item.name}}</view>
					</view>
					<view class="listBox" style="border-bottom: 1rpx solid #EBEBEB;">
						<view class="liName">标签</view>
						<view class="liInner">
							<view :class="{liActive:item.isChecked == 1}" class="li" v-for="(item,index) in labels" @click="chooseLabel(index)" :key="index">{{item.name}}</view>
						</view>
					</view>
					<view class="listBox newListBox">
						<view class="liName">中介费</view>
						<view class="liInner">
							<view :class="{liActive:feeIndex == index}" class="li" v-for="(item,index) in agencyFee" @click="chooseFee(index)" :key="index">{{item}}</view>
						</view>
					</view>
					<evan-form-item label="联系人" prop="landlordName" :fontBold="true" :border="false">
							<template v-slot:main>
								<input  class="form-input" placeholder-class="form-input-placeholder"  v-model="info.landlordName" placeholder="请输入"/>
							</template>
					</evan-form-item>
					<view class="listBox" style="border-bottom: 1rpx solid #EBEBEB;">
						<view class="liName">称呼</view>
						<view class="liInner1">
							<view :class="{liActive:sexIndex == index}" class="li" v-for="(item,index) in sexList" @click="chooseSex(index)" :key="index">{{item}}</view>
						</view>
					</view>
					<view v-if="landladyInfo.phoneNumber">
						<evan-form-item label="联系电话" prop="landlordPhone" :fontBold="true" :border="false">
								<template v-slot:main>
									<input  class="form-input" type="number" maxlength="11" placeholder-class="form-input-placeholder"  v-model="info.landlordPhone" placeholder="请输入"/>
								</template>
						</evan-form-item>
					</view>
					<view v-else>
						<evan-form-item label="联系电话" prop="landlordPhone" :fontBold="true" :border="false">
								<template v-slot:main>
									<view style="display: flex;justify-content: flex-end;">
										<button class="getTelNumImg form-input" hover-class="btnHoverClass" open-type="getPhoneNumber"
										 @getphonenumber="getPhoneNumber"></button>
									</view>
								</template>
						</evan-form-item>
					</view>
				</view>
			</evan-form>
			<view class="remarks">
				<view class="remarkNum">{{remarks.length}}/200</view>
				<view class="remarksDivide">描述</view>
				<textarea class="secTip textOverFlow" v-model="remarks" maxlength="500"
				 placeholder-class="textPlaceholder"></textarea></view>
			</view>
			<cover-view class="btnBox" v-if="roomInfo.rentStatus == 0">
				<cover-view class="publish" @click="publish">发布</cover-view>
			</cover-view>
			<cover-view class="btnBox1" v-else>
				<cover-view class="publish1" @click="cancelPub">撤租</cover-view>
				<cover-view class="publish2" @click="publish">更新</cover-view>
			</cover-view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	import tipModal from '../../components/tipModal.vue'
	import mUpload from '../../util/test.js'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
	import evanForm from '../../components/evan-form/evan-form.vue'
	import chooseList from '../../components/chooseList.vue'
	export default {
		components:{
			evanFormItem,
			evanForm,
			chooseList,
			tipModal
		},
		data() {
			const currentDate = this.$getDate();
			return {
				isCanPub:false,
				isShowTipModal:false,
				swiperCurrent:1,
				parOriIndex:null,
				parSeeIndex:null,
				hasEleFloor:1,
				sexIndex:0,
				descIndex:2,
				feeIndex:0,
				remarks:'',
				seeList:['随时看房','周末看房','工作日看房'],
				// checkInList:['随时入住','周末入住','工作日入住'],
				labels:[
					{name:'近地铁',isChecked:0},
					{name:'独卫',isChecked:0},
					{name:'精装修',isChecked:0}
				],
				facilities:[
					{name:'洗衣机',isChecked:1},
					{name:'空调',isChecked:1},
					{name:'衣柜',isChecked:1},
					{name:'电视',isChecked:1},
					{name:'冰箱',isChecked:1},
					{name:'热水器',isChecked:1},
					{name:'床',isChecked:1},
					{name:'书桌',isChecked:0},
					{name:'宽带',isChecked:0},
					{name:'天然气',isChecked:1},
				],
				showValueType:0,
				listTitle:'选择房屋朝向',
				sexList:['先生','女士'],
				drawStyleList:['毛坯','简装修','精装修'],
				agencyFee:['面议','35%','50%'],
				rentDateList:[
					{name:'可短租',isChecked:0},
					{name:'1年以上',isChecked:1}
				],
				listShow:false,
				list: ['东','南','西','北'],
				imgUrl:[],
				houseInfo:{},
				info:{
					floor:'',
					totalFloor:'',
					orientation:'',
					area:'',
					seeTheApartment:'',
					checkInTime:currentDate,
					landlordName:'',
					landlordPhone:''
				},
				rules:{
					floor:{
						required:true,
						message:'请输入楼层'
					},
					totalFloor:{
						required:true,
						message:'请输入总楼层'
					},
					orientation:{
						required:true,
						message:'请选择朝向'
					},
					area:{
						required:true,
						message:'请输入面积'
					},
					seeTheApartment:{
						required:true,
						message:'请选择看房时间'
					},
					landlordName:{
						required:true,
						message:'请输入联系人姓名'
					},
					landlordPhone: [{
							required: true,
							message: '请输入联系人电话'
						},
						{
							validator: (rules, landlordPhone, callback) => {
								if (this.$validate.isMobilePhone(landlordPhone)) {
									callback();
								} else {
									callback(new Error('手机号格式不正确'));
								}
							}
						}
					],
				},
				roomId:'',
				roomInfo:{}
			}
		},
		computed:{
			...mapState(['landladyInfo']),
			chooseIndex(){
				if(this.showValueType == 1){
					return this.parOriIndex
				}else if(this.showValueType == 2){
					return this.parSeeIndex
				}else{
					return null
				}
			}
		},
		onLoad(options) {
			console.log(options)
			this.roomId = options.roomId
			this.getHouseInfo(options.houseId)
			this.getRoomInfo(this.roomId)
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			if(this.landladyInfo.phoneNumber){
				this.info.landlordPhone = this.landladyInfo.phoneNumber
			}
		},
		methods: {
			returnCancel(){
				this.chooseImg()
				this.isShowTipModal = false;
			},
			returnSure(){
				this.isShowTipModal = false;
				this.isCanPub = true;
			},
			// 获取手机号方法
			getTelNum(res) {
				this.$request
					.post('/wx/takeWxDecode', res)
					.then(v => {
						this.info.landlordPhone = v.data.data.phoneNumber;
						this.landladyInfo.phoneNumber = v.data.data.phoneNumber;
						this.$store.commit('landladyInfo', this.landladyInfo)
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 点击获取手机号
			getPhoneNumber(e) {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes, '1111');
						let result = {
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: loginRes.code
						};
						_this.getTelNum(result);
					}
				});
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current +1;
			},
			bindDateChange(e){
				let curDate = this.$getDate().split('-')
				let temp = e.detail.value.split('-')
				if(parseInt(curDate[0]) <= parseInt(temp[0]) && parseInt(curDate[1]) <= parseInt(temp[1]) && parseInt(curDate[2]) <= parseInt(temp[2])){
					this.info.checkInTime = e.detail.value;
				}else{
					uni.showToast({
						title:'入住时间不能小于当前日期',
						icon:'none'
					})
				}
			},
			getFloor(e){
				if(this.info.totalFloor){
					if(parseInt(this.info.floor) > parseInt(this.info.totalFloor)){
						uni.showToast({
							title:'楼层数不能大于总楼层数',
							icon:'none'
						})
						return false;
					}else{
						return true;
					}
				}
			},
			getTotalFloor(e){
				if(this.info.floor){
					if(parseInt(this.info.floor) > parseInt(this.info.totalFloor)){
						uni.showToast({
							title:'总楼层数不能小于楼层数',
							icon:'none'
						})
						return false;
					}
				}
			},
			cancelPub(){
				let par = this.roomInfo
				par.rentStatus = "0"
				this.$request.post('room/update',par).then((res)=>{
					uni.showToast({
						title:'撤租成功',
						duration:1500
					})
					setTimeout(()=>{
						uni.navigateBack()	
					},1800)
				})
			},
			publish(){
				let _this = this
				if(this.imgUrl.length == 0 && !this.isCanPub){
					this.isShowTipModal = true
					return
				}
				if(!this.getFloor())return
				if(!_this.info.floor){
					uni.showToast({
						title:'请输入楼层',
						icon:'none'
					})
				}else{
					_this.$refs.form.validate((res) => {
						if(res){
							if(_this.$store.state.landladyInfo.phoneNumber == ""){
								uni.showToast({
									title:'请授权联系电话',
									icon:'none',
								})
								return
							}
							let par = _this.roomInfo
							for(let key in _this.info){
								switch (key){
									case 'seeTheApartment':
										par[key] = parseInt(_this.parSeeIndex) + 1
										break;
									case 'orientation':
										par[key] = parseInt(_this.parOriIndex)
										break;
									default:
										par[key] = _this.info[key]
										break;
								}
							}
							par.landlordPhone= _this.info.landlordPhone;
							par.landlordId = _this.$store.state.landladyInfo.id;
							par.landlordSex = _this.sexIndex;
							par.elevator = _this.hasEleFloor == 1 ? 1 : 2
							par.decoration = parseInt(_this.descIndex) +1
							par.intermePrice = parseInt(_this.feeIndex) +1
							par.tenancyTerm = JSON.stringify(_this.rentDateList) 
							par.roomConfigure = JSON.stringify(_this.facilities)
							par.label = JSON.stringify(_this.labels)
							par.rentStatus = 2
							par.remarks = _this.remarks
							par.roomImgs = _this.imgUrl.join(',')
							_this.$request.post('room/update',par).then(result =>{
								uni.showToast({
									title:'房间发布成功',
									duration:1500,
								})
								setTimeout(()=>{
									uni.navigateBack()	
								},1800)
							})
						}
					})
					
				}
			},
			chooseFac(index){
				this.facilities[index].isChecked = this.facilities[index].isChecked == 1 ? 0 : 1
			},
			chooseLabel(index){
				this.labels[index].isChecked = this.labels[index].isChecked == 1 ? 0 : 1
			},
			chooseFee(index){
				this.feeIndex = index
			},
			changeType(e){
				this.hasEleFloor = Number(e.detail.value)
			},
			chooseKeepDate(index){
				this.rentDateList[index].isChecked = this.rentDateList[index].isChecked == 1 ? 0 : 1
			},
			chooseDec(index){
				this.descIndex = index
			},
			chooseSex(index){
				this.sexIndex = index
			},
			showList(type){
				this.showValueType = type
				switch (type){
					case 1:
						this.listTitle = '选择房屋朝向';
						this.list = ['东','南','西','北']
						break;
					case 2:
						this.listTitle = '选择看房时间';
						this.list = this.seeList 
						break;
					default:
						break;
				}
				this.listShow = true
			},
			hideList(){
				this.listShow = false
			},
			returnEmit(e){
				console.log(e)
				this.listShow = false
				switch (this.showValueType){
					case 1:
						this.info.orientation = e.newVal
						this.parOriIndex = e.index
						break;
					case 2:
						this.info.seeTheApartment = e.newVal
						this.parSeeIndex = e.index
						break;
					default:
						break;
				}
				
			},
			chooseImg(num){
				let myUpload = new mUpload
				num = num || 5
				myUpload.choose_and_upload(num).then(res=>{
					this.imgUrl = this.imgUrl.concat(res.uploadedFiles)
				})
			},
			deleteImg(){
				this.imgUrl.splice(this.swiperCurrent - 1,1)
				this.chooseImg(1)
			},
			getRoomInfo(id){
				let _this = this
				_this.$request.post('room/findRoomById', {
					id
				}).then(res => {
					_this.roomInfo = res.data.data
					// if(_this.roomInfo.rentStatus == 2){
						for(let key in _this.info){
							switch (key){
								case 'seeTheApartment':
									_this.info[key] = _this.seeList[parseInt(_this.roomInfo[key]) - 1]
									_this.parSeeIndex = parseInt(_this.roomInfo[key]) - 1
									break;
								case 'orientation':
									_this.info[key] = _this.list[parseInt(_this.roomInfo[key])]
									_this.parOriIndex = parseInt(_this.roomInfo[key])
									break;
								case 'checkInTime':
									_this.info[key] = _this.roomInfo[key] ? _this.roomInfo[key] : _this.info[key]
									break;
								default:
									_this.info[key] = _this.roomInfo[key]
									break;
							}
						}
						if(_this.roomInfo.roomImgs){
							_this.imgUrl = _this.roomInfo.roomImgs.split(',')
						}else{
							_this.imgUrl = []
						}
						_this.landlordPhone = _this.roomInfo.landlordPhone
						_this.sexIndex = _this.roomInfo.landlordSex
						let delNum = _this.roomInfo.elevator == 1 ? 1 : 0
						_this.changeType({detail:{value:delNum}})
						_this.descIndex = _this.roomInfo.decoration ? parseInt(_this.roomInfo.decoration) - 1 : _this.descIndex
						_this.feeIndex = _this.roomInfo.intermePrice ? parseInt(_this.roomInfo.intermePrice) - 1 : _this.roomInfo.intermePrice
						_this.rentDateList = JSON.parse(_this.roomInfo.tenancyTerm) ?  JSON.parse(_this.roomInfo.tenancyTerm) : _this.rentDateList
						_this.facilities = JSON.parse(_this.roomInfo.roomConfigure) ?  JSON.parse(_this.roomInfo.roomConfigure) : _this.facilities
						_this.labels = JSON.parse(_this.roomInfo.label) ? JSON.parse(_this.roomInfo.label) : _this.labels
						_this.remarks = _this.roomInfo.remarks ? _this.roomInfo.remarks : ''
					// }
				})
			},
			getHouseInfo(id){
				this.$request.post('/house/findById',{
					id
				}).then(res=>{
					this.houseInfo = res.data.data
					this.info.floor = this.houseInfo.houseNo.substr(0,1)
				})
			}
		}
	}
</script>

<style scoped>
	.roomPublish{
		min-height: 100vh;
		height: 100%;
		background-color: #FAFAFA;
		width: 100%;
		padding-bottom: 188rpx;
	}
	.bannerBox{
		width: 100%;
		height: 434rpx;
		position: relative;
		color: #FFFFFF;
		font-size: 30rpx;
	}
	.bannerBox span{
		position: absolute;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.swiper{
		height: 434rpx;
		width: 100%;
	}
	.mask{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		background-color: #000000;
		opacity: 0.6;
		width: 100%;
		height: 434rpx;
		z-index: 99;
	}
	.bannerImg{
		width: 100%;
		height: 434rpx;
	}
	.uploadimg{
		width: 128rpx;
		height: 107rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 999;
	}
	.babb{
		position: absolute;
		bottom: 190rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 999;
	}
	.changeBtn{
		position: absolute;
		right: 24rpx;
		top: 20rpx;
		padding: 10rpx 25rpx;
		border-radius: 29rpx;
		background-color: rgba(255,255,255,0.1);
		color: #FFFFFF;
		z-index: 999;
	}
	.section1{
		padding: 0 40rpx;
		margin-bottom: 17rpx;
		background-color: #FFFFFF;
	}
	.infoItem{
		width: 100%;
		height: 112rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333333;
	}
	.infoItem:not(:last-of-type){
		border-bottom: 1rpx solid #EBEBEB;
	}
	.itemName{
		font-size: 34rpx;
		font-weight: bold;
	}
	.itemContent{
		font-size: 32rpx
	}
	.floorBox{
		width: 100%;
		height: 112rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.floorBox .floorItem{
		width: 50%;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.floor-input{
		width: 120rpx;
		height: 100%;
		text-align: right;
		font-size: 32rpx;
		color: #999999;
	}
	.floorDesc{
		font-size: 32rpx;
		color: #333333;
		margin-left: 24rpx;
		word-break: keep-all;
	}
	.inputSpan{
		margin-left: 22rpx;
		width: 0; 
		height: 0;
		border-top: 8px #DBDBDB solid;
		border-left: 8px transparent solid;
		border-bottom: 8px transparent solid;
		border-right: 8px transparent solid;
	}
	.listBox{
		width: 100%;
		min-height: 112rpx;
		padding-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333333;
		border-top: 1rpx solid #EBEBEB;
	}
	.newListBox{
		border-top:none;
		border-bottom: 1rpx solid #EBEBEB;
	}
	.liName{
		font-weight: bold;
		font-size: 34rpx;
	}
	.liInner,.liInner1{
		width: 494rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
	}
	.liInner .li:not(:nth-child(3n)){
		margin-right: 22rpx;
	}
	.liInner1 .li:not(:nth-child(2n)){
		margin-right: 22rpx;
	}
	
	.li{
		width: calc((100% - 44rpx) / 3);
		height: 60rpx;
		border-radius:10rpx;
		border:1rpx solid #D2D2D2;
		color: #666666;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		margin-top: 20rpx;
	}
	.liActive{
		border: 1rpx solid #FFA344 !important;
		color: #FFA344 !important;
	}
	.facilityBox{
		width: 666rpx;
		margin: 0 auto;
		height: fit-content;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.facilityLi{
		width: 150rpx;
		height: 60rpx;
		border-radius:10rpx;
		border:1rpx solid #D2D2D2;
		color: #666666;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}
	.facilityBox .facilityLi:not(:nth-of-type(4n)){
		margin-right: 22rpx;
	}
	.remarksDivide {
		padding: 28rpx 0;
		font-size: 34rpx;
		color: #999999;
		border-bottom: 2rpx solid #EBEBEB;
		margin-bottom: 28rpx;
	}
	.remarks {
		margin-top: 14rpx;
		height: fit-content;
		padding: 0 0 28rpx 30rpx;
		color: #999999;
		font-size: 30rpx;
		background-color: #ffffff;
		border-radius: 5rpx;
		position: relative;
	}
	.remarkNum{
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
	}
	.textPlaceholder {
		padding: 20rpx 0;
		color: #999999;
		font-size: 32rpx;
	}
	.secTip{
		width: 100%;
		height: 240rpx;
		font-size: 32rpx;
		color: #333333;
		padding-bottom: 50rpx;
	}
	.btnBox{
		height: 128rpx;
		width: 100%;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;	
	}
	.btnBox1{
		height: 128rpx;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.publish1{
		width:257rpx;
		height:74rpx;
		border: 1rpx solid #D2D2D2;
		border-radius:37rpx;
		font-size: 32rpx;
		color: #656565;
		text-align: center;
		line-height: 74rpx;
		position: absolute;
		top: 22rpx;
		left: 85rpx;
	}	
	.publish2{
		width:257rpx;
		height:74rpx;
		background-color: #EAB95D;
		border-radius:37rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 74rpx;
		position: absolute;
		top: 22rpx;
		right: 85rpx;
	}	
	.publish{
		width:257rpx;
		height:74rpx;
		background:#FFA044;
		border-radius:37rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 74rpx;
	}
	.slide-image{
		width: 100%;
		height: 100%;
	}
	.dots{
		position: absolute;
		right: 50rpx;
		bottom: 38rpx;
		font-size: 30rpx;
		color: #FFFFFF;
	}
	.dots::first-letter{
		opacity: 0.6;
	}
	.getTelNumImg {
		background-image: url(../../static/getTelNum.png);
		width: 213rpx !important;
		height: 53rpx !important;
		background-size: 100% 100%;
		border: none !important;
		outline: none !important;
	}
	
</style>
