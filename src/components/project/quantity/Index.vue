<template>
  <ListPage
    ref="page"
    title="工程量统计"
    api="/api/engine/project/quantity/list1"
    :model="this"
    :beforeLoad="beforeLoad"
    @onCurrentRowChange="curRowChg"
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
    <ListPageDetail
      ref="detail"
      slot="page-datatable-detail"
      api="/api/engine/project/quantity/getDetailList?projectCode="
      :columns="columns1"
    ></ListPageDetail>
  </ListPage>
</template>
<script>    
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    ListPage,
    DataRowOperate,
    ListPageDetail
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
          title: '工程编码',
          key: 'projectCode',
          width: 120,
          align: 'left',
        },
        {
          title: '工程名称',
          key: 'projectName',
          minWidth: 120,
          align: 'left',
        },
        {
          title: '施工总量',
          key: 'totalQuantity',
          align: 'center',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            if (row.totalQuantity != null) {
              return h('span', row.totalQuantity);
            } else {
              return h('span', "");
            }
          },
        },  
      ],
      columns1: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
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
          minWidth: 140
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
            }else{
              return h('span', "");
            }   
          },
        },
      ],
      columns2: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '工程编码',
          key: 'projectCode',
          width: 120,
          align: 'left',
        },
        {
          title: '工程名称',
          key: 'projectName',
          minWidth: 120,
          align: 'left',
        },
        {
          title: '复核工程总量',
          key: 'totalReviewWorkload',
          width: 120,
          align: 'left',
        },
        {
          title: '施工总量',
          key: 'totalQuantity',
          align: 'center',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            if (row.totalQuantity != null) {
              return h('span', row.totalQuantity);
            } else {
              return h('span', "");
            }
          },
        },
        {
          title: '累计完成百分比',
          key: 'totalPercent',
          align: 'center',
          width: 140,
          render: (h, params) => {
            var row = params.row;
            if (row.totalReviewWorkload > 0 && row.totalQuantity != null) {
              return h('span', floatObj.multiply(floatObj.divide(row.totalQuantity, row.totalReviewWorkload), 100) + "%");
            } else {
              return h('span', "");
            }
          },
        }    
      ],
      columns3: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
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
          minWidth: 140
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
            }else{
              return h('span', "");
            }   
          },
        },
        {
          title: '完成百分比',
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
    if (this.$user.hasPower('wdsx.gcltjszkj')) {
      this.columns = this.columns2;
      this.columns1 = this.columns3;
    }
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
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.projectCode;
        this.$refs.detail.load(row.projectCode);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
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
