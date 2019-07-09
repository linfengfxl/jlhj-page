<template>
  <ListPage ref="page" title="岗位设置" api="/api/engine/role/list" 
  :model="this" :beforeLoad="beforeLoad">
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="addRole" icon="plus">添加</Button>
            </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            <Input v-model="queryForm.keyword"  placeholder="角色名称" @on-enter="query"/>
          </td> 
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
        </tr>
      </table>
    </div>
    <RoleEdit ref="editRole" @on-save="query"></RoleEdit>
  </ListPage> 
</template>
<script>    
  import RoleEdit from '@/components/frame/RoleEdit';
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';

  export default {
    components: {
      RoleEdit,
      ListPage,
      DataRowOperate,
    },
    data() {
      let that = this;
      return {
        tabName:'1',
        columns: [
          /*
          {
            type: 'selection',
            width: 50,
            align: 'center',
            render: function (h,params) {
              if(params.row.roleId === 1){
                params.row._disabled = true
              }
            }
          },*/
          {
            title:'操作',
            width: 120,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    
                  },
                  {
                    key:'delete',
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                    if(key=="delete"){
                      this.rowCommand("删除",params);
                    }
                  }
                }
              });
            }
          },  
          {
            title: '编码',
            key: 'roleId',
            width:100,
          }, 
          {
            title: '名称',
            key: 'roleName',
            width:150,
          }, 
          {
            title: '备注',
            key: 'remark',
            align: 'left',
            minWidth:150
          },
          {
            title: '创建人',
            key: 'creatorName',
            align: 'center',
            width: 100,
          }, 
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            width: 160,
          },
          {
            title: '启用',
            key: 'status',
            align: 'center',
            width: 160,
            render:(h,params)=>{
              var row = params.row;
              return h('i-switch',{
                props: {
                    size: 'small',
                    value:row.status == 1, 
                  },
                  on: {
                    'on-change': (check) => {
                      if(check){
                        row.status=1;
                        that.updateStatus(row);
                      }else{
                        row.status=2;
                        that.updateStatus(row);
                      }    
                    }
                  }
              });
            }
             
          }
        ],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          keyword: '',
          page: '',
          pageSize: ''
        },
        selection: [],
        loading: 0
      }
    },
    mounted: function () {
      this.query();
    },
    computed: {},
    methods: {
      goTab(index){
        var pages = ['/admin','/role']; 
        this.$router.push({path:pages[index]});
      },
      beforeLoad(){

      },
      query() { 
        this.$refs.page.query();
      },
      reset: function () {
        // 清空条件
        this.queryForm.keyword = '';
        this.query();
      },
      select: function (selection) {
        this.selection = selection;
      },
      batch_del: function () {
        var selection = this.selection;
        var roleIds = [];
        for (var i = 0; i < selection.length; i++) {
          roleIds.push(selection[i].roleId);
        }
        if (roleIds.length > 0) {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
            onOk: () => {
              this.$http.post('/api/role/delete?roleIds=' + roleIds, {}).then((res) => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
                  $.extend(this.queryForm, this.queryParam);
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
      rowCommand: function (name, params) {
        if (name === '编辑') {
          this.updateRole(params.row.id);
          return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
            onOk: () => {               
              this.$http.post('/api/engine/role/delete?id=' + params.row.id, params.row).then((res) => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
                  this.$refs.page.query();
                } else {
                  this.$Message.error(res.data.message)
                }
              }).catch((error) => {
                this.$Message.error(error.toString())
              });
            }
          });
        }
      },
      //禁用启用
      updateStatus(row){
        this.$http.post('/api/engine/role/updateStatus', row).then((res) => {
          if (res.data.code === 0) {
            if(row.status==1){
              this.$Message.success("启用成功");
            }else{
              this.$Message.success("禁用成功");
            }    
            this.$refs.page.load();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.$Message.error(error.toString())
        });
      },
      goBack: function () {
        this.$router.go(-1);
      },
      exportDown(){
        this.$refs.page.exportDown();
      }, 
      addRole: function () {
        this.$refs.editRole.open(0);
      },
      updateRole: function (roleId) {
        this.$refs.editRole.open(roleId);
      },
    }
  }

</script>

<style type="text/css">

</style>
