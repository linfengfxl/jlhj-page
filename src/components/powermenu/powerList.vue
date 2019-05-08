<template>
<div class="apiedit">
    <div class="header">{{title}}</div>
    <div class="apiedit-body">
      <div class="subtitle">基本信息</div>
      <table class="form" cellpadding="0" cellspacing="0">
         <tr>
           <td class="label">功能点ID</td>
           <td>
             {{formItem.powerId}}
           </td>
         </tr>
         <tr>
           <td class="label">功能点key</td>
           <td>
              {{formItem.powerKey}}
           </td>
         </tr>
         <tr>
           <td class="label">类型</td>
           <td v-if="formItem.powerType==1">
             模块 
           </td>
            <td v-if="formItem.powerType==2">
             页面 
           </td>
            <td v-if="formItem.powerType==3">
             功能点 
           </td>
         </tr>
         <tr>
           <td class="label">图标</td>
           <td>
              {{formItem.powerIcon}}
           </td>
         </tr>
         <tr>
           <td class="label">标题</td>
           <td>
              {{formItem.powerCaption}}
           </td>
         </tr>
         <tr>
           <td class="label">功能点url</td>
           <td>
             {{formItem.powerUrl}} 
           </td>
         </tr>
         <tr>
           <td class="label">显示</td>
           <td v-if="formItem.isShow==1">
              是
           </td>
           <td v-else>
              否
           </td>
         </tr>
         <tr>
           <td class="label">父级ID</td>
           <td>
              {{formItem.parentId}}
           </td>
         </tr>
         <tr>
           <td class="label">排序</td>
           <td>
              {{formItem.seq}}
           </td>
         </tr>
         <tr> 
          <td></td>
         <td>
           <Button type="success" @click="update" > 编辑 </Button>　 
         </td>
       </tr>
      </table>
      <div class="subtitle">功能点</div>
      <Table :columns="columns" :data="list"></Table>
      <div class="subtitle">api授权</div>
      <table class="tab" cellpadding="0" cellspacing="0">
        <tr>
           <td class="label">api</td>
           <td colspan="2">
              <Select v-model="formItem.apis" multiple style="min-width: 500PX;">
                   <Option v-for="item in apiList" :value="item">{{ item }}</Option>
              </Select>
           </td>
         </tr>
       <tr> 
        <td></td>
         <td >
           <Button type="success" @click="save"> 保存 </Button>
          </td>　
        </tr>
      </table>
    </div>
    <PowerEdit ref="powerEdit" @on-save="resetMenu"></PowerEdit>
  </div>
</template>
<script>
  import Loading from '@/components/loading';
  import PowerEdit from '@/components/powermenu/PowerEdit';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import page from '@/assets/js/page';

  export default {
    components: {
      Loading,
      PowerEdit,
      DataRowOperate,
      page,
    },
    props: {
    },
    data() {
      var that = this;
      return {
        loading:0,
        types:[
         {argCode:1,argText:'模块'},
         {argCode:2,argText:'页面'},
         {argCode:3,argText:'功能点'}
        ],
        shows:[
         {argCode:1,argText:'是'},
         {argCode:0,argText:'否'},
        ],
        apiList: [],
        columns:[
          {
            title:'操作',
            width: 90,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    power:'ckgl.ck.edit',
                  },{
                    key:'delete',
                    power:'ckgl.ck.del',
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.updateTab(row);
                    }
                    if(key=="delete"){
                      this.del(row);
                    }
                  }
                }
              });
            }
          }, 
          {
            title: '功能点ID',
            key: 'powerId',
            width: 80,
            align: 'left',
          },
          {
            title: '功能点key',
            key: 'powerKey',
            width: 120,
            align: 'left',
          },
          page.table.initMapColumn({
            title: '类型',
            key: 'powerType',
            data:{
              '1':'模块',
              '2':'页面',
              '3':'功能点',
            }
          }), 
          {
            title: '图标',
            key: 'powerIcon',
            width: 120,
            align: 'left',
          },
          {
            title: '标题',
            key: 'powerCaption',
            width: 120,
            align: 'left',
          },
          {
            title: '功能点url',
            key: 'powerUrl',
            min_Width: 150,
            align: 'left',
          },
           page.table.initMapColumn({
            title: '是否显示',
            key: 'isShow',
            data:{
              '1':'是',
              '0':'否',
            }
          }), 
          {
            title: '父级ID',
            key: 'parentId',
            align: 'left',
            width:80,
          }, 
          {
            title: '排序',
            key: 'seq',
            align: 'center',
            width: 80,
          },
          ],
        list:[],
        title:'功能点信息',
        queryParam:{
          value: 'New York',
        },
        formItem: {
          powerId: '',
          powerKey:'',
          powerType:'',
          powerIcon: '',
          powerCaption:'',
          powerUrl:'',
          isShow:1,
          parentId:'', 
          seq:'',
          apis:[],
        },
        queryForm:{
         powerId: '',
         apis:''
       },
        queryForm2:{
         powerId: ''
       },
       selection:[]
     }
   },
   mounted:function(){
    this.query();
    this.apiquery();
  },
  computed:{
  },
  methods:{
    query() {
      this.apiquery();
      var url = '/api/engine/power.get';
      this.loading = 1;
      if(this.queryForm.powerId==''){
        this.loading = 0;
        return;
      }
      this.$http.post(url,this.queryForm).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data !=null) {
          var power=res.data.data;
          this.formItem = power;
          this.title= power.powerCaption;
          this.queryByParentId();
          if(power.apis != null && power.apis != ''){
            this.formItem.apis= power.apis.split(",");
          }
          
        } else {
          this.$Message.error(res.statusText);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
     queryByParentId() {
      this.list=[];
      var url = '/api/engine/power.queryByParentId';
      this.loading = 1;
      this.$http.post(url,{parentId:this.queryForm.powerId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data !=null) {
          var data = res.data.data;
          for(var i=0;i<data.length;i++){
          this.list.push(data[i]);
        }
        } else {
          this.$Message.error(res.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },  
    apiquery() {
      this.reset();
      var url = '/api/engine/power.getApis';
      this.loading = 1;
      this.$http.post(url, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          var dat=res.data.data;
          this.apiList=dat;
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    }, 
    resetMenu(){
      this.queryForm2.powerId=this.queryForm.powerId;
      this.$emit("on-save",this.queryForm.powerId);
    },
    load(){
      this.query();
    },
    reset:function(){
      //this.formItem.apis = []; 
    },
    rowCommand:function(name,params){
      if(name == '编辑'){
        this.update(params.row.powerId);
        return;
      } 
    }, 
    update:function(){
      this.$refs.powerEdit.open(this.formItem);
    },
    updateTab(row){
      this.$refs.powerEdit.open(row);
    },
    del(row){
      this.$emit("on-menu-del",row.powerId);
    },
    save(item){
      var url = '/api/engine/power.update';
      this.loading = 1;
      this.queryForm.apis=this.formItem.apis.toString();
     this.$http.post(url, this.queryForm).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success("操作成功");
            this.query();
          } else { 
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
    },
  }
}

</script>

<style type="text/css">
  .apiedit{
    height: 100%;
    overflow-y: auto; 
    padding-top: 42px;
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
    left:240px;
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
    width: 50%;
  }
  .apiedit .form td{
    padding: 4px;
  }
  .apiedit .tab td{
    padding: 4px;
  }
  .apiedit .label{
    width: 100px;
    text-align: right;
    color:#999;
  }
</style>

