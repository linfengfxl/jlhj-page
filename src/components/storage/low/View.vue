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
                <FormItem label="单据编号" prop="materialLowId">
                  {{formItem.materialLowId}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="projectCode" label="工程名称">
                  {{formItem.projectName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="结算日期" prop="billDate">
                  {{formItem.billDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="deptId" label="部门">
                  {{formItem.deptName}}
                </FormItem>
              </td> 
              <td>
                <FormItem prop="providerCode" label="供应商">
                  {{formItem.providerName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="联系人" prop>{{formItem.linkMan}}</FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="备注" prop="remark">
                  {{formItem.remark}}
                </FormItem>
              </td>
              <td>
                <FormItem label="金额合计" prop="totalAmount">
                  {{formItem.totalAmount}}
                </FormItem>
              </td>
              
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>
        <Editable ref="editable" :list="list" :editable="false" :model="formItem" @on-amount-change="onAmountChange" ></Editable>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="goBack">确定</td>
          <td class="reset" @click="goBack">取消</td>
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
import SelectDept from '@/components/page/form/SelectDept';
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectMember from '@/components/page/form/SelectMember';//收料员
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectDept,
    SelectProject,
    SelectMember,
    SelectProvider,
  },
  data() {
    return {
      loading: 0,
      materialLowId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        materialLowId: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        billDate: '',//结算日期
        providerCode: '',//供应商
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        deptId: '',//部门
        deptName: '',//部门
        totalAmount: 0,// 金额合计
        remark: '',//   备注 
      },
      formRules: {
      },
      list: [],
      oriItem: {},
    }
  },
  
  mounted: function () {
    this.materialLowId = this.$route.query.id;
    if (this.materialLowId) {
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
        return '低值耗材结算单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '低值耗材结算单 - 查看';
      }
      if (this.pageFlag == 3) {
        return '低值耗材结算单 - 修订';
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
      this.$http.post("/api/engine/material/low/get", { materialLowId: this.materialLowId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
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
        materialLowId: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        billDate: '',//结算日期
        providerCode: '',//供应商
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        deptId: '',//部门
        deptName: '',//部门
        totalAmount: 0,// 金额合计
        remark: '',//   备注 
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
      form.billDate = page.formatDate(form.billDate);
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
        if (item.feeType != '') {
          if (item.amount == 0) {
            this.$Message.error(msg + '请录入金额');
            return;
          }
          form.detailList.push(item);
        }
      }

      // 提交
      this.loading = 1;
      var uri = '/api/engine/material/low/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/material/low/update';
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
      this.formItem.totalAmount=total;
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
