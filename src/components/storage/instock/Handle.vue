<template>
  <HandleProcess
    ref="handleProcess"
    :instId="instId"
    :title="title"
    @on-load="instLoaded"
    @on-submit="save"
  >
    <div class="page instock-edit">
      <Loading :loading="loading">
        <div class="baseinfo">
          <div class="page-tools"></div>
          <Form ref="form" class="page-form" :model="formItem" :label-width="120">
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                <td>
                  <FormItem label="入往仓库">{{formItem.deptName}}</FormItem>
                </td>
                <td>
                  <FormItem label="工程名称">{{formItem.projectName}}</FormItem>
                </td>
                <td>
                  <FormItem label="供应商">{{formItem.providerName}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem label="税率">{{formItem.taxRate1}} %</FormItem>
                </td>
                <td>
                  <FormItem
                    label="纳税人类型"
                  >{{$args.getArgText('taxpayer_type', formItem.taxpayerType)}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem
                    prop
                    label="发票类型"
                  >{{$args.getArgText('invoice_type', formItem.invoiceType)}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="日期">{{formItem.operateDate}}</FormItem>
                </td>
                <td>
                  <FormItem label="收料员">{{formItem.operatorName}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="红蓝字">
                    <template v-if="formItem.inboundType==1">
                      <span style="color:blue;">蓝字</span>
                    </template>
                    <template v-if="formItem.inboundType==2">
                      <span style="color:red;">红字</span>
                    </template>
                  </FormItem>
                </td>
                <td colspan="2">
                  <FormItem prop=" " label="备注">{{formItem.remark}}</FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
        <div>
          <div class="subheader">单据明细</div>
          <Alert v-if="!formItem.deptId">请选择仓库</Alert>
          <Editable
            ref="editable"
            :list="list"
            :editable="false"
            :deptId="formItem.deptId"
            @on-amount-change="onAmountChange"
            :style="{display: formItem.deptId?'':'none'}"
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
    </div>
  </HandleProcess>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelStorage from '@/components/storage/input/SelStorage';//仓库部门
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectMember from '@/components/page/form/SelectMember';//收料员
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';

import HandleProcess from '@/components/workflow/process/Handle';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelectProject,
    SelectMember,
    SelectProvider,
    HandleProcess
  },
  data() {
    return {
      loading: 0,
      stockBillId: '',
      instId: 0,
      title: '',
      formItem: {
        stockBillId: '',//入库单号
        type: 2,//类型:1.出库, 2.入库
        projectCode: '',//工程编号
        projectName: '',//工程名称
        contractNo: '',//合同编号
        deptId: '',//仓库或部门 
        providerCode: '',//供应商编号
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        linkPhone: '',//供应商联系电话
        taxpayerType: '',//纳税人类型
        invoiceType: '',//发票类型
        taxRate: '',//税率 
        taxRate1: '',
        inboundType: 1,//红蓝字:1.“蓝字”表示入库，2.“红字”表示退货
        operateDate: page.formatDate(new Date(), 'yyyy-MM-dd'),
        remark: '',
        operator: '',//
        operatorName: '',
        instId: 0,
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
      this.stockBillId = proc.instance.businessKey;
      this.title = "入库单_" + this.stockBillId;
      this.load();
    },
    selProvider(data) {
      if (data) {
        this.formItem.providerName = data.providerName;
        this.formItem.providerCode = data.providerCode;
        this.formItem.linkMan = data.linkMan;//供应商联系人
        this.formItem.linkPhone = data.linkPhone;//供应商联系电话
        this.formItem.taxpayerType = data.taxpayerType;//纳税人类型
        this.formItem.invoiceType = data.invoiceType;//发票类型
        this.formItem.taxRate = data.taxRate;//税率 
      }
    },
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/storage/instock/get", { stockBillId: this.stockBillId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.formItem.taxRate1 = floatObj.multiply(this.formItem.taxRate, 100);
            this.list = res.data.data.detailList;
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
        stockBillId: '',//入库单号
        type: 2,//类型:1.出库, 2.入库
        projectCode: '',//工程编号
        contractNo: '',//合同编号
        deptId: '',//仓库或部门
        deptId: '',
        providerCode: '',//供应商编号
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        linkPhone: '',//供应商联系电话
        taxpayerType: '',//纳税人类型
        taxRate: '',//税率  
        inboundType: 1,
        remark: '',
        operator: '',//
        operatorName: '',
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
      form.signDate = page.formatDate(form.signDate);

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
        if (item.materCode != '') {
          if (item.quantity == 0) {
            this.$Message.error(msg + '请录入数量');
            return;
          }
          if (item.taxUnitPrice == '') {
            this.$Message.error(msg + '请录入含税单价');
            return;
          }
          form.detailList.push(item);
        }
      }
      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/storage/instock/submit';

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
  /* margin: 0 auto; */
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
