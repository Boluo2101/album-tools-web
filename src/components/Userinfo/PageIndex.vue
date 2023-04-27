<script setup>
// Vues
import { ref, reactive, watch, onMounted, computed } from "vue"

</script>

<template>
  <div class="userinfo">

  </div>
</template>

<style lang="less" scoped>
.userinfo {
  position: fixed; 
  bottom: 40px;
  left: 0px;
  z-index: 1000;
  box-shadow: @BoxShadow;
  background-color: #fff;
  min-width: 200px;
  min-height: 200px;
}
</style>