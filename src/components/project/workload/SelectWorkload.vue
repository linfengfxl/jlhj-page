<template>
  <Modal
    v-model="display"
    title="选择"
    :closable="false"
    :mask-closable="false"
    width="800"
    class-name="ivu-modal-mask select_provider"
    class="selprovider"
    :transfer="transfer"
  >
    <div class="page">
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <Input v-model="queryForm.keyword" placeholder @keyup.enter.native="query"></Input>
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
            ref="table"
            :row-class-name="rowClassName"
            :columns="columns"
            @on-selection-change="select"
            :data="list"
          ></i-table>

          <div style="height:10px;"></div>

          <Page
            ref="pagebar"
            :total="total"
            size="small"
            @on-page-size-change="pageSizeChange"
            @on-change="pageChange"
            show-sizer
            placement="top"
            :transfer="true"
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
    Loading,
  },
  props: {
    transfer: {
      type: Boolean,
      default: true
    },
    projectCode: {
      type: String,
      default: ''
    },
  },
  data() {
    var that = this;
    return {
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
          title: '层级编码',
          key: 'levelCode',
          width: 100,
        },
        {
          title: '分步分项工程名称',
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
        })
      ],
      display: false,
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        industry: '',
        status: 1
      },
      industry: [],
      selected: [],
      selection: [],
      loading: 0,
      options: {}
    }
  },
  mounted: function () {
    this.query()
  },
  computed: {},
  methods: {
    load() {
      var pagebar = this.$refs.pagebar;
      this.loading = 1;
      this.queryParam.page = pagebar.currentPage;
      this.queryParam.pageSize = pagebar.currentPageSize;
      this.queryParam.projectCode = this.projectCode;
      this.$http.post("/api/engine/project/workload/list", this.queryParam).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.loading = 0;
          var list = res.data.data.rows;
          list.map((item) => { item._checked = false; });
          this.list = list;
          this.total = res.data.data.total;
          this.selection = [];
          // 同步条件信息到表单
          Object.assign(this.queryForm, this.queryParam);
        } else {
          this.loading = 0;
          this.list = null;
          this.total = 0;
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });
    },
    query: function () {
      Object.assign(this.queryParam, this.queryForm)
      this.load();
    },
    pageChange: function (page) {
      this.load();
    },
    pageSizeChange: function (pageSize) {
      var pagebar = this.$refs.pagebar;
      if (pagebar.currentPage == 1) {
        this.load();
      }
    },
    innerCheckRow(index) {
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        item._checked = index == i && item.status != 2;
      }
    },
    select: function (selection) {
      this.selection = selection;
    },
    reset: function () {
      Object.assign(this.queryForm, {
        keyword: '',
        industry: '',
        status: 1
      });

      var pagebar = this.$refs.pagebar;
      pagebar.current = 1;
      pagebar.currentPage = 1;
      pagebar.currentPageSize = 10;

      this.query();
    },
    rowClassName(row, index) {
      return row._checked ? 'row-checked' : '';
    },
    // 对外方法
    show(options) {
      Object.assign(this.options, {
        ok: (data) => { },
        cancel: () => { }
      }, options);
      this.display = true;
      this.reset();
    },
    close() {
      this.display = false;
    },
    onOK() {
      var selectList = this.$refs.table.getSelection();
      if (selectList.length == 0) {
        this.$Message.error('请选择');
        return;
      }
      // this.display = false;
      // this.options.ok(select);
      this.display = false;
      this.options.ok(selectList);
    },
    onCancel() {
      this.display = false;
    }
  }
}

</script>

<style type="text/css">
.selprovider .page {
  padding: 0px;
}
.selprovider .page-searchbox {
  margin-top: 0px;
}
.selprovider .status-2 {
  color: #ff6600;
}
.selprovider .footer {
  text-align: right;
  padding-left: 10px;
}
.selprovider .row-checked td {
  background-color: #e8f8fd;
  /*color:#20bfee;*/
  font-weight: bold;
}
.select_provider {
  z-index: 10000;
}
</style>
