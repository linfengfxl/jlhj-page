<template>
  <ListPage
    ref="page"
    title="入库单汇总"
    api="/api/engine/storage/instock/summaryReport "
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.keyword" placeholder="工程名称" @on-enter="query"/>
          </td>
             <td>
            <Input v-model="queryForm.keyword" placeholder="项目（或仓库）" @on-enter="query"/>
          </td>
          <td>
            <Input v-model="queryForm.keyword" placeholder="材料" @on-enter="query"/>
          </td>
          <td>
            <Input v-model="queryForm.keyword" placeholder="日期" @on-enter="query"/>
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
  </ListPage>
</template>
<script>     
import ListPage from '@/components/page/ListPage';
export default {
  components: {
    ListPage,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '工程名称',
          key: 'projectName',
          width: 120,
        },
        {
          title: '仓库或部门',
          key: 'deptName',
          width: 150,
        },
        {
          title: '材料编号',
          key: 'materCode',
          align: 'left',
          minWidth: 100
        },
        {
          title: '材料名称',
          key: 'materName',
          align: 'center',
          width: 120,
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
          title: '数量',
          key: 'quantity',
          align: 'center',
          width: 100,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          width: 100,
        },
        {
          title: '税额',
          key: 'tax',
          align: 'center',
          width: 100,
        },
        {
          title: '价税合计',//含税单价
          key: 'taxUnitPrice',
          align: 'center',
          width: 100,
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
