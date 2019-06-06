<template>
  <ListPage
    ref="page"
    title="工程量填报"
    api="/api/engine/project/daily/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      <a @click="goPage('/project/daily')">施工日报</a>
      -&gt;工程量填报_{{name}}
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
        page.table.initDateColumn({
          title: '填报日期',
          key: 'dailyDate',
          width: 100,
        }),
        {
          title: '本日工作',
          key: 'dayWork',
          width: 100,
        }, {
          title: '明日计划',
          key: 'nextDayPlan',
          width: 220,
        }, {
          title: ' '
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        projectCode: '',
        subProjectName: '',
      },
      selection: [],
      name: '',
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
        this.$router.push({ path: '/project/daily/edit?id=' + params.row.dailyId + '&projectCode=' + this.queryForm.projectCode + '&name=' + this.name })
        return;
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    goPage(path) {
      this.$router.push({ path: path })
    },
    add: function () {
      this.$router.push({ path: '/project/daily/edit?projectCode=' + this.queryForm.projectCode + '&name=' + this.name })
    },
    updateRole: function (roleId) {
      this.$refs.edit.openEdit(roleId);
    },
  }
}

</script>

<style type="text/css">
</style>
