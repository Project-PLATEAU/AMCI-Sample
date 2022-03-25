<script>
import Vue from 'vue'
import { Pie } from 'vue-chartjs'

export default Vue.extend({
  mixins: [Pie],

  data() {
    const value = this.$amciData.totalPoints / 1000000

    return {
      chartData: {
        labels: null,
        datasets: [
          {
            backgroundColor: ['#eaf000', 'transparent'],
            data: [value, 1 - value],
            borderWidth: 0,
          },
        ],
      },

      options: {
        plugins: {
          deferred: {
            yOffset: '50%',
          },
        },
        cutoutPercentage: 75,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        hover: {
          mode: null,
        },
      },
    }
  },

  mounted() {
    this.addPlugin({
      beforeDraw(chart) {
        const x = chart.canvas.clientWidth / 2
        const y = chart.canvas.clientHeight / 2
        const ctx = chart.ctx

        ctx.beginPath()
        ctx.arc(x, y, chart.outerRadius - chart.radiusLength / 2, 0, 2 * Math.PI)
        ctx.lineWidth = chart.radiusLength - 0.6
        ctx.strokeStyle = '#463c64'
        ctx.stroke()
      },
    })
    this.renderChart(this.chartData, this.options)
  },
})
</script>
