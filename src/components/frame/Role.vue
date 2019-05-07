<template>
  <ListPage ref="page" title="" api="/api/role/list" 
  :model="this" :beforeLoad="beforeLoad">  
    <Tabs :animated="false" v-model="tabName" @on-click="goTab">
      <TabPane label="用户管理" name="0" ></TabPane>
      <TabPane label="角色设置" name="1" ></TabPane>
    </Tabs>

    <div class="page-tools" style="margin-top:0px;">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="addRole" icon="plus">添加</Button>
            </td>
            <td>
              <Button  @click="batch_del" icon="ios-trash-outline" v-if="false">删除</Button>
            </td> 
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            <Input v-model="queryForm.roleName"  placeholder="角色名称"/>
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
    <RoleEdit ref="editRole" @on-save="query"></RoleEdit>
  </ListPage> 
</template>
<script>
  import DataRowOperateBar from '@/components/commons/DataRowOperateBar';
  import Loading from '@/components/loading';
  import RoleEdit from '@/components/frame/RoleEdit';
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';

  export default {
    components: {
      DataRowOperateBar,
      Loading,
      RoleEdit,
      ListPage,
      DataRowOperate,
    },
    data() {
      let that = this;
      return {
        tabName:'1',
        columns: [
          {
            type: 'selection',
            width: 50,
            align: 'center',
            render: function (h,params) {
              if(params.row.roleId === 1){
                params.row._disabled = true
              }
            }
          },
          {
            title:'操作',
            width: 150,
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
                  },
                  {
                    key:'set',
                    text:'用户授权',
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
                    if(key=="set"){
                      this.$router.push({path:'/roleuser?forward',query:{roleId:params.row.roleId,roleName:params.row.roleName}});
                    }
                    
                  }
                }
              });
            }
          },  
          {
            title: '角色名称',
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
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            width: 160,
          }, 
          /*{
            title: '操作',
            width: 170,
            align: 'center',
            render: function (h, params) {
              return h('div',[
                h('a',{
                  on:{
                    'click':()=>{
                      that.rowCommand('编辑',params)
                    }
                  }
                },'编辑'),
                h('span',{style:'padding:0 4px;'}),
                h('a',{
                  on:{
                    'click':()=>{
                      that.rowCommand('删除',params)
                    }
                  }
                },'删除'),
                h('span',{style:'padding:0 4px;'}),
                h('a',{
                  on:{
                    'click':()=>{
                      that.$router.push({path:'/roleuser?forward',query:{roleId:params.row.roleId,roleName:params.row.roleName}});
                    }
                  }
                },'用户授权'),
              ]); 
            }
          }*/
        ],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          roleName: '',
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
        this.queryForm.roleName = '';
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
          this.updateRole(params.row.roleId);
          return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
            onOk: () => {
              let roleIds = [params.row.roleId];
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
        }
      },
      goBack: function () {
        this.$router.go(-1);
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
