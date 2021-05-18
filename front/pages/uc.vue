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
        async uploadFile() {

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
