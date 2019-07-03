<template>
  <ListPage
    ref="page"
    title="收发存汇总"
    api="/api/engine/material/sendAndReceive/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.deptName" placeholder="仓库（或部门）" @on-enter="query" />
          </td>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名" @on-enter="query" />
          </td>
          <td>
            <Input v-model="queryForm.materName" placeholder="材料" @on-enter="query" />
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
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
import Edit from '@/components/project/Edit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';

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
          title: '仓库',
          key: 'deptName',
          width: 120,
        },
        {
          title: '工程名称',
          key: 'projectName',
          minWidth: 150
        },
        {
          title: '材料编码',
          key: 'materCode',
          align: 'left',
          width: 150
        },
        {
          title: '材料名称',
          key: 'materName',
          align: 'center',
          width: 130,
        },
        {
          title: '规格型号',
          key: 'spec',
          align: 'center',
          width: 100,
        },
        {
          title: '计量单位',
          key: 'unit',
          align: 'center',
          width: 100,
        },
        {
          title: '期初数量',
          key: '期初数量',
          align: 'center',
          width: 100,
        },
        {
          title: '收入数量',
          key: '收入数量',
          align: 'center',
          width: 100,
        },
        {
          title: '发出数量',
          key: '发出数量',
          align: 'center',
          width: 100,
        },
        {
          title: '结存数量',
          key: '',
          align: 'center',
          width: 100,
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        deptName: '',
        projectName: '',
        materName: '',
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
    goBack: function () {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
</style>
