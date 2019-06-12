<template>
  <HandleProcess
    ref="handleProcess"
    :instId="instId"
    :title="title"
    @on-load="instLoaded"
    @on-submit="save"
  >
    <div class="page instock-edit">
      <Loading :loading="loading">
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
                <col width="50%">
                <col width="50%">
              </colgroup>
              <tr>
                <td>
                  <FormItem label="本日进行" prop="">
                   {{formItem.dayWork}}
                  </FormItem>
                </td>
                <td>
                  <FormItem label="明日计划" prop="">
                    {{formItem.nextDayPlan}}
                  </FormItem>
                </td>
              </tr>
              <!-- <tr>
              <td colspan="2">
                <FormItem label="班前教育" prop></FormItem>
              </td>
              </tr>-->
            </table>
          </Form>
        </div>
        <div>
          <div class="subheader">完成工作项</div>
          <Editable ref="editable" :list="list" :editable="false" :projectCode="projectCode"></Editable>
        </div>
        <!-- <div>
        <div class="subheader">劳务用工登记</div>
        <Editable2 ref="editable" :list="list2" :editable="true" ></Editable2>
        </div>-->
        <!-- <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
        </table>-->
      </Loading>
    </div>
  </HandleProcess>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
//import Editable2 from './DetailEditable2';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelStorage from '@/components/storage/input/SelStorage';//仓库部门
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectMember from '@/components/page/form/SelectMember';//收料员
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';

import HandleProcess from '@/components/workflow/process/Handle';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    //Editable2,
    SelStorage,
    SelectProject,
    SelectMember,
    SelectProvider,
    HandleProcess
  },
  data() {
    return {
      loading: 0,
      instId:0,
      dailyId: '',
      projectCode: '',
      projectName: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        dailyId: '',//日报编号
        dayWork: '',//本日进行
        nextDayPlan: '',//明日计划   
      },
      formRules: {
        dayWork: [
          { required: true, whitespace: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', max: 200, message: '不能超过200个字', trigger: 'blur' }
        ],
        nextDayPlan: [
          { required: true, whitespace: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', max: 200, message: '不能超过200个字', trigger: 'blur' }
        ],
      },
      list: [],
      list2: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.instId = this.$route.query.inst;
  },
  computed: {
    pageTitle() {
      return '施工日报 - 明細';
    }
  },
  methods: {
    instLoaded(proc) {
      this.dailyId = proc.instance.businessKey;
      this.title = "施工日报_" + this.dailyId;
      this.load();
    },
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/project/daily/get", { dailyId: this.dailyId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
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
        dailyId: '',//日报编号
        dayWork: '',//本日进行
        nextDayPlan: '',//明日计划  
      });
      this.list = [];
    },
    save(proc) {
      var form = {
        detailList: []
      };
      Object.assign(form, this.formItem);
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
        if (item.workloadId != '') {
          // workloadPlan: 0,//今日计划工程量
          // workload: 0,//今日完成工程量 
          // actualWorkload: 0,//累计完成工程量 
          // actualPercent: 0,//累计完成工程比 
          // startPile: '',//起始桩号 
          // leftRight: '',//左右幅
          if (item.workloadPlan == 0) {
            this.$Message.error(msg + '请录入今日计划工程量');
            return;
          }
          if (item.workload == 0) {
            this.$Message.error(msg + '请录入今日完成工程量');
            return;
          }
          if (item.actualWorkload == 0) {
            this.$Message.error(msg + '请录入累计完成工程量');
            return;
          }
          if (item.actualPercent == 0) {
            this.$Message.error(msg + '请录入累计完成工程比');
            return;
          }
          form.detailList.push(item);
        }
      }
      if (form.detailList.length == 0) {
        this.$Message.error('请至少填写一项分部分项工程名');
        return;
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/project/daily/submit'; 

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
