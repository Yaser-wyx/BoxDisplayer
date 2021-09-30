class ImgInfo {
  _img = null
  _bboxList = []
  _labels = []
  _imgName = ""
  _imgWidth = 0
  _imgHeight = 0
  _labelSet = new Set()

  getLabel(index) {
    return this._labels[index]

  }

  getBbox(index) {
    return this._bboxList[index]

  }

  get img() {
    return this._img;
  }

  set img(value) {
    this._img = value;
  }

  addObject(bbox, label) {
    this._bboxList.push(bbox)
    this._labels.push(label)
    this._labelSet.add(label)
  }

  get labelSet() {
    return this._labelSet;
  }

  get imgName() {
    return this._imgName;
  }

  set imgName(value) {
    this._imgName = value;
  }

  get imgWidth() {
    return this._imgWidth;
  }

  set imgWidth(value) {
    this._imgWidth = value;
  }

  get imgHeight() {
    return this._imgHeight;
  }

  set imgHeight(value) {
    this._imgHeight = value;
  }

  get length() {
    return this._labels.length
  }
}

function getValue(obj, tag) {
  return obj.getElementsByTagName(tag)[0].innerHTML


}

export function initImgInfoFromXml(xmlTxt, img = null, imgName = "") {
  let parser = new DOMParser();//创建文档对象
  let xmlDoc = parser.parseFromString(xmlTxt, 'text/xml')
  let size = xmlDoc.getElementsByTagName("size")[0]
  let imgInfo = new ImgInfo()
  imgInfo.img = img
  imgInfo.imgName = imgName
  imgInfo.imgWidth = parseInt(size.getElementsByTagName("width")[0].innerHTML)
  imgInfo.imgHeight = parseInt(size.getElementsByTagName("height")[0].innerHTML)

  let objectList = xmlDoc.getElementsByTagName("object")
  for (let i = 0; i < objectList.length; i++) {
    let object = objectList[i];
    let label = object.getElementsByTagName("name")[0].innerHTML
    if(label.length===0){
      label="未知"
    }
    let bndbox = object.getElementsByTagName("bndbox")[0]
    const bbox = [parseInt(getValue(bndbox, "xmin")), parseInt(getValue(bndbox, "ymin")), parseInt(getValue(bndbox, "xmax")), parseInt(getValue(bndbox, "ymax"))]
    imgInfo.addObject(bbox, label)
  }
  return imgInfo;
}
