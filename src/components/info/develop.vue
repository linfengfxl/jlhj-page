<template>
  <div class="page develop">
    <div class="page-title">
      页面开发中
    </div>

     <Card class="content">
        <p slot="title">{{title}}</p>
        <img src="@/assets/img/face01.png" />
        <div class="title">页面开发中 ...</div>
     </Card>
  </div>
</template>
<script>

  export default {
    components: { 
    },
    data() {       
      return {
         title:'标题'
      }
    },
    mounted: function () {
      this.load();
    },
    computed: {},
    methods: {
      load(){
        this.title = this.$route.query.title || '标题';
      }
    }
  }

</script>

<style type="text/css">
  .develop .content{
    position: absolute;
    top:50%;
    left:50%;
    width: 400px;
    margin-left: -150px;
    margin-top: -150px;
  }
  .develop .content img{
    float: left;
  }
  .develop .content .title{
    font-size: 28px;
    color:#999;    
    line-height: 100px;
    height: 100px; 
  }
</style>
