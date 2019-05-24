<template>
  <ListPage
    ref="page"
    title="运输小票"
    api="/api/engine/transport/order/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
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
            <Input v-model="queryForm.keyword" placeholder="名称" @on-enter="query"/>
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
    <Edit ref="edit" @on-save="query"></Edit>
  </ListPage>
</template>
<script>    
import Edit from '@/components/transport/order/Edit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';

export default {
  components: {
    Edit,
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
          title: '单据编号',
          key: 'transportOrderId',
          width: 80,
          align: 'center'
        },
        {
          title: '运输日期',
          key: 'transportDate',
          width:80,
          align: 'left'
        },
        {
          title: '所属部门',
          key: 'deptId',
          width: 80,
          align: 'center'
        },
         {
          title: '工程名称',
          key: 'projectCode',
          width: 80,
          align: 'left',
        },
        {
          title: '供应商名称',
          key: 'providerCode',
          width: 80,
          align: 'left',
        },
        {
          title: '供应商联系人',
          key: 'providerCode',
          width: 100,
          align: 'center',
        },
        {
          title: '税率',
          key: 'taxRate',
          width: 60,
          align: 'center',
        },
         {
          title: '运输设备名称',
          key: 'transportType',
          width: 100,
          align: 'left',
        },
        {
          title: '运输时间',
          key: 'transportDate',
          width: 80,
          align: 'left',
        },
        {
          title: '车牌号',
          key: 'vehicleNum',
          width: 80,
          align: 'left',
        },
        {
          title: '数量',
          key: 'num',
          width: 60,
          align: 'center',
        },
         {
          title: '单位',
          key: 'unit',
          width: 60,
          align: 'center',
        },
        {
          title: '里程数',
          key: 'milage',
          width: 60,
          align: 'center',
        },
        {
          title: '含税单价',
          key: 'taxUnitPrice',
          width: 80,
          align: 'center',
        },
        {
          title: '扣款金额',
          key: 'deductAmount',
          width: 80,
          align: 'center',
        },
         {
          title: '金额',
          key: 'amount',
          width: 60,
          align: 'center',
        },
        {
          title: '税额',
          key: 'tax',
          width: 60,
          align: 'center',
        },
        {
          title: '价税合计',
          key: 'totalPriceTax',
          width: 80,
          align: 'center',
        },
        {
          title: '运输起点',
          key: 'transportStart',
          width: 80,
          align: 'left',
        },
         {
          title: '运输终点',
          key: 'transportEnd',
          width: 80,
          align: 'left',
        },
        {
          title: '抵达时间',
          key: 'arrivalTime',
          width: 80,
          align: 'left',
        },
        {
          title: '运输类别',
          key: 'transportType',
          width: 80,
          align: 'center',
        },
        {
          title: '运输内容',
          key: 'transportContent',
          width: 80,
          align: 'left',
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        page: '',
        pageSize: ''
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
    // goTab(index) {
    //   var pages = ['/admin', '/provider'];
    //   this.$router.push({ path: pages[index] });
    // },
    beforeLoad() {

    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.keyword = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    rowCommand: function (name, params) {
      if (name === '编辑') {
        this.updateRole(params.row.transportOrderId);
        return;
      }
      if (name === '删除') {
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.$http.post('/api/engine/transport/order/delete?id=' + params.row.id, {}).then((res) => {
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
      this.$refs.edit.open(0);
    },
    updateRole: function (roleId) {
      this.$refs.edit.open(roleId);
    },
  }
}

</script>

<style type="text/css">
</style>
