<template>
    <div>
        <h1>用户中心</h1>
        <div>
            <input type="file" name='file' @change = "handleFilteChange">
        </div>
        <div>
            <el-button @click="uploadFile">上传</el-button>
        </div>
    </div>
</template>

<script>
export default {
    async mounted() {
        const ret = await this.$http.get('/user/info')
        console.log('===ret', ret);
    },
    data() {
        return {
            file: null
        }
    },
    methods: {
        async uploadFile() {

            const form = new FormData()
            form.append('file', this.file)   // 得到二进制
            const ret = await this.$http.post('/uploadFile', form)
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
