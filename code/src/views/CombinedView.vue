<template>
  <el-container style="height: 100vh;">
    <el-aside>
      <el-header><span>SONAGI</span></el-header>

      <div class="des" style="margin-top: 20px;">
        In Sonagi, the boy and the girl spend a few sporadic days together
        browsing the neighborhood set in an agricultural village and there is a
        slight hint of innocent romance built between them. On the right, you
        can see the storyline divided by the timeline and the progress of the
        Plot. <br /><br />Each rectangle color represents a main place of
        action.<br /><br /><span style="color: #3D0C02; font-size: 12px;">* ** *** **** indicates uncertainty in time.</span><br><br />
        <span style="font-size: 10px; text-align: right;">Original Text by Hwang Sun Won<br>English Translation by Samara Huggins</span>
        
      </div>

      <div class="locationList">
        <li>Locations identified in the text</li>
        <li>
          <span style="font-weight: bold;">{{ list1Name }}</span>
        </li>
        <li v-for="arr in myArr1" :key="arr">
          <span :class="arr.children[0].class"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
          {{ arr.name }}<br />
          <ul
                    v-for="location in arr.children"
                    :key="location"
                    :id="location.class"
                    @click="toggleClass()"
                    >
                   {{
                        location.name
                    }} 
          </ul>
        </li>
        <li></li>
        <br />
        <li>
          <span class="otherValley">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          ><span style="font-weight: bold;"> SEEN LOCATIONS</span>
          <ul>
            The Valley on the Other Side
          </ul>
          <ul>
            A Group of Thatched Roof Huts
          </ul>
        </li>

        <li></li>
        <br />

        <li>
          <span class="seoul">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          ><span style="font-weight: bold;"> ONLY REFERRED LOCATIONS</span>
          <ul>
            Seoul
          </ul>
          <ul>
            Countryside
          </ul>
           <ul>
            Yangpyeong
          </ul>
          <ul>
            A Little Shop
          </ul>
        </li>

        <!-- <li v-for="arr in myArr2" :key="arr">
                    {{ arr[1].name }}<br />
                    <ul
                    v-for="location in arr.children"
                    :key="location"
                    :id="location.name"
                    :ref="location.name"
                    :class="location.class"
                    >
                    {{ location.name }}
                    </ul>
                </li> -->
      </div>
    </el-aside>
    <el-container>
      <el-header class="black"
        ><span style="display: inline-block;">{{ title }}</span>
        <Nav />
      </el-header>
      <el-main>
        <svg
          :height="height"
          :width="myRightW"
          :viewbox="`0, 0, ${myRightW}, ${height}`"
        >
          <g
            id="viz"
            x="0"
            y="0"
            :height="height"
            :width="myRightW"
            transform="translate(0, 0)"
          >
            <text
              class="des"
              x="20"
              y="20"
              :width="myRightW - 340"
              height="100"
              style="font-weight: bold; text-anchor: start;"
            >
              {{ instruction }}
            </text>
            <foreignObject x="750" y="0" width="700" height="100">
              <div class="sideBtns">
                <el-button
                  size="mini"
                  type="info"
                  v-on:click="
                    showState = 1;
                    displayState();
                  "
                  >TimeLine View</el-button
                >
                <el-button
                  size="mini"
                  type="info"
                  v-on:click="
                    showState = 2;
                    nullBtn = true;
                    displayState();
                  "
                  >Full Text View</el-button
                >
                <!-- <el-button
                  size="mini"
                  type="info"
                  v-on:click="
                  textConversion()" 
                  >KO/EN</el-button
                > -->
              </div>
            </foreignObject>

            <line x="0" y="0" class="guideLine" stroke="#000"></line>
            <g x="0" y="0" class="ticks"></g>

            <g x="0" y="0" class="segments"></g>
            <g x="0" y="0" class="segmentText"></g>
            <g x="0" y="0" class="timeLineText">
              <path class="additional"></path>
            </g>
          </g>
          <g x="-1000" y="-1000" class="tooltip">
            <foreignObject x="-1000" y="-1000" class="t" width="420" height="600" ></foreignObject>
          </g>
          <g x="-1000" y="-1000" class="uncertaintyPopUp" >
            <foreignObject x="-1000" y="-1000" class="uncertaintyText" width="300" height="300"> </foreignObject>
          </g>
        </svg>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import * as d3 from "d3";
import Nav from "../components/Nav.vue";

export default {
  name: "CombinedView",
  props: {},
  components: {
    Nav,
  },
  data() {
    return {
      // width: 1200, //window.innerWidth *0.7, // *0.7
      width: window.innerWidth * 0.7,
      height: window.innerHeight - 100,
      // width: 1500,
      // height: 900,
      margin: 50,
      leftW: 0, // 340
      myRightW: Number,
      myLineW: Number,
      dPath: Object,
      showState: 1,
      nullBtn: false,
      yMax1: 9,
      // r1: window.innerWidth / 70,
      // r2: window.innerWidth / 15,
      r1: 25, //window.innerWidth / 70,
      r2: 100, // window.innerWidth / 15,
      m1: 5,
      m2: 8,
      activeCollapsibleName: "1", // model
      segmentData: Object,
      title: "STORYLINE BY THE TIMELINE",
      titles: ["STORYLINE BY THE TIMELINE", "FULL TEXT BY THE TIMELINE"],
      instruction:
        "Hover over each rectangle to reveal the storyline and the text.",
      instructions: [
        "Hover over each rectangle to reveal the storyline and the text.",
        "Click on the rectangle to see the text in full.",
        "",
      ],
      storyText: [],
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
            "The boy and the girl meet again a few days later. I assumed it should be within a week and gave 3-day-distance here.",
          X1: 5,
          Y1: 1,
          X2: 4,
          Y2: 1,
          Dist: 2,
        },
        {
          text: "** Saturday - Possibly of the same week",
          uncertainty:
            "In the text, it says “Saturday”. I assumed this Saturday lies within the same week from the previous day of action.  I gave a 3-day-distance here. Additionally, this is the day that rain shower came.",
          X1: 8,
          Y1: 1,
          X2: 6,
          Y2: 1,
          Dist: 2,
        },
        {
          text: "*** Many Continuous Days after Saturday",
          uncertainty:
            "The girl is unseen for a few days after the Saturday. I assumed that could be at least 5 continuous days.",
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
          text: "**** After the Creek Grew",
          uncertainty:
            "In the text, it says time has passed for the creek to grow.  I was not too sure how long it takes for the water to visibly grow. However, it must have been felt the longest for the boy.  I gave a full week's distance from the previous day of action here.",
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
  unmounted() {
    window.removeEventListener("resize", this.onReSize);
  },
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
            "Chosen Text": this.mySegs[i],
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
    this.height = window.innerHeight - 100;
    this.myRightW = this.width - this.leftW;
    this.myLineW = this.width - this.leftW - this.margin * 2;
    // this.r1 = window.innerWidth / 70;
    // this.r2 = window.innerWidth / 15;
    this.displayState();
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    displayState() {
      if (this.showState == 1) {
        console.log("showStateOne");
        this.drawSegments1(); //just the shell
        this.drawTicks1();
        this.drawTimeLineText1();
        this.drawGuideLine1();
        this.instruction = this.instructions[0];
        this.title = this.titles[0];
      } else if (this.showState == 2) {
        console.log("showStateTwo");
        this.drawSegments2(); //just the shell
        this.drawTicks2();
        this.drawTimeLineText2();
        this.drawGuideLine2();
        this.instruction = this.instructions[1];
        this.title = this.titles[1];
      }
      //   this.dPath = d3.path();
      //   this.dPath.moveTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(4)
      //   );
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(4));
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(5) - this.m2);
    },
    basicSetUp() {
      // (1) GuideLine
      d3.select(".guideLine")
        .attr("x1", this.myRightW - this.myLineW)
        .attr("y1", this.height / 2)
        .attr("x2", this.myLineW)
        .attr("y2", this.height / 2)
        .attr("opacity", 0);
      // (2) segments
      d3.select(".segments")
        .selectAll(".seg_rect")
        .data(this.segmentData)
        .join("rect")
        .attr("class", "seg_rect")
        .attr("id", (d, i) => {
          return "seg" + i;
        })
        .attr("x", (d) => this.xPos1(d["X1"]) - this.r1 / 2)
        .attr("y", (d) => 5 + this.yPos1(d["Y1"]))
        .attr("width", this.r1)
        .attr("height", this.r1) // division amount
        .attr("stroke", "none")
        .style("cursor", "pointer")
        .attr("opacity", 0);
      // (3) Ticks  (Small Rects)
      d3.select(".ticks")
        .selectAll("rect")
        .data(this.segmentData)
        .join("rect")
        .attr("stroke", "#000")
        .attr("x", (d) => {
          if (d["TimeFrame"]) {
            return this.xPos1(+d["X1"]) - 2;
          }
        })
        .attr("y", (d) => {
          if (d["TimeFrame"]) {
            return this.height / 2 - 2;
          }
        })
        .attr("width", (d) => {
          if (d["TimeFrame"]) {
            return 4;
          }
        })
        .attr("height", 4)
        .attr("opacity", 0);
      // (4) TimeLineText
      ////// --- LINE --- //////
      d3.select(".timeLineText")
        .selectAll("line")
        .data(this.timeLineArr)
        .join("line")
        .attr("id", (d, i) => i)
        .attr("class", "t_line")
        .attr("stroke", "#000")
        .attr("fill", "none")
        .attr("stroke-width", "1")
        .attr("x1", (d) => this.xPos1(d["X1"]))
        .attr("y1", () => this.height / 2)
        .attr("y2", () => this.height / 2 - Math.cos(45) * 30)
        .attr("x2", (d) => this.xPos1(d["X1"]) - Math.sin(45) * 20)
        .attr("opacity", 0);
      // LINE: ADDITIONAL PATH (POS2)
      //   this.dPath = d3.path();
      //   this.dPath.moveTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(4)
      //   );
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(4));
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(5) - this.m2);
      //   d3.select(".additional")
      //     .attr("d", this.dPath)
      //     .attr("stroke", "#000")
      //     .attr("stroke-width", "2")
      //     .attr("fill", "none")
      //     .attr("opacity", 0);
      ////// (2) TEXT  //////
      d3.select(".timeLineText")
        .selectAll("text")
        .data(this.timeLineArr)
        .join("text")
        .attr("class", "t_text")
        .attr("font-family", "Roboto, sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "lighter")
        .style("fill", (d) => {
          if (d["uncertainty"]) {
            return "#3D0C02";
          } else {
            return "#000";
          }
        })
        .attr("x", (d) => this.xPos1(d["X1"]) - Math.sin(45) * 20 - 5)
        .attr("y", this.height / 2 - Math.cos(45) * 20 - 5)
        .text((d) => d["text"])
        .attr("transform", (d) => {
          return (
            "rotate(45, " +
            (this.xPos1(d["X1"]) - Math.sin(45) * 20 - 5) +
            " " +
            (this.height / 2 - Math.cos(45) * 20 - 5) +
            ")"
          );
        })
        .attr("opacity", 0);
    },
    onReSize() {
      // Window Resize
      // this.width = window.innerWidth - 80;
      this.width = window.innerWidth * 0.7; //*0.7; //
      this.height = window.innerHeight - 100;
      this.myRightW = this.width - this.leftW;
      this.myLineW = this.width - this.leftW - this.margin * 2;
      this.displayState();
      // this.r1 = window.innerWidth / 70;
      // this.r2 = window.innerWidth / 15;

      // this.dPath = d3.path();
      //   this.dPath.moveTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(4)
      //   );
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(4));
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(5) - this.m2);
    },
    drawSegments1() {
      console.log("drawSegments1");

      // svg.append("defs")
      //         .append("pattern")
      //         .attr("x", 0)
      //         .attr("y", 0)
      //         .attr("width", this.r1)
      // 		.attr("height", this.r1)
      //         .attr("id", "bg")
      //         .append("image")
      //         .attr("x", 0).attr("y", 0)
      //    		.attr("width", this.r1)
      // 		.attr("height", this.r1)
      //         .attr("xlink:href", "./img/creekTobuckwheat.svg");

      d3.selectAll(".seg_rect")
        .transition()
        .duration((d, i) => 2050 - 50 * i)
        .attr("opacity", 1)
        .attr("x", (d) => this.xPos1(d["X1"]) - this.r1 / 2)
        .attr("y", (d) => 5 + this.yPos1(d["Y1"]))
        .attr("id", (d, i) => `rect_${i}`)
        .attr("width", this.r1)
        .attr("height", this.r1) // division amount
        .attr("stroke", "none")
        .attr("fill", (d) => {
          // console.log("rect num", i)
          if (d["BG Class"][0] == "creek") {
            return "#4d4acb";
          } else if (d["BG Class"][0] == "school") {
            return "#54bdc5";
          } else if (d["BG Class"][0] == "reedsField") {
            return "#dc8b39";
          } else if (
            d["BG Class"][0] == "ditch" ||
            d["BG Class"][0] == "ricePaddy"
          ) {
            return "#6740ab";
          } else if (
            d["BG Class"][0] == "lookoutHut" ||
            d["BG Class"][0] == "field"
          ) {
            return "#dbbe40";
          } else if (d["BG Class"][0] == "boysHouse") {
            return "#3e81e4";
          } else if (d["BG Class"][0] == "buckwheatField") {
            return "#c9458d";
          } else if (d["BG Class"][0] == "mountain") {
            return "#c0732d";
          } else if (d["BG Class"][0] == "fork") {
            return "#8e8cf3";
          }
          //   if (i ==4) {
          //       return "url(./img/creekTobuckwheat.svg)";
          //   }
        })
        .attr("opacity", 1);
      //
      d3.selectAll(".seg_text")
        .transition()
        .duration((d, i) => 2050 - 50 * i)
        .attr("x", (d) => this.xPos1(d["X1"]) - this.r1 / 2)
        .attr("y", (d) => 5 + this.yPos1(d["Y1"]))
        .attr("width", this.r1)
        .attr("height", this.r1) // division amount
        .attr("opacity", 0)
        .remove();
      //
      this.rectsRollOver();
      this.uncertaintyTextMouseOver();
    },
    drawSegments2() {
      d3.select(".segmentText")
        .selectAll(".seg_text")
        .data(this.segmentData)
        .join("foreignObject")
        .attr("class", "seg_text")
        .attr("id", (d, i) => `seg_text_${i}`)
        .attr("x", (d) => this.xPos1(d["X1"]) - this.r1 / 2)
        .attr("y", (d) => 5 + this.yPos1(d["Y1"]))
        .attr("width", this.r1)
        .attr("height", this.r1)
        .style("stroke", "#000")
        .html(
          (d) =>
            `<div class="seg_text_inside" 
                        style="font-size: 4.5px; color: #000; 
                        text-align: left; margin: 1px; padding: 4px; 
                        background-color: #fff"; display:block; border:none;>` +
            d["Chosen Text"] +
            `</div>`
        )
        .attr("opacity", 0)
        .transition()
        .duration((d, i) => 1050 + 50 * i) // .duration(1500)
        .attr("width", this.r2)
        .attr("height", this.r2)
        .attr("x", (d) => this.xPos2(d["X2"]))
        .attr("y", (d) => this.yPos2(d["Y2"]))
        .attr("opacity", 1);

      d3.selectAll(".seg_rect")
        .transition()
        .duration((d, i) => 1050 + 50 * i)
        .attr("opacity", 1)
        .attr("width", this.r2)
        .attr("height", this.r2)
        .attr("x", (d) => this.xPos2(d["X2"]))
        .attr("y", (d) => this.yPos2(d["Y2"]))
        .attr("stroke", "none");

      this.textClick();
    },
    uncertaintyTextMouseOver() {
      d3.selectAll(".t_text")
      .on("mouseover", function (d, i) {
        d3.select(this).style("cursor", "pointer;");
        console.log("mouse over on ");
        // console.log("d3 pointer", d3.pointer())

        if (i["uncertainty"]) {
        console.log("i_X1", i["X1"]);
        // console.log(d3.select(this));
        d3.select(this).attr("font-weight", "bold");

        d3.select(".uncertaintyText").html(
                `<div style="margin: 70px auto; font-size: 12px;
                padding: 20px; color: #3D0C02;
                background: #ccc; "><b>Time Uncertainty</b> <br>
                ` +
                i["uncertainty"] +
                `</div>`);
        d3.select(".uncertaintyPopUp").transition().duration(300).attr("opacity", 0.9);
        d3.select(".uncertaintyText")
          .attr("x", () => {
            if (i["X1"] == 22) {
              console.log("last")
              return event.pageX - 700;
            } else {
              return event.pageX - 360;
            }
            })
          .attr("y", event.pageY - 200);
        }
      })
      .on("mouseout", function() {
        d3.select(this).attr("font-weight", "lighter");
        d3.select(".uncertaintyPopUp").transition().duration(300).attr("opacity", 0);
        d3.select(".uncertaintyText").attr("x", -1000).attr("y", -1000); // disappear from screen
      })
     },
    textClick() {
      d3.selectAll(".seg_text").on("mouseover", function () {
        d3.select(this).style("cursor", "pointer;");
        console.log("mouseover");
      });
      d3.selectAll(".seg_text").on("click", function (d, i) {
          console.log("d, i", d, i, Number(i["Segment"] - 1));
          let myNum = Number(i["Segment"] - 1);

          // ****** Make others disappear; ******* //
          d3.selectAll(".seg_text")
            .transition()
            .duration(50)
            .attr("opacity", 0);

          d3.selectAll(".seg_rect")
            .transition()
            .duration(50)
            .attr("opacity", 0)
            .attr("y", -1000);

          d3.selectAll(".t_text")
            .transition()
            .duration(50)
            .attr("opacity", 0)
            .attr("y", -1000);

          d3.selectAll(".t_line")
            .transition()
            .duration(50)
            .attr("opacity", 0)
            .attr("y", -1000);
          // ****** Make others disappear; ******* //

          // ****** ME ******* //

          d3.select(`#rect_${myNum}`) // outer shell
            .transition()
            .duration(50)
            .attr("opacity", 0)
            .transition()
            .duration(200)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", () => 650)
            .attr("height", () => 650)
            .transition()
            .duration(1000)
            .attr("opacity", 0.8);

          d3.select(`#seg_text_${myNum}`)
            .html(
              (d) =>
                `<div class="seg_text_inside"
                        style="font-size: 18px; color: #000; top:0; left: 0;
                        text-align: left; margin: 10px; padding: 10px; 
                        background-color: #fff"; display:block; border:none;>` +
                d["En"] +
                `</div>` +
                `<div class="seg_text_inside"
                        style="font-size: 17px; color: #000; top:0; left: 0;
                        text-align: left; margin: 10px; padding: 10px; 
                        background-color: #fff"; display:block; border:none;>` +
                d["Ko"] +
                `</div>`
            );
          d3.select(`#seg_text_${myNum}`)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", () => 650)
            .attr("height", () => 650);

          d3.select(`#seg_text_${myNum}`)
            .transition()
            .duration(1000)
            .attr("opacity", 1);

      });
    },
    drawTicks1() {
      d3.select(".ticks")
        .selectAll("rect")
        .transition()
        .duration(2000)
        .attr("x", (d) => {
          if (d["TimeFrame"]) {
            return this.xPos1(+d["X1"]) - 2;
          }
        })
        .attr("y", (d) => {
          if (d["TimeFrame"]) {
            return this.height / 2 - 2;
          }
        })
        .attr("width", (d) => {
          if (d["TimeFrame"]) {
            return 4;
          }
        })
        .attr("opacity", 1);
    },
    drawTicks2() {
      d3.select(".ticks")
        .selectAll("rect")
        .transition()
        .attr("x", (d) => {
          if (d["TimeFrame"]) {
            return this.xPos1(+d["X1"]) - 2;
          }
        })
        .attr("y", (d) => {
          if (d["TimeFrame"]) {
            return this.height / 2 - 2;
          }
        })
        .attr("width", (d) => {
          if (d["TimeFrame"]) {
            return 4;
          }
        })
        .attr("opacity", 0);
    },
    showTimeUncertainty() {},
    drawTimeLineText1() {
      // LINE: POS1
      d3.select(".timeLineText")
        .selectAll("line")
        .transition()
        .duration(2000)
        .attr("opacity", 1)
        .attr("stroke-width", "1")
        .attr("x1", (d) => this.xPos1(d["X1"]))
        .attr("y1", () => this.height / 2)
        .attr("y2", () => this.height / 2 - Math.cos(45) * 30)
        .attr("x2", (d) => this.xPos1(d["X1"]) - Math.sin(45) * 20);

      d3.select(".additional")
        .transition()

        .attr("opacity", 0);
      // TEXT - POS1
      d3.select(".timeLineText")
        .selectAll("text")
        .transition()
        .duration(2000)
        .attr("text-anchor", "end")
        .attr("x", (d) => this.xPos1(d["X1"]) - Math.sin(45) * 20 - 5)
        .attr("y", this.height / 2 - Math.cos(45) * 20 - 5)
        .text((d) => d["text"])
        .attr("transform", (d) => {
          return (
            "rotate(45, " +
            (this.xPos1(d["X1"]) - Math.sin(45) * 20 - 5) +
            " " +
            (this.height / 2 - Math.cos(45) * 20 - 5) +
            ")"
          );
        })
        .attr("opacity", "0.8");
    },
    extraLine() {
      //   this.dPath.moveTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(1) - this.m2
      //   );
      //   this.dPath.lineTo(
      //     this.xPos2(6) + this.r2 * 2 + this.m2 * 2,
      //     this.yPos2(4)
      //   );
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(4));
      //   this.dPath.lineTo(this.xPos2(3), this.yPos2(5) - this.m2);
    },
    drawTimeLineText2() {
      // LINE: POS2
      d3.select(".timeLineText")
        .selectAll("line")
        .transition()
        .duration(2000)
        .attr("opacity", 1)
        .attr("stroke-width", "2")
        .attr("x1", (d) => this.xPos2(d["X2"]))
        .attr("y1", (d, i) => {
          if (i < 3 || i == 3) {
            return this.yPos2(d["Y2"]) - this.m2;
          }
          if (i > 3) {
            return this.yPos2(d["Y2"]);
          }
        })
        .attr(
          "x2",
          (d) =>
            this.xPos2(d["X2"]) +
            this.r2 * d["Dist"] +
            this.m2 * (d["Dist"] - 1)
        )
        .attr("y2", (d, i) => {
          if (i < 3 || i == 3) {
            return this.yPos2(d["Y2"]) - this.m2;
          }
          if (i > 3) {
            return this.yPos2(d["Y2"]);
          }
        })
        .attr("opacity", "0.8");
      d3.select(".additional")
        .transition()
        .duration(2000)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

      // TEXT TRANSITION -  POS 2
      d3.selectAll(".t_text")
        .transition()
        .duration(2000)
        .attr("opacity", 1)
        .attr("x", (d, i) => {
          if (i == 0 || i == 6) {
            return this.xPos2(d["X2"]) + this.r2;
          } else if (i == 4) {
            return this.xPos2(d["X2"]) + this.r2;
          } else if (i == 5) {
            return this.xPos2(d["X2"]) + this.r2 * 3 + this.m2 * 2;
          } else {
            return this.xPos2(d["X2"]) + this.r2 * 2 + this.m2;
          }
        })
        .attr("y", (d, i) => {
          if (i < 3 || i == 3) {
            return this.yPos2(d["Y2"]) - this.m2 * 2;
          }
          if (i > 3) {
            return this.yPos2(d["Y2"]) + this.m2 * 2;
          }
        })
        .attr("transform", "rotate(0, 0)");
    },
    drawLegend() {
      d3.select(".segmentsLegend")
        .selectAll("text")
        .data(this.segmentColors)
        .join("text")
        .attr("font-family", "Roboto, sans-serif")
        .attr("font-size", "10px")
        .attr("font-weight", "lighter")
        .style("fill", "#000")
        .attr("x", () => 40)
        .attr("y", (d, i) => {
          return 20 + 30 + 30 * i;
        })
        .attr("width", 100)
        .attr("height", 25)
        .text((d) => d["location"]);

      d3.select(".segmentsLegend")
        .selectAll("rect")
        .data(this.segmentColors)
        .join("rect")
        .attr("x", () => 0)
        .attr("y", (d, i) => {
          return 30 * i + 30;
        })
        .attr("width", 25)
        .attr("height", 25)
        .style("fill", (d) => d["color"]);

      d3.select(".segmentsLegend")
        .append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 100)
        .attr("height", 25)
        .attr("font-family", "Roboto, sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .style("fill", "#000")
        .text("Locations of Overall Action");
    },
    drawGuideLine1() {
      d3.select(".guideLine")
        .transition()
        .duration(2000)
        .attr("x1", this.myRightW - this.myLineW)
        .attr("y1", this.height / 2)
        .attr("x2", this.myLineW)
        .attr("y2", this.height / 2)
        .attr("opacity", 1);
    },
    drawGuideLine2() {
      d3.select(".guideLine")
        .transition()
        .attr("x1", this.myRightW - this.myLineW)
        .attr("y1", this.height / 2)
        .attr("x2", this.myLineW)
        .attr("y2", this.height / 2)
        .attr("opacity", 0);
    },
    rectsRollOver() {
      d3.selectAll(".seg_rect")
        .on("mouseover", function (d, i) {
          console.log("seg_rect d i", d, i);
          let myNum = Number(i["Segment"]) - 1;
          console.log("myNum", myNum);
          console.log("dom ID", d3.select(this), event.pageX, event.pageY);
          d3.select(this).style("cursor", "pointer;");
          d3.select(this).attr("stroke", "#000");

          d3.select(".t").html(
            `<div style="margin: 70px auto; font-size: 15px;
                padding: 20px; border: 1px solid #000; 
                background: #fff; border-radius: 5px;"><b>Main Story</b> <br>` +
              i["Story"] +
              `<br>` +
              `<p><b>Main Place Of Action </b>` +
              i["Overall Location Text"] +
              `</p>` +
              // `<p><b>Location Details </b>` +
              // i["Detailed Location"] +
              // `</p>` +
              // `<p><b>Text</b><br>` +
              // i["Chosen Text"] +
              // `</p>` +
              `</div>`
          );

          d3.select(".tooltip").transition().duration(300).attr("opacity", 1);

          d3.select(".t")
            .attr("x", () => {
              if (myNum < 15) {
                return event.pageX - 360;
              }
              if (myNum == 15 || myNum > 15) {
                return event.pageX - 800;
              }
            })
            .attr("y", event.pageY - 200);
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", "none");
          d3.select(".tooltip").transition().duration(300).attr("opacity", 0);

          d3.select(".t").attr("x", -1000).attr("y", -1000); // disappear from screen
        });
    },
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
    textConversion() {
        // if (this.myLangEn && this.showState == 2 && this.nullBtn == true) {
        //     d3.selectAll(".seg_text")
        //       .html(
        //         (d,i) =>
        //           `<div class="seg_text_inside"
        //                   style="font-size: 4.5px; color: #000; top:0; left: 0;
        //                   text-align: left; margin: 10px; padding: 10px; 
        //                   background-color: #fff"; display:block; border:none;>` +
        //           this.KoSegs[i] +
        //           `</div>`
        //       );
        //       this.myLangEn = false;
        //       this.nullBtn = false;
        //   } 
        // if (!this.myLangEn && this.showState ==2 && this.nullBtn == true) {
        //     d3.selectAll(".seg_text")
        //       .html(
        //         (d,i) =>
        //           `<div class="seg_text_inside"
        //                   style="font-size: 4.5px; color: #000; top:0; left: 0;
        //                   text-align: left; margin: 10px; padding: 10px; 
        //                   background-color: #fff"; display:block; border:none;>` +
        //           this.EnSegs[i] +
        //           `</div>`
        //       );
        //       this.myLangEn = true;
        //       this.nullBtn = false;
        //   }
          
    },
    toggleClass() {
      let myRef = event.target.id;
      console.log("my Ref", myRef);
      //   let myButton = d3.selectAll(`ul[id=${myRef}]`)["_groups"][0]; // clicked on menu
      //   let myList = d3.selectAll(`a[id^=${myRef}]`)["_groups"][0]; // ones in the text
      //   this.toggleHere(myList, myRef);
      //   this.toggleHere(myButton, myRef);
    },
    toggleHere(obj, myRef) {
      obj.forEach((element) => {
        if (element.classList) {
          element.classList.toggle(myRef);
        } else {
          var classes = element.className.split(" ");
          var i = classes.indexOf(myRef);
          if (i >= 0) {
            classes.splice(i, 1);
          } else {
            classes.push(myRef);
            element.className = classes.join(" ");
          }
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
