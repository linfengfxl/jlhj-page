<template>
  <ListPage
    ref="page"
    api="/api/engine/financial/payOrder/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      付款单
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
            <Button @click="add" v-power icon="plus">发起付款单</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.payOrderId" placeholder="付款单号" @keyup.enter.native="query" style="width:160px;"></Input>
          </td>
          <td>
            <Select v-model="queryForm.fundsPlan" @on-change="query" style="width:160px;">
              <Option v-for="item in fundsPlan" :value="item.code" :key="item.code" placeholder="资金计划类型">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <SelectProject v-model="queryForm.projectCode" :model="queryForm" :text="queryForm.projectName" placeholder="工程名称"
            textProp="projectName" />
          </td>
          <td>付款日期</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.payDate"
              split-panels
              placeholder="付款日期"
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
          title: '付款单号',
          key: 'payOrderId',
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
                  this.$router.push({path:'/financial/payorder/view?forward&inst='+row.instId});
                }
              }
            },row.payOrderId);
          }
        },
        {
          title: '资金计划类型',
          key: 'fundsPlan',
          align: 'center',
          width: 100,
          fixed: 'left',
        }, 
        {
          title: '付款分类',
          key: 'payType',
          align: 'center',
          width: 100,
        },
         page.table.initDateColumn({
          title: '付款日期',
          key: 'payDate',
        }),
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          width: 150,
        },
        {
          title: '供应商',
          key: 'providerName',
          align: 'left',
          minWidth: 180,
        },
        {
          title: '付款金额',
          key: 'amount',
          align: 'left',
          width: 150,
        },
        {
          title: '付款金额大写',
          key: 'amountCapital',
          align: 'left',
          minWidth: 150,
        },
        {
          title: '开户银行',
          key: 'bank',
          align: 'left',
          width: 150,
        },
        {
          title: '银行户名',
          key: 'bankAccount',
          align: 'left',
          width: 150,
        },
        {
          title: '开户账号',
          key: 'bankCardNo',
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
         {
          title: '付款说明',
          key: 'payDesc',
          align: 'center',
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
        payOrderId:'',
        fundsPlan:'',
        projectCode:'',
        projectName:'',
        status: 2, 
        payDate: null,
      },
      fundsPlan:[
        {code:'计划内',text:'计划内'},
        {code:'计划外',text:'计划外'},
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
      queryParam.payDateStart = '';
      queryParam.payDateEnd = '';
      delete queryParam.payDate;
      if (this.queryForm.payDate.length > 0) {
        queryParam.payDateStart = page.formatDate(this.queryForm.payDate[0]);
      }
      if (this.queryForm.payDate.length > 1) {
        queryParam.payDateEnd = page.formatDate(this.queryForm.payDate[1]);
      }
    },
    reset() {
      Object.assign(this.queryForm, {
        payOrderId:'',
        fundsPlan:'',
        projectCode:'',
        projectName:'',
        status: this.queryForm.status, 
        payDate:[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
        this.curRowId = row.payOrderId;
      } else {
        this.curRow = null;
        this.curRowId = null;
      }
    },
    add() {
      this.$router.push({ path: '/financial/payorder/start?forward'})
    },
    edit(row) {
      this.$router.push({
        path: '/financial/payorder/start?forward&id=' + row.payOrderId
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
