<template>
  <el-container style="height: 100vh;">
    <el-aside>
      <el-header><span>SONAGI</span></el-header>
      <div class="des" style="margin-top: 20px;">
        This is one map that is drawn with the text recognized in the story. 
        There is no appearance of “vehicles” in the story except
        for a cow that a farmer might be able to ride on. This indicates that
        all mentioned locations where the scenes happen are within a walking
        distance. <br><br>Want to browse the area together?
      </div>
    </el-aside>
    <el-container>
      <el-header class="black"
        ><span style="display: inline-block;">{{ title }}</span>
        <Nav/>
      </el-header>
      <el-main>
        <img :width="myRightW" src="img/SonagiMap1.svg" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import * as d3 from "d3";
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
      // width: 1500,
      // height: 900,
      margin: 50,
      leftW: 0, // 340
      myRightW: Number,
      myLineW: Number,
      dPath: Object,
      storyText: [],
      titles: ["MAP OF THE TOWN"],
      title: "MAP OF THE TOWN",
      segmentColors: [
        { location: "creek", color: "#4d4acb;" },
        { location: "school", color: "#54bdc5" },
        { location: "field", color: "#dbbe40" },
        { location: "ditch", color: "#6740ab;" },
        { location: "fork", color: "#8e8cf3;" },
        { location: "ricePaddy", color: "#6740ab;" },
        { location: "lookoutHut", color: "#dbbe40" },
        { location: "boysHouse", color: "#3e81e4" },
        { location: "buckwheatField", color: "#c9458d" },
      ],
      timeLineArr: [
        { text: "Day1", X1: 1, Y1: 1, X2: 1, Y2: 1, Dist: 1 },
        { text: "The Next Day", X1: 2, Y1: 1, X2: 2, Y2: 1, Dist: 2 },
        {
          text: "* A Few Continous Days After",
          uncertainty:
            "They meet again a few days later. I assumed it should be within a week. And gave 3 days length here.",
          X1: 5,
          Y1: 1,
          X2: 4,
          Y2: 1,
          Dist: 2,
        },
        {
          text: "** Saturday - Possibly of the same week",
          uncertainty:
            "In the text, it says “Saturday”. I assumed this Saturday lies within the same week of the previously mentioned day. This could be 3-5 days length. I gave a 3 days length here. This is the day that a rain shower came. It’s also when the boy and the girl spend most time together, exploring the nature.",
          X1: 8,
          Y1: 1,
          X2: 6,
          Y2: 1,
          Dist: 2,
        },
        {
          text: "*** Many Continuous Days after Saturday",
          uncertainty:
            "The girl is unseen for a few days thereafter. I assumed that could be at least 5  continuous days.",
          X1: 13,
          Y1: 1,
          X2: 2,
          Y2: 6,
          Dist: 1,
        },
        {
          text: "One Day after the Continous Days",
          X1: 14,
          Y1: 1,
          X2: 3,
          Y2: 6,
          Dist: 3,
        },
        { text: "The Next Day", X1: 15, Y1: 1, X2: 6, Y2: 6, Dist: 1 },
        {
          text: "**** Many days later",
          uncertainty:
            "In the text, it says time has passed for the creek to grow.  I was not too sure how long it takes for the water to visibly grow. However, I assumed that it must be longest time for the boy.  I gave 7 day length here.",
          X1: 22,
          Y1: 1,
          X2: 7,
          Y2: 6,
          Dist: 2,
        },
      ],
      allKoText: null,
      allEnText: null,
      KoSegs: [],
      EnSegs: [],
      myLangEn: true,
      mySegs: [],
      ready: true,
      showModal: false,
      bigText: false,
      list1Name: String,
      areasOfActionArr: Array,
      areasOfNoActionArr: Array,
      areasOfSeenArr: Array,
      areasOfReferencedArr: Array,
      myArr1: Array,
      myArr2: Array,
    };
  },
  watch: {},
  created() {
    this.myRightW = this.width - this.leftW;
    this.myLineW = this.width - this.leftW - this.margin * 2;
    // (0) Songai Entire Text //
    Promise.all([d3.json("./sonagi.json")]).then(([data]) => {
      console.log("sonagi Data", data);
      let segmentGroup = this.groupByKey(data, "Segment");
      this.aggregateBySeg(segmentGroup, "Segment", "En");
      this.aggregateBySeg(segmentGroup, "Segment", "Ko");
    });
    console.log("Story Segment Created", this.EnSegs, this.KoSegs);
    this.mySegs = this.EnSegs;
    console.log("mySegs", this.mySegs);
  },
  unmounted() {},
  mounted() {
    window.addEventListener("resize", this.onReSize);
    Promise.all([
      d3.json("./storySegment.json"),
      d3.json("./sonagiLocations_tree_EN.json"),
    ])
      .then(([storyData, treeData]) => {
        // (1) segmentData for rectangles
        this.segmentData = storyData;
        // (2) treeData => Array for sidebar
        this.list1Name = treeData.children[0].name;
        this.areasOfActionArr = Array.from(treeData.children[0].children);
        this.areasOfNoActionArr = Array.from(treeData.children[1].children);

        console.log(
          "areas of seen arr",
          treeData.children[1].children[0].children
        );
        console.log(
          "areas of Referenced Arr",
          treeData.children[1].children[1]
        );

        this.myArr1 = this.areasOfActionArr;
        this.myArr2 = this.areasOfNoActionArr;
        this.instruction = this.instructions[0];
        this.title = this.titles[0];
      })
      .then(() => {
        // Update My Segment Data - Ko, En, Chosen Text
        this.segmentData = this.segmentData.map((item, i) =>
          Object.assign({}, item, {
            Ko: this.KoSegs[i],
            En: this.EnSegs[i],
            "Chosen Text": this.EnSegs[i],
          })
        );
      })
      .then(() => {
        console.log("updated this.segmentData", this.segmentData);
        this.basicSetUp(); //
        this.displayState();
        this.drawLegend();
        console.log("story Segment data", this.segmentData);
      });
  },
  computed: {
    xPos1() {
      return d3
        .scaleLinear()
        .domain(
          d3.extent(this.segmentData, (d) => {
            return Number(d["X1"]);
          })
        )
        .range([this.myRightW - this.myLineW, this.myLineW]);
    },
    yPos1() {
      return d3
        .scaleLinear()
        .domain(
          d3.extent(this.segmentData, (d) => {
            return Number(d["Y1"]);
          })
        )
        .range([
          this.height / 2 + this.m1,
          this.height / 2 + this.yMax1 * (this.m1 + this.r1),
        ]);
    },
    xPos2() {
      return d3
        .scaleLinear()
        .domain(
          d3.extent(this.segmentData, (d) => {
            return Number(d["X2"]);
          })
        )
        .range([
          (this.myRightW - (this.r2 * 8 + this.m2 * 7)) / 2,
          this.myRightW -
            (this.myRightW - (this.r2 * 8 + this.m2 * 7)) / 2 -
            this.r2,
        ]);
    },
    yPos2() {
      return d3
        .scaleLinear()
        .domain(
          d3.extent(this.segmentData, (d) => {
            return Number(d["Y2"]);
          })
        )
        .range([
          (this.height - (this.r2 * 5 + this.m2 * 4)) / 2,
          this.height -
            (this.height - (this.r2 * 5 + this.m2 * 4)) / 2 -
            this.r2,
        ]);
    },
  },
  updated() {
    // on new DOM
    // this.width = window.innerWidth - 80;
    this.width = window.innerWidth * 0.7;
    this.height = window.innerHeight - 200;
    this.myRightW = this.width - this.leftW;
    this.myLineW = this.width - this.leftW - this.margin * 2;
    // this.r1 = window.innerWidth / 70;
    // this.r2 = window.innerWidth / 15;
    this.displayState();
  },
  methods: {
    groupByKey(data, key) {
      let g = d3.group(data, (d) => d[key]);
      //console.log(`Grouped Map By ${key}`, g)
      return g;
    },
    aggregateBySeg(data, key, lang) {
      let segs = Array.from(data); //segments
      segs.forEach((seg) => {
        let myArr = seg[1]; // Object Arrays
        let segTxtArr = [];
        myArr.forEach((arr) => {
          let myT = arr[lang]; // text in the language
          segTxtArr.push(myT); // text array
        });
        let allTxt = segTxtArr.join(" "); // combined text
        // console.log(`${key}`, allTxt);
        if (lang == "Ko") {
          this.KoSegs.push(allTxt);
        } else {
          this.EnSegs.push(allTxt);
        }
      });
    },
  },
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
