<template>
  <div>
    <input :id="inputDirId" :accept="acceptFileTypes" class="file-input" @change="addFileList" type="file"
           webkitdirectory
           directory/>
    <input :id="inputFileId" :accept="acceptFileTypes" class="file-input" @change="addFileList" type="file"/>
    <v-card  class="div-center" height="500">
      <v-card-title style="padding-bottom: 5px;padding-top:5px;font-size: 22px" class="web-font-yahei">{{
          tipText
        }}
      </v-card-title>
      <v-card-text class="card-text-wrapper">
        <div class=" file-item transition-200ms web-font-yahei" :class="{'active-item':index===activateId,
        'disabled':disabled,'able':!disabled}"
             @click="clickFile(index)"
             v-for="(fileItem,index) in fileList">{{ fileItem.name }}
        </div>
        <div v-show="fileList.length===0" class="web-font-yahei"
             style="font-size: 30px;margin-top: 10px;padding-left: 10px">当前列表为空！
        </div>
        <div class="count web-font-yahei">文件共计：{{fileList.length}}</div>
      </v-card-text>
    </v-card>
    <div style="margin-top: 30px">
      <v-btn @click="addDir" color="#1867c0" dark><span class="web-font-yahei">添加文件夹</span></v-btn>
      <v-btn @click="addFile" color="#1867c0" dark style="margin-left: 10px;"><span class="web-font-yahei">添加文件</span>
      </v-btn>
      <v-btn @click="clean" color="red" dark style="margin-left: 10px;"><span class="web-font-yahei">清空</span>
      </v-btn>
    </div>

  </div>

</template>

<script>
export default {
  name: "fileCard",
  props: {
    tipText: "",
    type: "",
    id: ""
  },
  computed: {
    inputFileId() {
      return this.id + "_file"
    },
    inputDirId() {
      return this.id + "_dir"
    },
    acceptFileTypes() {
      if (this.type === "img") {
        return "image/jpeg,image/jpg,image/png"
      } else {
        return "text/xml,text/txt,text/plain"
      }
    },
    disabled() {
      return this.type === "annotation"
    }
  },
  data() {
    return {
      fileList: [],
      suffixList: [],
      filenameMap: {},
      activateId: -1,
      imgBase64: null,
      annotationTxt: null,
    }
  },
  mounted() {
    this.suffixList = this.getFileSuffixList()
  },
  methods: {
    clean() {
      this.fileList = []
      this.filenameMap = {}
      this.activateId = -1
      this.imgBase64 = null
      this.annotationTxt = null
      let file = document.getElementById(this.inputDirId);
      file.value = ''
    },
    findAnnotation(filename) {
      console.log(filename)
      if(this.fileList.length===0){
        this.$message.info("请添加标注文件!")
        return
      }
      console.log(this.filenameMap[filename])
      if (this.filenameMap.hasOwnProperty(filename)) {
        let fileItem = this.fileList[this.filenameMap[filename]]
        const reads = new FileReader()
        reads.onload = (e) => {
          this.annotationTxt = e.target.result
          this.$emit("handleSend")
        }
        reads.readAsText(fileItem)
      } else {
        this.$message.error("没有找到指定的标注文件,请进行检查!")
      }
    },
    clickFile(index) {
      if (this.disabled) {
        //禁止标注文件点击
        return
      }
      this.$emit("loading")
      this.activateId = index
      let fileItem = this.fileList[index]
      const filename = fileItem.name.split(".")[0]
      console.log("clickFile")
      const reads = new FileReader()
      reads.onload = (e) => {
        this.imgBase64 = e.target.result
        this.$emit("findAnnotation", filename)
      }
      reads.readAsDataURL(fileItem)
    },

    addFile() {
      let fileInput = document.getElementById(this.inputFileId)
      fileInput.click()
    },
    addDir() {
      let dirInput = document.getElementById(this.inputDirId)
      dirInput.click()
    },
    getFileSuffixList() {
      let suffixList = []
      const suffixListTmp = this.acceptFileTypes.split(",")
      for (let idx in suffixListTmp) {
        suffixList.push(suffixListTmp[idx].split("/")[1])
      }
      return suffixList
    },
    addFileList(event) {
      console.log(event)
      let files = event.target.files
      for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < this.suffixList.length; j++) {
          const suffix = this.suffixList[j];
          const filename = files[i].name
          if (filename.endsWith(suffix)) {
            this.fileList.push(files[i])
            this.filenameMap[filename.split(".")[0]] = this.fileList.length - 1
          }
        }
      }
    },
    check() {
      console.log("check!")
      if (this.fileList.length === 0) {
        this.$message.info("请先添加图片和标注文件!")
        return false
      }
      return true
    },

    nextImg() {
      if (this.check()) {
        console.log("next")
        let index = this.activateId + 1
        if (index < this.fileList.length) {
          this.clickFile(index)
        } else {
          this.$message.info("没有下一张图片啦!")
        }
      }

    },
    preImg() {
      if (this.check()) {
        console.log("pre")

        let index = this.activateId - 1
        if (index >= 0) {
          this.clickFile(index)
        } else {
          this.$message.info("没有前一张图片啦!")
        }
      }
    }

  }
}
</script>

<style scoped>


.file-item {
  width: 100%;
  height: 35px;
  font-size: 18px;
  line-height: 35px;
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
}


.active-item {
  background-color: rgb(228, 237, 248);
  color: rgb(51, 103, 192)
}

.able:hover {
  background-color: rgb(228, 237, 248);
  color: rgb(51, 103, 192)
}

.file-input {
  opacity: 0;
  display: none;
}

.card-text-wrapper {
  overflow: auto;
  height: 430px;
  text-align: left;
  padding-left: 0;
  padding-right: 0;
  /*background-color: #D3D3D3;*/
}

.disabled {
  cursor: not-allowed;
  color: #BDBDBD
}
.count{
  position: absolute;
  bottom: 3px;
  height: 25px;
  font-size: 16px;
  line-height: 25px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
