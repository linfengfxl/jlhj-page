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
                <FormItem label="单据编号" prop="subOrderBillCode">
                  <Input v-model="formItem.subOrderBillCode" disabled  class="width-1" placeholder="自动生成"/>
                </FormItem>
              </td>
               <td>
                <FormItem prop="projectCode" label="工程名称">
                  <SelectProject
                    v-model="formItem.projectCode"
                    :model="formItem"
                    :text="formItem.projectName"
                    @on-select="selProject"
                  />
                </FormItem>
              </td>
              <td>
                <FormItem prop="subType" label="分包类型">
                  <Select v-model="formItem.subType" style="width:100%" >
                    <Option
                      v-for="item in subTypes"
                      :value="item.code"
                      :key="item.code"
                    >{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="subProjectName" label="分包项目">
                  <Input v-model="formItem.subProjectName" />
                </FormItem>
              </td>
              <td>
                <FormItem label="结算日期" prop="settleDate">
                  <Date-picker
                    type="date"
                    style="width:100%"
                    v-model="formItem.settleDate"
                    format="yyyy-MM-dd"
                  ></Date-picker>
                </FormItem>
              </td>
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
                <FormItem label="税率" prop>
                  {{formItem.taxRate*100+"%"}}
                </FormItem>
              </td>
              <td>
                <FormItem label="结算开始日期" prop="settleStartDate">
                  <Date-picker
                    type="date"
                    style="width:100%"
                    v-model="formItem.settleStartDate"
                    format="yyyy-MM-dd"
                  ></Date-picker>
                </FormItem>
              </td>
              <td>
                <FormItem label="结算结束日期" prop="settleEndDate">
                  <Date-picker
                    type="date"
                    style="width:100%"
                    v-model="formItem.settleEndDate"
                    format="yyyy-MM-dd"
                  ></Date-picker>
                </FormItem>
              </td>
              <td>
                <FormItem prop="deptId" label="部门">
                  <SelectDept v-model="formItem.deptId" :model="formItem" :text="formItem.deptName" />
                </FormItem>
              </td> 
              <td>
                <FormItem label="备注" prop="remark">
                  <Input v-model="formItem.remark"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="工程量合计" prop="projectQuantity">
                  {{formItem.projectQuantity}}
                </FormItem>
              </td>
              <td>
                <FormItem label="金额合计" prop="totalAmount">
                  {{formItem.totalAmount}}
                </FormItem>
              </td>
              <td>
                <FormItem label="价税合计" prop="totalPriceTax">
                  {{formItem.totalPriceTax}}
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>
        <Editable ref="editable" :list="list" :editable="true" :taxRate="taxRate" 
        :model="formItem" @on-amount-change="onAmountChange"></Editable>
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
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import UploadBox from '@/components/upload/Index';
import SelectDept from '@/components/page/form/SelectDept';
import pagejs from '@/assets/js/page';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    UploadBox,
    SelectDept
  },
  data() {
    return {
      loading: 0,
      subOrderBillCode: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        subOrderBillCode: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subType: '',//分包类型
        subProjectName:'',
        settleDate:'',
        providerCode:'',
        providerName:'',
        linkMan:'',
        taxRate:0,
        settleStartDate:'',
        settleEndDate:'',
        deptId:'',
        deptName:'',
        remark: '',
        projectQuantity: 0,
        totalAmount: 0,   
        totalPriceTax: 0, 
      },
      formRules: {
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        providerCode: [
          { required: true, whitespace: true, message: '请选择供应商', trigger: 'change' }
        ],
        settleDate: [
          {type: 'date', required: true, whitespace: true, message: '结算日期不能为空', trigger: 'change' },
        ],
      },
      taxRate:{
        taxRate:0,
      },
      list: [],
      oriItem: {},
      subTypes: [
        {code:'劳务分包',text:'劳务分包'},
        {code:'专业分包',text:'专业分包'},
      ],
    }
  },
  
  mounted: function () {
    this.subOrderBillCode = this.$route.query.id;
    if (this.subOrderBillCode) {
      this.pageFlag = 2;
      this.isEdit=1;
      this.load();
    } else {
      this.pageFlag = 1;
      this.isEdit=0;
      this.initNew();
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '分包结算会签单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '分包结算会签单 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '分包结算会签单 - 修订';
      }
    }
  },
  methods: {
    load() { 
      this.loading = 1;
      this.$http.post("/api/engine/sub/bill/get", { subOrderBillCode: this.subOrderBillCodel }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.selProject();
            this.list = res.data.data.detailList;
          } else {
            this.$Message.error('合同不存在！');
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
        subOrderBillCode: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subType: '',//分包类型
        subProjectName:'',
        settleDate:'',
        providerCode:'',
        providerName:'',
        linkMan:'',
        taxRate:0,
        settleStartDate:'',
        settleEndDate:'',
        deptId:'',
        deptName:'',
        remark: '',
        projectQuantity: 0,
        totalAmount: 0,   
        totalPriceTax: 0, 
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
      form.settleDate = page.formatDate(form.settleDate);
      form.settleStartDate = page.formatDate(form.settleStartDate);
      form.settleEndDate = page.formatDate(form.settleEndDate);
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
        if (item.name == '') {
          this.$Message.error(msg + '请录入工序名称');
          return;
        }

          form.detailList.push(item);
      }

      // 提交
      this.loading = 1;
      var uri = '/api/engine/sub/bill/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/sub/bill/update';
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
    onAmountChange(total){
      this.formItem.projectQuantity=total.projectQuantity;
      this.formItem.totalAmount=total.totalAmount;
      this.formItem.totalPriceTax=total.totalPriceTax;
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
