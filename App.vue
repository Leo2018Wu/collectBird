<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style>
/*每个页面公共css */
view,
input,
scroll-view {
  box-sizing: border-box;
}
.textOverFlow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
switch {
  transform: scale(0.6);
}
radio{
	transform: scale(0.7);
	
}
.form-input-placeholder {
  color: #999999;
  font-size: 30rpx;
  text-align: right !important;
}
.form-input {
  width: 100%;
  height: 100%;
  text-align: right;
}
</style>
