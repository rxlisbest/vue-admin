<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">上传统计(单位/M)</h4>
         <!--  <div class="block">
            <chartist class="lines-bars" :type="'Line'" :data="linesData" :options="linesOptions"></chartist>
          </div> -->
          <div class="block">
            <chartist v-if="chartistShow" class="lines-bars" :type="'Line'" :data="lineAreaData" :options="lineAreaOptions"></chartist>
          </div>
        </article>
      </div>
      <!-- <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">BARS</h4>
          <div class="block">
            <chartist class="lines-bars" :type="'Bar'" :data="linesData" :options="linesOptions"></chartist>
          </div>
          <div class="block">
            <chartist class="lines-bars" :type="'Bar'" :data="barsData" :options="barsOptions" :responsive-options="barsResponsiveOptions"></chartist>
          </div>
        </article>
      </div> -->
    </div>
    <!-- <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">PIES & DONUTS</h4>
          <div class="content">
            <div class="columns">
              <div class="column">
                <chartist class="lines-bars" :type="'Pie'" :data="pieData" :options="pieOptions"></chartist>
              </div>
              <div class="column">
                <chartist class="lines-bars" :type="'Pie'" :data="gaugeData" :options="gaugeOptions"></chartist>
              </div>
              <div class="column">
                <chartist class="lines-bars" :type="'Pie'" :data="donutData" :options="donutOptions"></chartist>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div> -->
  </div>
</template>

<script>
import Chartist from 'vue-bulma-chartist'

export default {
  components: {
    Chartist
  },

  data () {
    return {
      chartistShow: true,
      lineAreaData: {
        labels: [],
        series: [
          []
        ]
      },
      lineAreaOptions: {
        low: 0,
        showArea: true
      },
      is_mobile: false
    }
  },

  beforeMount () {
    // 判断是否是移动设备
    const { body } = document
    const WIDTH = 768
    const RATIO = 3

    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect();
        let isMobile = rect.width - RATIO < WIDTH;
        this.is_mobile = isMobile;
      }
    }

    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)
  },
  watch: {
    is_mobile: 'loadData'
  },
  methods: {
    loadData () {
      let _this = this;
      let type = 'month_storage';
      if(_this.is_mobile){
        type = 'week_storage';
      }
      _this.chartistShow = false;
      _this.axios({
        url: api.statistic.index,
        method: "get",
        params: {
          type: type,
        }
      }).then((response) => {
        _this.lineAreaData.labels = response.data.labels;
        let series = [];
        for(let i in response.data.series){
            series.push(Math.ceil(response.data.series[i]/1024/1024));
        }
        _this.lineAreaData.series = [series];
        _this.chartistShow = true;
      }).catch((error) => {
        // console.log(error)
      })
    }
  },

  mounted () {
    this.loadData();
  }
}
</script>

<style scoped>
.lines-bars {
  height: 240px;
}
</style>
