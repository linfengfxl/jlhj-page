<template>
  <ListPage
    ref="page"
    title="入库单汇总报表"
    api="/api/engine/storage/instock/summaryReport "
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名称" @on-enter="query"/>
          </td>
          <td>
            <Input v-model="queryForm.deptName" placeholder="项目（或仓库）" @on-enter="query"/>
          </td>
          <td>
            <Input v-model="queryForm.materName" placeholder="材料" @on-enter="query"/>
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
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>     
import ListPage from '@/components/page/ListPage';
import page from "@/assets/js/page";
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
        },
        {
          title: '仓库或部门',
          key: 'deptName',
        },
        {
          title: '材料编号',
          key: 'materCode',
          align: 'left',
          width: 100
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
          key: 'notTaxAmount',
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
          key: 'amount',
          align: 'center',
          width: 100,
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        type: 1,//入库
        projectName: '',
        deptName: '',
        materName: '',
        createTime: [], // 时间格式转换成简单格式
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
      var queryParam = this.$refs.page.queryParam;
      // 开始时间传入
      queryParam.createTimeStart = "";
      // 结束时间传入
      queryParam.createTimeEnd = "";
      // 删除复杂化的时间格式
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        // 将复杂的时间格式转化为年月日简单格式
        queryParam.createTimeStart = page.formatDate(
          this.queryForm.createTime[0]
        );
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(
          this.queryForm.createTime[1]
        );
      }
    },
    query() {
      this.$refs.page.query();
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
    reset: function () {
      // 清空条件
      this.queryForm.keyword = '';
      this.queryForm.projectName = '';
      this.queryForm.deptName = '';
      this.queryForm.materName = '';
      this.queryForm.createTime = []; // 时间
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
