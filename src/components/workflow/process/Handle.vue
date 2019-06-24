<template>
  <div class="wfprocess wfprocess-handle">
    <div class="wfprocess-header">      
      审批处理 - {{title}}
      <div class="header-left">
        <Button size="small" @click="goBack" icon="chevron-left" type="warning">返回</Button>
      </div>      
    </div>  
    <div class="wfprocess-container">
      <div class="wfprocess-bill">
        <slot></slot>
        <AuditLogs :instId="instId"></AuditLogs>
      </div> 
    </div>
    <div class="wfprocess-footer">
        <div class="wfprocess-footer-body">
        <table cellpadding="0" cellspacing="0" style="width: 100%">
          <tr>
            <td class="label">审批流程</td>            
            <td >
              <div class="nodes">
                <template v-for="(item,index) in instance.nodeList">
                  <div v-if="index<instance.cur" class="nodes-item pass">
                    <Icon type="ios-checkmark"></Icon>&nbsp;{{item.text}}
                  </div>
                  <div v-if="index==instance.cur" class="nodes-item cur">
                    <Icon type="ios-circle-filled"></Icon>&nbsp;{{item.text}}
                  </div>
                  <div v-if="index>instance.cur" class="nodes-item">
                    <Icon type="ios-circle-outline"></Icon></Icon>&nbsp;{{item.text}}
                  </div>
                </template>
              </div>
            </td>            
          </tr>
          <tr v-if="formItem.status == 5">
            <td class="label">转 审</td>
            <td>
              <SelMember ref="selMember" v-model="formItem.nextUser" :model="formItem" :text="formItem.nextUserName" textProp="nextUserName" 
              style="display:inline-block;width:100px;"></SelMember>
              <Button type="info" @click="trans" class="btn-trans" >返 回</Button>
            </td>
          </tr>
          <tr v-else>
            <td class="label">下一结点</td>
            <td>
              <Select v-model="formItem.nextCur" style="width: auto;min-width: 140px;" @on-change="selNextNode">
                <Option v-for="item in nextNodes" :value="item.index" :key="item.index">{{ item.text }}</Option>
              </Select>
              &nbsp;
              <Select v-model="formItem.nextUser" style="width: auto;min-width: 100px;">
                <Option v-for="item in users" :value="item.userId" :key="item.userId">{{ item.trueName }}</Option>
              </Select>
              <Button type="info" @click="trans" class="btn-trans" >转 审</Button>
            </td>
          </tr>          
          <tr>
            <td class="label">意 见</td>
            <td><Input v-model="formItem.comment" type="textarea" :rows="2" placeholder="" style="width:90%"></Input></td>
          </tr>
          <tr>
            <td style=""></td>
            <td>
               <Button type="success" size="large" @click="submit" class="btn-submit">提 交</Button>
               <Button type="default" size="large" @click="terminate" class="btn-terminate" >驳回到发起人</Button>
               <Button type="default" size="large" @click="invalid" class="btn-invalid" >作废</Button>
            </td>
          </tr>
        </table>
        </div>
      </div>
  </div>
</template>
<script>
  import SelMember from '@/components/page/form/SelectMember'
  import AuditLogs from './AuditLogs'
  export default {
    components: { 
      SelMember,
      AuditLogs
    },
    props:{
      title: {
        type: String,
        default: '标题'
      },
      instId:{
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
          instId:0,
          nextCur:0,
          nextUser:'',
          nextUserName:'',
          status:2,
          comment:''
        },
        instance:{
          title:'流程实例',
          cur:0,
          nodeList:[]
        }
      }
    },
    mounted: function () {
    },
    computed: {},
    watch:{
      instId(newVal,oldVal){
        this.load(newVal);
      }
    },
    methods: { 
      load(id){
        this.users = [];
        this.formItem = {
          nextCur:0,
          nextUser:'',
          nextUserName:'',
          comment:'',
          status:2,
        };
        this.instance = {
          title:'流程实例',
          cur:0,
          nodeList:[]
        } 

        this.loading = 1;
        this.$http.get('/api/engine/workflow/instance/get?id='+id).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            var data = res.data.data;
            if(data){
              Object.assign(this.instance,data);              
              this.formItem.instId = data.id;

              this.nextNodes = [];
              var nodeList = this.instance.nodeList;
              for(var i = 0;i<= this.instance.cur + 1;i++){
                if(i < nodeList.length){
                  var node = nodeList[i];
                  this.nextNodes.push({index:i,key:node.key,text:node.text});
                }
              }
              if(this.instance.cur + 1 >= nodeList.length){
                this.nextNodes.push({index:nodeList.length,key:'--',text:'结束'});
              }

              this.formItem.nextCur = this.instance.cur + 1;
              this.selNextNode();

              this.$emit('on-load',this,this.instance);

            }else{
              this.$Message.info("流程实例不存在！");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        })
      },
      selNextNode(){
        var cur = this.formItem.nextCur;
        if(cur >= 0){ 
          var node = this.nextNodes[cur*1];
          if(node.key == '--'){
            this.formItem.nextUser = '0';
            this.formItem.nextUserName = '结束';
            this.users = [{userId:'0',trueName:'结束'}];
          }else{
            this.loadUsers(node.key);  
          } 
        } 
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
        if(this.formItem.nextUser == null || this.formItem.nextUser == ''){
          this.$Message.error('请选择审批人');
          return;
        }
        if(this.formItem.status != 5){
          this.formItem.status = 2; // 完成
        }
        this.$emit('on-submit',this,this.formItem);
      },
      terminate(){
        this.formItem.status = 3; // 终止
        this.$emit('on-submit',this,this.formItem); 
      },
      invalid(){
        this.formItem.status = 4; // 作废
        this.$emit('on-submit',this,this.formItem); 
      },
      trans(){         
        if(this.formItem.status !=5){
          this.formItem.status = 5;
          this.formItem.nextCur = this.instance.cur;
          this.formItem.nextUser = '';
          this.formItem.nextUserName = '';
        }else{
          this.formItem.status = 2;

          this.formItem.nextCur = this.instance.cur + 1;
          this.selNextNode();
        }
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
    padding-right: 10px;
    line-height: 42px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    margin-top: -42px;
    background-color: #F9FAFB;
    text-align: center;
    position: relative;
  }
  .wfprocess-header .header-left{
    top:0px;
    position: absolute; 
  }
  
  .wfprocess-container{    
    height: 100%;
    width: 100%;
    overflow:hidden;
    position: relative;
    overflow-y: auto;
    overflow-x: auto;
    text-align: left;
  }  
  .wfprocess-bill{
    min-width: 600px;
    max-width: 1000px;
    margin: 0px auto;
    padding:10px;
  }

  .wfprocess.wfprocess-handle{
    padding-bottom: 195px;
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

  .wfprocess-footer .nodes .nodes-item{
    display: block;
    padding: 4px 8px;
    border:1px solid #eee;
    border-radius: 3px;
    float: left;
    margin-right: 10px;
    background-color: white;
    color: #999;
  }
  .wfprocess-footer .nodes .nodes-item .ivu-icon{
    font-size: 18px;
  }

  .wfprocess-footer .nodes .nodes-item.cur{
    color:#2d8cf0;font-weight: bold;
  }  

  .wfprocess-footer .nodes .nodes-item.pass{
    color:#19be6b;
  }

  .ivu-icon-ios-checkmark:before {
    content: "\F3FF";
  }


  .wfprocess-footer .label{
    width:70px;text-align: right;
    padding-right: 10px;  
  }
   
  .wfprocess-footer .btn-submit{
    height: 40px;width: 140px;    
  }

  .wfprocess-footer .btn-terminate{
  height: 40px;margin-left: 80px;
  }
  .wfprocess-footer .btn-invalid{
  height: 40px;margin-left: 10px;
  } 
</style>
