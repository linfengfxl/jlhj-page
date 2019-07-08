<template>
  <ListPage
    ref="page"
    api="/api/engine/sub/bill/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      分包结算会签单
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">添加</Button>&nbsp;
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            工程名称
          </td>
          <td >
            <Input v-model="queryForm.projectName" placeholder="工程名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            供应商名称
          </td>
          <td >
            <Input v-model="queryForm.providerName" placeholder="供应商名称" @keyup.enter.native="query"></Input>
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
      api="/api/engine/sub/bill/getDetailList?subOrderBillCode="
      :columns="columns1"
    ></ListPageDetail>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';

import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    ListPage,
    ListPageDetail,
    DataRowOperate,
    UploadBox
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
          key: 'subOrderBillCode',
          width: 140,
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/sub/bill/view?id=' + row.subOrderBillCode});
                }
              }
            },row.subOrderBillCode);
          }
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          minWidth: 150,
        },
        {
          title: '分包类型',
          key: 'subType',
          align: 'center',
          width: 100,
        },
        {
          title: '分包项目',
          key: 'subProjectName',
          align: 'center',
          minWidth: 150,
        },
        page.table.initDateColumn({
          title: '结算日期',
          key: 'settleDate',
          width: 100,
          align: 'center',
        }),
        {
          title: '供应商',
          key: 'providerName',
          align: 'center',
          minWidth: 150,
        },
        {
          title: '联系人',
          key: 'linkMan',
          align: 'center',
          minWidth: 150,
        },
        {
          title: "税率",
          key: "taxRate",
          width: 90,
          align: "center",
          render: (h, params) => {
            var row = params.row;
            return h('span', floatObj.multiply(row.taxRate, 100) + "%");
          }
        },
        page.table.initDateColumn({
          title: '结算开始日期',
          key: 'settleStartDate',
          width: 100,
          align: 'center',
        }),
        page.table.initDateColumn({
          title: '结算结束日期',
          key: 'settleEndDate',
          width: 100,
          align: 'center',
        }), 
        {
          title: '部门',
          key: 'deptName',
          align: 'left',
          width: 100,
        },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '工程量合计',
          key: 'projectQuantity',
          align: 'left',
          width: 120,
        },
        {
          title: '金额合计',
          key: 'totalAmount',
          align: 'left',
          width: 120,
        },
        {
          title: '价税合计',
          key: 'totalPriceTax',
          align: 'left',
          width: 120,
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
          title: '工序名称',
          key: 'name',
          align: 'left',
          minWidth: 120,
        },
        page.table.initArgColumn({
          title: '计量单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 150
        }),
        {
          title: '合同工程量',
          key: 'contractProjectQuantity',
          align: 'left',
          width: 150,
        },  
        {
          title: '含税单价',
          key: 'taxUnitPrice',
          align: 'left',
          width: 120,
        },
        {
          title: '单价',
          key: 'unitPrice',
          align: 'left',
          width: 120,
        },
        {
          title: '工程量',
          key: 'projectQuantity',
          align: 'left',
          width: 120,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'left',
          width: 120,
        },
        {
          title: '税额',
          key: 'tax',
          align: 'left',
          width: 120,
        },
        {
          title: '价税合计',
          key: 'totalPriceTax',
          align: 'left',
          width: 120,
        },
        {
          title: '累计计划工程量',
          key: 'totalProjectQuantity',
          align: 'left',
          width: 120,
        }
        
      ],
      queryForm: {
        projectName: '',
        providerName: '',
      },
      subTypes: [
        {code:'劳务分包',text:'劳务分包'},
        {code:'专业分包',text:'专业分包'},
      ],
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
    },
    reset() {
      Object.assign(this.queryForm, {
        projectName: '',
        providerName: '',
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.subOrderBillCode;
        this.$refs.detail.load(row.subOrderBillCode);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/sub/bill/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/sub/bill/edit?id=' + row.subOrderBillCode
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
            this.$http.post('/api/engine/sub/bill/delete', {
              subOrderBillCode: row.subOrderBillCode,
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
