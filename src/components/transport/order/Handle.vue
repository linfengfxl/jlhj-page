<template>
  <HandleProcess
    ref="handleProcess"
    :instId="instId"
    :title="title"
    @on-load="instLoaded"
    @on-submit="save"
    :loading="loading"
  >
    <div class="baseinfo">
      <div class="page-form">
        <Form
          :model="formItem"
          ref="form"
          :label-width="100"
          class="form-item"
          :rules="ruleValidate"
        >
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%" />
              <col width="auto" />
              <col width="33%" />
            </colgroup>
            <tr>
              <td>
                <FormItem label="运输类别" prop>{{formItem.transportType}}</FormItem>
              </td>
              <td>
                <FormItem prop label="所属部门">{{formItem.deptName}}</FormItem>
              </td>
              <td>
                <FormItem prop label="工程名称">{{formItem.projectName}}</FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="providerCode" label="供应商名称">
                  <SelectProvider
                    v-model="formItem.providerCode"
                    :model="formItem"
                    :text="formItem.providerName"
                    @on-select="selProvider"
                  />
                </FormItem>
              </td>
              <td>
                <FormItem label="供应商联系人" prop>{{formItem.linkMan}}</FormItem>
              </td>
              <td>
                <FormItem label="税率" prop>{{formItem.taxRate}}%</FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="运输设备名称" prop="machineCode">
                  <Select v-model="formItem.machineCode" placeholder="运输设备名称">
                    <Option
                      v-for="item in machines"
                      :value="item.machineCode"
                      :key="item.machineCode"
                    >{{ item.machineName }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem label="车牌号" prop="vehicleNum">
                  <Input v-model="formItem.vehicleNum" placeholder="车牌号不能为空" />
                </FormItem>
              </td>
              <td>
                <FormItem label="运输时间" prop>{{formItem.transportDate}}</FormItem>
              </td>
            </tr>

            <tr>
              <td>
                <FormItem label="数量" prop>{{formItem.num}}</FormItem>
              </td>
              <td>
                <FormItem label="单位" prop>{{formItem.unit}}</FormItem>
              </td>
              <td>
                <FormItem label="里程数" prop>
                  <Input-number v-model="formItem.milage" :min="0" @on-change="onChangeAmount"></Input-number>
                </FormItem>
              </td>
            </tr>

            <tr>
              <td>
                <FormItem label="含税单价" prop>
                  <Input-number
                    v-model="formItem.taxUnitPrice"
                    :min="0"
                    @on-change="onChangeAmount"
                    v-if="$user.hasPower('wdsx.ysxpxgjg')"
                  ></Input-number>
                  <template v-else>{{formItem.taxUnitPrice}}</template>
                </FormItem>
              </td>
              <td>
                <FormItem label="扣款金额" prop>
                  <Input-number
                    v-model="formItem.deductAmount"
                    :min="0"
                    @on-change="onChangeAmount"
                    v-if="$user.hasPower('wdsx.ysxpxgjg')"
                  ></Input-number>
                  <template v-else>{{formItem.deductAmount}}</template>
                </FormItem>
              </td>
              <td>
                <FormItem label="金额" prop>{{formItem.amount}}</FormItem>
              </td>
            </tr>

            <tr>
              <td>
                <FormItem label="税额" prop>{{formItem.tax}}</FormItem>
              </td>
              <td>
                <FormItem label="价税合计" prop>{{formItem.totalPriceTax}}</FormItem>
              </td>
              <td>
                <FormItem label="运输起点" prop>{{formItem.transportStart}}</FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="运输终点" prop>{{formItem.transportEnd}}</FormItem>
              </td>
              <td>
                <Form-item label="抵达时间" prop v-if="$user.hasPower('wdsx.ysxpddsj')">
                  <Date-picker type="datetime" placeholder="选择日期" v-model="formItem.arrivalTime"></Date-picker>
                </Form-item>
              </td>
              <td>
                <FormItem label="开票人" prop>{{formItem.invoiceUser}}</FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem label="运输内容" prop>{{formItem.transportContent}}</FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
    </div>
    <div slot="footer"></div>
  </HandleProcess>
</template>
<script>
import Loading from "@/components/loading";
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import SelectDept from "@/components/page/form/SelectDept"; // 所属部门
import SelContacts from "@/components/selcontacts";
import page from "@/assets/js/page";
import floatObj from '@/assets/js/floatObj';
import HandleProcess from '@/components/workflow/process/Handle';
export default {
  components: {
    HandleProcess,
    Loading,
    SelectProject,
    SelContacts,
    SelectProvider,
    SelectDept
  },
  data() {
    return {
      pageFlag: 1,//1.新建 2.编辑 3.修订
      loading: 0,
      title: '',
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      transportOrderId: '',
      instId: 0,
      //表单对象
      formItem: this.getInitFormItem(),
      machines: [],
      transportType: [
        { code: '内倒', text: '内倒' },
        { code: '外弃', text: '外弃' },
        { code: '运材料', text: '运材料' },
      ],
      ruleValidate: {
        providerCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择供应商",
            trigger: "change"
          }
        ],
        transportType: [
          {
            required: true,
            whitespace: true,
            message: "请填写运输设备名称",
            trigger: "blur"
          }
        ],
        vehicleNum: [
          {
            required: true,
            whitespace: true,
            message: "请填写车牌号",
            trigger: "blur"
          }
        ],
      }
    }
  },
  mounted: function () {
    this.instId = this.$route.query.inst;
    this.$http.post("/api/engine/machine/listAll", {}).then(res => {
      this.loading = 0;
      if (res.data.code === 0) {
        this.machines = res.data.data.rows;
      } else {
        this.$Message.error(res.data.message);
      }
    }).catch(error => {
      this.loading = 0;
      this.$Message.error(error.message);
    });
  },

  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '运输小票 - 创建';
      }
      if (this.pageFlag == 2) {
        return '运输小票 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '运输小票 - 修订';
      }
    }
  },
  methods: {
    instLoaded(proc) {
      this.transportOrderId = proc.instance.businessKey;
      this.title = "运输小票_" + this.transportOrderId;
      this.load();
    },
    save(proc) {
      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })
      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }
      var form = {};
      Object.assign(form, this.formItem);

      form.transportDate = page.formatDateTime(this.formItem.transportDate); //运输日期
      form.arrivalTime = page.formatDateTime(this.formItem.arrivalTime); //抵达时间
      if (!form.transportDate) {
        form.transportDate = null;
      }
      // 提交
      this.loading = 1;
      var uri = '/api/engine/transport/order/submit';
      form.proc = proc.formItem;
      this.loading = 1;
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
    // 初始化表单数据
    getInitFormItem() {
      var obj = {
        time: "",
        transportOrderId: "", //单据编号
        transportDate: "", //运输日期
        deptId: "", //所属部门
        deptName: "", // 所属部门
        projectCode: "", //工程代码
        projectName: "", //工程名称
        providerCode: "", //供应商名称,
        providerName: "", // 供应商名称
        linkMan: "", //供应商联系人',
        taxRate: 0, //税率%',
        taxRate1: 0, //税率',
        transportType: "", //运输设备名称',
        vehicleNum: "", //车牌号',
        num: 0, //数量',
        unit: "", //单位',
        milage: 0, //里程数',
        taxUnitPrice: 0, //含税单价',
        deductAmount: 0, //扣款金额',
        amount: 0, //金额',
        tax: 0, //税额',
        totalPriceTax: 0, //价税合计',
        transportStart: "", //运输起点',
        transportEnd: "", //运输终点',
        arrivalTime: "", //抵达时间',
        transportType: "", //运输类别
        transportContent: "",//运输内容
        instId: 0,
        invoiceUser:'',//开票人
      };
      return obj;
    },
    load() {
      this.loading = 1;
      this.$http
        .post("/api/engine/transport/order/get?transportOrderId=" + this.transportOrderId, {})
        .then(res => {
          this.loading = 0;
          if (res.data.code === 0) {
            Object.assign(this.formItem, res.data.data);
            this.formItem.taxRate1 = this.formItem.taxRate;//税率不带%
            this.formItem.taxRate = floatObj.multiply(this.formItem.taxRate, 100);
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error(error.message);
        });
    },
    selProvider(data) {
      if (data) {
        this.formItem.linkMan = data.linkMan; //供应商联系人
        this.formItem.taxRate = floatObj.multiply(data.taxRate, 100); //税率%
        this.formItem.taxRate1 = data.taxRate;//税率不带%
        this.onChangeAmount();
      }
    },
    onChangeAmount() {
      if (this.formItem.transportType != "" && this.formItem.transportType != null) {
        var milage = 0;
        if (this.formItem.transportType == "内倒") {
          milage = 1;
        } else {
          milage = this.formItem.milage;
        }
        if (this.formItem.num != null && milage != null && this.formItem.taxUnitPrice != null && this.formItem.taxUnitPrice != null &&
          this.formItem.taxRate != null) {
          this.formItem.amount = floatObj.multiply(floatObj.multiply(floatObj.multiply(this.formItem.num, milage), this.formItem.taxUnitPrice), floatObj.subtract(1, this.formItem.taxRate1))
          this.formItem.tax = floatObj.multiply(floatObj.multiply(floatObj.multiply(this.formItem.num, milage), this.formItem.taxUnitPrice), this.formItem.taxRate1);
          if (this.formItem.deductAmount != null) {
            this.formItem.totalPriceTax = floatObj.subtract(floatObj.multiply(floatObj.multiply(this.formItem.num, milage), this.formItem.taxUnitPrice), this.formItem.deductAmount);
          } else {
            this.formItem.totalPriceTax = 0;
          }
        } else {
          this.formItem.totalPriceTax = 0;
        }
      } else {
        //this.$Message.error("请先选择运输类别");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  }
};
</script>

<style type="text/css">
.customeredit .width-1 {
  width: 160px;
}

.transport-order-hander-edit.page {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.transport-order-hander-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.transport-order-hander-edit .baseinfo {
}
.transport-order-hander-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.transport-order-hander-edit .baseinfo table {
  width: 100%;
}
.transport-order-hander-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.transport-order-hander-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.transport-order-hander-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.transport-order-hander-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.transport-order-hander-edit .savebar .reset {
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

.transport-order-hander-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
