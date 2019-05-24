<template>
  <ListPage
    ref="page"
    title="审批流程定义"
    api="/api/engine/workflow/define"
    :model="this"
    :beforeLoad="beforeLoad"
    class="workflow-define"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input
              v-model="queryForm.keyword"
              placeholder="名称"
              style="width:150px"
              @on-enter="query"
            />
          </td>
          <td>
            <Button icon="ios-search" type="primary" @click="query">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
          <td>
            <Button @click="add" icon="plus">添加</Button> 
          </td>
        </tr>
      </table>
    </div>
    <div>
      <DefineEdit ref="editDefine" @on-save="load"></DefineEdit>       
    </div>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import DataRowOperateBar from '@/components/commons/DataRowOperateBar';
import Loading from '@/components/loading';
import DefineEdit from '@/components/workflow/define/DefineEdit';
//import SelectCategory from '@/components/material-category/SelectMaterialCategory';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';

export default {
  components: {
    DataRowOperateBar,
    Loading,
    DefineEdit,
    // SelectCategory,
    ListPage,
    DataRowOperate
  },
  props: {
  },
  data() {
    var that = this;
    return {
      loading: 0,
      totalCount: 0,
      timer: {},
      columns: [
        {
          title: '操作',
          width: 90,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                }]
              },
              on: {
                // 点击判断编辑或删除
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
          title: '流程名称',
          key: 'title',
          width: 200,
        },
        {
          title: '标题格式',
          key: 'instTitle',
          align: 'left',
          width: 200,
        },
        {
          title: '审批层级',
          key: 'nodeNames',
          align: 'left',
        } 
      ],
      list: [],
      queryParam: {

      },
      queryForm: {
        drawing: '',
        resourceType: '',
        containSub: 1,
        keyword: '',
      },
      selection: []
    }
  },
  mounted: function () {
    this.query();
  },
  computed: {
  },
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {

    },
    load() {
      this.$refs.page.load();
    },
    reset: function () {
      this.queryForm.keyword = '';
      this.query();
    },
    rowCommand: function (name, params) {
      if (name == '删除') {
        this.delete(params.row.id);
        return;
      }
      if (name == '编辑') {
        // 编辑row
        this.update(params.row);
        return;
      }
    },
    delete: function (id) {
      var that = this;
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除该条记录吗？</p>',
        onOk: () => {
          that.loading = 1;
          this.$http.post('/api/engine/material/delete?id=' + id, {}).then((res) => {
            if (res.data.code === 0) {
              that.loading = 0;
              this.$Message.success("删除成功");
              that.query();
            } else {
              this.loading = 0;
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        }
      });
    },
    add: function () {
      this.$refs.editDefine.open({ materCode: '', resourceType: this.queryForm.resourceType, code: this.queryForm.resourceType });
    },
    update: function (row) {
      // 打开DefineEdit组件
      this.$refs.editDefine.open(row);
    },
    save(item) {
      var url = '/api/engine/workflow/define/update';
      this.loading = 1;
      this.$http.post(url, item).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          this.$Message.success('保存成功');
          this.load();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
  }
}

</script>

<style type="text/css">
/*通用样式*/
.material-list .status-2 {
  color: #ff6600;
}
</style>

