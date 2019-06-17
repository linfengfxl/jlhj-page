<template>
  <ViewProcess
    ref="ViewProcess"
    :instId="instId"
    :title="title"
    @on-load="instLoaded"
    @on-submit="save"
  >
    <div class="page instock-edit">
      <Loading :loading="loading">
        <div class="baseinfo">
          <div class="page-tools"></div>
          <Form
            ref="form"
            class="page-form"
            :model="formItem"
            :rules="formRules"
            :label-width="120"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                <td>
                  <FormItem label="部门">{{formItem.deptName}}</FormItem>
                </td>
                <td>
                  <FormItem label="结算日期">{{formItem.billDate}}</FormItem>
                </td>
                <td>
                  <FormItem prop="projectCode" label="工程名称">{{formItem.projectCode}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="providerCode" label="供应商">{{formItem.providerName}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="结算开始日期">{{formItem.startDate}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="结算结束日期">{{formItem.endDate}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="金额合计">{{formItem.totalAmount}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="罚款">{{formItem.penalty}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="价税合计">{{formItem.totalPriceTax}}</FormItem>
                </td>
                <td>
                  <FormItem prop=" " label="备注">{{formItem.remark}}</FormItem>
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
            :deptId="formItem.deptId"
            @on-amount-change="onAmountChange"
          ></Editable>
        </div>
        <!-- <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
        </table>-->
      </Loading>
      <SelProvider ref="selProvider"></SelProvider>
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

import SelStorage from '@/components/storage/input/SelStorage';
import SelProvider from '@/components/provider/SelectProvider';
import SelectProject from '@/components/page/form/SelectProject';
import SelectMachine from '@/components/page/form/SelectMachine';

import ViewProcess from '@/components/workflow/process/View';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelProvider,
    SelectProject,
    SelectMachine,
    ViewProcess,
  },
  data() {
    return {
      loading: 0,
      instId: 0,
      machineBillCode: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      title: '',
      formItem: {
        machineBillCode: '',//单据编号
        deptId: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名   
        billDate: '',//结算日期

        providerCode: '',//供应商名称
        linkMan: '',//供应商联系人
        taxpayerType: '',//纳税人类型
        taxRate: '',   //税率
        invoiceType: '',//发票类型 

        startDate: '',//结算开始日期
        endDate: '',//结算结束日期 
        totalAmount: '',//金额合计
        penalty: '',//罚款
        totalPriceTax: '',//价税合计
        remark: '',//备注 
      },
      formRules: {

      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.instId = this.$route.query.inst;
  },
  computed: {
  },
  methods: {
    instLoaded(proc) {
      this.machineBillCode = proc.instance.businessKey;
      this.title = "机械租赁结算单_" + this.machineBillCode;
      this.load();
    },
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/machine/bill/get", { "machineBillCode": this.machineBillCode }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            res.data.data.billDate=res.data.data.billDate.length>=10?res.data.data.billDate.substring(0,10):res.data.data.billDate; 
            res.data.data.startDate=res.data.data.startDate.length>=10?res.data.data.startDate.substring(0,10):res.data.data.startDate; 
            res.data.data.endDate=res.data.data.endDate.length>=10?res.data.data.endDate.substring(0,10):res.data.data.endDate; 
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
            this.list.map((item) => {
              if (item.jobDate != null) {
                item.jobDate = item.jobDate.length >= 10 ? item.jobDate.substring(0, 10) : item.jobDate;
              }
            })
          } else {
            this.$Message.error('订单不存在！');
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
      Object.assign(this.formItem, {
        machineBillCode: '',//单据编号
        deptId: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名  

        providerCode: '',//供应商名称
        linkMan: '',//供应商联系人
        taxpayerType: '',//纳税人类型
        taxRate: '',   //税率
        invoiceType: '',//发票类型 

        startDate: '',//结算开始日期
        endDate: '',//结算结束日期 
        totalAmount: '',//金额合计
        penalty: '',//罚款
        totalPriceTax: '',//价税合计
        remark: '',//备注 
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.billDate = page.formatDate(form.billDate);
      form.startDate = page.formatDate(form.startDate);
      form.endDate = page.formatDate(form.endDate);

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
        form.detailList.push(item);
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/machine/bill/submit';

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
    selProvider(row) {
      var sel = this.$refs.selProvider;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.providerName = data.providerName;
            this.formItem.providerCode = data.providerCode;
            this.formItem.linkMan = data.linkMan;//供应商联系人
            this.formItem.linkPhone = data.linkPhone;//供应商联系电话
            this.formItem.taxpayerType = this.$args.getArgText('taxpayer_type', data.taxpayerType);//纳税人类型
            this.formItem.invoiceType = this.$args.getArgText('invoice_type', data.invoiceType);//发票类型
            this.formItem.taxRate = data.taxRate;//税率 
          }
        }
      });
    },
    onAmountChange(val) {
      this.formItem.amount = val;
    },
    reset() {
      if (this.pageFlag == 1) {
        this.initNew();
      } else {
        Object.assign(this.formItem, this.oriItem);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
.instock-edit.page {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.instock-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.instock-edit .baseinfo {
}
.instock-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.instock-edit .baseinfo table {
  width: 100%;
}
.instock-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.instock-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.instock-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.instock-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.instock-edit .savebar .reset {
  width: 60px;
  border: 1px solid #a1e7f8;
  background-color: #a1e7f8;
  color: white;
  text-align: center;
  cursor: pointer;
}

.selectinput {
  cursor: pointer;
}

.instock-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
