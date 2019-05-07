<template>
  <table class="form" cellpadding="0" cellspacing="0" v-if="config">
     <tr>
       <td class="label">Select</td>
       <td>
          <Input v-model="config.select" type="textarea" :rows="2" placeholder="" class="textarea"></Input>
       </td>
     </tr>
     <tr>
       <td class="label">From</td>
       <td>
          <Input v-model="config.from" type="textarea" :rows="2" placeholder="" class="textarea" ></Input>
       </td>
     </tr>
     <tr>
       <td class="label">Where</td>
       <td>
          <editor v-model="config.where" @init="editorInit" lang="groovy" theme="chrome" height="200"></editor>
       </td>
     </tr>
     <tr>
       <td class="label">Order By</td>
       <td>
          <Input v-model="config.orderBy"  placeholder="" class="textarea"></Input>
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
      return {} 
    },
    watch:{
      config(val){
        this.fillConfig();
      }
    },
    mounted:function(){
       
    },
    computed:{ 

    },
    methods:{
      defaultConfig(){ 
        return {
          select:'',
          from:'',
          where:`def sql = '1=1'
def params = []

if(condition.keyword != null)
{ 
    sql += " and (api like concat('%',?,'%') or title like concat('%',?,'%'))"
    params.add(condition.keyword)
    params.add(condition.keyword)
}

return [sql,params]`,
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
    }
  }

</script>

<style type="text/css">
   
</style>

