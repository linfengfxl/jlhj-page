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
              <col width="33%" />
              <col width="auto" />
              <col width="33%" />
            </colgroup>
            <tr>
              <td>
                <FormItem prop="deptId" label="仓库">
                  <SelStorage v-model="formItem.deptId" :model="formItem"></SelStorage>
                </FormItem>
              </td>
              <td>
                <FormItem prop="year" label="年度">
                  <Date-picker type="year" placeholder="选择日期" v-model="formItem.year"></Date-picker>
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
        <div class="subheader">单据明细</div>
        <div class="page-tools">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td class="page-tools" v-if="formItem.deptId"> 
                 <UploadButton  @on-upload="importExcel"></UploadButton>
              </td>
              <td v-if="formItem.deptId">
                <Button @click="exportDownModel" type="info" icon="ios-download-outline">下载模板</Button>
              </td>
            </tr>
          </table>
        </div>
        <div style="height:5px;"></div>
        <Alert v-if="!formItem.deptId">请选择仓库</Alert>
        <Editable
          ref="editable"
          :list="list"
          :editable="true"
          :style="{display: formItem.deptId?'':'none'}"
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
import SelStorage from '@/components/storage/input/SelStorage';//仓库部门
import SelectProject from "@/components/page/form/SelectProject";
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import pagejs from '@/assets/js/page';
import UploadButton from '@/components/upload/UploadButton';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelectProject,
    UploadButton
  },
  data() {
    return {
      loading: 0,
      inventoryCode: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        inventoryCode: '',// 
        deptId: '',//所属部门 
        year: '',
        projectCode: '',
        projectName: ''
      },
      formRules: {
        deptId: [
          { required: true, whitespace: true, message: '请选择仓库', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请选择年度', trigger: 'change', pattern: /.+/ }
        ],
        projectCode: [
          { required: true, message: '请选择工程名称', trigger: 'change', pattern: /.+/ }
        ],
      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.formItem.inventoryCode = this.$route.query.inventoryCode;
    if (this.formItem.inventoryCode) {
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
        return '期初库存 - 创建';
      }
      if (this.pageFlag == 2) {
        return '期初库存 - 编辑';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/material/inventory/getInventoryCodeByList?inventoryCode=" + this.formItem.inventoryCode).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            console.log(res.data.data);
            Object.assign(this.formItem, res.data.data.detailList[0]);
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
    importExcel(fileId) {
      var that = this;
      this.$http.post('/api/engine/material/inventory/import', { fileId: fileId }).then((res) => {
        if (res.data.code === 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            var item = res.data.data[i];
            var it = {
              materCode: item["材料编码"],
              materName: item["材料名称"],
              spec: item["规格型号"],
              unit: item["单位"],
              quantity: item["数量"]//数量
            }
            if (_.findIndex(that.list, { 'materCode': it.materCode }) >= 0) {
              continue;
            }
            that.list.push(it);
          }
          this.$Message.success("导入成功, 添加:" + res.data.data.length + "条");

        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
    exportDownModel(){
      this.loading = 1;         
      this.$http.post('/api/engine/material/inventory/import', {_action:'exportModel'}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) { 
          this.loading = 0;
          var data = res.data.data;
          window.open(this.$http.defaults.baseURL + '/api/file/download?fileId=' + data);
        } else {
          this.loading = 0;             
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });
    },
    initNew() {
      Object.assign(this.formItem, {
        inventoryCode: '',//
        year: '',//
        deptId: '',//所属部门 
        remark: '',//备注 
      });
      this.list = [];
    },
    save() {
      var form = {
        detailList: []
      };
      Object.assign(form, this.formItem);
      form.year = page.formatDateYear(form.year);

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
          form.detailList.push(item);
        }
      }
      // 提交
      this.loading = 1;
      var uri = '/api/engine/material/inventory/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/material/inventory/update';
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
</style>
