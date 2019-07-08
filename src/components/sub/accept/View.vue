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
                <FormItem label="单据编号" prop="subAccepCode">
                  {{formItem.subAccepCode}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="projectCode" label="工程名称">
                  {{formItem.projectName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="验收时间" prop="acceptDate">
                  {{formItem.acceptDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="providerCode" label="供应商">
                  {{formItem.providerName}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="deptId" label="竣工组织部门">
                  {{formItem.deptName}}
                </FormItem>
            </td> 
             <td>
                <FormItem label="开工日期" prop="startDate">
                  {{formItem.startDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="竣工日期" prop="endDate">
                  {{formItem.endDate}}
                </FormItem>
              </td>
              <td>
                <FormItem label="要求整改时间" prop="rectificationDate">
                  {{formItem.rectificationDate}}
                </FormItem>
              </td>
              <td>
                <FormItem label="参加验收人员" prop="acceptPerson">
                  {{formItem.acceptPerson}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="验收内容" prop="acceptContent">
                  {{formItem.acceptContent}}
                </FormItem>
              </td>
              <td>
                <FormItem label="验收问题" prop="acceptProblem">
                  {{formItem.acceptProblem}}
                </FormItem>
              </td>
              <td>
                <FormItem label="备注" prop="remark">
                  {{formItem.remark}}
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
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
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import UploadBox from '@/components/upload/Index';
export default {
  components: {
    Loading,
    LayoutHor,
    SelectProject,
    UploadBox
  },
  data() {
    return {
      loading: 0,
      subAccepCode: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        subAccepCode: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        acceptDate:'',//验收时间
        providerCode:'',
        providerName:'',
        deptId:'',
        deptName:'',
        startDate: '',
        endDate:'',
        rectificationDate:'',
        acceptPerson:'',
        acceptContent:'',
        acceptProblem: '',
        remark: '', 
      },
      formRules: {
      },
      list: [],
      oriItem: {},
    }
  },
  
  mounted: function () {
    this.subAccepCode = this.$route.query.id;
    if (this.subAccepCode) {
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
        return '分包完工验收单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '分包完工验收单 - 查看';
      }
    }
  },
  methods: {
    load() { 
      this.loading = 1;
      this.$http.post("/api/engine/sub/accept/get", { subAccepCode: this.subAccepCode }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            if(res.data.data.startDate!=null){
              res.data.data.startDate = res.data.data.startDate.length>=10?res.data.data.startDate.substring(0,10):res.data.data.startDate; 
            }
            if(res.data.data.endDate!=null){
              res.data.data.endDate = res.data.data.endDate.length>=10?res.data.data.endDate.substring(0,10):res.data.data.endDate; 
            }
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
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
        subAccepCode: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        acceptDate:'',//验收时间
        providerCode:'',
        providerName:'',
        deptId:'',
        deptName:'',
        startDate: '',
        endDate:'',
        rectificationDate:'',
        acceptPerson:'',
        acceptContent:'',
        acceptProblem: '',
        remark: '', 
      });
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
