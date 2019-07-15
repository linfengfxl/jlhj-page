<template>
  <ListPage
    ref="page"
    title="分包结算表"
    api="/api/engine/project/bill/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审批中</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">作废</Radio>
            </RadioGroup>
          </td>
          <td>
            <Button @click="add" icon="plus">添加</Button>
          </td>
          <!-- <td class="page-tools">
            <UploadButton @on-upload="importExcel"></UploadButton>
          </td>
          <td>
            <Button @click="exportDownModel" type="info" icon="ios-download-outline">下载模板</Button>
          </td> -->
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
         <td>
            <Input v-model="queryForm.projectName"  placeholder="工程名称" @on-enter="query"/>
          </td> 
          <td>
            <Input v-model="queryForm.projectTeam"  placeholder="工程队伍" @on-enter="query"/>
          </td>
          <td>
            <Input
              v-model="queryForm.projectBillCode"
              placeholder="单据编号"
              @keyup.enter.native="query"
            ></Input>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="选择日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script> 
import ListPage from "@/components/page/ListPage";
import DataRowOperate from "@/components/commons/DataRowOperate";
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import UploadButton from '@/components/upload/UploadButton';
import UploadBox from '@/components/upload/Index';
import page from "@/assets/js/page";
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    ListPage,
    DataRowOperate,
    SelectProject,
    SelectProvider,
    UploadButton,
    UploadBox
  },
  data() {
    let that = this;
    return {
      columns: [
        {
          title: "操作",
          width: 90,
          fixed: 'left',
          align: "center",
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [
                  {
                    key: "edit",
                    disabled: row.status !== 3
                  }
                ]
              },
              on: {
                click: key => {
                  if (key == "edit") {
                    this.rowCommand("编辑", params);
                  }
                  if (key == "export") {
                    this.exportDown(row);
                  }
                }
              }
            });
          }
        },
        {
          title: "单据编号",
          key: "projectBillCode",
          width: 140,
          fixed: 'left',
          align: "center",
          render: (h, params) => {
            var row = params.row;
            var text = row.projectBillCode;
            text = text;
            return h(
              "a",
              {
                props: {},
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/project/bill/view?forward&inst=" + row.instId
                    });
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "工程名称",
          key: "projectName",
          minWidth: 120,
          align: "left"
        },
        {
          title: "工程队伍",
          key: "projectTeam",
          width: 120,
          align: "left"
        },
        page.table.initDateColumn({
          title: "日期",
          width: 120,
          key: "billDate",
          align: "left"
        }),
        {
          title: "合价合计",
          key: "totalAmount",
          width: 100,
          align: "center"
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          minWidth: 200,
          render:(h,params)=>{
            var row = params.row;
            return h(UploadBox,{
              props:{
                value:row.files,
                readonly:true
              }
            });
          }
        },
        {
          title: "备注",
          key: "remark",
          width: 150,
          align: "left"
        },
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          width: 100,
        }, 
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 160,
        },
      ],
      list: [],
      total: 0,
      queryParam: {}, // creatTime生成的格式放入
      queryForm: {
        status: 2,
        projectName: "", // 工程名称
        projectTeam: "", // 工程队伍
        projectBillCode: "", // 单据编号ID
        createTime: [] // 时间
      },
      loading: 0
    };
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      // 开始时间传入
      queryParam.createTimeStart = "";
      // 结束时间传入
      queryParam.createTimeEnd = "";
      // 删除复杂化的时间格式
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        // 将复杂的时间格式转化为年月日简单格式
        queryParam.createTimeStart = page.formatDate(
          this.queryForm.createTime[0]
        );
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(
          this.queryForm.createTime[1]
        );
      }
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
    reset() {
      // 清空条件
      Object.assign(this.queryForm, {
        status: this.queryForm.status,
        projectName: "", // 工程名称
        projectTeam: "", // 工程队伍
        projectBillCode: "", // 单据编号ID
        createTime: [] // 时间格式转换成简单格式
      });
      this.query();
    },
    rowCommand: function (name, params) {
      if (name === "编辑") {
        if (params.row) {
          this.$router.push({
            path: "/project/bill/start?forward&id=" + params.row.projectBillCode
          });
        }
      }
      if (name === "删除") {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>删除后不能恢复，确定删除已选择的记录吗？</p>",
          onOk: () => {
            this.$http
              .post("/api/engine/project/bill/delete", {
                projectBillCode: params.row.projectBillCode
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
                  $.extend(this.queryForm, this.queryParam);
                  this.query();
                } else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch(error => {
                this.$Message.error(error.toString());
              });
          }
        });
      }
    },
    //导出
    exportDown(row){
      this.loading = 1;         
      this.$http.post('/api/engine/project/bill/get', Object.assign({},row,{_action:'export'})).then((res) => {
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
    exportDownModel(){
      this.loading = 1;         
      this.$http.post('/api/engine/project/bill/get', {_action:'exportModel'}).then((res) => {
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
    //导入
    importExcel(fileId){
      this.$router.push({
        path: "/project/bill/start?forward&fileId="+fileId
      });
    },
    goBack: function () {
      this.$router.go(-1);
    },
    add: function () {
      this.$router.push({
        path: "/project/bill/start?forward"
      });
    }
  }
};
</script>

<style type="text/css">
</style>
