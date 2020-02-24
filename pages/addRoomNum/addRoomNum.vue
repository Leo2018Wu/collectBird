<template>
	<view class="addRoomNum">
		<view class="communityName">
			<view>{{communityName}}</view>
			<view v-if="inEdit && !houseInfo.owner" class="bind" @click="bindNewLandlord">绑定业主</view>
			<view v-if="inEdit && houseInfo.owner" class="bind" @click="showNewLandLord">业主信息</view>
		</view>
		<view class="section1">
			<choose-list v-if="listShow" v-on:close="hideList" :currentChooseIndex="chooseIndex" :list="list" v-on:emitClick = "returnEmit"></choose-list>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
					<evan-form-item label="楼栋号" prop="houseNo">
						<template v-slot:main>
							<input class="form-input" type="number" maxlength="3" placeholder-class="form-input-placeholder" v-model="info.houseNo" @input="inputTip" placeholder="请输入楼栋号" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="房号" prop="roomNo">
						<template v-slot:main>
							<input class="form-input" type="number"  maxlength="4" placeholder-class="form-input-placeholder" v-model="info.roomNo" placeholder="请输入房号" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="户型" prop="houseType" >
						<template v-slot:main>
							<input  class="form-input" disabled="true" placeholder-class="form-input-placeholder" v-model="info.houseType" placeholder="请选择户型" @click="showList()"/>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
			</evan-form>
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
				<view style="display: flex; align-items: center; color: #999999;fontSize:32rpx">
					<span>编辑</span>
					<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
				</view>
				
			</view>
			
		</view>
		<tip-modal v-if="isShowTipModal" :title="'删除房号'" :describition="'删除房号将删除房号关联的一切信息，是否确认删除?'" v-on:emitCancel="hideTipModal" v-on:emitSure="returnSure"></tip-modal>
		<view class="saveBtnBox" v-if="inEdit">
			<view class="bindNewLandlord" @click="deleteHouse">删除</view>
			<view class="saveBtn" @click="save()">保存</view>
		</view>
		<view v-if="!inEdit" class="saveBtn1" @click="save()">保存</view>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue'
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
			chooseList,
			tipModal
		},
		data() {
			return {
				isShowTipModal:false,
				houseInfo:{},
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
				this.getHouseInfo(this.houseId)
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
				
			}
		},
		methods: {
			deleteHouse(){
				this.showTipModal()
			},
			returnSure(){
				this.$request.post('/house/delete',{
					id:this.houseId
				}).then((res)=>{
					this.hideTipModal();
					uni.showToast({
						title:'房号删除成功',
						duration:1500
					})
					setTimeout(()=>{
						uni.navigateBack()
					},2000)
				})
			},
			showTipModal(){
				this.isShowTipModal = true
			},
			hideTipModal(){
				this.isShowTipModal = false
			},
			showNewLandLord(){
				uni.navigateTo({
					url:"../addLandLord/addLandLord?ownerId="+this.houseInfo.owner.id+'&houseId='+this.houseId
				})
			},
			bindNewLandlord(){
				uni.navigateTo({
					url:"../addLandLord/addLandLord?houseId="+this.houseId
				})
			},
			inputTip(e){
				console.log(e)
				if(e.detail.value.length >= 2){
					uni.showToast({
						title:'请输入不超过两位数楼栋号！',
						icon:'none',
						duration:1500
					})
				}
			},
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
					this.houseInfo = res.data.data
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
		height: 120rpx;
		width: 100%;
		padding: 0 40rpx;
		color: #444444;
		font-size: 34rpx;
		font-weight: bold;
		background-color: #FFFFFF;
		margin-bottom:17rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.bind{
		width:170rpx;
		height:56rpx;
		background:#FFA344;
		text-align: center;
		line-height: 56rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		border-radius:28rpx;
		font-weight: normal;
		margin-left: auto;
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
		/* width: 100%; */
		width: 80%;
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
	.saveBtnBox{
		width: calc(100% - 180rpx);
		margin-left: 90rpx;
		height: 74rpx;
		display: flex;
		justify-content: space-between;
	}
	.saveBtnBox view{
		width: 257rpx;
		height: 74rpx;
		border-radius: 37rpx;
		text-align: center;
		line-height: 74rpx;
		margin-top: 140rpx;
	}
	.saveBtn,.saveBtn1{
		color: #FFFFFF;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
	}
	.bindNewLandlord{
		border: 1rpx solid #FFA344;
		color: #FFA344;
	}
	.saveBtn1{
		width: 257rpx;
		height: 74rpx;
		border-radius: 37rpx;
		text-align: center;
		line-height: 74rpx;
		margin: 140rpx auto 0 auto; 
		color: #FFFFFF;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
	}
</style>
