<template>
  <table class="form" cellpadding="0" cellspacing="0" v-if="config">
     <tr>
       <td class="label">脚本 Groovy</td>
       <td>
          <div :class="{'editor-container':true,'max':max}">
            <div class="editor-container-bar">
              <Button type="info" shape="circle" size="small" @click="clickMax" >
              {{max?'还原':'最大化'}}
              </Button>
            </div>
            <editor ref="editor" v-model="config.script" @init="editorInit" lang="groovy" theme="chrome" height="100%" ></editor>
          </div>
       </td>
     </tr>
     <tr>
       <td class="label">初始代码段</td>
       <td> 
          <Button type="info" shape="circle" size="small" @click="initCode(item)" v-for="item in codeTemps" style="margin-right: 10px">{{item.title}}</Button>
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
      config:{
        type:Object,
        default:()=>{
          return this.defaultConfig();
        }
      }
    },
    data() { 
      this.fillConfig();
      return {
        max:false,
        codeTemps:[],
      } 
    },
    watch:{
      config(val){
        this.fillConfig();
      }
    },
    mounted:function(){
      this.loadCodeTemp();
    },
    computed:{ 

    },
    methods:{
      defaultConfig(){ 
        return {
          script:'return [form,query]',
        };
      },
      fillConfig(){
        if(this.config){ 
          var defConfig = this.defaultConfig();
          for(var name in defConfig){
            if(typeof(this.config[name]) == 'undefined'){
              this.$set(this.config,name,defConfig[name]);
            }
          }
        }
      },
      editorInit: function () {
          // https://ace.c9.io/build/kitchen-sink.html
          // https://www.npmjs.com/package/vue2-ace-editor
           require('brace/ext/language_tools') //language extension prerequsite...
          // require('brace/mode/html')                
          // require('brace/mode/javascript')    //language
          // require('brace/mode/less')
          require('brace/mode/groovy')
          require('brace/theme/chrome')
          require('brace/snippets/javascript') //snippet
      },
      initCode(item){
        this.config.script = item.code;
      },
      loadCodeTemp(){
        this.loading = 1;
        this.$http.post('api/engine/api.scriptTemps', {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             this.codeTemps = res.data.data;
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });

      },
      clickMax(){
        this.max = !this.max;
        this.$nextTick(function(){
          this.resize();
        })
      },
      resize(){
        this.$refs.editor.editor.resize()        
      }
    }
  }

</script>

<style type="text/css">
   
</style>

