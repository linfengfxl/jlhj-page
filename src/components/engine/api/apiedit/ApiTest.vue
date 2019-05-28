<template>
  <table class="form" cellpadding="0" cellspacing="0">
     <tr>
       <td class="label">请求地址</td>
       <td>
          /api/engine/{{api}}?{{testQuery}}
       </td>
     </tr>
     <tr>
       <td class="label">QueryString</td>
       <td>
          <Input v-model="testQuery"></Input> 
       </td>
     </tr>
     <tr>
       <td class="label">Body</td>
       <td class="editor-body">
          <editor v-model="testParams" @init="editorInit" lang="json" theme="chrome" height="100%"></editor>
       </td>
     </tr>
     <tr>
       <td class="label"></td>
       <td>
         <Button type="info" @click="run">执行</Button>
       </td>
     </tr>
     <tr>
       <td class="label">结果</td>
       <td class="editor-response">
         <editor v-model="response" @init="editorInit" :lang="responseType" theme="chrome" height="100%"></editor>
       </td>
     </tr>
  </table> 
</template>
<script>
  export default {
    components: {
      editor: require('vue2-ace-editor'),
    },
    props: {
      value:{
        type:String,
        default:'{}'
      },
      api:{
        type:String,
        default:''
      }
    }, 
    data() {
      return {
        running:0,
        testParams:'{}',
        testQuery:'',
        response:'',
        responseType:'json',
      } 
    },
    watch:{
      testParams(val){
        if(val != this.value){
          this.$emit('input',val);
        } 
      },
      value(val){
        if(val != this.testParams){
          this.testParams = val || '';
        } 
      }
    },
    mounted:function(){ 
    },
    computed:{ 

    }, 
    methods:{
      editorInit: function () {
          // https://ace.c9.io/build/kitchen-sink.html
          // https://www.npmjs.com/package/vue2-ace-editor
           require('brace/ext/language_tools') //language extension prerequsite...
          // require('brace/mode/html')                
          // require('brace/mode/javascript')    //language
          // require('brace/mode/less')
          require('brace/mode/json')
          require('brace/mode/text')
          // require('brace/theme/chrome')
          // require('brace/snippets/javascript') //snippet
      },
      run(){
        this.running = 1;
        this.response = "request ...";
        var form = {};
        try{
          if(this.testParams != null && this.testParams[0] == '{'){
            form = eval('(' + this.testParams + ')');
          }
        }catch(ex){
          this.response = ex.message;
          return;
        }

        this.$http.post('/api/engine/' + this.api + "?" +this.testQuery, form).then((res) => {
          this.running = 0;
          if(typeof(res.data) == "string"){
            this.responseType = 'text';
            this.response = res.data;
          }else{
            this.responseType = 'json';
            this.response = JSON.stringify(res.data,null,4);
          } 
        }).catch((error) => { 
          this.running = 0;
          this.$Message.error(error.message)
        });
      },
    }
  }

</script>

<style type="text/css">
   
</style>

