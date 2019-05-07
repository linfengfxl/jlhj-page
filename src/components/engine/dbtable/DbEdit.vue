<template>
  <div class="apiedit">
    <div class="header">table - <span v-if="apiObject != null">{{apiObject.caption}}</span></div>
    <div class="apiedit-body">
      <div class="subtitle">基本信息</div>
      <Table :columns="columns2" :data="list"></Table>
      <div class="subtitle">配置信息</div>
      <editor theme="chrome" @init="editorInit" :lang="lang" height="200" v-model="sql" ></editor>
    </div>
    <div class="footer">
      <table class="form" cellpadding="0" cellspacing="0">
       <tr> 
         <td>
           <Button type="success" @click="loadSel()"> 查询sql </Button>　 
         </td>
       </tr>
       <tr>
         <td>
           <Button type="success" @click="loadAdd()"> 添加sql </Button>　 
         </td>
       </tr>
       <tr>
         <td>
           <Button type="success" @click="loadUpdate()"> 修改sql </Button>　 
         </td>
       </tr>
       <tr>
         <td>
           <Button type="success" @click="loadDel()"> 删除sql </Button>　 
         </td>
       </tr>
       <tr>
         <td>
           <Button type="success" @click="loadBean()"> 生成bean </Button>　 
         </td>
       </tr>
      </table>
    </div>
  </div>
</template>
<script> 
  import Loading from '@/components/loading'; 

  export default {
    components: {
      editor: require('vue2-ace-editor'),
    },
    props: {
      apiObject:{
        type:Object,
        default(){
          return {};
        }
      }
    },
    data () {
      var that = this;
      return {
          columns2: [
              {
                  title: 'tableName',
                  key: 'tableName',
                  width: 200
              },
              {
                  title: 'columnName',
                  key: 'columnName',
                  width: 150
              },
              {
                  title: 'caption',
                  key: 'caption',
                  width: 200
              },
              {
                  title: 'dataType',
                  key: 'dataType',
                  width: 200
              },
              {
                  title: 'nullable',
                  key: 'nullable',
                  width: 100
              },
              {
                  title: 'keyFlg',
                  key: 'keyFlg',
                  width: 100
              },
              {
                  title: 'identity',
                  key: 'identity',
                  width: 100
              },
              {
                  title: 'remark',
                  key: 'remark',
                  width: 150
              },
              {
                  title: 'seq',
                  key: 'seq',
                  width: 100
              },
              {
                  title: 'dataLength',
                  key: 'dataLength',
                  width: 100
              }],
          loading:0,
          list:[],
          bean:'',
          formItem:{},
          sql:'',
          tableList:[],
          tableValueList:[],
          tableTypeList:[],
          keyId:'',
          keyType:'',
          lang:'',
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
      load(apiObject){
        if(apiObject){
          Object.assign(this.formItem,apiObject);
          var tableName = apiObject.tableName;
          this.$http.post("/api/engine/db.columnName",{
              table:tableName,
              page:1,
              pageSize:100
            }).then((res) => {
          this.loading = 0;
          if (res.data.code == 0) {
            if(res.data.data){
              this.list = res.data.data;
            }else{
              this.$Message.error('该表不存在');
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("操作失败！")
        });
        }
      },
      loadAdd(){
        var tableName = this.formItem.tableName;
        this.lang = 'sql';
        this.tableList = [];
        this.tableTypeList = [];
        this.tableValueList = [];
        for(var i = 0;i<this.list.length;i++){
          this.tableList.push(this.list[i].columnName);
          this.tableTypeList.push(this.list[i].dataType);
          this.tableValueList.push('?');
        }
        this.$http.post("/api/engine/db.addSqlClass",{
            page:1,
            pageSize:10,
            tableList:this.tableList,
            tableValueList:this.tableValueList,
            tableTypeList:this.tableTypeList,
            table:tableName
          }).then((res) => {
        this.loading = 0;
        if (res.data) {
          this.sql = res.data;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
      },
      loadUpdate(){
        var tableName = this.formItem.tableName;
        this.lang = 'sql';
        this.tableList = [];
        this.tableTypeList = [];
        this.tableValueList = [];
        for(var i = 0;i<this.list.length;i++){
          if(this.list[i].keyFlg == "PK_1"){
            this.keyId = this.list[i].columnName;
          }
          this.tableList.push(this.list[i].columnName);
          this.tableTypeList.push(this.list[i].dataType);
          this.tableValueList.push('?');
        }
        this.$http.post("/api/engine/db.updateSqlClass",{
            page:1,
            pageSize:10,
            tableList:this.tableList,
            tableValueList:this.tableValueList,
            tableTypeList:this.tableTypeList,
            table:tableName,
            keyId:this.keyId,
            keyValue:"?",
          }).then((res) => {
        this.loading = 0;
        if (res.data) {
          this.sql = res.data;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
      },
      loadDel(){
        var tableName = this.formItem.tableName;
        this.lang = 'sql';
        for(var i = 0;i<this.list.length;i++){
          if(this.list[i].keyFlg == "PK_1"){
            this.keyId = this.list[i].columnName;
            this.keyType = this.list[i].dataType;
          }
        }
        this.$http.post("/api/engine/db.delSqlClass",{
            page:1,
            pageSize:10,
            table:tableName,
            delId:this.keyId,
            delValue:"?",
            delType:this.keyType
          }).then((res) => {
        this.loading = 0;
        if (res.data) {
          this.sql = res.data;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
      },
      loadSel(){
        var tableName = this.formItem.tableName;
        this.lang = 'sql';
        this.tableList = [];
        for(var i = 0;i<this.list.length;i++){
          this.tableList.push(this.list[i].columnName);
        }
        this.$http.post("/api/engine/db.selectSql",{
            page:1,
            pageSize:10,
            tableList:this.tableList,
            table:tableName
          }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
            if(res.data.data){
              this.sql = res.data.data;
            }else{
              this.$Message.error('该表不存在');
            }
          } else {
            this.$Message.error(res.data.message);
          }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
      },
      loadBean(){
        var tableName = this.formItem.tableName;
        this.lang = 'java';
        this.tableList = [];
        this.tableTypeList = [];
        for(var i = 0;i<this.list.length;i++){
          this.tableList.push(this.list[i].columnName);
          this.tableTypeList.push(this.list[i].dataType);
        }
        this.$http.post("/api/engine/db.beanClass",{
            tableList:this.tableList,
            tableTypeList:this.tableTypeList,
            table:tableName
          }).then((res) => {
        this.loading = 0;
        if (res.data) {
          this.sql = res.data;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
      },
      editorInit: function () {
          // https://ace.c9.io/build/kitchen-sink.html
          // https://www.npmjs.com/package/vue2-ace-editor
           require('brace/ext/language_tools') //language extension prerequsite...
          // require('brace/mode/html')                
          // require('brace/mode/javascript')    //language
          // require('brace/mode/less')
          //require('brace/mode/groovy')
          require('brace/theme/chrome')
          require('brace/mode/sql')
          require('brace/mode/java')
          require('brace/snippets/javascript') //snippet
      },
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
  }

  .apiedit .header{
    font-size: 14px; 
    color:green;
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

