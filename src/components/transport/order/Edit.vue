<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="80"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="单据编码" prop="transportOrderId">
              <Input v-model="formItem.transportOrderId" :disabled="isEdit == 1" class="width-1"/>
            </FormItem>
            <FormItem label="运输日期" prop>
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.transportDate"
                format="yyyy-MM-dd"
              ></Date-picker>
            </FormItem>
            <FormItem label="所属部门" prop>
              <Select v-model="formItem.deptId" style="width:150px" placeholder="类型">
                <Option
                  v-for="item in $args.getArgGroup('provider_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="工程名称" prop="projectCode">
              <Input v-model="formItem.projectCode" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="供应商名称" prop="providerCode">
              <Input v-model="formItem.providerCode" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="供应商联系人" prop="providerCode">
              <Input v-model="formItem.providerCode" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="税率" prop>
              <InputNumber
                v-model="formItem.taxRate1"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              ></InputNumber>
            </FormItem>
            <FormItem label="运输设备名称" prop>
              <Input v-model="formItem.transportType" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="运输时间" prop>
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.transportDate"
                format="yyyy-MM-dd"
              ></Date-picker>
            </FormItem>
            <FormItem label="车牌号" prop>
              <Input v-model="formItem.vehicleNum" placeholder="不超过12个字符"/>
            </FormItem>
            <FormItem label="数量" prop>
              <InputNumber
                v-model="formItem.num"
              ></InputNumber>
            </FormItem>
            <FormItem label="单位" prop>
              <Select v-model="formItem.unit" style="width:150px" placeholder="类型">
                <Option
                  v-for="item in $args.getArgGroup('provider_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="里程数" prop>
              <Input v-model="formItem.milage" class="width-2"/>
            </FormItem>
            <FormItem label="含税单价" prop>
              <Input v-model="formItem.taxUnitPrice"/>
            </FormItem>
            <FormItem label="扣款金额" prop>
              <Input v-model="formItem.deductAmount" placeholder="不超过12个字符" class="width-1"/>
            </FormItem>
            <FormItem label="金额" prop>
              <Input v-model="formItem.amount" class="width-1"/>
            </FormItem>
            <FormItem label="税额" prop>
              <Input v-model="formItem.tax" class="width-2"/>
            </FormItem>
            <FormItem label="价税合计" prop>
              <Input v-model="formItem.totalPriceTax" class="width-2"/>
            </FormItem>
            <FormItem label="运输起点" prop>
              <Input v-model="formItem.transportStart" class="width-2"/>
            </FormItem>
            <FormItem label="运输终点" prop>
              <Input v-model="formItem.transportEnd" class="width-2"/>
            </FormItem>
            <FormItem label="抵达时间" prop>
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.arrivalTime"
                format="yyyy-MM-dd"
              ></Date-picker>
            </FormItem>
            <FormItem label="运输类别" prop>
              <Select v-model="formItem.transportType" style="width:150px" placeholder="类型">
                <Option
                  v-for="item in $args.getArgGroup('taxpayer_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="运输内容" prop>
              <Input v-model="formItem.transportContent" class="width-2"/>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="checkmark" @click="save">保存</Button>
              <Button type="ghost" @click="reset" style="margin-left: 8px" v-if="this.isEdit==1">重置</Button>
              <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import Loading from "@/components/loading";
import SelContacts from "@/components/selcontacts";
import page from "@/assets/js/page";
export default {
  components: {
    Loading,
    SelContacts
  },
  data() {
    return {
      loading: 1,
      show: false,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      //表单对象
      formItem: {
        transportOrderId: "", //单据编号
        transportDate: "", //运输日期
        deptId: "", //所属部门
        projectCode: "", //工程名称
        providerCode: "", //供应商联系人',
        taxRate: 0, //税率',
        taxRate1: 0, //税率',
        transportType: "", //运输设备名称',
        vehicleNum: "", //车牌号',
        num: 0, //数量',
        unit: "", //单位',
        milage: "", //里程数',
        taxUnitPrice: "", //含税单价',
        deductAmount: "", //扣款金额',
        amount: "", //金额',
        tax: "", //税额',
        totalPriceTax: "", //价税合计',
        transportStart: "", //运输起点',
        transportEnd: "", //运输终点',
        arrivalTime: "", //抵达时间',
        transportType: "", //运输类别
        transportContent: "" //运输内容
      },
      //验证
      ruleValidate: {
        transportOrderId: [
          {
            required: true,
            whitespace: true,
            message: "编码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 50,
            message: "不能超过50个字",
            trigger: "blur"
          }
        ],
        providerName: [
          {
            required: true,
            whitespace: true,
            message: "名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 50,
            message: "不能超过50个字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    title() {
      if (this.isEdit === 0) {
        return "添加";
      } else {
        return "编辑";
      }
    }
  },
  methods: {
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.saveItem();
        } else {
          return;
        }
      });
    },
    saveItem() {
      let url = "";
      let msg = "";
      if (this.isEdit === 0) {
        url = "/api/engine/transport/order/add";
        msg = "添加成功";
      } else {
        url = "/api/engine/transport/order/update";
        msg = "修改成功";
      }
      this.formItem.transportDate = page.formatDate(
        this.formItem.transportDate
      ); //发展日期
       this.formItem.arrivalTime = page.formatDate(
        this.formItem.arrivalTime
      ); //抵达时间
      if (!this.formItem.transportDate) {
        this.formItem.transportDate = null;
      }
      this.formItem.disableTime = page.formatDate(this.formItem.disableTime); //停用日期
      if (!this.formItem.disableTime) {
        this.formItem.disableTime = null;
      }
      this.formItem.taxRate = this.formItem.taxRate1 * 0.01; //税率
      this.loading = 1;
      this.$http
        .post(url, this.formItem)
        .then(res => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.close();
            this.$emit("on-save");
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error(error.message);
        });
    },
    open(id) {
      this.show = true;
      this.$refs["form"].resetFields();
      this.checked = [];
      if (id) {
        this.isEdit = 1;
        this.formItem.transportOrderId = id;
        this.get(id);
      } else {
        this.loading = 0;
        this.isEdit = 0;
        for (var x in this.formItem) {
          this.formItem[x] = "";
        }
        this.formItem["taxRate"] = 0;
        this.formItem["taxRate1"] = 0;
      }
    },
    get(id) {
      this.loading = 1;
      this.$http
        .post("/api/engine/transport/order/get?id=" + id, {})
        .then(res => {
          this.loading = 0;
          if (res.data.code === 0) {
            Object.assign(this.formItem, res.data.data);
            this.formItem.taxRate1 = this.formItem.taxRate * 100;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error(error.message);
        });
    },
    close() {
      this.show = false;
    },
    reset() {
      this.checked = [];
      this.$refs["form"].resetFields();
      this.get(this.formItem.id);
    }
  }
};
</script>

<style type="text/css">
.customeredit .width-1 {
  width: 160px;
}
</style>
