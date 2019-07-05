<template>
  <Modal
    v-model="display"
    :title="title"
    :closable="false"
    :mask-closable="false"
    :transfer="transfer"
    :width="800"
    class="selmaterial"
    :model="model"
    :projectCode="projectCode"
  >
    <!-- 作业单号 -->
    <div class="page">
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <Input v-model="queryForm.machineName" placeholder="机械名称" @keyup.enter.native="query"></Input>
            </td>
            <td>
              <DatePicker
                type="daterange"
                v-model="queryForm.createTime"
                split-panels
                placeholder="时间"
                style="width: 180px"
                :clearable="true"
                ::transfer="true"
              ></DatePicker>
            </td>
            <td>
              <Button @click="query" type="primary" icon="ios-search">查询</Button>
            </td>
            <td>
              <Button @click="reset">重置</Button>
            </td>
          </tr>
        </table>
      </div>
      <Loading :loading="loading">
        <div class="page-datatable">
          <i-table
            :row-class-name="rowClassName"
            :columns="columns"
            @on-row-click="innerCheckRow(arguments[1])"
            @on-selection-change="select"
            :data="list"
          ></i-table>

          <div style="height:10px;"></div>

          <Page
            ref="pagebar"
            :total="total"
            size="small"
            :page-size-opts="[10,20,30,50,100]"
            @on-page-size-change="pageSizeChange"
            @on-change="pageChange"
            show-sizer
            placement="top"
            :transfer="false"
            show-total
            show-elevator
          ></Page>
        </div>
      </Loading>
    </div>
    <div slot="footer" class="footer">
      <Button @click="onOK" type="primary" icon="checkmark">确 定</Button>
      <Button @click="onCancel" type="default">取 消</Button>
    </div>
  </Modal>
</template>

<script> 
import Loading from '@/components/loading';
import page from '@/assets/js/page';
export default {
  components: {
    Loading
  },
  props: {
    transfer: {
      type: Boolean,
      default: true
    },
    model: {
      type: Object,
      default: null
    },
    projectCode: {
      type: Object,
      default: null
    }
  },
  data() {
    var that = this;
    return {
      title: "选择作业单",
      columns: [
        // {
        //   title: '选择',
        //   key: '_checked',
        //   width: 60,
        //   render: function (h, params) {
        //     var row = params.row;
        //     var index = params.index;
        //     var props = {
        //       value: row._checked,
        //     };
        //     if (row.status == "2") {
        //       props.disabled = true;
        //     }
        //     return h('Checkbox', {
        //       props: props,
        //       on: {
        //         'on-change': () => {
        //           that.innerCheckRow(index);
        //         }
        //       }
        //     });
        //   }
        // },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '单号',
          key: 'machineOrderId',
          width: 120,
        }, {
          title: '机械名称',
          key: 'machineName',
          width: 120,
        }, {
          title: '时间',
          key: 'startTime',
          width: 120,
        },
        {
          title: '作业时间',
          key: 'useTime',
          width: 120,
        }, {
          title: '作业台班',
          key: 'taiban',
          width: 120,
        },
        page.table.initDateColumn({
          title: '加油量',
          key: 'addFuel',
        }),
      ],
      display: false,
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        machineName: '',
        createTime: []
      },
      selected: [],
      selection: [],
      loading: 0,
      options: {
        type: 1
      },
    };
  },
  mounted: function () {
    this.query()
  },
  computed: {},
  methods: {
    load() {
      if (this.model != null) {
        this.title = "选择作业单 " + this.model.projectName + " / " + this.model.providerName + " / " + page.formatDate(this.model.billDate);
      }
      var pagebar = this.$refs.pagebar;
      this.loading = 1;
      this.queryParam.page = pagebar.currentPage;
      this.queryParam.pageSize = pagebar.currentPageSize;
      this.queryParam.type = this.options.type;
      this.queryParam.projectCode = this.projectCode;//传递的
      // this.queryParam.projectCode = this.model.projectCode;//传递的
      // this.queryParam.providerCode = this.model.providerCode;//传递的
      // this.queryParam.jobDate = page.formatDate(this.model.billDate);

      if (this.queryParam.createTime.length > 0) {
        this.queryParam.timeStart = page.formatDate(this.queryParam.createTime[0]);
      }
      if (this.queryParam.createTime.length > 1) {
        this.queryParam.timeEnd = page.formatDate(this.queryParam.createTime[1]);
      }
      this.$http.post('/api/engine/project/daily/selectMachineOrderList', this.queryParam).then((res) => {
        if (res.data.code === 0 && res.data.data != null) {
          this.loading = 0;
          var rows = res.data.data.rows;
          rows.map((item) => { item._checked = false; })
          this.list = rows;
          this.total = res.data.data.total;
          // 同步条件信息到表单
          $.extend(this.queryForm, this.queryParam);
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    refresh: function () {
      this.query();
      var pagebar = this.$refs.pagebar;
      pagebar.current = 1;
      pagebar.currentPage = 1;
      pagebar.currentPageSize = 10;
    },
    query: function () {
      $.extend(this.queryParam, this.queryForm);
      this.$refs.pagebar.currentPage = 1;
      this.load();
    },
    reset: function () {
      this.queryForm = {
        machineName: '',
        createTime: []
      }

      var pagebar = this.$refs.pagebar;
      pagebar.current = 1;
      pagebar.currentPage = 1;
      pagebar.currentPageSize = 10;

      this.query();
    },
    pageChange: function (page) {
      this.load();
    },
    pageSizeChange: function (pageSize) {
      var pagebar = this.$refs.pagebar;
      if (pagebar.currentPage === 1) {
        this.load();
      }
    },
    select: function (selection) {
      this.selection = selection;
    },
    innerCheckRow(index) {
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        item._checked = index == i && item.status != 2;
      }
    },
    reset: function () {
      Object.assign(this.queryForm, {
        keyword: ''
      });
      this.list = [];
      this.query();
    },
    rowClassName(row, index) {
      return row._checked ? 'row-checked' : '';
    },
    show(options) {
      Object.assign(this.options, {
        ok: (data) => { },
        cancel: () => { },
        type: 1,
      }, options);
      this.display = true;
      this.reset();
    },
    close() {
      this.display = false;
      this.options.cancel();
    },
    onOK() {
      // var select = null;
      // this.list.map((item) => {
      //   if (item._checked) {
      //     select = item;
      //   }
      // });
      // if (select == null) {
      //   this.$Message.error('请选择物料');
      //   return;
      // }
      // this.display = false;
      // this.options.ok(select);
      this.display = false;
      this.options.ok(this.selection);
    },
    onCancel() {
      this.display = false;
      this.options.cancel();
    }
  }
}
</script>

<style>
.selmaterial .page {
  padding: 0px;
}
.selmaterial .footer {
  text-align: center;
}
</style>

