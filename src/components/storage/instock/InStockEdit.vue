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
        <div class="page-tools">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <Button @click="goImport">导入入库申请单</Button>
              </td>
            </tr>
          </table>
        </div>
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
                <FormItem prop="department" label="工程名称">
                  <SelPersonInput
                    v-model="formItem.receiver"
                    :text="formItem.receiverName"
                    bindText="receiverName"
                    :model="formItem"
                  ></SelPersonInput>
                </FormItem>
              </td>
              <td>
                <FormItem prop="operator" label="供应商">
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
    <!-- <SelInStockApply ref="selInStockApply"></SelInStockApply> -->
    <SelProvider ref="selProvider"></SelProvider>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelStorage from '@/components/storage/input/SelStorage';
import SelProvider from '@/components/provider/SelectProvider';
//import SelStockOperType from '@/components/storage/input/SelStockOperType'; 

import SelPersonInput from '@/components/selcontacts/SelPersonInput';
//import SelInStockApply from '@/components/purchase/purchase-order-mgr/SelInStockApply'; 
import pagejs from '@/assets/js/page';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    //SelStockOperType, 
    SelPersonInput,
    // SelInStockApply
    SelProvider,
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
        contractNo: '',//合同编号
        deptId: '',//仓库或部门
        deptId: '',
        providerCode: '',//供应商编号
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        linkPhone: '',//供应商联系电话
        taxpayerType: '',//纳税人类型
        taxRate: '',//税率 
      },
      formRules: {

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
    load() {
      this.loading = 1;

      this.$http.post("/api/stock/bill/get?stockBillId=" + this.stockBillId, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
            this.formItem.departmentName = this.$args.getArgText('deptList', this.formItem.department);
            this.formItem.proposerName = this.$args.getArgText('empList', this.formItem.proposer);
            this.formItem.receiverName = this.$args.getArgText('empList', this.formItem.receiver);
            this.formItem.operatorName = this.$args.getArgText('empList', this.formItem.operator);

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
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    save() {
      debugger
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
      var uri = '/api/stock/bill/add';
      if (this.pageFlag == 2) {
        uri = '/api/stock/bill/update';
      }

      this.$http.post(uri, form).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          this.$Message.info("操作成功！");
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
            debugger
            this.formItem.providerName = data.providerName;
            this.formItem.providerCode = data.providerCode;
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
      this.$router.push('/storage/instock');
    },
    goImport() {
      if (!this.formItem.deptId) {
        this.$Message.error("请选择仓库");
        return;
      }
      var sel = this.$refs.selInStockApply;
      sel.show({
        deptId: this.formItem.deptId,
        ok: (select) => {
          if (select) {
            this.formItem.inStockApplyId = select.inStockApplyId;
            this.formItem.purchaseOrderId = select.purchaseOrderId;
            this.formItem.proposerName = this.$args.getArgText('empList', select.proposer);
            this.formItem.proposer = select.proposer;
            this.formItem.departmentName = this.$args.getArgText('deptList', select.department);
            this.formItem.department = select.department;
            this.list = [];
            select.detailList.map((row) => {
              var newRow = this.$refs.editable.listNewRow();
              row.subQuantity = floatObj.multiply(row.quantity, row.unitRate);
              this.list.push(Object.assign(newRow, row));
            });
          }
        }
      });
    }
  }
}

</script>

<style type="text/css">
.instock-edit.page {
  width: 900px;
  margin: 0 auto;
  padding: 10px 0px;
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
