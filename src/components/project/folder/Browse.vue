<template>
  <div class="pfbrowse">
    <div class="pfbrowse-header">      
      项目文件夹 - {{title}}
      <div class="header-left">
        <Button size="small" @click="goBack" icon="chevron-left" type="warning">返回</Button>
      </div>
      <div class="header-right">
         
      </div>
    </div>  
    <div class="pfbrowse-container">
      <div class="pfbrowse-address wt-scroll">
        <Icon type="folder" style="color:#ff9900;font-size: 18px;"></Icon>
        <a>项目</a><span class="separator">\</span>
        <a>工程计量</a><span class="separator">\</span>
        工程文件
      </div>

      <table class="pfbrowse-list" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th width="60">选择</th>
            <th>文件名</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="center"><Checkbox label="twitter"></Checkbox></td>
            <td>
              <div class="file">
                <Icon type="folder"></Icon>
                文件名  
              </div> 
            </td>
          </tr>
          <tr>
            <td class="center"><Checkbox label="twitter"></Checkbox></td>
            <td>
              <div class="file">
                <Icon type="folder"></Icon>
                文件名  
              </div> 
            </td>
          </tr>
          <tr>
            <td class="center"><Checkbox label="twitter"></Checkbox></td>
            <td>
              <div class="file">
                <Icon type="folder"></Icon>
                文件名  
              </div> 
            </td>
          </tr>
        </tbody>        
      </table>
    </div>
    <div class="pfbrowse-footer">
        <div class="pfbrowse-footer-body" style="height: 20px">  

        </div>
      </div>
  </div>
</template>
<script>
  import defineCfg from '@/components/workflow/defineCfg' 

  export default {
    components: {  
    },
    props:{  
    },
    data() {       
      return {        
        loading:0,          
        title:'',
        projectCode:'',
      }
    },
    mounted: function () {
      this.title = this.$route.query.projectName;
      this.projectCode = this.$route.query.projectCode;
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

        this.loading = 1;
        this.$http.get('/api/engine/workflow/instance/get?id='+id).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            var data = res.data.data;
            if(data){
              Object.assign(this.instance,data);              
              this.formItem.instId = data.id;
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
  .pfbrowse{
    height: 100%;
    overflow: hidden;
    padding-top: 42px;
  }
  .pfbrowse-header{
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
    white-space:nowrap;
  }
  .pfbrowse-header .header-left{
    top:0px;
    position: absolute; 
  }
  .pfbrowse-header .header-right{
    top:0px;
    right:10px;
    position: absolute; 
  }
  
  .pfbrowse-container{    
    height: 100%;
    width: 100%;
    overflow:hidden;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }  
  
  .pfbrowse-address{
    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid #eee;
    background-color: white;
    overflow-x: auto;
    overflow-y: hidden;
    white-space:nowrap;
    padding: 0px 10px;
    font-size: 14px;
    color:#666;
  }  
  .pfbrowse-address a{

  }
  .pfbrowse-address .separator{
    color:#999;
    padding: 0 10px;
  }

  .pfbrowse-list{
    width: 100%;
    margin-top: 10px;
  }

  .pfbrowse-list th{
    height: 24px;
    background-color:#fbfbfb;
    border:1px solid #eee;
    color:#999;
  }

  .pfbrowse-list td{
    height: 42px;
    border-bottom: 1px solid #eee;
  }

  .pfbrowse-list .file .ivu-icon{
    font-size: 26px;
    color: #ff9900;
    margin-right: 4px;
  }

  .pfbrowse-list .file{
    font-size: 14px;
    line-height: 26px;
  }

  .pfbrowse-footer{
    height: auto;
    width: 100%;
    position: absolute;
    bottom: 0px;        
    border-top: 1px solid #eee;
    background-color:  #fafafa;    
  }

  .pfbrowse-footer-body{
    padding: 4px 10px;
    font-size: 14px;
    max-width: 1000px;
    min-width: 600px;
    margin: 0px auto;
  } 

  .pfbrowse-footer .label{
    width:70px;text-align: right;
    padding-right: 10px;  
  } 
  .pfbrowse-footer .btn-submit{
    height: 40px;width: 140px;    
  } 
  
</style>



