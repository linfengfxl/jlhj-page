<template>
  <div class="wfprocess">
    <div class="wfprocess-header">
      <Button size="small" @click="goBack" icon="chevron-left" type="warning" style="float: left;margin-top: 10px;">返回</Button>
      发起审批 - {{title}}
    </div>    
    <div class="wfprocess-container">
      <div class="wfprocess-bill">
        <slot></slot>
      </div>
    </div>   
    <div class="wfprocess-footer">       
      <div class="wfprocess-footer-body">
          <table cellpadding="0" cellspacing="0" style="width: 100%">
          <tr>
            <td class="label">审批流程</td>            
            <td >
              <div class="nodes">
                <template v-for="(item,index) in define.nodeList">
                  <Tag type="dot" color="blue" v-if="index == 0">{{item.text}}</Tag>
                  <Tag type="dot" v-else>{{item.text}}</Tag>
                </template>
              </div>
            </td>
          </tr>
          <tr>
            <td class="label">审批人</td>
            <td>
              <Select v-model="formItem.nextUser" style="width: auto;min-width: 100px;">
                <Option v-for="item in users" :value="item.userId" :key="item.userId">{{ item.trueName }}</Option>
              </Select>
            </td>
          </tr> 
          <tr>
            <td style=""></td>
            <td>
               <Button type="success" size="large" @click="submit" class="btn-submit">提 交</Button>
            </td>
          </tr>
        </table>
      </div> 
    </div> 
  </div>
</template>
<script>

  export default {
    components: { 
      
    },
    props:{
      title: {
        type: String,
        default: '标题'
      },
      defineId:{
        type:[Number,String],
        default:0
      }
    },
    data() {       
      return {
        loading:0, 
        nextNodes:[],
        users:[],
        formItem:{
          defineId:0,
          nextUser:'',
          comment:''
        },
        define:{
          id:0,
          title:'流程定义',
          instTitle:'',
          nodes:'',
          nodeList:[]
        }
      }
    },
    mounted: function () {
      if(this.defineId){
        this.load(this.defineId);
      }
    },
    computed: {},
    watch:{
      defineId(newVal,oldVal){
        this.load(newVal);
      }
    },
    methods: {
      load(define){
        this.define = {
          id:0,
          title:'流程定义',
          instTitle:'',
          nodes:'',
          nodeList:[]
        };

        this.formItem.defineId = define;

        this.loading = 1;
        this.$http.get('/api/engine/workflow/define/get?id=' + define).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            var data = res.data.data;
            if(data){ 
              Object.assign(this.define,data);  
              if(data.nodeList.length > 0){
                this.loadUsers(data.nodeList[0].key);  
              }else{
                this.loadUsers('');
              }
            }else{
              this.$Message.info("流程定义不存在！");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        })
      }, 
      loadUsers(roleId){

        this.formItem.nextUser = ''; 
        this.users = [];
        this.$http.get('/api/engine/workflow/loadUsers?roleId='+roleId).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            var data = res.data.data;
            this.users = data;
            if(data.length > 0){
              this.formItem.nextUser = data[0].userId;
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.$Message.error(error.toString())
        })
      },
      submit(){
        if(this.define.id == 0){
          this.$Message.error('流程定义为空');
          return;
        }
        if(this.formItem.nextUser == null || this.formItem.nextUser == ''){
          this.$Message.error('请选择下一节点审批人');
          return;
        }
        this.$emit('on-submit',this);
      },
      goBack(){
        this.$router.go(-1);
      }
    }
  }

</script>

<style type="text/css">
  .wfprocess{
    height: 100%;
    overflow: hidden;
    padding-top: 42px;
  }
  .wfprocess-header{
    height: 42px;
    padding-left: 10px;
    line-height: 42px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    margin-top: -42px;
    background-color: #F9FAFB;
    text-align: center;
  }
  .wfprocess-container{    
    height: 100%;
    width: 100%;
    overflow:hidden;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }  
  .wfprocess-bill{
    max-width: 1000px;
    min-width: 600px;
    margin: 0px auto;
    padding:15px 10px 195px 15px;
  }
  .wfprocess-footer{
    height: auto;
    width: 100%;
    position: absolute;
    bottom: 0px;        
    border-top: 1px solid #eee;
    background-color:  #fafafa;    
  }

  .wfprocess-footer-body{
    padding: 4px 10px;
    font-size: 14px;
    max-width: 1000px;
    min-width: 600px;
    margin: 0px auto;
  }
  

  .wfprocess-footer td{
    padding: 4px;
  }

  .wfprocess-footer .nodes li{
    display: block;
    padding: 4px 8px;
    border:1px solid #eee;
    border-radius: 3px;
    float: left;
    margin-right: 10px;
  }
  .wfprocess-footer .label{
    width:70px;text-align: right;
    padding-right: 10px;  
  } 
  .wfprocess-footer .btn-submit{
    height: 40px;width: 140px;    
  }
</style>
