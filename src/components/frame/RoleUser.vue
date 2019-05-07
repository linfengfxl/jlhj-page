<template>
  <ListPage ref="page"  api="/api/role/user/list" 
  :model="this">
  <div class="page-title" slot="page-title">
  </div> 
  <div class="page-bar">
    <LayoutHor>
      <div slot="left">
        <Button size="small" @click="goBack" icon="chevron-left"  type="warning">返回</Button>
      </div>
      <div class="page-bar-title">角色-{{title}}</div>
    </LayoutHor>
  </div>
  <div class="page-searchbox" style="margin-top:15px;">
    <table cellpadding="0" cellspacing="0">
      <tr> 
        <td>
          <Input v-model="queryForm.keyword" class="input-title"   placeholder="登录名、姓名" @on-enter="query"></Input>
        </td>
        <td>
          <Input v-model="queryForm.mobile" class="input-title"   placeholder="手机号" @on-enter="query"></Input>
        </td>
        <td>
          <Button @click="query"  type="primary" icon="ios-search">查询</Button>
        </td>
        <td>
          <Button @click="reset"  type="default">重置</Button>
        </td>
        <td>
          <Button @click="setUser"  type="default">设置用户</Button>
        </td>
      </tr>
    </table>
    <SelPersons ref="selPersons" :transfer="true"></SelPersons> 
  </div>
</ListPage>
</template>
<script>
  import DataRowOperateBar from '@/components/commons/DataRowOperateBar';
  import Loading from '@/components/loading';
  import page from '@/assets/js/page';
  import ListPage from '@/components/page/ListPage';
  import SelPersons from '@/components/selcontacts1'; 
  import LayoutHor from '@/components/layout/LayoutHor'; 

  export default {
    components: {
      DataRowOperateBar,
      Loading,
      page,
      ListPage,
      SelPersons,
      LayoutHor
    },
    data() {
      var that = this;
      return {
        tabName:'0',
        columns:[
        {
          title: '登录名',
          key: 'loginName',
          width:120,
          align:'left',
        },
        {
          title:'姓名',
          width:80,
          key:"trueName",
          align:'left'
        },
        page.table.initMapColumn({
          title: '性别',
          key: 'sex',
          width:50,
          data:{
            '0':'保密',
            '1':'男',
            '2':'女',
          }
        }),        
        {
          title: '手机',
          key: 'mobile',
          width:120,
          align:'center',
        },
        {
          title: '邮箱',
          key: 'email',
          align:'left',
          minWidth:150,
        },
        page.table.initDepartmentColumn({
          title: '部门 ',
          key: 'deptId',
          width:120,
        })
        
        ],
        roleId:'',
        roleName:'',
        title:'',
        list:[ ],
        total:0,
        curRowid:[],
        queryParam:{
          userId:[],
          roleId:'',
        },
        queryForm:{
          keyword:'',
          roleId:''
        },
        loading:0
      }
    },
    computed: {

    },
    mounted:function(){
      this.roleId = this.$route.query.roleId;
      this.title = this.$route.query.roleName;  
      this.query();  
    },
    methods:{
     load() {
     },
     setUser(){
      var ids=[];
      var that = this;
      this.loading = 1;
      this.$http.post('/api/role/getUserIds?roleId=' + this.roleId, {}).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0; 
          ids = res.data.data;
          var sel = this.$refs.selPersons;
          sel.checkEmpIds=ids;
          sel.show({
            checkEmpIds:ids,
            identify:1,
            ok:()=>{ 
             this.checkEmpIds1 = sel.checkEmpIds;
             this.queryParam.roleId=that.roleId;
             this.queryParam.userId=sel.checkEmpIds;
             this.$http.post('/api/role/setUserIds', this.queryParam).then((res) => {
               if (res.data.code === 0) {
                 this.$Message.success("设置成功");
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
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });   
    },
    query:function(){
      this.queryForm.roleId = this.roleId;
      this.$refs.page.query();
    },
    reset:function(){
      this.queryForm.keyword='';
      this.queryForm.mobile='';
      this.query();
    },
    goBack(){
      this.$router.push('/role');
    },

  }
}

</script>

<style type="text/css">
.admin-status-2{
  color:#ff6600;
}
</style>
