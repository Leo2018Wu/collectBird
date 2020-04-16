const upload = function uploadImg(){
	let _this = this;
	return new Promise((reslove,reject) =>{
		uni.chooseImage({
			count:1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				uni.showLoading({
					title:'正在上传...',
					mask:true,
				})
				uni.uploadFile({
					url:'https://funnyduck.raysler.com/rentbird'+'/util/uploadByPath',
					name: "file",
					filePath: res.tempFilePaths[0], // 使用files上传数组列表,上面两者都会失效
					formData:{
						parentPath:'house',
						fileType:"images"
					},
					success:res=>{
						let data = JSON.parse(res.data)
						if(data.code == '87014'){
							uni.showToast({
								title:'图片内容违规，请重新选择',
								icon:'none'
							})
							return;
						}
						reslove(data.data)
						uni.hideLoading()
					},
					fail:err=>{
						uni.hideLoading()
						uni.showToast({
							title:err.errMsg
						})
					}
				})
			},
			fail(){
				uni.hideLoading()
			}
		})
	})
}
module.exports = {
	upload,
}