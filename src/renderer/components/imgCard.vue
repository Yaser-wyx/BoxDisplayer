<template>
  <div class="img-main-wrapper">
    <div class="img-wrapper">
      <div style="position:absolute;width: 550px;height: 550px">
        <canvas id="imgCanvas" width="550" height="550"></canvas>
      </div>
    </div>
    <div>
      <div class="mt-3">
        <v-btn @click="pre" color="cyan" dark><span class="web-font-yahei">上一张</span></v-btn>

        <v-btn @click="next" class="ml-3" color="cyan" dark><span class="web-font-yahei">下一张</span></v-btn>
        <div class="switch-wrapper my-inline-div">
          <v-switch
            @change="changeSwitch(key)"
            v-for="(boxMap, key) in bboxSwitchMap"
            :color="boxMap.color"
            dense
            hide-details
            :label="key"
            class="mt-0 mr-2 my-inline-div"
            v-model="boxMap.show"
          ></v-switch>

        </div>
        <v-progress-circular
          v-if="showLoading"
          indeterminate
          color="primary"
          class="right"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: "imgCard",
  mounted() {
    this.canvas = document.getElementById("imgCanvas");
    this.canvasText = this.canvas.getContext("2d");
    this.img.src = require("../assets/palm.png");
    this.img.onload = () => {
      this.canvasText.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasText.drawImage(this.img, 175, 175, 200, 200);   //绘制PALM图片
    };

  },
  methods: {
    pre() {
      this.$emit("pre")
    },
    next() {
      this.$emit("next")
    },

    scaleBbox(bbox) {
      const canvasSize = this.canvas.width
      const scaleX = canvasSize / this.imgInfo.imgWidth
      const scaleY = canvasSize / this.imgInfo.imgHeight
      return [bbox[0] * scaleX, bbox[1] * scaleY, bbox[2] * scaleX, bbox[3] * scaleY]
    },
    drawBox() {
      const width = this.canvas.width
      this.canvas.width = width // 重置canvas画布
      this.img.src = this.imgInfo.img

      this.img.onload = () => {
        this.canvasText.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);   //添加一张图片
        for (let i = 0; i < this.imgInfo.length; i++) {
          const label = this.imgInfo.getLabel(i)
          if (this.bboxSwitchMap[label].show) {
            const color = this.bboxSwitchMap[label].color
            const bbox = this.scaleBbox(this.imgInfo.getBbox(i))

            this.canvasText.beginPath()
            this.canvasText.font = "20px sans-serif"
            this.canvasText.fillStyle = color
            this.canvasText.fillText(label, bbox[0], bbox[1] + 25);
            this.canvasText.lineWidth = 3
            this.canvasText.strokeStyle = color
            this.canvasText.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
            this.canvasText.stroke();
            this.canvasText.closePath()
          }
        }
        this.showLoading = false
      }
    },
    prepareDrawBox(imgInfo) {
      let newSwitchMap = {}
      imgInfo.labelSet.forEach(label => {
        newSwitchMap[label] = {
          show: true,
          color: this.randomColor(),
        }
      })
      this.imgInfo = imgInfo
      this.bboxSwitchMap = newSwitchMap
      this.drawBox()

    },
    randomColor() {
      let re = "#FF";
      let col = this.color();
      re += col;
      return re
    },

    color() {
      let re = "";
      for (let xunhuan = 0; xunhuan < 2; xunhuan++) {

        let temp = Math.floor(256 * Math.random());
        if (temp < 130 && xunhuan === 0) {
          temp = 130;
        }
        if (temp > 200 && xunhuan === 1) {
          temp = 200;
        }
        temp = temp.toString(16);//将数值转换成16进制
        if (temp.length !== 2) {
          temp = "0" + temp
        }
        re += temp//对颜色进行拼接
      }
      return re;
    },
    changeSwitch(switchKey) {
      console.log(switchKey)
      this.drawBox()
    }
  },
  data() {
    return {
      canvas: null,
      imgInfo: null,
      switch1: true,
      canvasText: null,
      img: new Image(),
      showLoading: false,
      bboxSwitchMap: {}
    }
  },
}
</script>

<style scoped>
.img-wrapper {
  width: 550px;
  /*padding-top: 120px;*/
  height: 550px;
  overflow: hidden;
  background-color: rgb(224, 224, 224);
  border-radius: 10px;
}

.img-wrapper img {
  position: relative;

}

.switch-wrapper {
  height: 150px;
  width: 300px;
}

.error-msg {
  text-align: center;
  font-size: 22px;
  line-height: 550px;
}
</style>
