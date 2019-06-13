<template>
  <ListPage
    ref="page"
    api="/api/engine/financial/payPlan/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      付款计划
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
            <Button @click="add" v-power icon="plus">发起付款计划单</Button>&nbsp;
          </td>
           <td class="page-tools">
            <UploadButton @on-upload="importExcel"></UploadButton>
          </td>
          <td class="page-tools">
            <Button @click="exportDown" type="info"  icon="ios-download-outline">导出</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.payPlanId" placeholder="付款计划单号" @keyup.enter.native="query"></Input>
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
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage'; 
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';
import UploadButton from '@/components/upload/UploadButton';

import page from '@/assets/js/page';

export default {
  components: {
    ListPage, 
    DataRowOperate,
    ListPageDetail,
    UploadBox,
    UploadButton
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
          title: '付款计划单号',
          key: 'payPlanId',
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
                  this.$router.push({path:'/financial/payplan/view?forward&inst='+row.instId});
                }
              }
            },row.payPlanId);
          }
        },
        {
          title: '付款计划名称',
          key: 'payPlanName',
          align: 'center',
          width: 100,
        },
        {
          title: '供应商',
          key: 'providerName',
          align: 'left',
          minWidth: 180,
        },
        {
          title: '供应商联系人',
          key: 'linkMan',
          align: 'center',
          width: 100,
        },
        {
          title: '发生额',
          key: 'amount',
          align: 'left',
          width: 150,
        },
        {
          title: '累计付款额',
          key: 'acumPayAmount',
          align: 'left',
          width: 150,
        },
        {
          title: '应付金额',
          key: 'payableAmount',
          align: 'left',
          width: 150,
        },
        {
          title: '应付类型',
          key: 'payableType',
          align: 'center',
          width: 100,
        },
        {
          title: '本期应付款额',
          key: 'currentPayableAmount',
          align: 'center',
          width: 120,
        },
        {
          title: '本期计划付款额',
          key: 'currentPlanAmount',
          align: 'center',
          width: 120,
        },
        {
          title: '合同付款方式',
          key: 'contractPayType',
          align: 'center',
          width: 100,
        },
         {
          title: '合同账期(%)',
          key: 'contractBillPeriod',
          align: 'center',
          width: 100,
        },
         {
          title: '申请部门',
          key: 'deptName',
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
          title: '计划年度',
          key: 'planYear',
          align: 'center',
          width: 100,
        },
         {
          title: '计划月份',
          key: 'planMonth',
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
        payPlanId:'',
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
        payPlanId:'',
        status: this.queryForm.status, 
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
        this.curRowId = row.payPlanId;
      } else {
        this.curRow = null;
        this.curRowId = null;
      }
    },
    add() {
      this.$router.push({ path: '/financial/payplan/start?forward'})
    },
    edit(row) {
      this.$router.push({
        path: '/financial/payplan/start?forward&id=' + row.payPlanId
      })
    },
    goPage(page) {
      this.$router.push({ path: page });
    },
    importExcel(fileId){
      this.$http.post('/api/engine/financial/payPlan/import', {defineId:"4",fileId:fileId}).then((res) => {
        if (res.data.code === 0) {
          this.$Message.success("导入成功, 添加:"+ res.data.data +"条");
          this.reset();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
  }
}

</script>

<style type="text/css">
</style>
