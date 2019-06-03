<template>
  <ListPage
    ref="page"
    api="/api/engine/financial/reserve/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      备用金申请单
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审批中</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">报废</Radio>
            </RadioGroup>
          </td>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">发起备用金申请单</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.reserveApplyId" placeholder="备用金申请单号" @keyup.enter.native="query" style="width:160px;"></Input>
          </td>

          <td>备用金类型</td>
          <td>
            <Select v-model="queryForm.reverseType" @on-change="query" style="width:160px;">
              <Option v-for="item in reverseType" :value="item.code" :key="item.code" placeholder="备用金类型">{{ item.text }}</Option>
            </Select>
          </td>
          <td>最后付款日期</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.finalPaymentDate"
              split-panels
              placeholder="最后付款日期"
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
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage'; 
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';
import SelectProject from '@/components/page/form/SelectProject';

import page from '@/assets/js/page';

export default {
  components: {
    ListPage, 
    DataRowOperate,
    ListPageDetail,
    UploadBox,
    SelectProject
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
                  disabled: row.status != 3
                }]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.edit(row);
                  }
                  
                }
              }
            });
          }
        },
        {
          title: '备用金申请单号',
          key: 'reserveApplyId',
          width: 140,
          align: 'center',
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/financial/reserve/view?forward&inst='+row.instId});
                }
              }
            },row.reserveApplyId);
          }
        },
        {
          title: '申请部门',
          key: 'applyDeptName',
          align: 'center',
          width: 100,
        }, 
        {
          title: '申请人',
          key: 'applicantName',
          align: 'center',
          width: 100,
        },
        {
          title: '备用金类型',
          key: 'reverseType',
          align: 'left',
          width: 150,
        },
        page.table.initDateColumn({
          title: '预计冲销日期',
          key: 'offsetDate',
        }),
        {
          title: '收款人',
          key: 'payee',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '开户银行',
          key: 'bankOpen',
          align: 'left',
          width: 150,
        },
        {
          title: '银行户名',
          key: 'bankAccName',
          align: 'left',
          width: 150,
        },
        {
          title: '银行账号',
          key: 'bankAccount',
          align: 'left',
          width: 150,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'left',
          width: 150,
        },
        {
          title: '付款方式',
          key: 'payWay',
          align: 'center',
          width: 100,
        },
        {
          title: '法律主体',
          key: 'legalSubject',
          align: 'center',
          width: 100,
        },
        page.table.initDateColumn({
          title: '最后付款日期',
          key: 'finalPaymentDate',
        }),
        {
          title: '备用金用途',
          key: 'reserveUse',
          align: 'center',
          width: 120,
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          width: 200,
          render:(h,params)=>{
            var row = params.row;
            return h(UploadBox,{
              props:{
                value:row.files,
                readonly:true
              }
            });
          }
        },
        page.table.initMapColumn({
          title: '状态',
          key: 'status',
          data: {
            '0': '待提交',
            '1': '审核中',
            '2': '通过',
            '3': '驳回',
            '4': '报废',
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
      queryForm: { 
        reserveApplyId:'',
        reverseType:'',
        status: 2, 
        finalPaymentDate: null,
      },
      reverseType:[
        {code:'临时备用金',text:'临时备用金'},
        {code:'定额备用金',text:'定额备用金'},
        {code:'特殊备用金',text:'特殊备用金'},
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
      var queryParam = this.$refs.page.queryParam;
      queryParam.finalPaymentDateStart = '';
      queryParam.finalPaymentDateEnd = '';
      delete queryParam.finalPaymentDate;
      if (this.queryForm.finalPaymentDate.length > 0) {
        queryParam.finalPaymentDateStart = page.formatDate(this.queryForm.finalPaymentDate[0]);
      }
      if (this.queryForm.finalPaymentDate.length > 1) {
        queryParam.finalPaymentDateEnd = page.formatDate(this.queryForm.finalPaymentDate[1]);
      }
    },
    reset() {
      Object.assign(this.queryForm, {
        reserveApplyId:'',
        reverseType:'',
        finalPaymentDate: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
        status: this.queryForm.status, 
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
        this.curRowId = row.reserveApplyId;
      } else {
        this.curRow = null;
        this.curRowId = null;
      }
    },
    add() {
      this.$router.push({ path: '/financial/reserve/start?forward'})
    },
    edit(row) {
      this.$router.push({
        path: '/financial/reserve/start?forward&id=' + row.reserveApplyId
      })
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
