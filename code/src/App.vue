<template>
  <router-view />
  <!-- <ScrollCheck :scrollPosition="scrollTop" :sections="sections"/> -->
</template>

<script>

export default {
  name: "App",
  data() {
    //variables ??;
    return {
      scrollTop: 0,
    };
  },
  components: {
    // ScrollCheck // HELPER
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onScroll);
  },
  computed: {},
  methods: {
    onScroll(/*event*/) {
      this.scrollTop = window.scrollY;
    },
  },
};
</script>

<style>
body {
  font-family: "Roboto", serif;
}
#app {
  padding: 0; margin:0;
}

.right {
  float: right;
}

.el-dropdown-link {
  color: #699B7F;
}

.el-dropdown__popper, .el-popper .is-light .is-pure {
  color: #699B7F;
}

.el-dropdown-menu__item {
  padding: 20px 0;
}

.el-dropdown-menu__item a, .el-dropdown-menu__item a:hover, .el-dropdown-menu__item a:visited {
  /* color: inherit; */
  color: #000;
  text-decoration: none;
  font-size: 15px;
}

.el-dropdown-link {
    cursor: pointer;
    /* color: #409EFF; */
    color: #000;
  }

.el-icon-arrow-down {
    font-size: 15px;
  }

.el-container {
  padding: 0 20px;
  margin-top: 5px;

}
.el-aside {
  padding: 0 20px;
  margin-top: 5px;
}
.el-main {
  padding-bottom: 0;
  width: 80vw;
}
.el-header {
  padding: 0;
  margin: 0;
  font-family: "Montserrat", sans-serif;
  /* font-size: 2vw; */
  font-size: 35px;
  color: #58d99b;
  border-top: 5px solid #58d99b;
  border-bottom: 5px solid #58d99b;
  display: block;
}
.el-header.black {
  color: #263a36;
  border-top: 5px solid #263a36;
  border-bottom: 5px solid #263a36;
}
.el-header span {
  vertical-align: middle;
  text-align: left;
}

/* 1, 학교 School */
.school,
.pathFromSchool,
.schoolPlayground,
.school5thGradeClass {
  background: #54bdc5;
}

/* 2. 개울 Creek */
.creek,
.creekEdge,
.creekBank,
.steppingStone {
  background-color: #4d4acb;
  color: #fff;
}

/*  3. 갈밭 Field of Grass Reeds */
.reedsField,
.reedsFieldPath,
.reedsTallest {
  background-color: #dc8b39;
}

/*  4. Buckwheatield */
.buckWheatField {
  background-color: #c9458d;
}

/*  5. fork */
.fork,
.lowerPath,
.upperPath {
  background-color: #8e8cf3;
}

/*  6. Seodanggol near Girls Home */
.girlsHouse,
.seodanggol {
  background-color: #78de7b;
}

/* 7. Boys Home. Near There */
.boysHouse,
.walnutField,
.pathFromWalnutField,
.ricePaddyByBoysHome
.shade,
.barn {
  background-color: #3e81e4;
  color: #fff;
}

/*  8. Ricefield */
.ricePaddy,
.pathThroughRicePaddy,
.scarecrow,
.firstScarecrow,
.secondScarecrow,
.ditch {
  background-color: #6740ab;
  color: #fff;
}

/* 9. fields */
.field,
.lookoutHut,
.radishField,
.melonField,
.sorghumField,
.sorghumBundle {
  background-color: #dbbe40;
}

/* 10. Mountain */
.mountain,
.mountainRidge,
.largeRock,
.slope {
  background-color: #c0732d;
}

/* 11. Seen from mountain */
.otherValley,
.thatchedRoofHuts {
  background-color: #478a6e;
}

/* 12. Mentioned Location */
.seoul,
.countryside,
.yangpyeong,
.littleShop {
  background-color: #ade86b;
}

</style>
