<template>
  <ListPage
    ref="page"
    title="工程登记"
    api="/api/engine/project/list"
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
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
        </tr>
      </table>
    </div>
    <Edit ref="edit" @on-save="query"></Edit>
  </ListPage>
</template>
<script>    
import Edit from '@/components/project/Edit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';

export default {
  components: {
    Edit,
    ListPage,
    DataRowOperate, 
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '操作',
          width: 120,
          align: 'center',
          fixed:'left',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',

                },
                {
                  key: 'delete',
                }]
              },
              on: {
                click: (key) => {
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
          key: 'projectCode',
          width: 80,
          fixed:'left',
        },
        {
          title: '工程名称',
          key: 'name', 
          width: 180, 
          align: 'left',
          fixed:'left',
        },
        page.table.initMapColumn({
          title: '状态',
          key: 'status', 
          width: 60,
          data: {
            '1': '进行中',
            '2': '结项',
          }
        }),
        {
          title: '委托单位',
          key: 'customerName',
          align: 'left',
          width: 150,
        },
        {
          title: '客户信用等级',
          key: 'customerBank',
          align: 'center',
          width: 130,
        },
        {
          title: '职称(职务)',
          key: 'position',
          align: 'center',
          width: 130,
        },
        {
          title: '联系人',
          key: 'linkMan',
          align: 'center',
          width: 130,
        },
        {
          title: '联系电话',
          key: 'linkPhone',
          align: 'center',
          width: 130,
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center',
          width: 130,
        },
        {
          title: '项目来源',
          key: 'source',
          align: 'center',
          width: 130,
        },
        {
          title: '投资额',
          key: 'investment',
          align: 'center',
          width: 130,
        },
        {
          title: '投资性质',
          key: 'investmentType',
          align: 'center',
          width: 130,
        },
        {
          title: '工程总规模',
          key: 'totalSize',
          align: 'center',
          width: 130,
        },
        {
          title: '计量单位',
          key: 'unit',
          align: 'center',
          width: 130,
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
        this.updateRole(params.row.projectCode);
        return;
      }
      if (name === '删除') {
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.$http.post('/api/engine/project/delete', { 'projectCode': params.row.projectCode }).then((res) => {
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
    exportDown(){
      this.$refs.page.exportDown();
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
    importExcel(){

    }
  }
}

</script>

<style type="text/css">
</style>
