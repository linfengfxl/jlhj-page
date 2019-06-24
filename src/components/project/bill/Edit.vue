<template>
  <StartProcess ref="startProcess" defineId="16" :loading="loading" :title="pageTitle" @on-submit="save">
        <div class="baseinfo">
          <div class="page-tools"></div>
          <Form
            ref="form"
            class="page-form"
            :model="formItem"
            :rules="formRules"
            :label-width="120"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                 <td>
                  <FormItem prop="projectCode" label="工程名称">
                    <SelectProject
                      v-model="formItem.projectCode"
                      :model="formItem"
                      :text="formItem.projectName"
                      @on-select="onQueryChange"
                    />
                  </FormItem>
                </td>
                 <td>
                  <FormItem prop="projectTeam" label="工程队伍">
                    <Input v-model="formItem.projectTeam"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="billDate" label="日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.billDate"
                      format="yyyy-MM-dd"
                    ></Date-picker>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="合价合计">
                    <Input v-model="formItem.totalAmount" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="计算">
                    <Input v-model="formItem.calcPeople"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="复核">
                    <Input v-model="formItem.reviewPeople" />
                  </FormItem>
                </td>
              </tr>
              <tr> 
                <td>
                  <FormItem prop label="审核">
                    <Input v-model="formItem.auditPeople"/>
                  </FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
        <div>
          <div class="subheader">成本分析明细</div>
          <Editable
            ref="editable"
            :list="list"
            :editable="true"
            @on-import="onImport"
            @on-amount-change="onAmountChange"
          ></Editable>
        </div>
  </StartProcess>
</template>
<script>
import Loading from "@/components/loading";
import LayoutHor from "@/components/layout/LayoutHor";
import Editable from "./DetailEditable";
import page from "@/assets/js/page";
import floatObj from "@/assets/js/floatObj";
import SelectProject from "@/components/page/form/SelectProject";
import StartProcess from "@/components/workflow/process/Start";
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    StartProcess
  },
  props: {
    api: {
      type: String,
      default: '/api/engine/project/quantity/listAll'
    },
  },
  data() {
    return {
      loading: 0,
      pageFlag: 1, //1.新建 2.编辑 3.修订
      formItem: this.getInitFormItem(),
      formRules: {
        projectCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择工程",
            trigger: "change"
          }
        ],
        projectTeam: [
          {
            required: true,
            whitespace: true,
            message: "工程队伍不能为空",
            trigger: "change"
          }
        ]
      },
      list: [],
      projectBillCode:'',
      oriItem: {},
    };
  },
  mounted: function () {
    this.projectBillCode = this.$route.query.id;
    if (this.projectBillCode) {
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
        return "工程结算表 - 创建";
      }
      if (this.pageFlag == 2) {
        return "工程结算表 - 编辑";
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http
        .post("/api/engine/project/bill/get", {
          projectBillCode: this.projectBillCode
        })
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            if (res.data.data) {
              this.oriItem = eval("(" + JSON.stringify(res.data.data) + ")");
              Object.assign(this.formItem, res.data.data);
              this.list = res.data.data.detailList;
              this.$nextTick(() => {
                this.list = res.data.data.detailList;
              })
            } else {
              this.$Message.error("订单不存在！");
              this.goBack();
            }
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error("操作失败！");
        });
    },
    initNew() {
      Object.assign(this.formItem, this.getInitFormItem());
      this.list = [];
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.billDate = page.formatDate(form.billDate);
      var pass = true;
      this.$refs.form.validate(valid => {
        pass = valid;
      });
      if (!pass) {
        this.$Message.error("验证未通过！");
        return;
      }
      form.detailList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = "明细第 " + (i + 1) + " 行，";
        if (item.levelCode == ''||item.levelCode == null) {
          this.$Message.error(msg + '层级编码不能为空');
          return;
        }
        if(item.settlePrice==''||item.settlePrice==null||item.settlePrice==0){
          this.$Message.error(msg + '结算价格不能为空');
          return;
        }
        form.detailList.push(item);
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = "/api/engine/project/bill/add ";
      if (this.pageFlag == 2) {
        uri = "/api/engine/project/bill/update ";
      }
      this.$http
        .post(uri, form)
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            this.$Message.success("操作成功！");
            this.goBack();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新操作");
        });
    },
    // 初始化表单数据
    getInitFormItem() {
      var obj = {
        projectBillCode: "", 
        projectCode: "", 
        projectName: "", 
        projectTime: "", 
        billDate: "",   
        totalAmount: 0, 
        calcPeople: "",
        reviewPeople: "", 
        auditPeople: "", 
        status: 0 //  审批状态
      };
      return obj;
    },
    onAmountChange(total) {
      this.formItem.totalAmount = total.totalAmount;
    },
    // 对运输结算单进行新增前判断,通过后获取列表
    onImport() {
      if (this.formItem.projectCode == "") {
        this.$Message.error("请选择工程");
        return;
      }
      var param = {};
      param.projectCode = this.formItem.projectCode;
      this.$http.post(this.api, param).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.loading = 0;
          var data = res.data.data;
          res.data.data.rows.map((item)=>{
            item.workload=item.reviewWorkload;
            item.settlePrice=0;
            item.amount=0;
            item.priceUnit='元/'+item.unit;
          })
          this.list = data.rows;
          if (this.list.length == 0) {
            this.$Message.error("抱歉，没有找到对应数据");
          } else {
            this.$Message.success("共查询" + this.list.length + "条数据");
          }
        } else {
          this.loading = 0;
          this.list = [];
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });

    },
    onQueryChange() {
      this.list = [];
      this.onImport();
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
    }
  }
};
</script>

<style type="text/css">
.instock-edit.page {
  width: 1000px;
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
