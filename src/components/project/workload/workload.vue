<template>
  <ListPage
    ref="page"
    title="工程量明细导入"
    api="/api/engine/project/workload/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      <a @click="goPage('/workload')">工程量导入</a> -&gt;工程量明细导入_{{name}}
    </div>
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
            <Input v-model="queryForm.subProjectName" placeholder="名称" @on-enter="query"/>
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
  </ListPage>
</template>
<script>    
import Edit from '@/components/project/workload/workloadEdit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';

export default {
  components: {
    Edit,
    ListPage,
    DataRowOperate,
    page
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '序号',
          type: 'selection',
          width: 50,
          align: 'center',
        },
        {
          title: '操作',
          width: 120,
          align: 'center',
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
          title: '层级编码',
          key: 'levelCode',
          width: 100,
        },
        {
          title: '分步分项工程名称',
          key: 'subProjectName',
          width: 220,
        },
        {
          title: '设计工作量',
          key: 'designWorkload',
          align: 'left',
          minWidth: 150
        },
        {
          title: '复核工作量',
          key: 'reviewWorkload',
          align: 'center',
          width: 130,
        },
        page.table.initArgColumn({
          title: '单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        projectCode: '',
        subProjectName: '',
      },
      selection: [],
      name:'',
      loading: 0
    }
  },
  mounted: function () {
    this.queryForm.projectCode = this.$route.query.projectCode;
    this.name = this.$route.query.name;
    if (this.queryForm.projectCode) {
      this.query();
    } else {
      this.$Message.error("请选择工程");
      this.goBack();
    }
    
  },
  computed: {},
  methods: {
    beforeLoad() {

    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.subProjectName = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    rowCommand: function (name, params) {
      if (name === '编辑') {
        this.updateRole(params.row.workloadId);
        return;
      }
      if (name === '删除') {
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.$http.post('/api/engine/project/workload/delete?workloadId=' + params.row.workloadId, {workloadId:params.row.workloadId}).then((res) => {
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
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
    goPage(path){
      this.$router.push({ path: path})
    },
    add: function () {
      this.$refs.edit.openAdd(this.queryForm.projectCode);
    },
    updateRole: function (roleId) {
      this.$refs.edit.openEdit(roleId);
    },
  }
}

</script>

<style type="text/css">
</style>
