// import config from "../config.js";
let config = {
    // 上传图片的API
    upload_img_url:'https://funnyduck.raysler.com/rentbird/util/uploadByPath',
	// upload_img_url:'https://funnyduck.raysler.com/rentbird_test/util/uploadByPath'
}
class Uploader {
    constructor() {

    }
    choose(num) {
        return new Promise((resolve, reject) => {
            uni.chooseImage({
                count: num,
                success(res) {
                    // console.log(res);
                    // 缓存文件路径
                    resolve(res.tempFilePaths)
                },
                fail(err) {
                    console.log(err)
                    reject(err)
                }
            })
        })
    }
    upload_one(path) {
        return new Promise((resolve, reject) => {
          uni.showLoading({
              title:'上传中'
          })
            uni.uploadFile({
                url: config.upload_img_url, //仅为示例，非真实的接口地址
                filePath: path,
				name: "file",
				formData:{
					parentPath:'house',
					fileType:"images",
					word: "收 租 鸟"
				},
                success: (uploadFileRes) => {
					console.log(uploadFileRes)
                    if("string"===typeof uploadFileRes.data){
                        resolve(JSON.parse(uploadFileRes.data).data)
                    }else{
                        resolve( uploadFileRes.data.data )
                    }

                },
                complete() {
                    uni.hideLoading()
                }
            });
        })
    }
    upload(path_arr) {
        let num = path_arr.length;
        return new Promise(async (resolve, reject) => {
            let img_urls = []
            for (let i = 0; i < num; i++) {
                let img_url = await this.upload_one(path_arr[i]);
                console.log(img_url)
                img_urls.push(img_url)
            };
            console.log("全部上传成功")
            resolve(img_urls)
        })

    }
    choose_and_upload(num) {
        return new Promise(async (resolve, reject) => {
            let path_arr = await this.choose(num);
            let img_urls = await this.upload(path_arr);
			let res = {
				tempFiles:path_arr,
				uploadedFiles:img_urls
			}
            resolve(res);
        })

    }
}
export default Uploader;