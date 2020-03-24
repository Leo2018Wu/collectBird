<template>
	<view class="addMemo">
		<tip-modal v-if="isShowTipModal" v-on:emitCancel="returnCancel" v-on:emitSure="returnSure" :title="'提示'" :describition="'是否确认删除该条记事'"></tip-modal>
		<view class="curDate">{{curDate}}</view>
		<input class="secTip textOverFlow" v-model="title" placeholder="标题" placeholder-class="textPlaceholder"></input>
		<view class="divide"></view>
		<textarea class="secTip1" v-model="content" placeholder="记事" placeholder-class="textPlaceholder1"></textarea>
		<view class="btnBox" v-if="!memoId">
			<view class="saveBtn" @click="save">保存</view>
		</view>
		<view class="btnBox1" v-else>
			<view class="delBtn" @click="delMemo">删除</view>
			<view class="saveBtn" @click="save">保存</view>
		</view>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue';
	import moment from 'moment'
	export default {
		components: {
			tipModal
		},
		data() {
			return {
				title: '',
				curDate: '',
				content: '',
				memoId:null,
				isShowTipModal:false
			}
		},
		onLoad(options) {
			this.memoId = options.memoId
			if(this.memoId){
				this.getMemo(this.memoId)
				uni.setNavigationBarTitle({
					title:'编辑记事'
				})
			}
			this.curDate = moment().format("YYYY-MM-DD HH:mm:ss");
		},
		methods: {
			returnCancel(){
				this.hideModal()
			},
			returnSure(){
				let _this = this;
				_this.$request.post('/note/delete',{
					landlordId: _this.$store.state.landladyInfo.id, // 二房东id
					id:_this.memoId
				}).then((res)=>{
					if(res.data.code == "200"){
						uni.showToast({
							title:'记事删除成功',
							duration:1500
						})
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
					}
				})
			},
			hideModal(){
				this.isShowTipModal = false;
			},
			delMemo(){
				this.isShowTipModal = true;
			},
			getMemo(id){
				let _this = this;
				this.$request.post('/note/findById', {
					landlordId: _this.$store.state.landladyInfo.id, // 二房东id
					id
				}).then((res)=>{
					console.log(res)
					_this.title = res.data.data.noteTitle;
					_this.content = res.data.data.noteContent;
				})
			},
			save() {
				let _this = this
				if(!_this.content){
					uni.showToast({
						title:'记事内容不能为空',
						icon:'none',
						duration:1500
					})
					return
				}
				let par = {
					"landlordId": _this.$store.state.landladyInfo.id, // 二房东id
					"noteType": "1", // 记事类型，默认1
					"noteTitle": _this.title, // 标题
					"noteContent": _this.content, // 正文
					"createTime": _this.curDate // 创建日期，注意格式
				}
				let postUrl = _this.memoId ? '/note/update' : '/note/insert'
				if(_this.memoId){
					par.id = _this.memoId
				}
				this.$request.post(postUrl, par).then((res)=>{
					if(res.data.code == "200"){
						uni.showToast({
							duration:1500
						})
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.addMemo {
		padding: 0 30rpx;
	}

	.curDate {
		color: #999999;
		font-size: 30rpx;
		margin: 30rpx 0 50rpx 0;
	}

	.secTip {
		width: 690rpx;
		min-height: 56rpx;
		height: fit-content;
		font-size: 42rpx;
		padding-bottom: 32rpx;
	}

	.textPlaceholder {
		font-size: 42rpx;
		color: #C8C9CB;
	}

	.divide {
		width: 100%;
		height: 1rpx;
		background-color: #E5E5E5;
		margin-bottom: 32rpx;
	}

	.secTip1 {
		width: 690rpx;
		height: 340rpx;
		font-size: 34rpx;
		padding-bottom: 32rpx;
	}

	.textPlaceholder1 {
		font-size: 34rpx;
		color: #C8C9CB;
	}
	.btnBox,.btnBox1{
		width: calc(100% - 172rpx);
		margin-left: 86rpx;
		position: fixed;
		left: 0;
		bottom: 150rpx;
	}
	.btnBox {
		display: flex;
		justify-content: center;
	}
	.btnBox1{
		display: flex;
		justify-content: space-between;
	}

	.saveBtn {
		width: 257rpx;
		height: 82rpx;
		background: linear-gradient(-90deg, rgba(234, 185, 93, 1) 0%, rgba(228, 158, 84, 1) 100%);
		border-radius: 41rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 82rpx;
	}
	.delBtn{
		width: 257rpx;
		height: 82rpx;
		border: 1rpx solid #D2D2D2;
		border-radius: 41rpx;
		font-size: 34rpx;
		color: #656565;
		text-align: center;
		line-height: 82rpx;
	}
</style>
