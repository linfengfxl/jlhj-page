<template>
  <ListPage
    ref="page"
    api="/api/engine/storage/instock/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">出库单</div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审核中</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">作废</Radio>
            </RadioGroup>
          </td>
          <td class="page-tools">
            <Button @click="add"  v-power="'fq.clckd'" icon="plus">出库单</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.stockBillId" placeholder="出库单号" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.deptName" placeholder="项目（或仓库）" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input v-model="queryForm.materName" placeholder="材料" @keyup.enter.native="query"></Input>
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
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
        </tr>
      </table>
    </div>
    <ListPageDetail
      ref="detail"
      slot="page-datatable-detail"
      api="/api/engine/storage/instock/getDetailList?stockBillId="
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
                  disabled: row.status != 3
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
        }, {
          title: '单号',
          key: 'stockBillId',
          width: 120,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            var text = row.stockBillId;
            text = text;
            return h('a', {
              props: {

              },
              on: {
                click: () => {
                  this.$router.push({ path: '/storage/outstock/view?forward&inst=' + row.instId });
                }
              }
            }, text);
          }
        },
        page.table.initDateColumn({
          title: '单据日期',
          key: 'operateDate',
          align: 'center',
          width: 100,
        }),
        {
          title: '仓库',
          key: 'deptName',
          align: 'left',
          width: 160,
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '申请人',
          key: 'creatorName',
          align: 'left',
          width: 100,
        },
        page.table.initMapColumn({
          title: '状态',
          key: 'status',
          data: {
            '0': '待提交',
            '1': '审核中',
            '2': '通过',
            '3': '驳回',
            '4': '作废',
          },
          width: 80,
        }),
        {
          title: '红蓝字',
          key: 'inboundType',
          align: 'center',
          width: 100,
          render: (h, params) => {
            var row = params.row;
            if(row.inboundType==1){
              return h('span', {
                style: {
                  color:'blue'
                }
              },"蓝字");
            }
            return h('span',{
                style: {
                  color:'red'
                }
              },"红字");
          }
        },
        page.table.initDateColumn({
          title: '创建日期',
          key: 'createTime',
          align: 'center',
          width: 100,
        })
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
        stockBillId: '',
        status: 2,
        projectName: '',
        providerName: '',
        deptName: '',
        materName: '',
        type: 2,
        createTime: null,
      },
      loading: 0
    }
  },
  mounted: function () {
    this.query();
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
        status: 2,
        projectName: '',
        providerName: '',
        deptName: '',
        materName: '',
        type: 2,
        stockBillId: '',
        createTime: []//[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.stockBillId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
    add() {
      this.$router.push({ path: '/storage/outstock/start?forward' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/storage/outstock/start?forward&id=' + row.stockBillId
        })
      }
    },
    sendAudit() {
      var selection = this.$refs.page.getSelection();
      if (selection.length == 0) {
        this.$Message.error('请选择要操作的数据行');
        return;
      }
      var start = 0;
      var handle = () => {
        if (start >= selection.length) {
          return;
        }
        var item = selection[start];
        this.$http.post('/api/stock/bill/submit?stockBillId=' + item.stockBillId, {}).then((res) => {
          if (res.data.code === 0) {
            this.$Message.info("第 " + (start + 1) + " 条操作成功");
            start++;
            if (start < selection.length) {
              handle();
            } else {
              this.$refs.page.load();
            }
          } else {
            this.$Message.error(res.data.message)
            this.$refs.page.load();
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        });
      }
      handle();
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          if (row) {
            this.loading = 1;
            this.$http.post('/api/engine/storage/outstock/delete', {
              stockBillId: row.stockBillId,
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
