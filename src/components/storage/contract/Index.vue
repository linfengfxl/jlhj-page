<template>
  <ListPage
    ref="page"
    api="/api/engine/material/contract/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      采购合同
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
            <Input v-model="queryForm.contractId" placeholder="编号" @keyup.enter.native="query"></Input>
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
      api="/api/engine/material/contract/getDetailList?contractId="
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
          title: '编号',
          key: 'contractId',
          width: 140,
          fixed: 'left',
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

        page.table.initDateColumn({
          title: '签订份数',
          key: 'signNum',
          width: 100,
          align: 'center',
        }),
        {
          title: '合同金额',
          key: 'amount',
          align: 'right',
          width: 100,
        },
        page.table.initMapColumn({
          title: '状态',
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
        /* {
           title:'#', 
           fixed: 'left',
           width:50,
           align:'center',
           render:(h,params)=>{
             return h('span', params.index + 1);
           }
         },*/
        {
          title: '物料代码',
          key: 'materCode',
          fixed: 'left',
          align: 'left',
          width: 120,
        },
        {
          title: '物料名称',
          key: 'materName',
          fixed: 'left',
          align: 'left',
          width: 120,
        },
        {
          title: '规格型号',
          key: 'spec',
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
          key: 'quantity',
          align: 'left',
          width: 120,
        },
        {
          title: '含税单价',
          key: 'taxUnitPrice',
          align: 'left',
          width: 120,
        },
        {
          title: '单价(元)',
          key: 'unitPrice',
          align: 'left',
          width: 120,
        },
        {
          title: '金额(元)',
          key: 'amount',
          align: 'left',
          width: 120,
        }, {
          title: '税额(元)',
          key: 'tax',
          align: 'left',
          width: 120,
        }, {
          title: ' ',
        },
      ],
      queryForm: {
        contractId: '',
        contractName: '',
        projectName: '',
        type: 1,
        operId: '',
        operType: 1,
        createTime: null,
      },
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    query() {
      //   if (!this.queryForm.storageId) {
      //     this.$Message.error('请选择仓库');
      //     return;
      //   }
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
        projectName: '',
        type: 1,
        operId: '',
        operType: 1,
        contractId: '',
        contractName: '',
        createTime: []//[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.contractId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/storage/contract/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/storage/contract/edit?id=' + row.contractId
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
            this.$http.post('/api/engine/material/contract/delete', {
              contractId: row.contractId,
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
