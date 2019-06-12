<template>
  <ListPage ref="page" title="" api="/api/engine/user/list" class="member"
  :model="this" :beforeLoad="beforeLoad" @on-load="totalCount=$refs.page.total">   
  <div class="page-searchbox" style="margin-top: 0px">
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td width="140">
          <span class="member-count">全部成员<span style="color:#999;">（共{{totalCount}}人）</span></span>
        </td>
        <td>
          <Button  @click="addEmp" icon="plus">添加用户</Button> 
        </td>          
        <td width="1%">
          <Input v-model="queryForm.keyword" placeholder="搜索姓名/手机号" style="width:150px" @on-enter="query" />
        </td>
        <td width="1%">
          <Button icon="ios-search" type="primary" @click="query">查询</Button>
        </td>
      </tr>
    </table>
  </div> 
  <div>
    <EditEmp ref="editEmp" @on-save="query"></EditEmp>
  </div>
</div>
</ListPage>
</template>
<script>
  import ListPage from '@/components/page/ListPage'; 
  import DataRowOperateBar from '@/components/commons/DataRowOperateBar';
  import Loading from '@/components/loading';
  import page from '@/assets/js/page';
  import EditEmp from '@/components/contacts/EditEmp'; 
  import DataRowOperate from '@/components/commons/DataRowOperate';

  export default {
    components: {
      ListPage,
      DataRowOperateBar,
      Loading,
      EditEmp, 
      DataRowOperate,
      page
    },
    props: {
    },
    data() {
      var that = this;
      return {
        loading:0,          
        totalCount:0,
        columns:[
        /*
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },*/
        {
          title: '用户名',
          key: 'loginName',
          align: 'center',
          width:120
        }, 
        {
          title: '姓名',
          key: 'trueName',
          align: 'center',
          width:120
        }, 
        {
          title: '岗位',
          key: 'roleName',
          align: 'left',
          minWidth:100 
        }, 
        {
          title: '部门',
          key: 'deptName',
          align: 'left',
          minWidth:100 
        }, 
        {
          title: '手机号',
          key: 'mobile',
          align: 'center',
          width:120
        }, 
        {
          title: '邮箱',
          key: 'email',
          align: 'center',
          width:120
        },  
        page.table.initMapColumn({
          title: '登录',
          key: 'isLogin',
          data:{
            '1':'已登录',
            '0':'',
          }
        }), 
        page.table.initMapColumn({
            title: '状态',
            key: 'status',
            data:{
              '1':'',
              '2':'禁用',
            }
          }), 
        {
            title:'操作',
            width: 140,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[
                    {key:'edit'},
                    {key:'reset',text:'重置密码'},
                    {key:'del',text:'删除'}
                  ]
                },
                on:{
                  click:(key)=>{                    
                    if(key=="edit"){
                      this.updateUser(row);
                    }
                    if(key=="reset"){
                      this.resetUser(row);
                    }
                    if(key=="del"){
                      this.delUser(row);
                    }
                  }
                }
              });
            }
          }, 
       
        ],
        queryForm:{ 
          status:0,
          keyword:'',  
          deptId: '',
          deptName:''
        }
      }
    },
    mounted:function(){
      this.query(); 
    },
    computed:{ 
    },
    methods:{
      follow(status){
        if(status ===1 ) {
          return require('../../assets/img/icon-follow.png');
        }
        return require('../../assets/img/icon-unfollow.png');
      },
      query() {
        this.$refs.page.query();
      }, 
      beforeLoad(){

      },
      reset() {
        Object.assign(this.queryForm,{
          keyword: '',
          industry:'',
        });
        this.query(); 
      },
      reset(){
        Object.assign(this.queryForm,{
          status:-1,
          keyword:'',
          dimission: 2,
          deptId: 1
        });
        this.query();
      },   
      updateUser:function(row){
        if(row.id == 0){
          this.$Message.error("admin 不能修改");
          return;
        }
        this.$refs.editEmp.open(row);
      }, 
      resetUser:function(row){         
         this.$Modal.confirm({
          title: '确认',
          content: '<p>重置后密码为 888888 </p>',
          onOk: () => {
            this.loading = 1;
            this.$http.post('/api/engine/user/resetpwd', {id:row.id}).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                this.$Message.success("操作成功");
                this.$refs.page.load();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            }); 
          }
        });
      }, 
      delUser:function(row){
        if(row.id == 0){
          this.$Message.error("admin 不能删除");
          return;
        }
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.loading = 1;
            this.$http.post('/api/engine/user/delete', {id:row.id}).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                this.$refs.page.load();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            }); 
          }
        });
      }, 
      addEmp:function(){
        this.$refs.editEmp.open({deptIds:[this.queryForm.deptId],deptName:this.queryForm.deptName});
      }, 
      batch(){
        if(!this.$user.hasPower('txl.pl')){
          this.$Message.error('暂无权限！');
          return;
        }
        this.$router.push({name:'contacts.batch'});
      }
    }
  }

</script>

<style type="text/css">
  
</style>

