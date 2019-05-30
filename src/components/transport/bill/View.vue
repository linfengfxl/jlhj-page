<template>
  <ViewProcess ref="ViewProcess" :instId="instId" :title="title" @on-load="instLoaded" @on-submit="save">
    <div class="page expense-edit">     
    <Loading :loading="loading">
      <div class="baseinfo"> 
        <div class="subheader">
          单据表头
        </div>
        <Form ref="form" class="page-form page-form-view" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                <td>
                  <FormItem prop="deptId" label="部门">
                    {{formItem.deptName}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="billDate" label="结算日期">
                   {{formItem.billDate}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="projectCode" label="工程名称">
                   {{formItem.projectName}}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="providerCode" label="供应商">
                   {{formItem.providerName}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="纳税人类型">{{$args.getArgText('taxpayer_type', formItem.taxpayerType)}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="税率">{{formItem.taxRate}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="发票类型">{{formItem.invoiceType}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="结算开始日期">
                   {{formItem.startDate}}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="结算结束日期">
                   {{formItem.endDate}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="金额合计">
                    {{formItem.amount}}
                  </FormItem>
                </td>

                <td>
                  <FormItem prop label="税额合计">
                    {{formItem.tax}}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="扣款合计">
                   {{formItem.deductAmount}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="价税合计">
                   {{formItem.totalPriceTax}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop=" " label="备注">
                  {{formItem.remark}}
                  </FormItem>
                </td>
              </tr>
            </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>         
        <Editable
          ref="editable"
          :list="list"
          :editable="false"
          @on-amount-change="onAmountChange"           
        ></Editable>
      </div>       
    </Loading>
  </div>
</ViewProcess>  
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj'; 
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';

import SelectProject from '@/components/page/form/SelectProject';
import SelectDept from '@/components/page/form/SelectDept';

import ViewProcess from '@/components/workflow/process/View';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,     
    UploadBox,
    SelectProject,
    SelectDept,
    ViewProcess
  },
  data() {
    return {
      title:'报销单',
      loading: 0,
      instId:0,
      formItem: {
     
      },
      formRules: {
         
      },
      list: [],
      oriItem: {},
    }
  },
  mounted: function () { 
    this.instId = this.$route.query.inst;    
  },
  computed: {     
  },
  methods: {
    instLoaded(proc){ 
      this.transportBillId = proc.instance.businessKey;
      this.title = "结算单_" + this.transportBillId;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/transport/bill/get?transportBillId=" + this.transportBillId, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {            
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);             
            this.list = res.data.data.detailList;
          } else {
            this.$Message.error('单据不存在！');
            this.goBack();
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    initNew() {
      Object.assign(this.formItem, this.getInitFormItem());
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
      // 初始化表单数据
    getInitFormItem() {
      var obj = {
        transportBillId: "", //单据编号
        deptId: "", //所属部门
        deptName: "", // 所属部门
        projectCode: "", //工程代码
        projectName: "", //工程名称
        providerCode: "", //供应商名称,
        providerName: "", // 供应商名称
        linkMan: "", //供应商联系人',
        taxpayerType: "", //纳税人类型
        invoiceType: "", // 发票类型
        taxRate: 0, //税率',
        taxRate1: 0, //税率',
        startDate: "", // 结算开始日期
        endDate: "", // 结算结束日期
        billDate: "", // 结算日期
        taxUnitPrice: 0, //含税单价',
        deductAmount: 0, //扣款金额',
        amount: 0, //金额',
        tax: 0, //税额',
        totalPriceTax: 0, //价税合计',
        transportStart: "", //运输起点',
        transportEnd: "", //运输终点',
        transportType: "", //运输类别
        transportContent: "", //运输内容
        status: 0 //  审批状态
      };
      return obj;
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.billDate = page.formatDate(form.billDate);

      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }

      form.detailList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = '明细第 ' + (i + 1) + ' 行，';
        if (item.amount > 0) {
          if (item.feeType == '' || item.feeType == null) {
            this.$Message.error(msg + '请选择费用类型');
            return;
          }
          form.detailList.push(item);
        }
      }

      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/expense/submit';

      this.$http.post(uri, form).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          this.$Message.success("操作成功！");
          this.goBack();
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新操作")
      });
    },  
    onAmountChange(val) {
      this.formItem.amount = val;
    },
    reset() {
      Object.assign(this.formItem, this.oriItem);
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
.expense-edit.page {
  position: relative;
}
.expense-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.expense-edit .baseinfo {
}
.expense-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.expense-edit .baseinfo table {
  width: 100%;
}
.expense-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
} 

.selectinput {
  cursor: pointer;
}

.expense-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
