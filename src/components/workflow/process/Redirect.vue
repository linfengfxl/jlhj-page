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
       
      this.$http.post('/api/engine/workflow/form/getByDefine',{defineId:defineId}).then((res) => {
          if (res.data.code === 0) {
            var form = res.data.data;
            if(form == null){
              this.$Message.error('未知的流程定义 ' + defineId);
              this.$router.go(-1);
              return;
            }

            var url = '';
            
            if (action == 'handle') { 
              url = form.handleUrl;
            }

            if (action == 'restart') { 
              url = form.startUrl;
            } 

            if (action == 'view') { 
              url = form.viewUrl;        
            } 

            if (url) {
              url += '?forward&inst=' + instId;
              if(action == 'restart'){
                url += '&id=' + businessKey;
              }

              this.$router.replace({
                path: url
              })
            } else {
              this.$Message.error('表单未配置 url');
              this.$router.go(-1);
            }

          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
            this.$Message.error(error.toString())
        }) 
    },
  }
}

</script>

<style type="text/css">
 
</style>
