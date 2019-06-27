<template>
  <ListPage
    ref="page"
    api="/api/engine/machine/contract/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      机械租赁合同
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
            <Input v-model="queryForm.machineContractId" placeholder="合同编号" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.contractName" placeholder="合同名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名" @keyup.enter.native="query"></Input>
          </td>
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
            <Button @click="reset">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <ListPageDetail
      ref="detail"
      slot="page-datatable-detail"
      api="/api/engine/machine/contract/getDetailList?machineContractId="
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
          title: '合同编号',
          key: 'machineContractId',
          width: 140,
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/machine/contract/view?id=' + row.machineContractId});
                }
              }
            },row.machineContractId);
          }
        },
        {
          title: '合同名称',
          key: 'contractName',
          align: 'left',
          width: 120,
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          width: 140,
        },
        page.table.initDateColumn({
          title: '签订日期',
          key: 'signDate',
          width: 100,
          align: 'center',
        }),
        {
          title: '签订份数',
          key: 'signNum',
          align: 'center',
          width: 100,
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
          title: '付款方式',
          key: 'payWay',
          align: 'left',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            return h('span', this.$args.getArgText('pay_way',row.payWay));
          }
        },
        {
          title: '预付款',
          key: 'prepayment',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '质保金',
          key: 'warranty',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '税率',
          key: 'taxRate',
          align: 'left',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            return h('span', row.taxRate);
          }
        },
        {
          title: '租赁方式',
          key: 'leaseType',
          align: 'left',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            return h('span', this.$args.getArgText('lease_type',row.leaseType));
          }
        },
        {
          title: '租赁价格',
          key: 'leasePrice',
          align: 'left',
          minWidth: 120,
        },
        page.table.initMapColumn({
          title: '合同状态',
          key: 'status',
          width: 100,
          data: {
            '1': '执行中',
            '2': '终止',
            '3': '已结算',
            '4': '解除',
            '5': '关闭',
          }
        }),
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
        {
          title: ' ',
        },
      ],
      columns1: [
        {
          title: '机械代码',
          key: 'machineCode',
          align: 'left',
          width: 120,
        },
        {
          title: '机械名称',
          key: 'machineName',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '规格型号',
          key: 'machineModel',
          align: 'left',
          width: 120,
        },
        page.table.initArgColumn({
          title: '单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
        {
          title: '数量',
          key: 'taxUnitPrice',
          align: 'left',
          width: 120,
        },
        {
          title: '进场时间',
          key: 'entryTime',
          align: 'left',
          width: 150,
        },
      ],
      queryForm: {
        machineContractId: '',
        contractName: '',
        projectName: '',
        createTime: [],
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
    reset() {
      Object.assign(this.queryForm, {
        machineContractId: '',
        contractName: '',
        projectName: '',
        createTime: [],
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.machineContractId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/machine/contract/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/machine/contract/edit?id=' + row.machineContractId
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
            this.$http.post('/api/engine/machine/contract/delete', {
              machineContractId: row.machineContractId,
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
