<template>
	<view class="addRoomNum">
		<view class="communityName">{{communityName}}</view>
		<view class="section1">
			<choose-list v-if="listShow" v-on:close="hideList" :currentChooseIndex="chooseIndex" :list="list" v-on:emitClick = "returnEmit"></choose-list>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
					<evan-form-item label="楼栋号" prop="houseNo">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.houseNo" placeholder="请输入楼栋号" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="房号" prop="roomNo">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.roomNo" placeholder="请输入房号" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="户型" prop="houseType" >
						<!-- :style_Container="'height: 50px; font-size: 16px;'" -->
						<!-- :initValue="''" -->
						<template v-slot:main>
							
							<input  class="form-input" disabled="true" placeholder-class="form-input-placeholder" v-model="info.houseType" placeholder="请选择户型" @click="showList()"/>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
			</evan-form>
			
			<!-- <view class="inputContainer">
				<view class="inputBarBox"><input-bar :placeholderContent="'请输入楼层'">楼层</input-bar></view>
				<span class="inputSpan"></span>
			</view>
			<view class="inputContainer">
				<view class="inputBarBox"><input-bar :placeholderContent="'请输入面积'">面积</input-bar></view>
				<span class="inputSpan"></span>
			</view> -->
			
			<view class="switchBox" @click="changeSwitch()">
				<span>是否整租</span>
				<switch :disabled="isHaveRenter" :checked="isWholeRent" @change="changeType" color="#F09A42" />
			</view>
		</view>
		<!-- <view class="section2">
			<view class="itemBar">公共配置</view>
			<view class="facilityBox">
				<view class="facilityItem" v-for="(item,index) in commonFacBarList" :key="index">
					<facility-bar :title="item"></facility-bar>
				</view>
			</view>
		</view> -->
		<view class="section3">
			<view v-if="isWholeRent" class="inputContainer" @click="goRoomDetail">
				<view class="inputBarBox"><input-bar :disabled="true" >整租</input-bar></view>
				<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
			</view>
			<view v-else  class="inputContainer" @click="goRoomDetail(item)" v-for="(item,index) in roomList" :key="index">
				<view class="inputBarBox"><input-bar :disabled="true" >卧室{{item}}</input-bar></view>
				<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
			</view>
			
		</view>
			
		<view class="saveBtn" @click="save()">保存</view>
	</view>
</template>

<script>
	import chnToNumber from '../../util/index'
	import chooseList from '../../components/chooseList.vue'
	import { mapState, mapMutations } from "vuex";
	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
	import evanForm from '../../components/evan-form/evan-form.vue'
	import facilityBar from '../../components/facilityBar.vue'
	import inputBar from '../../components/inputBar.vue'
	export default {
		components:{
			inputBar,
			facilityBar,
			evanFormItem,
			evanForm,
			chooseList
		},
		data() {
			return {
				isHaveRenter:false,//房号下是否有租客
				chooseIndex:null,
				list: [
					'1室1厅1卫',
					'2室1厅1卫'
				],
				inEdit:false,
				placeContent:'',
				returnHouseId:null,
				housePar:[],
				roomList:[],
				tempRoomList:[],
				listShow:false,
				communityId:'',//从楼号页面传过来的houseId
				houseId:'',
				communityName:'',
				commonFacBarList:['空调','智能锁','燃气灶','热水器'],
				isWholeRent:0,
				info:{
					houseNo:'',
					roomNo:'',
					houseType:'',
				},
				rentType:'',
				rules:{
					houseNo:{
						required:true,
						message:"请输入楼栋号"
					},
					roomNo:{
						required:true,
						message:"请输入房号"
					},
					houseType:{
						required:true,
						message:"请输入户型"
					}
				}
			}
		},
		computed:{
			...mapState(["tempRoomInfo"])
		},
		onShow() {
			if(this.inEdit){
				uni.setNavigationBarTitle({
					title:'编辑房号'
				})
			}
		},
		onLoad(options){
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			this.getHouseTypeList()
			this.communityId = options.communityId;
			this.communityName = options.communityName;
			if(options.houseId){
				this.inEdit = true;
				this.houseId = options.houseId;
				this.getHouseInfo(options.houseId)
			}
		},
		methods: {
			
			showList(){
				this.showTip().then(res=>{
					if(res){
						this.listShow = true;
					}
				})
			},
			hideList(){
				this.listShow = false;
			},
			returnEmit(e){
				console.log(e);
				this.roomList = []
				this.housePar.length = chnToNumber.chnToNumber(e.newVal)[0]
				for(let i = 0;i<this.housePar.length;i++){
					this.housePar[i] = chnToNumber.chnToNumber(e.newVal)[0]
				}
				this.housePar.forEach((item,index)=>{
					this.roomList.push(String.fromCharCode(index+65))
				})
				this.chooseIndex = e.index
				this.info.houseType = e.newVal
				this.listShow = false;
			},
			
			getHouseInfo(id){
				let _this = this;
				this.$request.post('/house/findById',{id}).then(res=>{
					console.log(res)
					this.tempRoomList = res.data.data.roomList
					this.info.houseNo = res.data.data.buildingNo;
					this.info.roomNo = res.data.data.houseNo;
					this.rentType = res.data.data.rentType;
					this.returnHouseId = res.data.data.id
					this.tempRoomList.forEach((item)=>{
						if(item.tenantNum > 0) this.isHaveRenter = true;
					})
					let temp = {
						index:parseInt(res.data.data.bedroomNum) - 1,
						newVal:res.data.data.bedroomNum+'室1厅1卫'
					}
					let index = parseInt(res.data.data.bedroomNum) - 1;
					
					_this.returnEmit(temp)
					_this.isWholeRent = this.rentType == '0' ? 1 : 0;
				})
			},
			getHouseTypeList(){
				this.$request.post('/dict/findByParentName',{
					name:'HOUSE_TYPE'
				}).then(res=>{
					this.list = []
					res.data.data.forEach(item =>{
						this.list.push(item.name)
					})
					console.log(this.list)
				})
			},
			
			
			save(){
				let _this = this;
				uni.showLoading({
					title:'正在保存'
				})
				let requestPar = this.inEdit ? '/house/update' : '/house/addHouse'
				this.info.houseNo = this.info.houseNo.replace(/\b(0+)/gi,"")
				this.info.roomNo = this.info.roomNo.replace(/\b(0+)/gi,"")
				let par ={
					landlordId:this.$store.state.landladyInfo.id,
					communityId:this.communityId,
					buildingNo:this.info.houseNo,
					houseNo:this.info.roomNo,
					bedroomNum:this.housePar[0],
					livingroomNum:"1",
					toiletNum:"1",
					rentType:this.isWholeRent ? "0" : '1',
				}
				if(this.inEdit){
					par.id = this.houseId
				}
				this.$refs.form.validate((res) => {
					if (res) {
						_this.$request.post(requestPar,par).then(res=>{
							console.log(res)
							uni.showToast({
								title:'保存成功',
							})
							if(this.inEdit){
								_this.returnHouseId = this.houseId
							}else{
								_this.returnHouseId = res.data.data
							}
							// uni.hideLoading()
						}).catch(()=>{
							uni.hideLoading()
						})
					}
						
				})
				
			},
			goRoomDetail(item){
				console.log(item)
				let houseInfo = this.info;
				houseInfo.communityName = this.communityName;
				houseInfo.communityId = this.communityId;
				this.$refs.form.validate((res) => {
					if (res) {
						if(this.returnHouseId == null && !this.inEdit){
							uni.showToast({
								title:'请先保存房屋信息',
						icon:'none'
					})
					return;
				}
				houseInfo.houseId = this.returnHouseId;
						uni.navigateTo({
							url:`../roomDetail/roomDetail?isWholeRent=${this.isWholeRent}`+`&roomNo=`+`${item}`+'&houseInfo='+`${JSON.stringify(houseInfo)}`,
						})
					}
				})
			},
			changeSwitch(){
				this.showTip()
			},
			showTip(){
				return new Promise((res,rej) =>{
					if(this.isHaveRenter){
						uni.showToast({
							title:'当前房号下已经有房间有租客入驻，不可调整出租方式。',
							icon:'none',
							duration:1500
						})
					}else{
						res(true)
					}
				})
			},
			changeType(e){
				console.log(e)
					this.isWholeRent = e.detail.value ?  1 : 0 //1是整租0不是
				
			}
		}
	}
	
</script>

<style scoped>
	.addRoomNum{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		padding-bottom: 30rpx;
		background-color: #FAFAFA;
	}
	.communityName{
		padding: 32rpx 0 32rpx 40rpx;
		color: #444444;
		font-size: 34rpx;
		font-weight: bold;
		background-color: #FFFFFF;
		margin-bottom: 17rpx;
	}
	.form-input{
		font-size: 32rpx;
	}
	.section1{
		padding: 0rpx 40rpx;
		background-color: #FFFFFF;
		font-size: 30rpx;
		margin-bottom: 17rpx;
	}
	.inputContainer{
		width: 100%;
		height: 94rpx;
		line-height: 94rpx;
		display: flex;
		align-items: center;
		border-bottom: 3rpx solid #EBEBEB80;
	}
	.inputBarBox{
		width: 100%;
		height: 100%;
	}
	.inpArrow{
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
	.switchBox{
		height: 93rpx;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 10rpx;
	}
	.switchBox switch{
		
		/* margin-left: 13rpx; */
	}
	.section2{
		padding: 32rpx 40rpx 0 40rpx;
		background-color: #FFFFFF;
		margin-bottom: 17rpx;
	}
	.itemBar{
		margin-bottom: 35rpx;
	}
	.facilityBox{
		display: flex;
		flex-wrap: wrap;
	}
	.facilityItem{
		width: calc(100% / 5);
		margin-bottom: 54rpx;
	}
	.section3{
		padding: 0 40rpx;
		background-color: #FFFFFF;
	}
	.saveBtn{
		width: 257rpx;
		height: 74rpx;
		border-radius: 37rpx;
		color: #FFFFFF;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		text-align: center;
		line-height: 74rpx;
		margin: 136rpx auto 0 auto;
	}
</style>
