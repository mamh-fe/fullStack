<template>
    <div>
        <h1>用户中心</h1>
        <div ref='drag' id='drag'>

            <input type="file" name='file' @change = "handleFilteChange">
        </div>
        <div>
            <el-progress  :stroke-width = '20' :text-inside="true" :percentage='uploadProgress'></el-progress>
        </div>
        <div>
            <el-button @click="uploadFile">上传</el-button>
        </div>
    </div>
</template>

<style lang='stylus'>
#drag 
    height 100px
    line-height 100px
    border dashed  2px #eee
    text-align center 
    vertical-align middle
</style>

<script>
export default {
    async mounted() {
        const ret = await this.$http.get('/user/info')
        console.log('===ret', ret);
        // 监听事件
        this.bindEvents()
    },
    data() {
        return {
            file: null,
            uploadProgress: 0
        }
    },
    methods: {
        bindEvents() {
            console.log('===$ref', this.$refs)
            const drag = this.$refs.drag
            drag.addEventListener('dragover', e => {
                drag.style.borderColor ='red';
                e.preventDefault()
            })

            drag.addEventListener('dragleave', e => {
                drag.style.borderColor ='#eee';
                e.preventDefault()
            })

            drag.addEventListener('drop', e => {
                const fileList = e.dataTransfer.files;
                drag.style.borderColor ='#eee';
                this.file = fileList[0]
                e.preventDefault()
            })
        },
        async blobToString(blob) {
            // 读文件内容拿出来二进制信息
            return new Promise(resolve => {
                // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
                //其中File对象可以是来自用户在一个<input>元素上选择文件后返回的FileList对象,也可以来自拖放操作生成的 DataTransfer对象,
                // 还可以是来自在一个HTMLCanvasElement上执行mozGetAsFile()方法后返回结果。
                const reader = new FileReader()
                reader.onload = function() {
                    console.log( '读取结果', reader.result);
                    // 比如 gif 的  reader.result 是 GIF89a
                    const ret = reader.result.split('')  // 切割成单独的  ['G', 'I', 'F', '8', '9', 'a']
                                .map(v => v.charCodeAt() )  // 每个都转成 10进制的 assic 码['71', ‘72’ ...])
                                .map(v => v.toString(16).toUpperCase())  // 再转成 16进制，  ['47', ...]
                                .map(v => v.padStart(2, '0'))  // 位数不够的情况补充0  , 不够两位的话， 从左侧开始填充0 到 2位
                                .join('')  // 再转成字符串
                    resolve(ret)
                }
                // readAsBinaryString 方法会读取指定的 Blob 或 File 对象，当读取完成的时候，readyState  会变成DONE（已完成）
                reader.readAsBinaryString(blob)
            })

        },
        async isGif(file) {
            // 网上搜索对应的文件头信息可得知 gif 的是：
            // 前面 6 ge 16进制  ‘47 49 46 38 39 61’  和 ‘47 49 46 38 37 61’ 两种， 一个 89年规范， 一个 87年规范
            // 对应 GIF89a  和 GIF87a   就是把每个字符的16进制的asic 码拿出来

            // 16进制的转换  获取前6个字符  (将上传的前6位转成16进制然后和对应格式的比较， 一样则证明传的没问题)
            // 不是每种格式的都获取前6个
            const ret = await this.blobToString(file.slice(0,6))
            const isGif = (ret === '47 49 46 38 39 61') || (ret === '47 49 46 38 37 61')
            console.log('==isGif', isGif);
            return isGif

        },
        async isImage(file) {
            // 通过文件流来判断
            // 先判定gif
            // 读取文件是个异步的过程， 所以要加await， 不然结果可能永远是正确的
            return await  this.isGif(file)
        },
        async uploadFile() {
            // 注意是异步的
            if(!await this.isImage(this.file)) {
                alert('文件格式不对')
                return
            }
            const form = new FormData()
            form.append('file', this.file)   // 得到二进制
            const ret = await this.$http.post('/uploadFile', form, {
                onUploadProgress: progress => {
                   this.uploadProgress = Number(((progress.loaded/progress.total)*100).toFixed(2))
                }
            })
        },
        handleFilteChange(e) {
            const [file] = e.target.files
            console.log('==file', file);
            if(!file) return
            this.file = file;
        }
    }
}
</script>
