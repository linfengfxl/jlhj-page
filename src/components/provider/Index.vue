<template>
  <ListPage
    ref="page"
    title="供应商"
    api="/api/engine/provider/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Button @click="add" icon="plus">添加</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.keyword" placeholder="编码、名称" @on-enter="query"/>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <Edit ref="edit" @on-save="query"></Edit>
    <SetLoginName ref="setLoginName" @on-save="query"></SetLoginName>
  </ListPage>
</template>
<script>    
import Edit from '@/components/provider/Edit';
import SetLoginName from '@/components/provider/SetLoginName';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';

export default {
  components: {
    Edit,
    SetLoginName,
    ListPage,
    DataRowOperate,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
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
          title: '操作',
          width: 150,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'set',
                  text:'设置账号'
                },
                {
                  key: 'edit',
                },
                {
                  key: 'delete',
                }]
              },
              on: {
                click: (key) => {
                  if (key == "set") {
                    this.$refs.setLoginName.open(row.id);
                  }
                  if (key == "edit") {
                    this.rowCommand("编辑", params);
                  }
                  if (key == "delete") {
                    this.rowCommand("删除", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '编码',
          key: 'providerCode',
          width: 100,
        },
        {
          title: '名称',
          key: 'providerName',
          width: 150,
        },
        {
          title: '类别',
          key: 'providerType',
          width: 150,
          render: (h, params) => {
            var row = params.row;
            return h('label', this.$args.getArgText('provider_type', row.providerType));
          }
        },
         {
          title: '联系人',
          key: 'linkMan',
          align: 'center',
          width: 130,
        },
        {
          title: '地址',
          key: 'address',
          align: 'left',
          minWidth: 150
        },
        {
          title: '登录账号',
          key: 'loginName',
          align: 'left',
          minWidth: 150
        },
        page.table.initMapColumn({
          title: '状态',
          key: 'status',
          data:{
            '1':'正常',
            '2':'停用',
          }
        }), 
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
        }
      ],
      list: [],
      total: 0,
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
    goTab(index) {
      var pages = ['/admin', '/provider'];
      this.$router.push({ path: pages[index] });
    },
    beforeLoad() {

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
             this.$http.post('/api/engine/a.canDelete', {providerCode:params.row.providerCode}).then((res) => {
              if (res.data.code === 0&&res.data.data === true) {
                this.$http.post('/api/engine/provider/delete?id=' + params.row.id, {}).then((res) => {
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
              } else {
                this.$Message.error("此供应商已被使用，无法删除")
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
    add: function () {
      this.$refs.edit.open(0);
    },
    updateRole: function (roleId) {
      this.$refs.edit.open(roleId);
    },
  }
}

</script>

<style type="text/css">
</style>
