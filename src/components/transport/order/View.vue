<template>
<ViewProcess ref="ViewProcess" :instId="instId" :title="title" @on-load="instLoaded" @on-submit="save">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form :model="formItem" ref="form" :label-width="100" class="form-item">
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
                  <FormItem prop="" label="所属部门">{{formItem.deptName}}</FormItem>
                </td>
                <td>
                  <FormItem prop="" label="工程名称">{{formItem.projectName}}</FormItem>
                </td>
                <td>
                  <FormItem prop="" label="供应商名称">{{formItem.providerName}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="供应商联系人" prop="">
                     {{formItem.linkMan}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="税率" prop>
                  {{formItem.taxRate}}%
                  </FormItem>
                </td>
                <td>
                  <FormItem label="运输设备名称" prop="">
                   {{formItem.machineName}}
                  </FormItem>
                </td>
              </tr>

              <tr>
                <td>
                  <FormItem label="运输时间" prop>
                   {{formItem.transportDate}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="车牌号" prop="">
                   {{formItem.vehicleNum}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="数量" prop>
                   {{formItem.num}}
                  </FormItem>
                </td>
              </tr>

              <tr>
                <td>
                  <FormItem label="单位" prop>
                   {{formItem.unit}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="里程数" prop>
                    {{formItem.milage}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="含税单价" prop>
                    {{formItem.taxUnitPrice}}
                  </FormItem>
                </td>
              </tr>

              <tr>
                <td>
                  <FormItem label="扣款金额" prop>
                    {{formItem.deductAmount}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="金额" prop>
                     {{formItem.amount}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="税额" prop>
                   {{formItem.tax}}
                  </FormItem>
                </td>
              </tr>

              <tr>
                <td>
                  <FormItem label="价税合计" prop>
                    {{formItem.totalPriceTax}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="运输起点" prop="">
                   {{formItem.transportStart}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="运输终点" prop="">
                    {{formItem.transportEnd}}
                  </FormItem>
                </td>
              </tr>
              <!--<FormItem label="运输日期" prop="transportDate">
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.transportDate"
                format="yyyy-MM-dd"
              ></Date-picker>
              </FormItem>-->
              <tr>
                <td>
                  <Form-item label="抵达时间" prop>
                    {{formItem.arrivalTime}}
                  </Form-item>
                </td>
                <td>
                  <FormItem label="运输类别" prop>
                    {{formItem.transportType}} 
                  </FormItem>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="运输内容" prop="">
                    {{formItem.transportContent}}
                  </FormItem>
                </td>
              </tr>
            </table>
            <!-- <FormItem>
              <Button type="primary" icon="checkmark" @click="save">保存</Button>
              <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
            </FormItem>-->
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
</ViewProcess>
</template>
<script>
import Loading from "@/components/loading";
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import SelectDept from "@/components/page/form/SelectDept"; // 所属部门
import SelContacts from "@/components/selcontacts";
import page from "@/assets/js/page";
import floatObj from '@/assets/js/floatObj';
import ViewProcess from '@/components/workflow/process/View';
export default {
  components: {
    ViewProcess,
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
    }
  },
  mounted: function () {
    this.instId = this.$route.query.inst;
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
      debugger
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

      form.transportDate = page.formatDate(
        this.formItem.transportDate
      ); //运输日期
      form.arrivalTime = page.formatDate(this.formItem.arrivalTime); //抵达时间
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
        instId: 0
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
      if (this.formItem.num != null && this.formItem.milage != null && this.formItem.taxUnitPrice != null && this.formItem.taxUnitPrice != null &&
        this.formItem.taxRate != null) {
        this.formItem.amount = floatObj.multiply(floatObj.multiply(floatObj.multiply(this.formItem.num, this.formItem.milage), this.formItem.taxUnitPrice), floatObj.subtract(1, this.formItem.taxRate1))
        this.formItem.tax = floatObj.multiply(floatObj.multiply(floatObj.multiply(this.formItem.num, this.formItem.milage), this.formItem.taxUnitPrice), this.formItem.taxRate1);
        if (this.formItem.deductAmount != null) {
          this.formItem.totalPriceTax = floatObj.subtract(floatObj.multiply(floatObj.multiply(this.formItem.num, this.formItem.milage), this.formItem.taxUnitPrice), this.formItem.deductAmount);
        }
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
</style>
