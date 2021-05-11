<template>
  <el-container style="height: 100vh;">
    <el-aside>
      <el-header><span>SONAGI</span></el-header>
      <div class="des" style="margin-top: 20px;">
        Overall, identifying the literary geography allowed me to discover new
        details and get a deeper understanding in the story.
        <br /><br />
        Here are some of my findings.
      </div>
    </el-aside>
    <el-container>
      <el-header class="black"
        ><span style="display: inline-block;">FINDINGS</span>
        <Nav />
      </el-header>
      <el-main>
        <img :width="myRightW " src="img/finding.png" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Nav from "../components/Nav.vue";

export default {
  name: "Map",
  props: {},
  components: {
    Nav,
  },
  data() {
    return {
      width: 1200, //window.innerWidth *0.7, // *0.7
      height: window.innerHeight - 200,
      myRightW: Number,
      leftW: 0,
    };
  },
  watch: {},
  created() {
    this.myRightW = this.width - this.leftW - 100;
  },
  unmounted() {},
  mounted() {},
  computed: {},
  updated() {},
  methods: {},
};
</script>

<style scoped>
.sideBtns {
  /* margin: 10px; */
  margin-left: 0;
}
el-button {
  padding: 2px;
}
.seg_rect {
  cursor: pointer;
}
.des {
  font: 13px "Roboto", sans-serif;
  margin: 0;
  border: 1px solid #ccc;
  padding: 10px;
}

.tooltip {
  font: 12px "Roboto", sans-serif;
}

.locationList {
  padding: 0;
  padding-bottom: 20px;
  margin-top: 10px;
  /* font-size: 0.8em; */
}

ul {
  /* cursor: pointer; */
}

li {
  font-size: 0.8em;
  display: block;
  margin: 0;
  padding: 4px;
  line-height: 1.1;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  color: black;
  list-style: none;
  font-weight: 400;
}
li > ul {
  font-size: 0.8em;
  margin: 5px;
  /* padding: 4px; */
  margin-left: 15px;
  /* background: #fff; */
  display: block;
  /* cursor: pointer; */
  font-weight: 100;
}

/*  Close Button; */
.close {
  position: absolute;
  right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
}
.close:hover {
  opacity: 1;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: " ";
  height: 33px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>

<style></style>
