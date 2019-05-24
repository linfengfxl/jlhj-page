<template>
  <div class="wfprocess">
    <div class="wfprocess-header">
      <Button size="small" @click="goBack" icon="chevron-left" type="warning" style="float: left;margin-top: 10px;">返回</Button>
      审批处理 - {{title}}
    </div>  
    <div class="wfprocess-container">
      <div class="wfprocess-bill">
        <slot></slot>
      </div>
      <div class="wfprocess-footer">
        <div class="wfprocess-footer-body">
        <table cellpadding="0" cellspacing="0" style="width: 100%">
          <tr>
            <td class="label">审批流程</td>            
            <td >
              <div class="nodes">
                <template v-for="(item,index) in instance.nodeList">                  
                  <Tag type="dot" color="green" v-if="index<instance.cur">{{item.text}}</Tag>
                  <Tag type="dot" color="blue" v-if="index==instance.cur" >{{item.text}}</Tag>                  
                  <Tag type="dot" v-if="index>instance.cur" >{{item.text}}</Tag>                  
                </template>
              </div>
            </td>            
          </tr>
          <tr>
            <td class="label">下一结点</td>
            <td>
              <Select v-model="formItem.nextCur" style="width: auto;min-width: 140px;" @on-change="selNextNode">
                <Option v-for="item in nextNodes" :value="item.index" :key="item.index">{{ item.text }}</Option>
              </Select>
              &nbsp;
              <Select v-model="formItem.nextUser" style="width: auto;min-width: 100px;">
                <Option v-for="item in users" :value="item.userId" :key="item.userId">{{ item.trueName }}</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td class="label">评  论</td>
            <td><Input v-model="formItem.comment" type="textarea" :rows="2" placeholder="" style="width:90%"></Input></td>
          </tr>
          <tr>
            <td style=""></td>
            <td>
               <Button type="primary" size="large" @click="submit">提 交</Button>
            </td>
          </tr>
        </table>
        </div>
      </div>
    </div>    
  </div>
</template>
<script>

  export default {
    components: { 
    },
    data() {       
      return {
        instId:0,
        loading:0, 
        nextNodes:[],
        users:[],
        formItem:{
          instId:0,
          nextCur:0,
          nextUser:'',
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
      this.load();
    },
    computed: {},
    methods: {
      load(){
        if(this.$route.query.inst){
          this.instId = this.$route.query.inst;
          this.loadProcess();
        }else{
          this.$Message.error('缺少参数 task！');
          this.$router.go(-1);
          return;
        }
      },
      loadProcess:function(){
        this.loading = 1;
        this.$http.get('/api/engine/workflow/instance/get?id='+this.instId).then((res) => {
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
          this.$Message.error('请选择下一节点审批人');
          return;
        }
         
        // 提交保存
        this.loading = 1;
        this.$http.post('/api/engine/workflow/instance/submit',this.formItem).then((res) => {
          this.loading = 0;
          if (res.data.code == 0) {
             this.$Message.info('提交成功');
             this.$router.go(-1);
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.$Message.error(error.toString())
        })
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
</style>
