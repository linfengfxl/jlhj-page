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
                  <FormItem prop="projectCode" label="工程名称">
                    {{formItem.projectName}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="projectTeam" label="计量金额合计">
                    {{formItem.totalMeteringAmount}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="projectTeam" label="批复金额合计">
                    {{formItem.totalReplyAmount}}
                  </FormItem>
                </td>
              </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">计量表明细</div>
        <Editable ref="editable" :list="list"  :editable="true" :model="formItem" @on-import="onImport"
              @on-amount-change="onAmountChange"></Editable>
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
import Loading from "@/components/loading";
import LayoutHor from "@/components/layout/LayoutHor";
import Editable from "./DetailEditable";
import page from "@/assets/js/page";
import floatObj from "@/assets/js/floatObj";
import SelectProject from "@/components/page/form/SelectProject";
import UploadBox from '@/components/upload/Index';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    UploadBox
  },
  props: {
    api: {
      type: String,
      default: '/api/engine/project/metering/list'
    },
  },
  data() {
    return {
      loading: 0,
      pageFlag: 1, //1.新建 2.编辑 3.修订
      formItem:{
        projectCode: "", 
        projectName: "", 
        totalMeteringAmount: 0, 
        totalReplyAmount: 0,   
      },
      formRules: {
      },
      list: [],
      ExcelList: [],
      fileId:'',//导入文件id
      click:'',
      oriItem: {},
    };
  },
  mounted: function () {
    this.formItem.projectCode = this.$route.query.projectCode;
    this.formItem.projectName = this.$route.query.projectName;
    this.click = this.$route.query.click;
    if (this.click=="edit") {
      this.pageFlag = 2;
      this.initNew();
    } else {
      this.pageFlag = 1;
      this.initNew();
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return "工程计量汇总表 - 创建";
      }
      if (this.pageFlag == 2) {
        return "工程计量汇总表 - 编辑";
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http
        .post("/api/engine/project/metering/list", {
          projectCode: this.formItem.projectCode
        })
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            if (res.data.data) {
              this.list = res.data.data.rows;
              this.$nextTick(() => {
                this.list = res.data.data.rows;
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
      this.onImport();
    },
    save(proc) {
      var pass = true;
      this.$refs.form.validate(valid => {
        pass = valid;
      });
      if (!pass) {
        this.$Message.error("验证未通过！");
        return;
      }
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = "明细第 " + (i + 1) + " 行，";
        if (item.meteringDate == ''||item.meteringDate == null) {
          this.$Message.error(msg + '日期不能为空');
          return;
        }
        if(item.meteringAmount==''||item.meteringAmount==null){
          this.$Message.error(msg + '计量金额不能为空');
          return;
        }
      }

      // 提交
      this.loading = 1;
      var uri = "/api/engine/project/metering/add ";
      if (this.pageFlag == 2) {
        uri = "/api/engine/project/metering/update ";
      }
      var that =this;
      this.$Modal.confirm({
          title: "保存确认",
          content: "<p>确定保存吗？</p>",
          onOk: () => {
           var bool=true;
            for (var i = 0; i < this.list.length; i++) {
              var item = this.list[i];
              if(item.id!=null){
                uri = "/api/engine/project/metering/update ";
              }else{
                uri = "/api/engine/project/metering/add ";
              }
              item.meteringDate = page.formatDate(item.meteringDate);
              this.$http.post(uri, item).then(res => {
                this.loading = 0;
                if (res.data.code == 0) {
                } else {
                  bool=false;
                  this.$Message.error(res.data.message);
                }
              })
              .catch(error => {
                bool=false;
                this.loading = 0;
                this.$Message.error("请求失败，请重新操作");
              });
            }
            if(bool){
              this.$Message.success("操作成功");
              this.goBack();
            }
          }
        });
      this.loading = 0;         
    },
    onAmountChange(total) {
      this.formItem.totalMeteringAmount = total.totalMeteringAmount;
      this.formItem.totalReplyAmount = total.totalReplyAmount;
    },
    // 对汇总表进行新增前判断,通过后获取列表
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
          this.list = res.data.data.rows;
          if (this.list.length == 0) {
            this.list = [];
            this.list.push(this.$refs.editable.listNewRow());
            this.list.push(this.$refs.editable.listNewRow());
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
        this.list = [];
        this.onImport();
      }
    },
    goBack() {
      this.$router.go(-1);
    },
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
