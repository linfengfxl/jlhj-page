<template>
  <ListPage
    ref="page"
    title="工程量统计"
    api="/api/engine/project/quantity/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名称" @on-enter="query"/>
          </td>
          <td>选择日期</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="创建日期"
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
          <td>
            <Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>    
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    ListPage,
    DataRowOperate,
  },
  data() {
    let that = this;
    return {
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '工程名称',
          key: 'projectName',
          minWidth: 120,
        },
        {
          title: '层级编码',
          key: 'levelCode',
          width: 120,
        },
        {
          title: '分部分项工程名称',
          key: 'subProjectName',
          align: 'left',
          width: 140
        },
        {
          title: '设计工程量',
          key: 'designWorkload',
          align: 'center',
          width: 120,
        },
        {
          title: '复核工程量',
          key: 'reviewWorkload',
          align: 'center',
          width: 100,
        },
        page.table.initArgColumn({
          title: '单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
        {
          title: '施工总量',
          key: 'quantity',
          align: 'center',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            if (row.quantity != null) {
              return h('span', row.quantity);
            } else {
              return h('span', 0);
            }
          },
        },
        {
          title: '累计完成百分比',
          key: 'percent',
          align: 'center',
          width: 140,
          render: (h, params) => {
            var row = params.row;
            if (row.designWorkload > 0 && row.quantity != null) {
              return h('span', floatObj.multiply(floatObj.divide(row.quantity, row.designWorkload), 100) + "%");
            } else {
              return h('span', "");
            }
          },
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        projectName: '',
        createTime: null,
      },
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
      queryParam.createTimeStart = '';
      queryParam.createTimeEnd = '';
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        queryParam.createTimeStart = page.formatDate(this.queryForm.createTime[0]);
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
      }
    },
    query() {
      this.$refs.page.query();
    },
    exportDown() {
      this.$refs.page.exportDown();
    },
    reset: function () {
      Object.assign(this.queryForm, {
        projectName: '',
        createTime: ''
      });
      this.query();
    },
  }
}

</script>

<style type="text/css">
</style>
