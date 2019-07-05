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
                <FormItem label="单据编号" prop="subPlanId">
                  {{formItem.subPlanId}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="projectCode" label="工程名称">
                  {{formItem.projectName}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="subType" label="分包类型">
                  {{formItem.subType}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="levelCode" label="分包项目">
                  {{formItem.subProjectNames}}
                </FormItem>
              </td>
              <td>
                <FormItem label="分包进场日期" prop="entryDate">
                  {{formItem.entryDate}}
                </FormItem>
              </td>
              <td>
                <FormItem label="分包退场日期" prop="exitDate">
                  {{formItem.exitDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
               <td>
                <FormItem label="工期" prop="duration"> 
                   {{formItem.duration}}
                </FormItem>
              </td>
              <td colspan="2">
                <FormItem label="分包原因" prop="reason">
                  {{formItem.reason}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem prop="files" label="附件">
                  <UploadBox v-model="formItem.files" :readonly="true"></UploadBox>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="数量合计" prop="planWorkload">
                  {{formItem.planWorkload}}
                </FormItem>
              </td>
              <td>
                <FormItem label="金额合计" prop="amount">
                  {{formItem.amount}}
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>
        <Editable ref="editable" :list="list" :editable="false" :model="formItem"></Editable>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="goBack" v-if="pageFlag<=2">确定</td>
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
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import UploadBox from '@/components/upload/Index';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    UploadBox
  },
  data() {
    return {
      loading: 0,
      subPlanId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        subPlanId: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subType: '',//分包类型
        levelCode:'',
        subProjectName:'',
        entryDate:'',
        exitDate:'',
        duration: 0,
        reason: '',
        files: '',
        planWorkload: 0,
        amount: 0,   
      },
      formRules: {
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
    this.subPlanId = this.$route.query.id;
    if (this.subPlanId) {
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
        return '分包需求计划 - 创建';
      }
      if (this.pageFlag == 2) {
        return '分包需求计划 - 查看';
      }
    }
  },
  methods: {
    load() { 
      this.loading = 1;
      this.$http.post("/api/engine/sub/plan/get", { subPlanId: this.subPlanId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            if(res.data.data.entryDate!=null){
              res.data.data.entryDate = res.data.data.entryDate.length>=10?res.data.data.entryDate.substring(0,10):res.data.data.entryDate; 
            }
            if(res.data.data.exitDate!=null){
              res.data.data.exitDate = res.data.data.exitDate.length>=10?res.data.data.exitDate.substring(0,10):res.data.data.exitDate; 
            }
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
          } else {
            this.$Message.error('单据不存在！');
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
        subPlanId: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subType: '',//分包类型
        levelCode:'',
        subProjectName:'',
        entryDate:'',
        exitDate:'',
        duration: 0,
        reason: '',
        files: '',
        planWorkload: 0,
        amount: 0,   
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
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
