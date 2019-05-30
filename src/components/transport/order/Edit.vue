<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="100"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="单据编码" prop="transportOrderId">
              <Input v-model="formItem.transportOrderId" :disabled="true" class="width-1"/>
            </FormItem>
            <FormItem label="运输日期" prop="transportDate">
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.transportDate"
                format="yyyy-MM-dd"
              ></Date-picker>
            </FormItem>
            <FormItem prop="deptId" label="所属部门">
              <SelectDept
                v-model="formItem.deptId"
                :model="formItem"
                :text="formItem.deptName"
                :transfer="false"
              />
            </FormItem>
            <FormItem prop="projectCode" label="工程名称">
              <SelectProject
                v-model="formItem.projectCode"
                :model="formItem"
                :text="formItem.projectName"
              />
            </FormItem>

            <FormItem prop="providerCode" label="供应商名称">
              <SelectProvider
                v-model="formItem.providerCode"
                :model="formItem"
                :text="formItem.providerName"
                @on-select="selProvider"
              />
            </FormItem>

            <FormItem label="供应商联系人" prop="linkMan">
              <Input v-model="formItem.linkMan" placeholder="请填写供应商联系人"/>
            </FormItem>

            <FormItem label="税率" prop>
              <InputNumber
                v-model="formItem.taxRate1"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              ></InputNumber>
            </FormItem>
            <FormItem label="运输设备名称" prop="transportType">
              <Input v-model="formItem.transportType" placeholder="名称不能为空"/>
            </FormItem>

            <FormItem label="运输时间" prop>
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.transportDate"
                format="yyyy-MM-dd"
              ></Date-picker>
            </FormItem>
            <FormItem label="车牌号" prop="vehicleNum">
              <Input v-model="formItem.vehicleNum" placeholder="车牌号不能为空"/>
            </FormItem>
            <FormItem label="数量" prop>
              <InputNumber v-model="formItem.num" :min="1"></InputNumber>
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
              <Input-number v-model="formItem.milage" :min="1"></Input-number>
            </FormItem>
            <FormItem label="含税单价" prop>
              <Input-number v-model="formItem.taxUnitPrice" :min="1"></Input-number>
            </FormItem>
            <FormItem label="扣款金额" prop>
              <Input-number v-model="formItem.deductAmount" :min="1"></Input-number>
            </FormItem>
            <FormItem label="金额" prop>
              <Input-number v-model="formItem.amount" :min="1"></Input-number>
            </FormItem>
            <FormItem label="税额" prop>
              <Input-number v-model="formItem.tax" :min="1"></Input-number>
            </FormItem>
            <FormItem label="价税合计" prop>
              <Input-number v-model="formItem.totalPriceTax" :min="1"></Input-number>
            </FormItem>
            <FormItem label="运输起点" prop="transportStart">
              <Input v-model="formItem.transportStart" placeholder="请填写运输起点"/>
            </FormItem>
            <FormItem label="运输终点" prop="transportEnd">
              <Input v-model="formItem.transportEnd" placeholder="请填写运输终点"/>
            </FormItem>
            <Form-item label="抵达时间" prop>
              <Date-picker
                type="date"
                placeholder="选择日期"
                v-model="formItem.arrivalTime"
                format="yyyy-MM-dd"
              ></Date-picker>
            </Form-item>
            <FormItem label="运输类别" prop>
              <Select v-model="formItem.transportType" style="width:150px" placeholder="类型">
                <Option
                  v-for="item in $args.getArgGroup('taxpayer_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="运输内容" prop="transportContent">
              <Input type="textarea" :autonsize="{minRows: 2, maxRows: 5}" placeholder="请输入..." v-model="formItem.transportContent" class="width-2"/>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="checkmark" @click="save">保存</Button>
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
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import SelectDept from "@/components/page/form/SelectDept"; // 所属部门
import SelContacts from "@/components/selcontacts";
import page from "@/assets/js/page";
export default {
  components: {
    Loading,
    SelectProject,
    SelContacts,
    SelectProvider,
    SelectDept
  },
  data() {
    return {
      loading: 1,
      show: false,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      //表单对象
      formItem: this.getInitFormItem(),
      //验证
      ruleValidate: {
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
        // linkMan: [
        //   {
        //     required: true,
        //     whitespace: true,
        //     message: "请填写供应商联系人",
        //     trigger: "blur"
        //   }
        // ],
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
        transportStart: [
          {
            required: true,
            whitespace: true,
            message: "请填写运输起点",
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
        ],
        transportContent: [
          {
            required: true,
            message: "请输入运输内容",
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 1,
            message: '最少不少于1字',
            trigger: 'blur'
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
      ); //运输日期
      this.formItem.arrivalTime = page.formatDate(this.formItem.arrivalTime); //抵达时间
      if (!this.formItem.transportDate) {
        this.formItem.transportDate = null;
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
    // 初始化表单数据
    getInitFormItem(){
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
          taxRate: 0, //税率',
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
          transportContent: "" //运输内容
        };
      return obj;
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
        this.formItem = this.getInitFormItem();
      }
    },
    get(id) {
      this.loading = 1;
      this.$http
        .post("/api/engine/transport/order/get?transportOrderId=" + id, {})
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
    selProvider(data) {
      if (data) {
        this.formItem.linkMan = data.linkMan; //供应商联系人
      }
    },
    close() {
      this.show = false;
    }
  }
};
</script>

<style type="text/css">
.customeredit .width-1 {
  width: 160px;
}
</style>
