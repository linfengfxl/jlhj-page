<template>
  <ListPage
    ref="page"
    api="/api/engine/material/low/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      低值耗材结算单
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">添加</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.materialLowId" placeholder="单据编号" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.providerName" placeholder="供应商名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.billDate"
              split-panels
              placeholder="结算日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <ListPageDetail
      ref="detail"
      slot="page-datatable-detail"
      api="/api/engine/material/low/getDetailList?materialLowId="
      :columns="columns1"
    ></ListPageDetail>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';

import page from '@/assets/js/page';

export default {
  components: {
    ListPage,
    ListPageDetail,
    DataRowOperate
  },
  data() {
    let that = this;
    return {
      curRow: null,
      columns: [
        {
          title: '操作',
          width: 90,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  //power: 'ckgl.rk.edit',
                  //disabled: row.status != 0
                }, {
                  key: 'delete',
                  //power: 'ckgl.rk.edit',
                  //disabled: row.status != 0
                }]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.edit(row);
                  }
                  if (key == "delete") {
                    this.del(row);
                  }
                }
              }
            });
          }
        },
        {
          title: '单据编号',
          key: 'materialLowId',
          width: 140,
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/storage/low/view?id=' + row.materialLowId});
                }
              }
            },row.materialLowId);
          }
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          width: 140,
        },
        page.table.initDateColumn({
          title: '结算日期',
          key: 'billDate',
          width: 100,
          align: 'center',
        }),
        {
          title: '部门',
          key: 'deptName',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '供应商名称',
          key: 'providerName',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '供应商联系人',
          key: 'linkMan',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '金额合计',
          key: 'totalAmount',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          minWidth: 150,
        },
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          width: 100,
        },
        page.table.initDateColumn({
          title: '创建日期',
          key: 'createTime',
          align: 'center',
          width: 100,
        }),
      ],
      columns1: [
        {
          title: '费用类型',
          key: 'feeType',
          align: 'left',
          width: 120,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'left',
          minWidth: 120,
        }
      ],
      queryForm: {
        materialLowId: '',
        projectName: '',
        providerName:'',
        billDate: [],
      },
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      queryParam.billDateStart = '';
      queryParam.billDateEnd = '';
      delete queryParam.createTime;
      if (this.queryForm.billDate.length > 0) {
        queryParam.billDateStart = page.formatDate(this.queryForm.billDate[0]);
      }
      if (this.queryForm.billDate.length > 1) {
        queryParam.billDateEnd = page.formatDate(this.queryForm.billDate[1]);
      }
    },
    reset() {
      Object.assign(this.queryForm, {
        materialLowId: '',
        projectName: '',
        providerName:'',
        billDate: [],
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.materialLowId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/storage/low/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/storage/low/edit?id=' + row.materialLowId
        })
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          if (row) {
            this.loading = 1;
            this.$http.post('/api/engine/material/low/delete', {
              materialLowId: row.materialLowId,
            }).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                this.$refs.page.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            });
          }
        }
      });
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
