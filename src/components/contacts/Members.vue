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
          <Select v-model="queryForm.status" @on-change="query" >
            <Option v-for="item in status" :value="item.value" :key="item.index">{{ item.label }}</Option>
          </Select>
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
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '姓名',
          align: 'center',
          width:200,
          render: (h,params)=>{

            return h('Row',{
              props:{type:'flex',justify:'center',align:'middle'},
            },
            [
            /*h('Col',{props:{span:'3'}},[
              h('img',{attrs:{src:that.follow(params.row.status),style:'width:12px;height:12px;margin-top:6px;'}})
              ]),*/
            h('Col',{props:{span:'6'}},[
              h('Avatar',{
                props:{src:params.row.header,shape:'circle',icon:'person'}
              })
              ]
              ),
            h('Col',{props:{span:'1'}},[
              ]),
            h('Col',{props:{span:'14','class-name':'truename-col-span'}},[
              h('span',params.row.trueName),
              h('span',{class:{'icon-manager':true,'icon-manager-none':params.row.isManager!=1}},"部门主管")
              ])
            ]
            );
          }
        }, 
        {
          title: '手机号',
          key: 'mobile',
          align: 'center',
          width:120
        },
        {
          title: '部门',
          key: 'deptName',
          align: 'left',
          minWidth:100 
        }, 
        page.table.initMapColumn({
            title: '状态',
            key: 'status',
            data:{
              '1':'',
              '0':'禁用',
            }
          }), 
        {
            title:'操作',
            width: 200,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'view',
                    
                  },
                  {
                    key:'edit',
                    
                  },{
                    key:'del',
                    text:'删除',
                  },{
                    key:'set',
                    text:params.row.isManager!=1 ? "设为主管":"取消主管",
                  }]
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
                    if(key=="set"){
                      if(params.row.isManager!=1){
                        this.rowCommand("设为主管",params);
                      }else{
                        this.rowCommand("取消主管",params);
                      }
                      
                    }
                  }
                }
              });
            }
          }, 
       
        ], 
        status: [
        { value: -1, label: '全部成员'},
        { value: 1, label: '已关注'},
        { value: 0, label: '未关注'}
        ], 
        queryForm:{ 
          status:-1, //1=已激活，2=已禁用，0=未激活
          keyword:'', 
          dimission: 2, //离职状态(2在职,1离职) 
          distribution: true, // 已分配部门
          deptId: 1, //部门ID
          deptName: '黄河软轴',
        }, 
        empParams:{
          id:null,
          empId:'',
          isManager:0
        },
        deptManager:'renxin',
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
        if(name == '删除'){
          this.deleteEmp(params.row.empId);
          return;
        }
        if(name == '离职'){
          this.dimissed(params.row.empId);
          return;
        }
        if(name == '编辑'){
          this.updateEmp(params.row.empId);
          return;
        }
        if(name == '查看'){
          this.viewEmp(params.row.empId);
          return;
        }
        if(name == '设为主管'){
          this.setManage(1,params);
          return;
        }
        if(name == '取消主管'){
          this.setManage(0,params);
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
      //弃用
      oldSetManage(empId,deptId){ 
        this.$Modal.confirm({
          title: '信息确认',
          content: '<p>确定此用户设为部门主管？</p>',
          onOk: () => {
            this.loading = 1;
            this.$http.post('/api/contacts/dept/saveManage?empId=' + empId + '&deptId=' + deptId,{}).then((res) => {
              if (res.data.code === 0) {
                this.loading = 0;
                this.$Message.success("设置成功");
                this.loadDept();
              } else {
                this.loading = 0;
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.message)
            });
          }
        });
      },
       setManage(n,params){
        if(n==1){
          this.$Modal.confirm({
          title: '信息确认',
          content: '<p>确定将该成员设为部门主管？</p>',
          onOk: () => {
            this.updateManage(n,params);           
          }
        });
        }else{
          this.$Modal.confirm({
          title: '信息确认',
          content: '<p>确定取消该部门主管？</p>',
          onOk: () => {
            this.updateManage(n,params);           
          }
        });
        }   
      },
      updateManage(n,params){
        this.loading = 1;
        this.empParams.id=params.row.id;
        this.empParams.empId=params.row.empId;
        this.empParams.isManager=n;
         this.$http.post('/api/contacts/emp/setManager',this.empParams).then((res) => {
              if (res.data.code === 0) {
                this.loading = 0;
                this.$Message.success("设置成功");
                this.$refs.page.load();
              } else {
                this.loading = 0;
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.message)
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
  /*通用样式*/
  .page.member{
    padding-top: 0px;
  }

  .member .member-count{
    color: #666;
    font-size: 14px;
  } 

  .member .ivu-avatar {
    margin-top: 5px;
    width: 28px;
    height: 28px;
    line-height: 28px;
  }

  .member .ivu-avatar>i {
    line-height: 28px;
  }
  .member .truename-col-span {
    text-align: left;
  }

  .member .icon-manager{
    display: inline-block;
    border: solid salmon 1px;
    color:white;
    background-color: coral; 
    padding: 1px 2px;
    margin-left:4px;
  }

  .member .icon-manager-none{
    display: none;
  }

</style>

