const app = getApp();
Page({
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    // 截切图片信息
    cutImgInfo: {
      src: '',
      picWidth: 0,
      picHeight: 0,
      picLeft: 0,
      picTop: 0,
      picScale: 1,
      picRotate: 0
    },
    // 滑块长度
    slideLength: 0,
    // 滑块居左长度
    slideLeftLength: 0,
    // 小滑块宽度
    slideWidth: 10,
    // 缩放滑块位置
    slideLeft_scale: 0,
    // 旋转滑块位置
    slideLeft_rotate: 0,
    // 图片缩放和canvas
    scaleImgandCanvas: 1,
    // 图片旋转和canvas
    rotateImgandCanvas: 0,
    globalCanvasDom: null,
    pcutImgInfo: null,
    // 度数和倍数
    jkDandB: {
      scale: 0,
      rotate: '0'
    }
  },
  onLoad: function () {
    
  },

  /* 
    小滑块滑动
  */
  jkSlideViewMove(e) {
    let { globalCanvasDom, jkDandB } = this.data;
    if( !globalCanvasDom ) {
      app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      return;
    }
    let a = e.touches[0].pageX-98
      , b = (this.data.slideLength-this.data.slideWidth)/2;
    if(a<0) {
      a = 0;
    }else if(a>(this.data.slideLength-this.data.slideWidth)) {
      a = this.data.slideLength-this.data.slideWidth;
    }
    if(a>=0&&a<=(this.data.slideLength-this.data.slideWidth)) {
      let c = a-b;
      if(e.currentTarget.dataset.info == 'scale') {
        let imgScale = `cutImgInfo.picScale`,
          jkDandBScale = `jkDandB.scale`;
        if(c>0) {
          this.setData({
            scaleImgandCanvas: 1+(c/b)*1,
            [imgScale]: 1+(c/b)*1
          })
        }else {
          this.setData({
            scaleImgandCanvas: 1-(Math.abs(c)/b)*0.1,
            [imgScale]: 1-(Math.abs(c)/b)*0.1
          })
        }
        this.setData({
          slideLeft_scale: a,
          [jkDandBScale]: this.data.scaleImgandCanvas>1?((c/b)*1).toFixed(1):`-${((Math.abs(c)/b)*0.1*10).toFixed(1)}`
        })
      }else {
        let imgRotate = `cutImgInfo.picRotate`,
          jkDandBRotate = `jkDandB.rotate`;
        this.setData({
          rotateImgandCanvas: (c/b)*180,
          [imgRotate]: (c/b)* Math.PI
        })
        this.setData({
          slideLeft_rotate: a,
          [jkDandBRotate]: this.data.rotateImgandCanvas.toFixed(0)
        })
      }
    }
  },

  /* 
    小滑块滑动结束
  */
  jkSlideViewEnd(e) {
    let { cutImgInfo, globalCanvasDom } = this.data;
    if( !globalCanvasDom ) {
      app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      return;
    }
    let a = e.changedTouches[0].pageX-98;
    if(a<0) {
      a = 0;
    }else if(a>(this.data.slideLength-this.data.slideWidth)) {
      a = this.data.slideLength-this.data.slideWidth;
    }
    if(a>=0&&a<=(this.data.slideLength-this.data.slideWidth)) {
      this.setData({
        pcutImgInfo: cutImgInfo
      })
    }
  },
  
  /* 
    选择图片
  */
  jkChooseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        this.setData({
          imgSrc: res.tempFilePaths[0]
        })
      }
    })
  },

  /* 
    重置按钮
  */
  jkResetCutImg() {
    // 触发组件中重置按钮
    this.component_cut._jkResetCutImg();
    this.setData({
      scaleImgandCanvas: 1,
      rotateImgandCanvas: 0,
      // 缩放滑块位置
      slideLeft_scale: (this.data.slideLength - this.data.slideWidth) / 2,
      // 旋转滑块位置
      slideLeft_rotate: (this.data.slideLength - this.data.slideWidth) / 2,
    })
  },
  /* 
    确定切图
  */
  jkCutImg() {
    this.component_cut._jkCutImg();
  },

  jkGetNoreadNotify(e) {
    this.setData({
      globalCanvasDom: e.detail.globalCanvasDom,
    })
  },
  onReady() {
    this.component_cut = this.selectComponent("#component_cut");
    const query = wx.createSelectorQuery()
    query.select('#lineSlide').boundingClientRect()
      .exec((res) => {
        let a = (res[0].width-this.data.slideWidth) / 2;
        this.setData({
          slideLeftLength: res[0].left,
          slideLength: res[0].width,
          // 缩放滑块位置
          slideLeft_scale: a,
          // 旋转滑块位置
          slideLeft_rotate: a
        })
      })
  }
})
