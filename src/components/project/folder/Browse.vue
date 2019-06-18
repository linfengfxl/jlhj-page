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
      <Loading :loading="loading">
      <div class="pfbrowse-address wt-scroll">
        <Icon type="folder" style="color:#999;font-size: 18px;"></Icon>
        <a @click="goRoot">项目</a>
        <template v-for="(item,index) in nav">
          <span class="separator">\</span>
          <a @click="clickNav(item)">{{item.fileName}}</a>          
        </template>
      </div>
      <div class="pfbrowse-toolbar">
        <table cellpadding="0" cellspacing="0">
          <tr v-if="parentId==0"></tr>
          <tr v-else>
            <td>
              <UploadButton text="上传" @on-upload="doUpload"></UploadButton>              
            </td>
            <td>
              <Button icon="plus" type="default" @click="createDir" v-power="'xmwjj.add'" >目录</Button>
            </td>
            <td></td><td></td>
            <td>
              <Button type="default" @click="move" v-power="'xmwjj.move'">移动 {{clipboard.length}}</Button>
            </td>
            <td>
              <Button type="default" @click="paste" v-power="'xmwjj.move'" :disabled="clipboard.length==0">粘贴</Button>
            </td>
            <td></td><td></td>
            <td>
              <Button type="default" @click="del" v-power="'xmwjj.delete'">删除</Button>
            </td>
          </tr>
        </table>
      </div>
      <table class="pfbrowse-list" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th width="60">选择</th>
            <th>文件名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list">
            <td class="center"><Checkbox v-model="item.check"></Checkbox></td>
            <td>
              <!--文件夹-->
              <div class="file" v-if="item.fileType == 1">
                <Icon type="folder"></Icon>
                <a @click="clickFile(item)">{{item.fileName}}</a>
                <a @click="rename(item)" style="margin-left: 20px;" class="extbtn" v-if="item.subType != 'gcjl' && item.subType != 'xmwj'" v-power="'xmwjj.add'">改名</a>
              </div>
              <!--文件-->
              <div class="file" v-else>
                <Icon type="document"></Icon>
                <a @click="clickFile(item)">{{item.fileName}}.{{item.subType}}</a>
                <a @click="download(item)" style="margin-left: 20px;" class="extbtn">下载</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="height: 80px;"></div>
      </Loading>
    </div>
    <div class="pfbrowse-footer">
      {{list.length}} 个对象
    </div>
  </div>
</template>
<script> 
  import UploadButton from "@/components/upload/UploadButton"
  import Loading from '@/components/loading'
  export default {
    components: {
      UploadButton,
      Loading
    },
    props:{

    },
    data() {       
      return {        
        loading:0,          
        title:'',
        projectCode:'',     
        parentId:0,
        list:[],
        nav:[],
        clipboard:[]
      }
    },
    mounted: function () {
      this.title = this.$route.query.projectName;
      this.projectCode = this.$route.query.projectCode;
      this.load()
    },
    computed: {},
    methods: { 
      load(){
        this.loading = 1;
        this.$http.post('/api/engine/project/folder/list',{projectCode:this.projectCode,parentId:this.parentId}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {            
            this.list = res.data.data;
            this.list.map(item=>{
              item.check = false;
            })
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        })
      }, 
      goRoot(){
        this.parentId = 0;
        this.nav = [];
        this.load();
      },
      clickNav(item){
        var index = this.nav.indexOf(item);
        this.nav.splice(index+1);
        this.parentId = item.id;
        this.list = [];
        this.load();
      },
      clickFile(item){
        // 1.目录 2.文件
        if(item.fileType == 1){
          this.nav.push(item);
          this.list = [];
          this.parentId = item.id;
          this.load();
        }else{ 
          window.open(this.$http.defaults.baseURL + '/api/file/view?fileId='+item.fileId);
        }
      },
      download(item){
        window.open(this.$http.defaults.baseURL + '/api/file/download?fileId='+item.fileId);
      },
      rename(item){ 
        var fileName = item.fileName;
        this.$Modal.confirm({
            render: (h) => {
                return h('Input', {
                    props: {
                        value: fileName,
                        autofocus: true,
                        placeholder: '名称'
                    },
                    on: {
                        input: (val) => {
                          fileName = val;
                        }
                    }
                })
            },
            onOk:()=>{
              if(fileName == ''){
                this.$Message.error('请录入名称');
                return;
              }
              var newItem = Object.assign({},item,{fileName:fileName});
              this.doRename(newItem);
            }
        })
      },
      doRename(item){        
        this.loading = 1;
        this.$http.post('/api/engine/project/folder/rename',item).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success('操作成功');
            this.load();
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        })
      },
      doUpload(fileId){
        this.add({projectCode:this.projectCode,parentId:this.parentId,fileId:fileId});        
      },
      add(item){
        this.loading = 1;
        this.$http.post('/api/engine/project/folder/add',item).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.load();
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        })
      },
      createDir(){
        var fileName = "";
        this.$Modal.confirm({
            render: (h) => {
                return h('Input', {
                    props: {
                        value: '',
                        autofocus: true,
                        placeholder: '名称'
                    },
                    on: {
                        input: (val) => {
                          fileName = val;
                        }
                    }
                })
            },
            onOk:()=>{
              if(fileName == ''){
                this.$Message.error('请录入名称');
                return;
              }
              var newItem = {projectCode:this.projectCode,parentId:this.parentId,fileType:1,fileName:fileName};
              this.add(newItem);
            }
        })
      },
      move(){
        var items = [];
        this.list.map(item=>{
          if(item.check){
            items.push(item);
          }
        });
        this.clipboard = items;
      },
      paste(){
        var items = JSON.parse(JSON.stringify(this.clipboard));
        items.map(item=>{
          item.parentId = this.parentId;
        });

        this.loading = 1; 
        this.$http.post('/api/engine/project/folder/move',items).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success('操作成功');
            this.clipboard = [];
            this.load();
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        })
      },
      del(){
        var items = [];
        this.list.map(item=>{
          if(item.check){
            items.push(item);
          }
        });
        if(items.length==0){
          this.$Message.error('请选择要删除的对象');
          return;
        }

        this.$Modal.confirm({
            title:'询问',
            content:'确定要删除码？',
            onOk:()=>{
               this.doDel(items);
            }
        }) 
      },
      doDel(items){
        this.loading = 1; 
        this.$http.post('/api/engine/project/folder/delete',items).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success('操作成功');             
            this.load();
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
  .pfbrowse-toolbar{     
    background-color:  #fdfdfd;    
    padding: 10px;
  }
  .pfbrowse-toolbar td{
    padding-right: 10px;
  }

  .pfbrowse-list{
    width: 100%;
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
    font-size: 20px;
    color: #ff9900;
    margin-right: 4px;
  }

  .pfbrowse-list .file{
    font-size: 14px;
    line-height: 26px;    
  } 

  .pfbrowse-list .extbtn{
    color:#999;
  }

  .pfbrowse a{
    color:#666;
  }
  .pfbrowse a:hover{
    color:#20c1ee;
  }

  .pfbrowse-footer{     
    width: 100%;
    position: absolute;
    bottom: 0px;        
    border-top: 1px solid #eee;
    background-color:  #fdfdfd;
    padding: 10px;
    font-size: 14px;
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



