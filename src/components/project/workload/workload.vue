<template>
  <ListPage
    ref="page"
    title="工程量明细导入"
    api="/api/engine/project/workload/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      <a @click="goPage('/workload')">工程量导入</a>
      -&gt;工程量明细导入_{{name}}
    </div>
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Button @click="add" icon="plus">添加</Button>
          </td>
          <td>
            <UploadButton @on-upload="importExcel"></UploadButton>
          </td>
          <td>
            <Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button>
          </td>
          <td>
            <Button @click="exportDownModel" type="info" icon="ios-download-outline">下载模板</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.subProjectName" placeholder="名称" @on-enter="query" />
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
          <td>
            <Button @click="del" type="primary">删除</Button>
          </td>
          <td>&nbsp;</td>
          <td></td>
        </tr>
      </table>
    </div>
    <Edit ref="edit" @on-save="query"></Edit>
  </ListPage>
</template>
<script>    
import Edit from '@/components/project/workload/workloadEdit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import UploadButton from '@/components/upload/UploadButton';

export default {
  components: {
    Edit,
    ListPage,
    DataRowOperate,
    page,
    UploadButton
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          width: 50,
          type: 'index',
          align: 'center',
        },
        {
          title: '操作',
          width: 120,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',

                },
                {
                  key: 'delete',
                }]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("编辑", params);
                  }
                  if (key == "delete") {
                    this.rowCommand("删除", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '层级编码',
          key: 'levelCode',
          width: 100,
        },
        {
          title: '分部分项工程名称',
          key: 'subProjectName',
          width: 220,
        },
        {
          title: '设计工作量',
          key: 'designWorkload',
          align: 'left',
          minWidth: 150
        },
        {
          title: '复核工作量',
          key: 'reviewWorkload',
          align: 'center',
          width: 130,
        },
        page.table.initArgColumn({
          title: '单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        projectCode: '',
        subProjectName: '',
      },
      selection: [],
      name: '',
      loading: 0
    }
  },
  mounted: function () {
    this.queryForm.projectCode = this.$route.query.projectCode;
    this.name = this.$route.query.name;
    if (this.queryForm.projectCode) {
      this.query();
    } else {
      this.$Message.error("请选择工程");
      this.goBack();
    }

  },
  computed: {},
  methods: {
    beforeLoad() {

    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.subProjectName = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    del: function () {
      var selection = this.$refs.page.getSelection();
      if (selection.length == 0) {
        this.$Message.error('请选择要删除的数据行');
        return;
      }
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          var start = 0;
          var handle = () => {
            if (start >= selection.length) {
              return;
            }
            var item = selection[start];
            this.$http.post('/api/engine/project/workload/delete', { workloadId: item.workloadId }).then((res) => {
              if (res.data.code === 0) {
                start++;
                if (start < selection.length) {
                  handle();
                } else {
                  this.$Message.success("删除成功");
                  this.$refs.page.load();
                  this.query();
                }
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            });
          }
          handle();
        }
      });
    },
    rowCommand: function (name, params) {
      if (name === '编辑') {
        this.updateRole(params.row.workloadId);
        return;
      }
      if (name === '删除') {
        this.delConfirm(params.row.workloadId);
      }
    },
    delConfirm: function (id) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          this.$http.post('/api/engine/project/workload/delete', { workloadId: id }).then((res) => {
            if (res.data.code === 0) {
              this.$Message.success("删除成功");
              this.query();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.$Message.error(error.toString())
          });
        }
      });
    },
    goBack: function () {
      this.$router.go(-1);
    },
    goPage(path) {
      this.$router.push({ path: path })
    },
    add: function () {
      this.$refs.edit.openAdd(this.queryForm.projectCode);
    },
    updateRole: function (roleId) {
      this.$refs.edit.openEdit(roleId);
    },
    importExcel(fileId) {
      this.$http.post('/api/engine/project/workload/import', { projectCode: this.$route.query.projectCode, fileId: fileId }).then((res) => {
        if (res.data.code === 0) {
          this.$Message.success("导入成功, 添加:" + res.data.data.add + " 条, 更新:" + res.data.data.update + " 条");
          this.reset();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
    exportDown() {
      this.$refs.page.exportDown();
    },
    exportDownModel() {
      this.loading = 1;
      this.$http.post('/api/engine/project/workload/list', { _action: 'exportModel' }).then((res) => {
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
  }
}

</script>

<style type="text/css">
</style>
