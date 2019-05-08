<template>
  <ListPage ref="page" title="" api="/api/engine/emp/list" class="member"
  :model="this" :beforeLoad="beforeLoad" @on-load="totalCount=$refs.page.total">   
  <div class="page-searchbox" style="margin-top: 0px">
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td width="140">
          <span class="member-count">全部成员<span style="color:#999;">（共{{totalCount}}人）</span></span>
        </td>
        <td>
          <Button  @click="addEmp">添加员工</Button> 
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
    <EditEmp ref="editEmp" @on-load="query"></EditEmp>
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
        manager:[],// 部门主管(empIds)
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
          key: 'roleNames',
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
            width: 100,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[
                    {key:'edit'},
                    {key:'del',text:'删除'}
                  ]
                },
                on:{
                  click:(key)=>{
                    if(key=="view"){
                      this.rowCommand("查看",params);
                    }
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                    if(key=="del"){
                      this.rowCommand("删除",params);
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
          deptId: ''
        }
      }
    },
    mounted:function(){
      this.loadDept();
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
      rowCommand(name,params){ 
        if(name == '编辑'){
          this.updateEmp(params.row.empId);
          return;
        } 
      },
      updateEmp:function(empId){
        this.$refs.editEmp.open(empId);
      },
      viewEmp:function(empId){
        this.$refs.editEmp.view(empId);
      },
      addEmp:function(){
        this.$refs.editEmp.addOpen(this.queryForm.deptId,this.queryForm.deptName);
      },
      deleteEmp(empId){
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.loading = 1;
            this.$http.post('/api/contacts/emp/deleteEmp?empId=' + empId, {}).then((res) => {
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
            this.query();
          }
        });
      }, 
      loadDept() {
        this.$http.post('/api/engine/dept/list', {}).then((res) => {
          if (res.data.code === 0 && res.data.data !=null) {
            var manager = [];
            res.data.data.map((item)=>{
              if(item.manager){
                manager.push(item.manager);
              }
            });
            this.manager = manager;
            this.$refs.page.load();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => { 
          this.$Message.error(error.message)
        });
      },
      sync(){
        this.$router.push({name:'contacts.sync'});
      },
      openQy(){
        window.open('https://work.weixin.qq.com/');
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

