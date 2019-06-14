<template>
  <ListPage
    ref="page"
    title="机械作业单"
    api="/api/engine/machine/order/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审核中</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">作废</Radio>
            </RadioGroup>
          </td>
          <td>
            <Button @click="add" icon="plus">添加</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
              <td>
            <Input v-model="queryForm.machineOrderId" placeholder="单号" @keyup.enter.native="query"></Input>
          </td>
          </td>
          <td>
            <Input v-model="queryForm.keyword" placeholder="供应商、工程" @on-enter="query"/>
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
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
export default {
  components: {
    ListPage,
    DataRowOperate,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        /*
        {
          type: 'selection',
          width: 50,
          align: 'center',
          render: function (h,params) {
            if(params.row.roleId === 1){
              params.row._disabled = true
            }
          }
        },*/
        {
          title: '操作',
          width: 90,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  disabled: row.status != 3
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
        }, {
          title: '单号',
          key: 'machineOrderId',
          width: 140,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            var text = row.machineOrderId;
            text = text;
            return h('a', {
              props: {

              },
              on: {
                click: () => {
                    this.$router.push({ path: '/machine/order/view?forward&inst=' + row.instId }); 
                }
              }
            }, text);
          }
        }, {
          title: '部门',
          key: 'deptName',
          width: 120,
        },
        {
          title: '工程名称',
          key: 'projectName',
          minwidth: 140,
        }, {
          title: '供应商',
          key: 'providerName',
          minwidth: 120,
        },
        {
          title: '机械名称',
          key: 'machineName',
          width: 120,
        },
        page.table.initDateColumn({
          title: '作业时间',
          key: 'jobDate',
        }),
        page.table.initMapColumn({
          title: '来源',
          key: 'source',
          width: 80,
          data: {
            '1': 'PC端',
            '2': 'APP',
          },  
        }),
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
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        machineOrderId:'',
        page: '',
        pageSize: '',
        status: 2,
      },
      selection: [],
      loading: 0
    }
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
    goTab(index) {
      var pages = ['/admin', '/machine'];
      this.$router.push({ path: pages[index] });
    },
    beforeLoad() {

    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.keyword = '';
      this.queryForm.machineOrderId = ''; 
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    rowCommand: function (name, params) {
      if (name === '编辑') {
        if (params.row) {
          this.$router.push({
            path: '/machine/order/start?forward&id=' + params.row.machineOrderId
          })
        }
      }
      if (name === '删除') {
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.$http.post('/api/engine/machine/order/delete', { 'machineOrderId': params.row.machineOrderId }).then((res) => {
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                $.extend(this.queryForm, this.queryParam);
                this.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.$Message.error(error.toString())
            });
          }
        });
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    add: function () {
      this.$router.push({ path: '/machine/order/start?forward' })
    },
  }
}

</script>

<style type="text/css">
</style>
