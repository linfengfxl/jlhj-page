<template>
  <StartProcess ref="startProcess" defineId="13" :loading="loading" :title="pageTitle" @on-submit="save">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="100"
            :rules="ruleValidate"
            class="form-item"
          >
            <!-- 
 <FormItem label="单据编码" prop="transportOrderId">
              <Input v-model="formItem.transportOrderId" :disabled="true" class="width-1"/>
            </FormItem>-->
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                <td>
                  <FormItem label="运输类别" prop="transportType">
                    <Select v-model="formItem.transportType" @on-change="onChangeAmount">
                      <Option
                        v-for="item in transportType"
                        :value="item.code"
                        :key="item.code"
                      >{{ item.text }}</Option>
                    </Select>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="deptId" label="所属部门">
                     <SelStorage v-model="formItem.deptId" :model="formItem"></SelStorage>
                    <!-- <SelectDept
                      v-model="formItem.deptId"
                      :model="formItem"
                      :text="formItem.deptName"
                      :transfer="false"
                    /> -->
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
                  <FormItem label="供应商联系人" prop="linkMan">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem label="税率" prop>
                    <InputNumber
                      v-model="formItem.taxRate"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      readonly="readonly"
                      @on-change="onChangeAmount"
                      style="width:100%"
                    ></InputNumber>
                  </FormItem>
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
                    <Input v-model="formItem.vehicleNum" placeholder="车牌号不能为空"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem label="运输时间" prop="transportDate">
                    <Date-picker
                      type="datetime"
                      placeholder="选择日期"
                      v-model="formItem.transportDate"
                      style="width:100%"
                    ></Date-picker>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="单位" prop>
                    <Select v-model="formItem.unit" placeholder="单位">
                      <Option
                        v-for="item in $args.getArgGroup('unit')"
                        :value="item.argCode"
                        :key="item.argCode"
                      >{{ item.argText }}</Option>
                    </Select>
                  </FormItem>
                </td>
                <td>
                  <FormItem label="数量" prop>
                    <InputNumber
                      v-model="formItem.num"
                      :min="0"
                      @on-change="onChangeAmount"
                      style="width:100%"
                    ></InputNumber>
                  </FormItem>
                </td>
                <td>
                  <FormItem label="里程数" prop>
                    <Input-number
                      v-model="formItem.milage"
                      :min="0"
                      @on-change="onChangeAmount"
                      style="width:100%"
                    ></Input-number>
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
                      style="width:100%"
                      v-if="$user.hasPower('wdsx.ysxpxgjg')"
                    ></Input-number>
                    <InputNumber disabled v-model="formItem.taxUnitPrice" v-else></InputNumber>
                  </FormItem>
                </td>
                <td>
                  <FormItem label="扣款金额" prop>
                    <Input-number
                      v-model="formItem.deductAmount"
                      :min="0"
                      @on-change="onChangeAmount"
                      style="width:100%"
                      v-if="$user.hasPower('wdsx.ysxpxgjg')"
                    ></Input-number>
                    <InputNumber disabled v-model="formItem.deductAmount" v-else></InputNumber>
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
                  <Form-item label="抵达时间" prop  v-if="$user.hasPower('wdsx.ysxpddsj')">
                    <Date-picker
                      type="datetime"
                      placeholder="选择日期"
                      v-model="formItem.arrivalTime"
                      style="width:100%" 
                    ></Date-picker>
                  </Form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <FormItem label="运输内容" prop="transportContent">
                    <Input
                      type="textarea"
                      :autonsize="{minRows: 2, maxRows: 5}"
                      placeholder="请输入..."
                      v-model="formItem.transportContent"
                      class="width-2"
                    />
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="invoiceUser" label="开票人">
                    <Input v-model="formItem.invoiceUser" />
                  </FormItem>
                </td> 
              </tr>
              <tr>
                <td>
                  <FormItem label="运输起点">
                    <!-- <Input v-model="formItem.transportStart" placeholder="请填写运输起点"/> -->
                    <AutoComplete
                      v-model="address1"
                      :data="data1"
                      :filter-method="filterMethod"
                      placeholder="请填写运输起点"
                    ></AutoComplete>
                  </FormItem>
                </td>
                <td>
                  <FormItem label="运输终点">
                    <!-- <Input v-model="formItem.transportEnd" placeholder="请填写运输终点"/> -->
                    <AutoComplete
                      v-model="address2"
                      :data="data2"
                      :filter-method="filterMethod"
                      placeholder="请填写运输终点"
                    ></AutoComplete>
                    <!-- <AutoComplete
                      v-model="address2"
                      :data="addressList"
                      :filter-method="filterMethod"
                      placeholder="请填写运输起点"
                      style="width:200px"
                    ></AutoComplete>-->
                  </FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
    <div slot="footer"></div>
  </StartProcess>
</template>
<script>
import Loading from "@/components/loading";
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import SelectDept from "@/components/page/form/SelectDept"; // 所属部门
import SelStorage from '@/components/storage/input/SelStorage';
import SelContacts from "@/components/selcontacts";
import page from "@/assets/js/page";
import floatObj from '@/assets/js/floatObj';
import StartProcess from '@/components/workflow/process/Start';
export default {
  components: {
    StartProcess,
    Loading,
    SelectProject,
    SelContacts,
    SelectProvider,
    SelectDept,
    SelStorage
  },
  data() {
    return {
      address1: '',
      address2: '',
      data1: [],
      data2: [],
      select: '',
      addressList: [],
      pageFlag: 1,//1.新建 2.编辑 3.修订
      loading: 0,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      transportOrderId: '',
      //表单对象
      formItem: this.getInitFormItem(),
      machines: [],
      //验证
      ruleValidate: {
        transportType: [
          {
            required: true,
            whitespace: true,
            message: "请选择运输类别",
            trigger: "change"
          }
        ],
        transportDate: [
          {
            required: true,
            whitespace: true,
            type: "date",
            message: "请选择日期",
            trigger: "change"
          }
        ],
        deptId: [
          {
            required: true,
            whitespace: true,
            message: "请选择部门",
            trigger: "change"
          }
        ],
        projectCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择工程",
            trigger: "change"
          }
        ],
        providerCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择供应商",
            trigger: "change"
          }
        ],
        // transportType: [
        //   {
        //     required: true,
        //     whitespace: true,
        //     message: "请填写运输设备名称",
        //     trigger: "blur"
        //   }
        // ],
        vehicleNum: [
          {
            required: true,
            whitespace: true,
            message: "请填写车牌号",
            trigger: "blur"
          }
        ],
        transportEnd: [
          {
            required: true,
            whitespace: true,
            message: "请填写运输终点",
            trigger: "blur"
          }
        ]

      },
      transportType: [
        { code: '内倒', text: '内倒' },
        { code: '外弃', text: '外弃' },
        { code: '运材料', text: '运材料' },
      ],
    }
  },
  mounted: function () {
    this.transportOrderId = this.$route.query.id;
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
    this.$http.post("/api/engine/transport/order/getRecentMachine", {}).then(res => {
      this.loading = 0;
      if (res.data.code === 0) {
        if (res.data.data.rows.length > 0) {
          var list = res.data.data.rows;
          var count = 0;
          list.map((item) => {
            if (item.machineCode != null && item.machineName != null && count == 0) {
              this.formItem.machineCode = item.machineCode;
              this.formItem.machineName = item.machineName;
              count++;
            }
          })
        }
      } else {
        this.$Message.error(res.data.message);
      }
    }).catch(error => {
      this.loading = 0;
      this.$Message.error(error.message);
    });

    if (this.transportOrderId) {
      this.pageFlag = 2;
      this.load();
    } else {
      this.pageFlag = 1;
    }
    this.loadAddressList();
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
    loadAddressList() {
      var that = this;
      var uri = '/api/engine/address/list';
      this.$http.post(uri, { pageSize: 1000000 }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          var rows = res.data.data.rows;
          for (let i = 0; i < rows.length; i++) {
            that.data1.push(rows[i].name);
            that.data2.push(rows[i].name);
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.$Message.error("请求失败，请重新操作")
      });
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
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
      if (form.transportType == "运材料" && form.unit == "") {
        this.$Message.error('单位不能为空');
        return;
      }
      if (form.transportType == "运材料" && form.transportContent == "") {
        this.$Message.error('运输内容不能为空');
        return;
      }

      form.transportDate = page.formatDateTime(
        this.formItem.transportDate); //运输日期
      form.arrivalTime = page.formatDateTime(this.formItem.arrivalTime); //抵达时间
      if (!form.transportDate) {
        form.transportDate = null;
      }
      if (!form.arrivalTime) {
        form.arrivalTime = null;
      }
      form.taxRate = this.formItem.taxRate1;
      form.transportStart = this.address1;
      form.transportEnd = this.address2;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/transport/order/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/transport/order/update';
      }
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
        transportContent: "", //运输内容
        invoiceUser:this.$user.trueName,//开票人
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
            this.formItem.taxRate = floatObj.multiply(this.formItem.taxRate, 100);
            this.address1 = this.formItem.transportStart;
            this.address2 = this.formItem.transportEnd;
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
.ivu-auto-complete {
  height: 200px;
}
</style>
