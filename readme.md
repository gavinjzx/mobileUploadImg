# 移动端头像上传前端处理案例
```` 
利用canvas 实体前端（客户端）图片处理，可移动，放大缩小，裁剪，原生JS编写。
````
# 演示地址
[http://atigege.com/case/web/mobileUploadImg/]
![image](https://raw.githubusercontent.com/gavinjzx/mobileUploadImg/master/qrcode.png)
# 使用说明
1. 页面添加file元素
````
<input type="file" id="btnSelectImg" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">

````
2. 页面添加画布(canvas)元素
````
<canvas id="previewImg">
        您当前的浏览器不支持canvas。
    </canvas>
````
3. js调用
````
<script>
    upload.init({
        eleFileID: "#btnSelectImg",//上传按钮ID
        canvasID: "#previewImg",//canvasID
        canvasWidth: 300,//生成canvas宽度
        canvasHeight: 300,//生成canvas高度
        messageID: "#message"
    })
</script>
````
# 参数说明
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

# 参考文章
````
https://blog.csdn.net/qq_29132907/article/details/82456245?utm_source=blogxgwz0
https://www.cnblogs.com/laneyfu/p/6156409.html

https://blog.csdn.net/chenqiuge1984/article/details/80129080
https://github.com/codingplayboy/web_demo/blob/master/mobile/mobile_gesture.html
````