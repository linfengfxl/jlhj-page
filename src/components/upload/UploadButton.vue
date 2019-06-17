<template>
  <Upload name="file"
        :show-upload-list="false" 
        :action="action"
        :on-success="onUpload">
      <Button icon="ios-cloud-upload-outline" :disabled="disabled">{{text}}</Button>
  </Upload>
</template>
<script>　
  export default {
    components: {
     　 
    },
    data() {　
      return {
        loading:0,
        action:this.$http.defaults.baseURL + '/api/file/upload',
        fileIds:'',
      }
    },
    mounted: function () {

    },
    computed: {

    },
    model: {
      prop: 'value',
      event: 'input-value'
    },
    props:{
      value:{
        type:String,
        default:''
      },
      text:{
        type:String,
        default:"导入"
      },
      disabled:{
        type:Boolean,
        default:false,
      }
    },
    watch:{
      value(new_val,old_val){

      }
    },
    methods: { 
      onUpload(response, file, fileList){
        if(response.code == 0){ 
          this.$emit('input-value',response.data);
          this.$emit('on-upload',response.data);
        } 
      }
    }
  }
</script>

<style type="text/css">
   
</style>
