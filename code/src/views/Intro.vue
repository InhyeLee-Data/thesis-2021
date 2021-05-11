<template>
      <!-- <div id="Section_Intro" style="background-image:url(img/textRain.svg)"> -->
      <div id="Section_Intro">
        <div class="center">
          <div class="intro_title">
            <h3>Mapping the literary geography of</h3>
            <h1>SONAGI  소나기</h1>
          </div>
          <p>
            <b>Sonagi 소나기</b> is a Korean word that means <b>rain shower</b>. 
            It is also the title of a short story by the author Hwang Sun Won, one of the most accomplished writers of short fiction in modern Korea literature. The story which has a simple plot of “a boy in the countryside meets a girl from the city” is one of the most well-known short stories of Hwang. 
            They spend a few sporadic days together browsing the neighborhood set in an agricultural village and there is a slight hint of innocent romance built between them. 
          </p>
      
          <p>The idyllic and natural setting that two young protagonists explore on foot is one of the core elements of the story. 
            This project aims to identify <b>the literary geography of Sonagi</b> and <b>construct a map of the story</b>, providing another way of understanding the story.
            </p>
            <router-link to="combinedview"><el-button icon="el-icon-arrow-down" circle size="small"></el-button></router-link>
          </div>
          
          
        </div>

</template>

<script>
export default ({
    name: 'Intro',
    data() {
        return { // data have to be returned;
            visible: true
        }
    },
    props: {
        // sections: Array
    },
    computed: {
      scrollBlock(){
          return Math.floor(this.scrollPosition / 100)
      }
    }
})
</script>

<style scoped>
body {
  background: #fff;
  /* background-image: url(img/textRain.svg); */
}
#Section_Intro {
  height: 95vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap:0; grid-gap: 0;
  padding: 0.75rem;
  
}
.center{
 /* margin-top: 50; */
  grid-column: 2/4;
  grid-row: 1;
   background: #58D99B;
    color: #fff;
    padding: 50px;
    min-width: 600px;
}

.intro_title {
  display: inline-block;
  border-top: 10px solid #fff;
  border-bottom: 1px solid #fff;
  text-align: left;
  min-width: 600px;
}
.intro_title h3 {
  color: rgb(255, 255, 255, 0.5);
}
.intro_title h1 {
  color: rgb(255, 255, 255, 1);
}

</style>