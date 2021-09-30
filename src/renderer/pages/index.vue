<template>
  <div class="main-wrapper div-center">

    <div class="file-card-wrapper">
      <div class="card-wrapper ">
        <fileCard ref="imgChild" id="img" tip-text="图片：" @findAnnotation="findAnnotation" @loading="loading"
                  type="img"></fileCard>
      </div>
      <div class="card-wrapper ml-3">
        <fileCard ref="annotationChild" id="annotation" @handleSend="handleSend" tip-text="标注文件："
                  type="annotation"></fileCard>
      </div>
    </div>

    <div class="img-wrapper ">
      <imgCard @next="next" @pre="pre" @handleSend="handleSend" ref="imgCanvas"></imgCard>
    </div>


  </div>
</template>

<script>
import fileCard from "../components/fileCard";
import imgCard from "../components/imgCard";
import {initImgInfoFromXml} from "../utils/ImgInfo"

export default {
  components: {
    fileCard,
    imgCard
  },
  data() {
    return {}
  },
  methods: {

    next() {
      this.$refs.imgChild.nextImg()
    },
    pre() {
      this.$refs.imgChild.preImg()
    },

    handleSend() {
      this.$refs.imgCanvas.showLoading = true
      const imgBase64 = this.$refs.imgChild.imgBase64
      const annotationTxt = this.$refs.annotationChild.annotationTxt
      const imgInfo = initImgInfoFromXml(annotationTxt, imgBase64)
      this.$refs.imgCanvas.prepareDrawBox(imgInfo)
    },
    findAnnotation(filename) {
      this.$refs.annotationChild.findAnnotation(filename)
    },
    loading() {
      this.$refs.imgCanvas.showLoading = true
    }

  }
}
</script>

<style scoped>
.main-wrapper {
  padding: 30px 10px 10px;
  width: 95%;
}

.file-card-wrapper {
  width: 750px;
  position: relative;
  height: 600px;
  padding: 5px;
  margin-left: 10px;
  text-align: center;
  display: inline-block;
  margin-top: 0;

}

.card-wrapper {
  display: inline-block;
  width: 350px;
  text-align: center;
}

.img-wrapper {

  float: right;
}
</style>
