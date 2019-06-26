<template>
  <div class="wfprocess wfprocess-view">
    <div class="wfprocess-header">      
      审批详情 - {{title}}
      <div class="header-left">
        <Button size="small" @click="goBack" icon="chevron-left" type="warning">返回</Button>
      </div>
      <div class="header-right">
        <Button size="small" @click="print" icon="printer" type="info" v-if="showPrint">打印</Button>
      </div>
    </div>  
    <div class="wfprocess-container">
      <div :class="{'page':1,'page-bill':1,'page-bill-max':max}">
        <Loading :loading="loading">
          <slot></slot>
          <AuditLogs :instId="instId"></AuditLogs>
        </Loading>
      </div>
    </div>
    <Comment :instId="instId"></Comment>
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
          <tr v-if="instance.status == 1">
            <td class="label">当前审批</td>
            <td>
              <span>{{instance.curUserName}} - ({{instance.curNodeName}})</span>               
            </td>
          </tr>
          <tr v-if="instance.status == 2">
            <td class="label">状态</td>
            <td>
               <Tag color="green">完成</Tag>      
            </td>
          </tr>
          <tr v-if="instance.status == 3">
            <td class="label">状态</td>
            <td>
               <Tag color="red">驳回终止</Tag>    
            </td>
          </tr>
          <tr v-if="instance.status == 4">
            <td class="label">状态</td>
            <td>
               <Tag color="red">作废</Tag>    
            </td>
          </tr>
        </table>
        </div>
      </div>
  </div>
</template>
<script>
  import defineCfg from '@/components/workflow/defineCfg'
  import AuditLogs from './AuditLogs'
  import Comment from './Comment'
  import Loading from '@/components/loading'

  export default {
    components: { 
      AuditLogs,
      Loading,
      Comment
    },
    props:{
      title: {
        type: String,
        default: '标题'
      },
      instId:{
        type:[Number,String],
        default:0
      },
      loading:{
        type:[Number,String],
        default:0
      },
      max:{
        type:[Number,String,Boolean],
        default:false
      }
    },
    data() {       
      return {
        innerLoading:0,          
        users:[],
        formItem:{
          instId:0,
          nextCur:0,
          nextUser:'',
          status:2,
          comment:''
        },
        instance:{
          title:'流程实例',
          cur:0,
          nodeList:[]
        },
        showPrint:false
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
          comment:'',
          status:2,
        };
        this.instance = {
          title:'流程实例',
          cur:0,
          nodeList:[],
          curNode:'',
          curNodeName:'',
          curUser:'',
          curUserName:'',
        } 

        this.innerLoading = 1;
        this.$http.get('/api/engine/workflow/instance/get?id='+id).then((res) => {
          this.innerLoading = 0;
          if (res.data.code === 0) {
            var data = res.data.data;
            if(data){
              Object.assign(this.instance,data);              
              this.formItem.instId = data.id;
              this.$emit('on-load',this,this.instance);

              var form = defineCfg.getFormByDefine(this.instance.defineId);
              if(form && form.printUrl){ 
                this.showPrint = true;
              }else{
                this.showPrint = false;
              }

            }else{
              this.$Message.info("流程实例不存在！");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.innerLoading = 0;
          this.$Message.error(error.toString())
        })
      }, 
      goBack(){
        this.$router.go(-1);
      },
      print(){
        if(this.instance.id){
          var form = defineCfg.getFormByDefine(this.instance.defineId);
          if(form && form.printUrl){
            window.open(form.printUrl + this.instance.businessKey);
          }
        }
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
  .wfprocess-header .header-right{
    top:0px;
    right:10px;
    position: absolute; 
  }
  
  .wfprocess-container{    
    height: 100%;
    width: 100%;
    overflow:hidden;
    position: relative;
    overflow-y: auto;
    overflow-x: auto;
  }  
  .wfprocess-bill{ 
    margin: 0px auto;
    padding:10px;
  }

  .wfprocess.wfprocess-view{
    padding-bottom: 86px;
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
  
</style>



