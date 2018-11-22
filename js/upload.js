/**
 * Created by c-zouzhongxing1 on 2018/11/14. 微信:gavinjzx QQ:120534960
 */
var upload = {
    config: {
        eleFileID: "",//选择图片ID
        canvasID: "",//canvasID
        previewID: "",//预览区ID
        clickToUploadMessage: "点击上传图片",//点击上传图片提示信息
        uploading: "图片上传中",//上传中提示信息
        uploadSuccess: "上传成功！",//上传成功提示信息
        uploadFailure: "上传失败！",//上传失败提示信息
        quality: 1,//图片质量
        sMaxWidth: 6000,//原图最大宽度
        sMaxHeight: 6000,//原图最大高度
        canvasWidth: 300,//目标图片宽度
        canvasHeight: 300,//目标图片高度
        sMinWidth: 0,//最小宽度
        sMinHeight: 0,//最小高度
        disableSlipOut: true,//禁止滑出，也就是裁图不允许留白
        maxFileSize: 10 * 1024 * 1024,//最大文件大小，默认10M
        messageID: ""
    },
    status: {
        message: "",//当前状态信息
        selectedImg: false,//选中图片状态
        errMessage: [],//错误信息
        // touch: {
        //     startX: 0,
        //     startY: 0,
        //     endX: 0,
        //     endY: 0
        // },
        touches: {//记录两个touch点
            one: {x: 0, y: 0},
            two: {x: 0, y: 0}
        },
        firstScale: 1,//最后的缩放比例c
        origin: {},//原点
        offset: {//手指移动
            x: 0,//移动的X
            y: 0//移动的Y
        },
        drawObj: {//画图对象的坐标信息
            image: null,//图片
            sX: 0,//可选。开始剪切的 x 坐标位置。
            sY: 0,//可选。开始剪切的 y 坐标位置。
            lsX:0,//保存最后一次图片左顶的sx
            lsY:0,//保存最后一次图片左顶的sy
            sWidth: 0,//可选。被剪切图像的宽度。
            sHeight: 0,//可选。被剪切图像的高度。
            dX: 0,//在画布上放置图像的 x 坐标位置。
            dY: 0,//在画布上放置图像的 y 坐标位置。
            dWidth: 0,//可选。要使用的图像的宽度。（伸展或缩小图像）
            dHeight: 0//可选。要使用的图像的高度。（伸展或缩小图像）
        }
    },
    init: function () {//初始化
        this.extend(this.config, arguments[0]);//参数扩展
        if (!this.config.eleFileID || !this.config.canvasID)return;//如果选择图片ID为空 && canvasID为空，直接返回。
        this.fitDevice();//根据设备相素率生成canvas css宽度
        this.bindFileSelect();//绑定事件ID
    },
    bindFileSelect: function () {//选择图片
        var selectBtn = document.querySelector(this.config.eleFileID);
        var self = this;
        selectBtn.addEventListener("change", function (event) {
            self.bindCanvas(event.target.files[0]);//把文件传递给bindCanvas函数
        }, false)
    },
    bindCanvas: function () {//canvas事件
        var self = this;//引用this
        var file = arguments[0];
        //清除错误信息
        this.status.errMessage = [];
        this.checkFile(file);//如果有错，则不执行以下部分
        //如果是图片内则处理
        var reader = new FileReader(file);
        reader.readAsDataURL(file);
        reader.onload = function () {
            //生成img
            var image = new Image();
            image.src = this.result;
            image.onload = function () {//图片加载后绘制canvas
                self.drawCanvas(image);
                self.bindTouch();
            }
        }
    },
    checkFile: function (file) {
        if (!file) {
            return
        }
        if (file.size > this.config.maxFileSize) {
            this.status.errMessage.push("文件大小" + file.size + "大于最大尺寸：" + this.config.maxFileSize / 1024 / 1024 + "M")
        }
        if (file.type.indexOf("image") != 0) {
            this.status.errMessage.push("请选择图片！")
        }
        if (this.config.sMinWidth > 0) {
            if (file.width < this.config.sMinWidth) {
                this.status.errMessage.push("选择的图片太窄！")
            }
        }
        if (this.config.sMinHeight > 0) {
            if (file.width < this.config.sMinHeight) {
                this.status.errMessage.push("选择的图片高度太短！")
            }
        }
        if (this.status.errMessage.length > 0) {
            for (var i = 0; i < this.status.errMessage; i++) {
                alert(this.status.errMessage[i]);//弹出错误信息
            }
            return;
        }

    },
    bindTouch: function () {
        var el = document.querySelector(this.config.canvasID),
            self = this;
        el.addEventListener("touchstart", function (e) {
            self.touchStart(e);
        });
        el.addEventListener("touchmove", function (e) {
            self.touchMove(e);
        });
        el.addEventListener("touchend", function (e) {
            self.touchEnd(e);
        });
        // el.addEventListener("changetouches", function (e) {
        //     self.changeTouches(e);
        // })
    },
    fitDevice: function () {
        var ele = document.querySelector(this.config.canvasID);
        ele.height = this.config.canvasHeight;
        ele.width = this.config.canvasWidth;
        ele.style.height = this.config.canvasHeight / window.devicePixelRatio;//按设备像素率缩放
        ele.style.width = this.config.canvasWidth / window.devicePixelRatio;//按设备像素率缩放
        // ele.style.transform = "scale(" + 1 / window.devicePixelRatio + ")";
        // ele.style.transformOrigin = "0 0";
    },
    touchStart: function (e) {
        //记录下来touch点
        this.status.touches.one.x = e.targetTouches[0].screenX;
        this.status.touches.one.y = e.targetTouches[0].screenY;
        if (e.targetTouches.length > 1) {
            this.status.touches.two.x = e.targetTouches[1].screenX;
            this.status.touches.two.y = e.targetTouches[1].screenY;
        }
    },

    touchMove: function (e) {
        if (e.targetTouches.length === 1) {
            //alert("moving");
            this.Translate(e);
        } else {
            this.Zoom(e);
        }
        var message = "status.drawObj.sX:" + this.status.drawObj.sX;
        message += "<br>status.drawObj.sY:" + this.status.drawObj.sY;
        message += "<br>status.offset:" + this.status.offset;
        message += "<br>status.drawObj.lastScale:" + this.status.lastScale;
        this.setMessage(message);

    },
    touchEnd: function (e) {
        this.status.drawObj.sX =this.status.drawObj.lsX;
        this.status.drawObj.sY =this.status.drawObj.lsY;
        this.status.offset = {x: 0, y: 0};
        this.status.drawObj.lastScale = this.status.drawObj.sWidth / this.status.drawObj.image.width;
        var message = "status.drawObj.sX:" + this.status.drawObj.sX;
        message += "<br>status.drawObj.sY:" + this.status.drawObj.sY;
        message += "<br>status.offset x:" + this.status.offset.x;
        message += "<br>status.offset y:" + this.status.offset.y;
        message += "<br>status.drawObj.lastScale:" + this.status.lastScale;
        console.log(message);
        this.setMessage(message);
    },
    setMessage: function (message) {
        console.log(this.config.messageID);
        if (this.config.messageID) {
            console.log("true");
            var ele = document.querySelector(this.config.messageID);
            ele.innerText = message;
        }
    },
    //多指缩放函数
    Zoom: function (e) {
        var origin = this.getOrigin(this.status.touches.one, this.status.touches.two),//获取2指中间为原点
            distanceStart = this.getDistance(this.status.touches.one, this.status.touches.two),//起始距离
            distanceEnd = this.getDistance(//移动中距离
                {x: e.touches[0].screenX, y: e.touches[0].screenY}
                , {x: e.touches[1].screenX, y: e.touches[1].screenY});
        var scale = distanceEnd / distanceStart;
        //开始给drawObj赋值
        //原理sX1-ox=(sX-oX)*scale
        this.status.drawObj.sX = (this.status.drawObj.sX - origin.x) * scale + origin.x;
        this.status.drawObj.sY = (this.status.drawObj.sY - origin.y) * scale + origin.y;
        //修改原图的宽度和高度即是缩放
        this.status.drawObj.sWidth = this.status.drawObj.image.width * this.status.drawObj.lastScale * scale;
        this.status.drawObj.sHeight = this.status.drawObj.image.height * this.status.drawObj.lastScale * scale;
        //重画canvas
        this.redrawCanvas();
    },
    //单指移动函数
    Translate: function (e) {
        //移动时，只需要记录下手指移，然后重画canvas
        this.status.offset = {
            x: e.touches[0].screenX - this.status.touches.one.x,
            y: e.touches[0].screenY - this.status.touches.one.y
        };
        //console.log(this.status.offset.x);
        this.redrawCanvas();
    },
    getOrigin: function (first, second) {//获取原点
        return {
            x: (first.x + second.x) / 2,
            y: (first.y + second.y) / 2
        };
    },
    getDistance: function (start, stop) {//获取距离
        return Math.sqrt(Math.pow((stop.x - start.x), 2) + Math.pow((stop.y - start.y), 2));
    },
    drawCanvas: function (image, sx, sy) {//重绘canvas
        var imgWidth = image.width,//图像宽度
            imgHeight = image.height,//图像高度
            canvasWidth = this.config.canvasWidth,//画布宽度
            canvasHeight = this.config.canvasHeight;//画布高度
        var imgXYRatio = imgWidth / imgHeight,//原图xy比
            canvasXyRatio = canvasWidth / canvasHeight;//画板xy比
        var newImgWidth, newImgHeight;
        if (imgXYRatio <= canvasXyRatio) {
            newImgWidth = canvasWidth;//赋值宽度
            newImgHeight = newImgWidth / imgXYRatio;//计算高度
        }
        else {
            newImgHeight = canvasHeight;
            newImgWidth = newImgHeight * imgXYRatio;//计算宽度
        }
        var canvas = document.querySelector(this.config.canvasID);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        console.log(newImgWidth);
        console.log(imgWidth);
        //console.log(this.status.lastScale);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // this.status.image = image;
        if (arguments.length < 3) {//如果参数长度小于3，则认为没有传sx和sy过来
            sx = -(newImgWidth - canvasWidth) / 2;
            sy = -(newImgHeight - canvasHeight) / 2;
        }
        this.status.drawObj.image = image;
        this.status.drawObj.sX = sx;
        this.status.drawObj.sY = sy;
        this.status.drawObj.sWidth = newImgWidth;
        this.status.drawObj.sHeight = newImgHeight;
        this.status.drawObj.firstScale = newImgHeight / imgHeight;
        // console.log("first scale:" + this.status.firstScale);
        this.status.drawObj.lastScale = newImgWidth / imgWidth;

        ctx.drawImage(image, sx, sy, newImgWidth, newImgHeight);
    },
    redrawCanvas: function () {//重画画板
        var canvas = document.querySelector(this.config.canvasID);
        canvas.width = this.config.canvasWidth;
        canvas.height = this.config.canvasHeight;
        var sWidth = this.status.drawObj.sWidth;
        var sHeight = this.status.drawObj.sHeight;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);//清空画板
        // console.log(this.status.drawObj.image);
        var sX, sY;//设定位移
        sX = this.status.drawObj.sX + this.status.offset.x;
        sY = this.status.drawObj.sY + this.status.offset.y;
        //滑出边界判断，根据config里的disableSlitOut来判断是否允许滑出边界
        if (this.config.disableSlipOut) {
            //如果画布大于图片宽
            if (canvas.width > sWidth) {
                if (sX < 0) sX = 0;//如果左侧移出则返回0，0点
                if (sX > canvas.width - sWidth) sX = canvas.width - sWidth;
            } else {//画布小于图像宽
                if (sX > 0) sX = 0;//如果左侧出白，则返回0点
                if (sX < canvas.width - sWidth) sX = canvas.width - sWidth;
            }
            //如果画布大于图片高
            if (canvas.height > sHeight) {
                if (sY < 0) sY = 0;//如果上侧移出则返回0，0点
                if (sY > canvas.height - sHeight) sY = canvas.height - sHeight;
            } else {//画布小于图像宽
                if (sY > 0) sY = 0;//如果上侧出白，则返回0点
                if (sY < canvas.height - sHeight) sY = canvas.height - sHeight;
            }
        }
        this.status.drawObj.lsX = sX;
        this.status.drawObj.lsY = sY;
        ctx.drawImage(//绘制图像
            this.status.drawObj.image,
            sX,
            sY,
            this.status.drawObj.sWidth,
            this.status.drawObj.sHeight)
    },
    extend: function () {//参数扩展
        var length = arguments.length;//参数长度
        var target = arguments[0] || {};
        if (typeof target != "object" && typeof target != "function") {
            target = {};
        }
        if (length == 1) {
            target = this;
        }
        for (var i = 1; i < length; i++) {
            var source = arguments[i];
            for (var key in source) {
                // 使用for in会遍历数组所有的可枚举属性，包括原型。
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }
}