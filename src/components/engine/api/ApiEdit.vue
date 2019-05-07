<template>
  <div class="apiedit">
    <div class="header">Api {{edit?'编辑':'添加'}} - {{title}}</div>
    <div class="apiedit-body">
      <div class="subtitle">基本信息</div>
      <table class="form" cellpadding="0" cellspacing="0">
         <tr>
           <td class="label">Api</td>
           <td>
              <Input v-model="formItem.api" placeholder="" ></Input>
           </td>
         </tr>
         <tr>
           <td class="label">标题</td>
           <td>
              <Input v-model="formItem.title" placeholder="" ></Input>
           </td>
         </tr>
         <tr>
           <td class="label">描述</td>
           <td>
              <Input v-model="formItem.description" type="textarea" :rows="4" placeholder=""  ></Input>
           </td>
         </tr>
         <tr>
           <td class="label">Api 模板</td>
           <td>
              <Select v-model="formItem.handler" >
                  <Option v-for="item in handler" :value="item.name" :key="item.name">{{ item.title }}</Option>
              </Select>
           </td>
         </tr>
      </table>
      <div class="subtitle">配置信息</div>
      <div v-if="formItem.handler == 'com.lyarc.engine.core.ListQueryApiHandler'">
        <ListQueryConfig :config="config"></ListQueryConfig>
      </div>
      <div v-if="formItem.handler == 'com.lyarc.engine.core.ScriptApiHandler'">
        <ScriptConfig :config="config"></ScriptConfig>
      </div>
      <div class="subtitle" v-if="edit">调试</div>        
      <div v-if="edit">
        <ApiTest ref="apiTest" :api="formItem.api" v-model="formItem.testParams"></ApiTest>
      </div>
    </div>
    <div class="footer">
      <table class="form" cellpadding="0" cellspacing="0">
       <tr> 
         <td>
           <Button type="success" @click="save(0)"> 保存 </Button>　 
         </td>
        </tr>
        <tr>
         <td v-if="edit">
           <Button type="info" @click="save(1)"> 另存为 </Button>
         </td>
        </tr>
        <tr>
         <td>
           <Button type="default" @click="reset"> 重置 </Button>
         </td>
        </tr>
        <template v-if="edit">
          <tr>
            <td></td>
          </tr>
          <tr>
           <td>
             <Button type="info" @click="saveRun"> 保存<br/>执行 </Button>
           </td>
          </tr>
          <tr>
           <td>
             <Button type="info" @click="run"> 执行 </Button>
           </td>
          </tr>
        </template> 
        <template v-if="edit">
          <tr>
            <td></td>
          </tr>
          <tr>
           <td>
             <Button type="warning" @click="remove"> 删除 </Button>
           </td>
          </tr>
        </template> 
      </table>
    </div>
  </div>
</template>
<script> 
  import Loading from '@/components/loading'; 
  import ListQueryConfig from './apiedit/ListQueryConfig'; 
  import ScriptConfig from './apiedit/ScriptConfig'; 
  import ApiTest from './apiedit/ApiTest'; 

  export default {
    components: {
       ListQueryConfig,
       ScriptConfig,
       ApiTest
    },
    props: {
      apiObject:{
        type:Object,
        default(){
          return {};
        }
      }
    },
    data() {
      var that = this;
      return {
        loading:0,
        title:'new',
        edit:0,// 1.编辑 0.添加
        formItem:this.defaultFormItem(),
        config:{
        },
        handler:[
          {name:'com.lyarc.engine.core.ScriptApiHandler',title:'ScriptApiHandler - groovy 脚本'},
          {name:'com.lyarc.engine.core.ListQueryApiHandler',title:'ListQueryApiHandler - 分页查询'},
        ]
      } 
    },
    watch:{
      apiObject(val){
        this.load(val);
      } 
    },
    mounted:function(){
       
    },
    computed:{ 

    },
    methods:{
      defaultFormItem(){
        return {
          id:0,
          api:'module.action',
          title:'api - 添加',
          description:'',
          handler:'com.lyarc.engine.core.ListQueryApiHandler',
          config:'{}',
          status:'',
        };
      }, 
      load(apiObject){
        if(apiObject){
          this.formItem = this.defaultFormItem();
          Object.assign(this.formItem,apiObject);
          this.loadConfig();
          this.edit = true && this.formItem.id;
          if(this.edit){
            this.title = this.formItem.api;
          }
        }else{
          this.formItem = this.defaultFormItem();
          this.loadConfig();
          this.title = 'new';
          this.edit = 0;
        } 
      }, 
      loadConfig(){ 
        var config = {};
        var formItem = this.formItem; 
        if(formItem.config != null && formItem.config != '' && formItem.config[0] == '{'){
          try{
            config = eval('('+formItem.config+')');            
          }catch(ex){
            //...
            console.log('eval(formItem.config) 失败！')
          }
        }

        this.config = config;
      },
      save(copy,callback){ 
        var form = {};
        Object.assign(form,this.formItem);
        form.config = JSON.stringify(this.config);

        let url = '';
        let msg = '';
         
        if (this.edit && !copy) {
          url = '/api/engine/api.update';
          msg = '修改成功';
        } else {
          url = '/api/engine/api.add';
          msg = '添加成功';
        }

        this.loading = 1;
        this.$http.post(url, form).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.$emit("on-save",form);
            if(callback){
              callback();
            }
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });

      },
      remove(){
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            var id = this.formItem.id;
            this.loading = 1;
            this.$http.post('/api/engine/api.delete', {id:id}).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                this.$emit("on-save",this.formItem);
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            });
          }
        });
      },
      saveRun(){
        this.save(false,()=>{
          this.run();
        })
      },
      run(){
        this.$refs.apiTest.run();
      },
      reset(){
        this.load(this.apiObject);
      }
    }
  }

</script>

<style type="text/css">
  .apiedit{
    height: 100%;
    overflow-y: auto; 
    padding-top: 42px;
    padding-right: 80px;
  }

  .apiedit-body{
    height: 100%;
    width: 100%;
    overflow-y: auto; 
    padding:10px;
    padding-right: 20px;
  }

  .apiedit .header{
    font-size: 14px; 
    color: #333;
    position: absolute; 
    left:200px;
    right:0px;
    margin-top: -42px;
    line-height: 42px;
    height: 42px;
    padding-left: 10px;
    background-color: white;
    border-bottom: 1px solid #eeeeee;
  }
  .apiedit .subtitle{
    padding: 4px;
    color: #20bfee;
    font-size: 12px;
  }
  .apiedit .form{
    width: 100%;
  }
  .apiedit .form td{
    padding: 4px;
  }
  .apiedit .label{
    width: 100px;
    text-align: right;
    color:#999;
  }

  .apiedit .footer{ 
    position: absolute; 
    background-color: #fafafa;
    border-top:1px solid #eeeeee;
    padding: 4px 0px;  
    right: 0px; 
    top: 37px;
    bottom: 0px;
    z-index: 10;
  }

  .apiedit .footer .ivu-btn
  {
    width: 100%;
    height: 100%;
  }
  .apiedit .footer table{
    width: 100%;
  }
  .apiedit .footer table td{
    height: 70px;
    padding: 8px;
    padding-bottom: 0px;
  }
</style>

