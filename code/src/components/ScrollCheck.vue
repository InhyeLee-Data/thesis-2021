<template>
  <div class="ScrollCheck centerContainer">
    <div>REFERENCE: Scroll-Y is {{ scrollPosition }}</div>
  </div>
</template>

<script>
export default {
  name: "ScrollCheck",
  data() {
    // sections: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  },
  props: { 
    scrollPosition: Number,
  },
  computed: {
    scrollBlock() {
      return Math.floor(this.scrollPosition / 100);
    },
  },
};
</script>

<style>
.ScrollCheck {
  position: fixed;
  top: 25vh;
  left: 25vw;
  width: 50vw;
  opacity: 1;
  color: black;
  border: 1px solid #dddddd;
  background: green;
  padding: 10px;
  opacity: 0;
}

@keyframes morph {
  0%   {top: 0px; left: 0px; background: pink;}
  50%  {top: 0px; left: 5px; background: lightgray; opacity: 1}
  100% {top: 0px; left: 0px; background: pink;}
}
</style>
