<template>
  <div class="page page-bill">
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
                <FormItem label="编码" prop="contractId">
                  <Input v-model="formItem.contractId" :disabled="isEdit == 1" class="width-1"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="名称" prop="contractName">
                  <Input v-model="formItem.contractName" placeholder="不超过64个字符"/>
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
                <FormItem label="签订日期" prop="signDate">
                  <Date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="formItem.signDate"
                    format="yyyy-MM-dd"
                  ></Date-picker>
                </FormItem>
              </td>
              <td>
                <FormItem label="签订份数" prop="signNum"> 
                   <InputNumber v-model="formItem.signNum"  ></InputNumber>
                </FormItem>
              </td>

              <td>
                <FormItem label="合同金额" prop="amount">
                  <InputNumber v-model="formItem.amount"></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="providerCode" label="供应商">
                  <SelectProvider
                    v-model="formItem.providerCode"
                    :model="formItem"
                    :text="formItem.providerName"
                    @on-select="selProvider"
                  />
                </FormItem>
              </td>
              <td>
                <FormItem label="联系人" prop>{{formItem.linkMan}}</FormItem>
              </td>

              <td>
                <FormItem label="付款方式" prop="payWay">
                  <Select v-model="formItem.payWay" style="width:150px" placeholder="付款方式">
                    <Option
                      v-for="item in $args.getArgGroup('pay_way')"
                      :value="item.argCode"
                      :key="item.argCode"
                    >{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="预付款" prop>
                  <InputNumber v-model="formItem.prepayment"></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="质保金金额" prop>
                  <InputNumber v-model="formItem.warranty"></InputNumber>
                </FormItem>
              </td>

              <td>
                <FormItem label="税率" prop>
                  <InputNumber
                    v-model="formItem.taxRate1"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    @on-change="computedDetailList()"
                  ></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="合同状态" prop>
                  <Select v-model="formItem.status" style="width:150px" placeholder="类型">
                    <!--1.执行中 2.终止 3.已结算 4.解除 5关闭 -->
                    <Option value="1">执行中</Option>
                    <Option value="2">终止</Option>
                    <Option value="3">已结算</Option>
                    <Option value="4">解除</Option>
                    <Option value="5">关闭</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem label="合同要点" prop>
                  <Input type="textarea" :rows="2" v-model="formItem.contractPoint"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="专项条款" prop>
                  <Input type="textarea" :rows="2" v-model="formItem.specialTerms"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="风险项" prop>
                  <Input type="textarea" :rows="2" v-model="formItem.riskItem"/>
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>
        <Editable ref="editable" :list="list" :editable="true" :model="formItem"></Editable>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
      </table>
    </Loading>
  </div>
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
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelectProject,
    SelectMember,
    SelectProvider,
  },
  data() {
    return {
      loading: 0,
      contractId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        contractId: '',//合同编号
        contractName: '',//合同名称
        projectCode: '',//对应工程
        signDate: '',//签订日期
        signNum: 0,//签定份数
        providerCode: '',//供应商
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        amount: 0,//	合同金额
        payWy: '',//付款方式:从字典中选择
        prepayment: 0,//	预付款
        warranty: 0,//		质保金
        taxRate: '',//		税率
        taxRate1: '',//		税率
        contractPoint: '',//		合同要点
        specialTerms: '',//		专项条款
        riskItem: '',//		风险项 
        status: '1',//	合同状态 1.执行中 2.终止 3.已结算 4.解除 5关闭  
      },
      formRules: {
        contractId: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        contractName: [
          { required: true, whitespace: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        signNum: [
          {type: 'number', required: true, whitespace: true, message: '不能为空', trigger: 'blur' },
        ],
        signDate: [
          {type: 'date', required: true, whitespace: true, message: '签订日期不能为空', trigger: 'change' },
        ],
        amount: [
          {type: 'number', required: true, whitespace: true, message: '不能为空', trigger: 'blur' },
        ],
        providerCode: [
          { required: true, whitespace: true, message: '请选择供应商', trigger: 'change' }
        ],
        payWay: [
          { required: true, whitespace: true, message: '请选择付款方式', trigger: 'change' }
        ]
      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  
  mounted: function () {
    this.contractId = this.$route.query.id;
    if (this.contractId) {
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
        return '采购合同 - 创建';
      }
      if (this.pageFlag == 2) {
        return '采购合同 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '采购合同 - 修订';
      }
    }
  },
  methods: {
    selProvider(data) {
      if (data) {
        this.formItem.providerName = data.providerName;
        this.formItem.providerCode = data.providerCode;
        this.formItem.linkMan = data.linkMan;//供应商联系人
      }
    },
    load() { 
      this.loading = 1;
      this.$http.post("/api/engine/material/contract/get", { contractId: this.contractId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.formItem.status = this.formItem.status.toString();
            this.formItem.taxRate1 = floatObj.multiply(this.formItem.taxRate, 100);//税率
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
        contractId: '',//合同编号
        contractName: '',//合同名称 
        projectCode: '',//对应工程
        contractNo: '',//合同编号
        deptId: '',//仓库或部门 
        providerCode: '',//供应商编号
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人 
        taxRate: '',//税率  
        taxRate1: '',//		税率
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
      form.taxRate = floatObj.multiply(form.taxRate1, 0.01);//税率
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
      var uri = '/api/engine/material/contract/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/material/contract/update';
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
    computedDetailList() {
      // for (var i = 0; i < this.list.length; i++) {
      //   this.list[i].quantity = 0;
      // }
    },
    reset() {
      if (this.pageFlag == 1) {
        this.initNew();
      } else {
        Object.assign(this.formItem, this.oriItem);
        this.formItem.status = this.formItem.status.toString();
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
