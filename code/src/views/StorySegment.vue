<template>
  <el-container style="height: 100vh;">
    <el-aside>
      <el-header><span>LOCATION</span></el-header>
      <div class="locationList">
          <li>Following is the list of locations mentioned in the text. Please note that english expressions for a single location can appear with variations.</li>
          <li><span style="font-weight: bold">{{list1Name}}</span></li>
          <li v-for="arr in myArr1" :key="arr">
            {{ arr.name }}<br />
            <ul
              v-for="location in arr.children"
              :key="location"
              :id="location.class"
              :class="location.class"
              @click="toggleClass()"
            >
              {{
                location.name
              }}
            </ul>
          </li>
          <li v-for="arr in myArr2" :key="arr">
            {{ arr.name }}<br />
            <ul
              v-for="location in arr.children"
              :key="location"
              :id="location.name"
              :ref="location.name"
              :class="location.class"
            >
              {{
                location.name
              }}
            </ul>
          </li>
        </div>
    </el-aside>

    <el-container>
      <el-header class="black"><span>STORYLINE WITH LOCATION MENTIONS IN ACTUAL TEXT</span></el-header>
      <el-main id="Section_StorySegment">
        <div class="seg_btn">
          <el-button @click="textConversion">KO/EN</el-button>
        </div>
        <div
          class="card"
          v-for="(t, i) in mySegs"
          :key="t"
          :id="`seg${i + 1}`"
          :ref="`seg${i + 1}`"
          @click="bigText = true"
        >
          <div class="content">
            <div class="center" :ref="`txt${i + 1}`" @click="open(t)">
              {{ textToHTML(t, i) }}
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>


</template>

<script>
import * as d3 from 'd3';

export default {
  name: "StorySegment",
  props: {
    // sections: Array,
    // KoSegs: Array,
    // EnSegs: Array
  },
  components: {
    // LocationList
  },
  data() {
    return {
      myLangEn: true,
      mySegs: [],
      KoSegs: [],
      EnSegs: [],
      ready: true,
      showModal: false,
      bigText: false,
      list1Name: String,
      areasOfActionArr: Array,
      areasOfNoActionArr: Array,
      saved_ArrAction: Array,
      saved_ArrNoAction: Array,
      myArr1: Array,
      myArr2: Array
    };
  },
  created() {
    // console.log("Story Segment Created");
    // this.mySegs = this.EnSegs;
    // console.log("this.mySegs", this.mySegs);
    let segmentGroup;
    Promise.all([d3.json("./sonagi.json")]).then(([data]) => {
      console.log("sonagi Data", data);
      segmentGroup = this.groupByKey(data, "Segment");
      console.log("segmentGroup", segmentGroup);
      
      
    }).then(()=>{
      this.aggregateBySeg(segmentGroup, "Segment", "En");
      this.aggregateBySeg(segmentGroup, "Segment", "Ko");
    })
    console.log("Story Segment Created", this.EnSegs, this.KoSegs);
    this.mySegs = this.EnSegs;
    // console.log("mySegs", this.mySegs);
  },
  mounted() {
    d3.json("./sonagiLocations_tree.json").then((data) => {
      this.sonagiJson = data;
      // console.log(this.sonagiJson.children[0].name);
      this.list1Name = this.sonagiJson.children[0].name;
      this.areasOfActionArr = Array.from(data.children[0].children);
      this.areasOfNoActionArr = Array.from(data.children[1].children);
      this.saved_ArrAction = this.areasOfActionArr;
      this.saved_ArrNoAction = this.areasOfNoActionArr;
      this.myArr1 = this.areasOfActionArr;
      this.myArr2 = this.areasOfNoActionArr;
      console.log("saved_ArrNoAction ", this.saved_ArrNoAction)
    });
  },
  computed: {},
  methods: { 
    groupByKey(data, key) {
      let g = d3.group(data, (d) => d[key]);
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
    textConversion(event) {
      if (event) {
          this.myArr1 = this.saved_ArrAction;
          this.myArr2 = this.saved_ArrNoAction;  
        if (this.myLangEn) {
          console.log("conversion btn clicked. English.")
          this.mySegs = this.KoSegs;
          this.myLangEn = false;   
        } else {
          console.log("conversion btn clicked. Korean.")
          this.mySegs = this.EnSegs;
          this.myLangEn = true;
        }
      }
    },
    textToHTML(t, i) {
      this.$nextTick(() => {
        let myRef = `txt${i + 1}`;
        // console.log(this.$refs[myRef]);
        this.$refs[myRef].innerHTML = t;
      });
    },
    open(t) {
      this.$alert(t, {
        confirmButtonText: "CLOSE",
      });
    },
    toggleClass() {
      let myRef = event.target.id;
      console.log("my Ref", myRef);
      let myButton = d3.selectAll(`ul[id=${myRef}]`)["_groups"][0]; // clicked on menu
      let myList = d3.selectAll(`a[id^=${myRef}]`)["_groups"][0]; // ones in the text
      this.toggleHere(myList, myRef);
      this.toggleHere(myButton, myRef);
    },
    toggleHere(obj, myRef) {
      obj.forEach((element) =>{
        if (element.classList) { 
          element.classList.toggle(myRef);
        } else {
          var classes = element.className.split(" ");
          var i = classes.indexOf(myRef);
          if (i >= 0) {
            classes.splice(i, 1);
          }
          else { 
            classes.push(myRef);
            element.className = classes.join(" "); 
          }
        }
      })
    },
  },
};
</script>
<style scoped>


#Section_StorySegment {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 0.5vw; /* To define the gap between rows/columns */
  gap: 0.5vw;
  padding: 0.75rem;
  padding-left: 0;
}

.opening_btn {
  position: absolute;
  top: 0;
  left: 0;
}

.card {
  /* This will come in handy later to center the contents */
  position: relative;
  font-size: 0.35vw;
  padding: 1vw;
  display: block;
  border-color: #2d142d;
  color: rgb(0, 0, 0, 0.5);
  min-width: 6vw;
  font-size: 6px;
}

.card:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.card .content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.center {
  width: 90%;
  height: 90%;
  text-align: left;
  overflow: hidden;
  border: 1px solid #ccc;
  /* border-radius: 0.75rem; */
  padding: 0.5vw;
}

div#segFull {
  grid-column: 1;
  grid-row: 1;
}
div#seg1 {
  grid-column: 1;
  grid-row: 1;
}
div#seg2 {
  grid-column: 2;
  grid-row: 1;
}
div#seg3 {
  grid-column: 3;
  grid-row: 1;
}
div#seg4 {
  grid-column: 4;
  grid-row: 1;
}
div#seg5 {
  grid-column: 5;
  grid-row: 1;
}
div#seg6 {
  grid-column: 6;
  grid-row: 1;
}
div#seg7 {
  grid-column: 7;
  grid-row: 1;
}
div#seg_btn {
  grid-column: 8;
  grid-row: 1;
  border: none;
}
div#seg8 {
  grid-column: 7;
  grid-row: 2;
}
div#seg9 {
  grid-column: 7;
  grid-row: 3;
}
div#seg10 {
  grid-column: 6;
  grid-row: 3;
}
div#seg11 {
  grid-column: 5;
  grid-row: 3;
}
div#seg12 {
  grid-column: 4;
  grid-row: 3;
}
div#seg13 {
  grid-column: 3;
  grid-row: 3;
}
div#seg14 {
  grid-column: 2;
  grid-row: 3;
}
div#seg15 {
  grid-column: 2;
  grid-row: 4;
}
div#seg16 {
  grid-column: 2;
  grid-row: 5;
}
div#seg17 {
  grid-column: 3;
  grid-row: 5;
}
div#seg18 {
  grid-column: 4;
  grid-row: 5;
}
div#seg19 {
  grid-column: 5;
  grid-row: 5;
}
div#seg20 {
  grid-column: 6;
  grid-row: 5;
}
div#seg21 {
  grid-column: 7;
  grid-row: 5;
}
div#seg22 {
  grid-column: 8;
  grid-row: 5;
}

.locationList {
  padding: 0;
  padding-bottom: 20px;
  margin-top: 10px;
  font-size: 0.8em;
}

ul {
  cursor: pointer;
}

li {
  font-size: 1em;
  display: block;
  margin: 0;
  padding: 4px;
  line-height: 1.2;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  color: black;
  list-style: none;
  font-weight: 200;
}
li > ul {
  font-size: 0.7em;
  padding: 0px;
  margin: 0px;
  margin-bottom: 1px;
  /* background: #fff; */
  display: block;
  cursor: pointer;
  font-weight: 100;
}
</style>


<style>
a.highlight {
  text-decoration: none;
}

a.highlight {
}

</style>
