<template id="app">
  <router-view></router-view>
</template>

<script>

  export default {
    name: 'app',
    mounted: function(){
      const that = this;
      window.onresize = function () {
        that.$winHeight = window.innerHeight;
      };
      let oemData = this.$ls.get(this.$webConfig.oemData);
      if(oemData&&oemData.pc_back_icon){
        document.getElementById('__favicon').href=oemData.pc_back_icon;
      }
    }
  }
</script>