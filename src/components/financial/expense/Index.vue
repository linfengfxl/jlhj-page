<template>
  <ListPage
    ref="page"
    api="/api/engine/financial/expense/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      报销单
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审批中</Radio>
              <Radio :label="3">驳回</Radio>
            </RadioGroup>
          </td>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">发起报销单</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.stockBillId" placeholder="报销单号" @keyup.enter.native="query"></Input>
          </td>
          <td>创建日期</td>
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
      api="/api/engine/financial/expense/getDetailList?billId="
      listBind=""
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

export default {
  components: {
    ListPage, 
    DataRowOperate,
    ListPageDetail,
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
                  power: 'ckgl.rk.edit',
                  disabled: row.status != 0
                }, {
                  key: 'delete',
                  power: 'ckgl.rk.del',
                  disabled: row.status != 0
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
          title: '报销单号',
          key: 'billId',
          width: 140,
          align: 'center',
          fixed: 'left',
        },
        page.table.initDateColumn({
          title: '单据日期',
          key: 'billDate',
          align: 'center', 
        }),
        {
          title: '分类',
          key: 'catalog',
          align: 'center',
          width: 100,
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          width: 150,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          width: 100,
        },
        {
          title: '银行名称',
          key: 'bank',
          align: 'left',
          width: 150,
        },
        {
          title: '开户银行',
          key: 'bankOpen',
          align: 'left',
          width: 150,
        },
        {
          title: '开户账号',
          key: 'bankAccount',
          align: 'left',
          width: 150,
        },
        {
          title: '经办人',
          key: 'operatorName',
          align: 'center',
          width: 100,
        },
        {
          title: '部门',
          key: 'deptName',
          align: 'center',
          width: 100,
        },
        {
          title: '支付方式',
          key: 'payWay',
          align: 'center',
          width: 100,
        },
        {
          title: '法律主体',
          key: 'legal',
          align: 'center',
          width: 100,
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          width: 150,
          render1:(h,params)=>{
            var row = params.row;
            return h(UploadBox,{
              props:{
                value:row.files,
                readonly:true
              }
            });
          }
        },
        {
          title: '描述',
          key: 'describe',
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
        }),
      ],
      columns1: [ 
        {
          title: '费用科目',
          key: 'feeType',           
          align: 'left',
          width: 150,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          width: 100,
        },
        {
          title: '描述',
          key: 'describe',
          align: 'left',
        },
      ],
      queryForm: { 
        status: 2, 
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
        status: 2, 
        createTime: null,
        createTime: []//[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
        this.curRowId = row.billId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/financial/expense/edit?forward' })
    },
    edit(row) {
      if (row) {
        if (row.isWeight) {
          this.$router.push({
            path: '/storage/weightinstock/edit?forward&id=' + row.stockBillId
          })
        } else {
          this.$router.push({
            path: '/storage/instock/edit?forward&id=' + row.stockBillId
          })
        }
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
            this.$http.post('/api/engine/storage/instock/delete', {
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
