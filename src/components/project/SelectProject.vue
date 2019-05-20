<template>
  <Modal
    v-model="display"
    title="选择工程"
    :closable="false"
    :mask-closable="false"
    width="800"
    class-name="ivu-modal-mask select_project"
    class="selproject"
    :transfer="transfer"
  >
    <div class="page">
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <Input
                v-model="queryForm.keyword"
                placeholder="编码、名称查询"
                @keyup.enter.native="query"
              ></Input>
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
export default {
  components: {
    Loading,
  },
  props: {
    transfer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    var that = this;
    return {
      columns: [
        {
          title: '选择',
          key: '_checked',
          width: 60,
          render: function (h, params) {
            var row = params.row;
            var index = params.index;
            var props = {
              value: row._checked,
            };
            return h('Checkbox', {
              props: props,
              on: {
                'on-change': () => {
                  that.innerCheckRow(index);
                }
              }
            });
          }
        },
        {
          title: '编码',
          key: 'projectCode',
          width: 120,
        },
        {
          title: '名称',
          key: 'name',
          align: 'left'
        },
        {
          title: '委托单位',
          key: 'customerCode',
          align: 'left',
        },
        {
          title: '联系人',
          key: 'linkMan',
          width: 80,
          align: 'center',
        }
      ],
      display: false,
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
      },
      selected: [],
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
      this.$http.post("/api/engine/project/list", this.queryParam).then((res) => {
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
        item._checked = index == i;
      }
    },
    reset: function () {
      Object.assign(this.queryForm, {
        keyword: '',
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
      var select = null;
      this.list.map((item) => {
        if (item._checked) {
          select = item;
        }
      });
      if (select == null) {
        this.$Message.error('请选择供应商');
        return;
      }
      this.display = false;
      this.options.ok(select);
    },
    onCancel() {
      this.display = false;
    }
  }
}

</script>

<style type="text/css">
.selproject .page {
  padding: 0px;
}
.selproject .page-searchbox {
  margin-top: 0px;
}
.selproject .status-2 {
  color: #ff6600;
}
.selproject .footer {
  text-align: right;
  padding-left: 10px;
}
.selproject .row-checked td {
  background-color: #e8f8fd;
  /*color:#20bfee;*/
  font-weight: bold;
}
.select_project {
  z-index: 10000;
}
</style>
