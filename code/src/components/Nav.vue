<template>
   <div class="right">
        <el-dropdown>
            <span class="el-dropdown-link Basic Black">    <i class="el-icon-more"></i>
                <i class="el-icon-arrow-down el-icon--right Basic Black"></i>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item class="Basic Black"><router-link to="intro">Intro</router-link></el-dropdown-item>
                <el-dropdown-item class="Basic Black"><router-link to="combinedview">Locations in Text</router-link></el-dropdown-item>
                <el-dropdown-item class="Basic Black"><router-link to="map">Map</router-link></el-dropdown-item>
                <el-dropdown-item class="Basic Black"><router-link to="findings">Findings</router-link></el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
        </div>
</template>

<script>
export default {
  name: "Nav",
  data() {
  },
  props: { 
  },
  computed: {
  },
};
</script>

<style>

</style>
