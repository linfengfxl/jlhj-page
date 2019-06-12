<template>
  <ListPage
    ref="page"
    title="入库单汇总"
    api="/api/engine/project/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
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
  </ListPage>
</template>
<script>    
import Edit from '@/components/project/Edit';
import ListPage from '@/components/page/ListPage';
export default {
  components: {
    Edit,
    ListPage,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '工程名称',
          key: 'projectCode',
          width: 120,
        },
        {
          title: '仓库或部门',
          key: 'name',
          width: 150,
        },
        {
          title: '材料编号',
          key: '',
          align: 'left',
          minWidth: 100
        },
        {
          title: '材料名称',
          key: '',
          align: 'center',
          width: 120,
        },
        {
          title: '规格型号',
          key: '',
          align: 'center',
          width: 100,
        },
        {
          title: '计量单位',
          key: '',
          align: 'center',
          width: 100,
        },
        {
          title: '数量',
          key: '',
          align: 'center',
          width: 100,
        },
        {
          title: '金额',
          key: '',
          align: 'center',
          width: 100,
        },
        {
          title: '税额',
          key: '',
          align: 'center',
          width: 100,
        },
        {
          title: '价税合计',
          key: '',
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
