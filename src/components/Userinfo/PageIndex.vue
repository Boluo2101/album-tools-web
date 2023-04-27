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
  bottom: 60px;
  left: 50px;
  z-index: 1000;
  box-shadow: @BoxShadow;
  background-color: @DarkBoxBackgroundColor;
  min-width: 200px;
  min-height: 300px;
  border-radius: @BorderRadius;
}
</style>