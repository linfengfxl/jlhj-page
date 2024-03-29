<template>
  <Modal
    v-model="display"
    title="选择物料"
    :closable="false"
    :mask-closable="false"
    :transfer="transfer"
    :width="800"
    class="selmaterial"
  >
    <div class="page">
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <Input
                v-model="queryForm.keyword"
                placeholder="物料编码/名称/图号"
                style="width:200px;"
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
            if (row.status == "2") {
              props.disabled = true;
            }
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
          title: '物料编码',
          key: 'materCode',
          align: 'left',
          width: 120
        },
        {
          title: '物料名称',
          key: 'materName',
          align: 'left',
          render: (h, params) => {
            var row = params.row;
            var title = row.materName;
            if (row.type == '2') {
              title =
                [row.materName, '    ', '【',
                row.customerName, ' - ', row.drawing, '】'].join('');
            }
            return h('span', {}, title);
          }
        },
        {
          title: '规格型号',
          key: 'spec',
          align: 'left',
          width: 60
        },
        page.table.initArgColumn({
          title: '计量单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
        page.table.initArgColumn({
          title: '资源类别',
          key: 'resourceType',
          align: 'center',
          group: 'material_type',
          width: 100
        }),
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 60,
          render: (h, params) => {
            var status = params.row.status;
            var setButton = "正常";
            if (status == 2) {
              setButton = "禁用";
            }
            return h('span', { class: 'status-' + status }, setButton);
          }
        },
      ],
      display: false,
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        status: 1
      },
      selected: [],
      loading: 0,
      options: {
        type: 1
      }
    };
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
      this.queryParam.type = this.options.type;
      this.$http.post('/api/engine/material/list', this.queryParam).then((res) => {
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
        materId: '',
        drawing: '',
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
      var select = null;
      this.list.map((item) => {
        if (item._checked) {
          select = item;
        }
      });
      if (select == null) {
        this.$Message.error('请选择物料');
        return;
      }
      this.display = false;
      this.options.ok(select);
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

