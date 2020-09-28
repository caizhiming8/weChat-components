// components/cut-image/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgSrc: {
      type: 'String',
      value: '',
      observer:function(newVal,oldVal,change){
        if(newVal == oldVal) {
          return;
        }
        if (newVal){
          this._jkChooseImg(newVal);
        }
      }
    },
    // 图片信息
    pcutImgInfo: {
      type: 'Object',
      value: null,
      observer:function(newVal,oldVal,change){
        if (newVal){
          this._jkSlideViewEnd(newVal);
        }
      }
    },
    // 图片缩放和canvas
    scaleImgandCanvas: {
      type: 'Number',
      value: 1
    },
    // 图片旋转和canvas
    rotateImgandCanvas: {
      type: 'Number',
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cut_viewTop: 0,
    cut_viewLeft: 0,
    cut_viewWidth: 0,
    cut_viewHeight: 0,
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
    // canvas信息
    cutCanvasInfo: {
      Width: 0,
      Height: 0
    },
    // 当前点击的切图View的位置
    curClickCutViewInfo: {
      x: 0,
      y: 0
    },
    // 图片缩放和canvas
    scaleImgandCanvas: 1,
    // 图片旋转和canvas
    rotateImgandCanvas: 0,
    globalCanvasDom: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 
      小滑块滑动结束
    */
    _jkSlideViewEnd(e) {
      let {cutImgInfo,cutCanvasInfo} = this.data;
      cutImgInfo.picScale = e.picScale;
      cutImgInfo.picRotate = e.picRotate;
      this.setData({
        cutImgInfo
      })
      const context = wx.createCanvasContext('cutCanvas',this);
      context.clearRect(0, 0, cutCanvasInfo.Width, cutCanvasInfo.Height);
      context.translate(cutCanvasInfo.Width/2, cutCanvasInfo.Height/2);
      context.scale(cutImgInfo.picScale,cutImgInfo.picScale);
      context.rotate(cutImgInfo.picRotate);
      context.drawImage(cutImgInfo.src, cutImgInfo.picLeft, cutImgInfo.picTop, cutImgInfo.picWidth*3, cutImgInfo.picHeight*3);
      context.clearRect(0, 0, cutCanvasInfo.Width, cutCanvasInfo.Height);
      context.translate(-(cutCanvasInfo.Width/2), -(cutCanvasInfo.Height/2));
      context.drawImage(cutImgInfo.src, cutImgInfo.picLeft, cutImgInfo.picTop, cutImgInfo.picWidth*3, cutImgInfo.picHeight*3);
      context.draw();
    },
    _jkCutViewStart: function(e) {
      let { globalCanvasDom } = this.data;
      if( globalCanvasDom ) {
        this.setData({
          cut_viewWidth: 0,
          cut_viewHeight: 0,
          cut_viewTop: e.touches[0].pageY,
          cut_viewLeft: e.touches[0].pageX
        })
      } else {
        app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      }
    },
    _jkCutViewMove: function(e) {
      let { globalCanvasDom } = this.data;
      if ( globalCanvasDom ) {
        this.setData({
          cut_viewWidth: e.touches[0].pageX-this.data.cut_viewLeft,
          cut_viewHeight: e.touches[0].pageY-this.data.cut_viewTop
        })
      } else {
        app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      }
    },
  
    _jkCut_ViewStart: function(e) {
      let { globalCanvasDom } = this.data;
      if( globalCanvasDom ) {
        this.setData({
          curClickCutViewInfo: {
            x: e.touches[0].pageX -this.data.cut_viewLeft,
            y: e.touches[0].pageY -this.data.cut_viewTop,
          }
        })
      }else {
        app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      }
    },
    _jkCut_ViewMove: function(e) {
      let { globalCanvasDom } = this.data;
      if(globalCanvasDom) {
        this.setData({
          cut_viewTop: e.touches[0].pageY-this.data.curClickCutViewInfo.y,
          cut_viewLeft: e.touches[0].pageX-this.data.curClickCutViewInfo.x
        })
      }else {
        app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      }
    },
    /* 
      剪切view的角
    */
    _jkCut_ViewMove_angle(e) {
      let { globalCanvasDom } = this.data;
      if(globalCanvasDom) {
        if(e.currentTarget.dataset.info == 'right_bot') {
          this.setData({
            cut_viewWidth: e.touches[0].pageX-this.data.cut_viewLeft,
            cut_viewHeight: e.touches[0].pageY-this.data.cut_viewTop
          })
        }else {
          this.setData({
            cut_viewWidth: (this.data.cut_viewLeft+this.data.cut_viewWidth)-e.touches[0].pageX,
            cut_viewHeight: (this.data.cut_viewTop+this.data.cut_viewHeight)-e.touches[0].pageY,
            cut_viewTop: e.touches[0].pageY,
            cut_viewLeft: e.touches[0].pageX
          })
        }
      }else {
        app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      }
    },
    
    /* 
      选择图片
    */
    _jkChooseImg(e) {
      let { globalCanvasDom,cutCanvasInfo } = this.data;
      let _this = this;
      if(globalCanvasDom) {
        globalCanvasDom = null;
      }
      // 重置
      _this._jkResetCutImg();

      const tempFilePaths = e;
      let imgSrc = `cutImgInfo.src`
      _this.setData({
        [imgSrc]: e
      })
      wx.getImageInfo({
        src: e,
        success (res) {
          console.log(res)
          let imgWidth = `cutImgInfo.picWidth`
            ,imgHeight = `cutImgInfo.picHeight`
            ,imgLeft = `cutImgInfo.picLeft`
            ,imgTop = `cutImgInfo.picTop`
            ,canWidth = `cutCanvasInfo.Width`
            ,canHeight = `cutCanvasInfo.Height`;
          const query = _this.createSelectorQuery()
          query.select('#contView').boundingClientRect()
            .exec((data) => {
              let contView_width = data[0].width
                , contView_height = data[0].height
                , curImgWidth = res.width
                , curImgHeight = res.height;
              let imgRoate = curImgWidth/curImgHeight;
              // 对图片的缩放
              if (res.width > contView_width) {
                curImgWidth = contView_width*0.9;
                curImgHeight = curImgWidth/imgRoate;
              }
              if(curImgHeight>contView_height) {
                curImgHeight = contView_height*0.9;
                curImgWidth = (curImgHeight * imgRoate);
              }

              _this.setData({
                [ imgWidth ]: curImgWidth,
                [ imgHeight ]: curImgHeight,
                [ canWidth ]: contView_width*3,
                [ canHeight ]: contView_height*3
              })

              let imgPicLeft = (contView_width - curImgWidth)/2
                , imgPicTop = (contView_height - curImgHeight)/2;
              _this.setData({
                [ imgLeft ]: imgPicLeft*3,
                [ imgTop ]: imgPicTop*3
              })
              globalCanvasDom = wx.createCanvasContext('cutCanvas',_this);
              _this.setData({ globalCanvasDom });
              globalCanvasDom.drawImage(tempFilePaths, imgPicLeft*3, imgPicTop*3, curImgWidth*3, curImgHeight*3);
              globalCanvasDom.draw();
              _this.triggerEvent('jkGetnoreadcount', {globalCanvasDom,cutCanvasInfo});
            })
        }
      })
    },

    /* 
      重置按钮
    */
    _jkResetCutImg() {
      let { cutImgInfo, globalCanvasDom } = this.data;
      this.setData({
        cut_viewTop: 0,
        cut_viewLeft: 0,
        cut_viewWidth: 0,
        cut_viewHeight: 0
      })
      if(globalCanvasDom) {
        globalCanvasDom.drawImage(cutImgInfo.src, cutImgInfo.picLeft, cutImgInfo.picTop, cutImgInfo.picWidth*3, cutImgInfo.picHeight*3);
        globalCanvasDom.draw();
      }
    },
    /* 
      确定切图
    */
    _jkCutImg() {
      let { cut_viewWidth, globalCanvasDom, cutImgInfo } = this.data;
      if(globalCanvasDom) {
        if(cut_viewWidth==0) {
          // 如果没有选择区域 默认剪切整张图片
          wx.previewImage({
            current: cutImgInfo.src, // 当前显示图片的http链接
            urls: [ cutImgInfo.src ] // 需要预览的图片http链接列表
          })
          return;
        }
        wx.canvasToTempFilePath({
          x: (this.data.cut_viewLeft)*3,
          y: (this.data.cut_viewTop)*3,
          width: this.data.cut_viewWidth*3,
          height: this.data.cut_viewHeight*3,
          canvasId: 'cutCanvas',
          success(res) {
            wx.previewImage({
              current: res.tempFilePath, // 当前显示图片的http链接
              urls: [res.tempFilePath] // 需要预览的图片http链接列表
            })
          }
        },this)
      } else {
        app.globalData.webapi.goShowToast(`请选择图片`,null,null,false);
      }
    }
  }
})
