<template>
  <div class="page labor-edit">
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
                <FormItem prop="laborDate" label="日期">
                  <Date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="formItem.laborDate"
                    format="yyyy-MM-dd"
                  ></Date-picker>
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
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">明细</div> 
        <Editable
          ref="editable"
          :list="list"
          :editable="true" 
        ></Editable>
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
import pagejs from '@/assets/js/page'; 

import SelectProject from '@/components/page/form/SelectProject';


export default {
  components: {
    Loading,
    LayoutHor,
    Editable, 
    SelectProject, 

  },
  data() {
    return {
      loading: 0,
      laborId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        laborId: '',//
        laborDate:'',//
        deptId: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名 
        remark: '',//备注 
      },
      formRules: {
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        laborDate: [
          { required: true, message: '请选择日期', trigger: 'change', pattern: /.+/ }
        ],
      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.laborId = this.$route.query.id;
    if (this.laborId) {
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
        return '劳务用工登记 - 创建';
      }
      if (this.pageFlag == 2) {
        return '劳务用工登记 - 编辑';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/project/labor/get", { "laborId": this.laborId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
            this.list.map(p => {
              p.times = [p.startTime, p.endTime];
            });
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
          laborId: '',//
          laborDate:'',//
          deptId: '',//所属部门
          projectCode: '',//工程代码
          projectName: '',//工程名 
          remark: '',//备注 
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
      form.laborDate = page.formatDate(form.laborDate);

      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }

      form.detailList = [];
      var taiban = 0, useTime = 0;
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = '明细第 ' + (i + 1) + ' 行，';
        // if (item.startTime == '') {
        //   this.$Message.error(msg + '请选择时间');
        //   return;
        // }
        // if (item.endTime == '') {
        //   this.$Message.error(msg + '请选择时间');
        //   return;
        // }
        // if (item.taiban == 0) {
        //   this.$Message.error(msg + '请录入作业台班');
        //   return;
        // }
        // item['startTime'] = page.formatDateTime(item['startTime']);
        // item['endTime'] = page.formatDateTime(item['endTime']);
        form.detailList.push(item);
        // taiban = floatObj.add(item['taiban'], taiban);
        // useTime = floatObj.add(item['useTime'], useTime);
      } 
      debugger;
      console.log(form); 
      // 提交
      this.loading = 1;
      var uri = '/api/engine/project/labor/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/project/labor/update';
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
.labor-edit.page {
  width: 800px;
  margin: 0 auto;
  padding: 10px 20px;
  position: relative;
}
.labor-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.labor-edit .baseinfo {
}
.labor-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.labor-edit .baseinfo table {
  width: 100%;
}
.labor-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.labor-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.labor-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.labor-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.labor-edit .savebar .reset {
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

.labor-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
