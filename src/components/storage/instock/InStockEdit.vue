<template>
  <div class="page instock-edit">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="chevron-left" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{pageTitle}}</div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div class="page-tools"></div>
        <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%">
              <col width="auto">
              <col width="33%">
            </colgroup>
            <tr>
              <td>
                <FormItem prop="deptId" label="入往仓库">
                  <SelStorage v-model="formItem.deptId"></SelStorage>
                </FormItem>
              </td>
              <td>
                <FormItem prop="projectCode" label="工程名称">
                  <SelectProject
                    v-model="formItem.projectCode"
                    :model="formItem"
                    :text="formItem.projectName"
                  />
                </FormItem>
              </td>
              <td>
                <FormItem prop="providerCode" label="供应商">
                  <Input
                    v-model="formItem.providerName"
                    placeholder
                    class="width-1"
                    readonly="readonly"
                    icon="search"
                    @on-click="selProvider"
                  />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop label="供应商联系人">{{formItem.linkMan}}</FormItem>
              </td>
              <td>
                <FormItem prop="amount" label="税率">{{formItem.taxRate}} %</FormItem>
              </td>
              <td>
                <FormItem prop="remark" label="纳税人类型">{{formItem.taxpayerType}}</FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop label="发票类型">{{formItem.invoiceType}}</FormItem>
              </td>
              <td>
                <FormItem prop label="日期">{{formItem.operateDate}}</FormItem>
              </td>
              <td>
                <FormItem prop="operatorName" label="收料员">
                  <SelectMember
                    v-model="formItem.operator"
                    :model="formItem"
                    :text="formItem.operatorName"
                  />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop label="红蓝字">
                  <Radio-group v-model="formItem.inboundType">
                    <Radio :label="1">蓝字</Radio>
                    <Radio :label="2">红字</Radio>
                  </Radio-group>
                </FormItem>
              </td>
              <td colspan="2">
                <FormItem prop=" " label="备注">
                  <Input type="textarea" :rows="2" v-model="formItem.remark"/>
                </FormItem>
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
          :editable="true"
          :deptId="formItem.deptId"
          @on-amount-change="onAmountChange"
          :style="{display: formItem.deptId?'':'none'}"
        ></Editable>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
      </table>
    </Loading>
    <SelProvider ref="selProvider"></SelProvider>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelProvider from '@/components/provider/SelectProvider';
import SelStorage from '@/components/storage/input/SelStorage';
import SelectProject from '@/components/page/form/SelectProject';
import SelectMember from '@/components/page/form/SelectMember';
import SelPersonInput from '@/components/selcontacts/SelPersonInput';
import pagejs from '@/assets/js/page';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelProvider,
    SelStorage,
    SelPersonInput,
    SelectProject,
    SelectMember
  },
  data() {
    return {
      loading: 0,
      stockBillId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
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
        inboundType: 1,//红蓝字:1.“蓝字”表示入库，2.“红字”表示退货
        operateDate: page.formatDate(new Date(), 'yyyy-MM-dd'),
        remark: '',
        operator: '',//
        operatorName: '',
      },
      formRules: {
        deptId: [
          { required: true, whitespace: true, message: '请选择仓库', trigger: 'change' }
        ],
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        providerCode: [
          { required: true, whitespace: true, message: '请选择供应商', trigger: 'change' }
        ],
        operatorName: [
          { required: true, whitespace: true, message: '请选择收料员', trigger: 'change' }
        ],
      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.stockBillId = this.$route.query.id;
    if (this.stockBillId) {
      this.pageFlag = 2;
      this.load();
    } else {
      this.pageFlag = 1;
      this.initNew();
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '入库单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '入库单 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '入库单 - 修订';
      }
    }
  },
  methods: {
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
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/storage/instock/get?stockBillId=" + this.stockBillId, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.formItem.taxpayerType = this.$args.getArgText('taxpayer_type', this.formItem.taxpayerType);//纳税人类型
            this.formItem.invoiceType = this.$args.getArgText('invoice_type', this.formItem.invoiceType);//发票类型
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
    save() {
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

      // 提交
      this.loading = 1;
      var uri = '/api/engine/storage/instock/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/storage/instock/update';
      }

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
      this.$router.push('/storage/instock');
    },
  }
}

</script>

<style type="text/css">
.instock-edit.page {
  width: 900px;
  /* margin: 0 auto; */
  padding: 10px 20px;
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
