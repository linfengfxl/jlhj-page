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
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

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
          render: (h, params) => {
            var row = params.row;
            //subtract 
            return h('span', floatObj.subtract(floatObj.add(row["期初数量"], row["收入数量"]), row["发出数量"], 0));
          }
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        deptName: '',
        projectName: '',
        materName: '',
        year: '',
        createTime: [],
        page: '',
        pageSize: ''
      },
      selection: [],
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
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
        queryParam.year = page.formatDateYear(this.queryForm.createTime[0]);
        queryParam.year = queryParam.year.length>4?queryParam.year.substring(0,4):queryParam.year;
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
      }
    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      Object.assign(this.queryForm, {
        projectName: '',
        deptName: '',
        materName: '',
        year:'',
        createTime:[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180)), page.formatDate(new Date())]
      });
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
