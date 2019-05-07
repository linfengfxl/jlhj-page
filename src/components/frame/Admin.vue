<template>
  <ListPage ref="page" title="" api="/api/admin/list" 
  :model="this" :beforeLoad="beforeLoad">
    <Tabs :animated="false" v-model="tabName" @on-click="goTab">
      <TabPane label="用户管理" name="0" ></TabPane>
      <TabPane label="角色设置" name="1" ></TabPane>
    </Tabs> 
     
    <div class="page-searchbox" style="margin-top:0px;">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            <Input v-model="queryForm.keyword" class="input-title"   placeholder="登录名、姓名" @on-enter="query"></Input>
          </td>
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
      <AdminEdit ref="adminEdit" @on-submit="requireQuery"></AdminEdit>
      <ModifyPassword ref="modifyPassword" @on-submit-modifyPassword="modifyPassword"></ModifyPassword>
      <AdminAdd ref="addAdmin" @on-submit="requireQuery"></AdminAdd>
  </ListPage>
</template>
<script>
import DataRowOperateBar from '@/components/commons/DataRowOperateBar';
import Loading from '@/components/loading';
import AdminEdit from '@/components/frame/AdminEdit';
import ModifyPassword from'@/components/frame/ModifyPassword';
import AdminAdd from'@/components/frame/AdminAdd';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';

export default {
  components: {
    DataRowOperateBar,
    Loading,
    AdminEdit,
    ModifyPassword,
    AdminAdd,
    ListPage,
    DataRowOperate
  },
  data() {
    var that = this;
    return {
      tabName:'0',
      columns:[
        {
          type: 'selection',
          width: 40,
          align: 'center',
          fixed: 'left',
        },
         {
            title:'操作',
            width: 120,
            align: 'center',
            fixed: 'left',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'default',
                    text:'修改密码',
                  },{
                    key:'edit',
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="default"){
                      this.rowCommand("修改密码",params);
                    }
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                  }
                }
              });
            }
          },  
        {
            title: '登录名',
            key: 'loginName',
            width:120,
            align:'left',
            fixed: 'left',
        },
        {
          title:'姓名',
          width:70,
          key:"trueName",
          align:'left'
        },
        {
            title: '手机',
            key: 'mobile',
            width:120,
            align:'center',
        },
        {
            title: '角色',
            key: 'roleNames',
            align:'left',
            minWidth:160,
        }, 
        {
          title: '创建时间',
          key: 'createTime',
          align:'center',
          width:160,
        }
      ],
      list:[ ],
      total:0,
      queryParam:{

      },
      queryForm:{
        keyword:''
      },
      selection:[],
      loading:0
    }
  },
  mounted:function(){
    this.query();
  },
  methods:{
    goTab(index){
      var pages = ['/admin','/role']; 
      this.goPage(pages[index]);
    },
    beforeLoad(){

    },
    requireQuery:function(){
      this.query();
    },
    modifyPassword:function(){
      this.query();
    },
    add:function(){
      this.$refs.addAdmin.open();
    },
    query:function(){
      this.$refs.page.query();
    },
    reset:function(){
      this.queryForm.keyword='';
      this.query();
    },
    select:function(selection){
      this.selection=selection;
    },
    batch_delAdmin:function(){
      var selection = this.selection;
      var ids=[];
      for(var i=0;i<selection.length;i++){
        ids.push(selection[i].id);
      }
      if(ids.length > 0){
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复,确定要删除子账号？</p>',
          onOk: () => {
            this.$http.post('/api/admin/deleteList?ids='+ids, {}).then((res) => {
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                $.extend(this.queryForm,this.queryParam);
                this.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
                this.$Message.error(error.toString())
            });
          }
        });
      } else {
        this.$Message.error("请选中需删除的数据");
      }
    },
    rowCommand:function(name,params){
      if(name === '启用' || name === '禁用'){
        this.rowParams = params;
        var id = this.rowParams.row.userId;
        var status = this.rowParams.row.status;
        this.$http.post('/api/admin/updateStatus', {
          id:id,
          status:status
          }).then((res) => {
            if (res.data.code === 0) {
              this.query();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
              this.$Message.error(error.toString())
          });
      }
      if(name == '修改密码'){
        this.rowParams = params;
        var id = this.rowParams.row.id;
        this.$refs.modifyPassword.open(id);
        return;
      }
      if(name == '编辑'){
        this.rowParams = params;
        var id = this.rowParams.row.id;
        this.$refs.adminEdit.open(id);
        return;
      } 
    },
    goPage:function (path) {
        this.$router.push({path:path});
    }
  }
}

</script>

<style type="text/css">
  .admin-status-2{
    color:#ff6600;
  }
</style>
