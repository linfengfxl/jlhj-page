<template>
  <div class="page">页面跳转中...</div>
</template>
<script>

export default {
  components: {
  },
  data() {
    return {

    }
  },
  mounted: function () {
    this.goRedirect();
  },
  computed: {},
  methods: {
    goRedirect() {
      var action = this.$route.query.do;
      var instId = this.$route.query.inst;
      var defineId = this.$route.query.define;
      var businessKey = this.$route.query.businessKey;

      var url = '';
      if (action == 'handle') {
        if (defineId == 1) {//报销单
          url = '/financial/expense/handle?forward&inst=' + instId
        }
        if (defineId == 2) {//入库单
          url = '/storage/instock/handle?forward&inst=' + instId
        }
        if (defineId == 4) {//付款计划
          url = '/financial/payplan/handle?forward&inst=' + instId
        }
        if (defineId == 5) {//机械租赁结算单
          url = '/machine/bill/handle?forward&inst=' + instId
        }
        if (defineId == 6) {//运输结算单
          url = '/transport/bill/handle?forward&inst=' + instId
        }
      }

      if (action == 'view') {
        if (defineId == 1) {//报销单
          url = '/financial/expense/view?forward&inst=' + instId
        }

        if (defineId == 6) {//运输结算单
          url = '/transport/bill/view?forward&inst=' + instId

        if (defineId == 4) {//付款计划
          url = '/financial/payplan/view?forward&inst=' + instId
        }

        if (defineId == 4) {//付款计划
          url = '/financial/payplan/view?forward&inst=' + instId
        }
      }
      
      if (url) {
        this.$router.replace({
          path: url
        })
      } else {
        this.$Message.error('未知的类型');
        this.$router.go(-1);
      }
    }
    },
    loadProcess: function () {
      this.loading = 1;
      this.$http.get('/api/engine/workflow/instance/get?id=' + this.instId).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          if (data) {
            Object.assign(this.instance, data);
            this.formItem.instId = data.id;

            this.nextNodes = [];
            var nodeList = this.instance.nodeList;
            for (var i = 0; i <= this.instance.cur + 1; i++) {
              if (i < nodeList.length) {
                var node = nodeList[i];
                this.nextNodes.push({ index: i, key: node.key, text: node.text });
              }
            }
            if (this.instance.cur + 1 >= nodeList.length) {
              this.nextNodes.push({ index: nodeList.length, key: '--', text: '结束' });
            }

            this.formItem.nextCur = this.instance.cur + 1;
            this.selNextNode();

          } else {
            this.$Message.info("流程实例不存在！");
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.toString())
      })
    }
  }
}

</script>

<style type="text/css">
.wfprocess {
  height: 100%;
  overflow: hidden;
  padding-top: 42px;
}
.wfprocess-header {
  height: 42px;
  padding-left: 10px;
  line-height: 42px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  margin-top: -42px;
  background-color: #f9fafb;
  text-align: center;
}
.wfprocess-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.wfprocess-bill {
  max-width: 1000px;
  min-width: 600px;
  margin: 0px auto;
  padding: 15px 10px 195px 15px;
}
.wfprocess-footer {
  height: auto;
  width: 100%;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.wfprocess-footer-body {
  padding: 4px 10px;
  font-size: 14px;
  max-width: 1000px;
  min-width: 600px;
  margin: 0px auto;
}

.wfprocess-footer td {
  padding: 4px;
}

.wfprocess-footer .nodes li {
  display: block;
  padding: 4px 8px;
  border: 1px solid #eee;
  border-radius: 3px;
  float: left;
  margin-right: 10px;
}
.wfprocess-footer .label {
  width: 70px;
  text-align: right;
  padding-right: 10px;
}
</style>
