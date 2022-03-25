<script>
import Vue from 'vue'
import { Pie } from 'vue-chartjs'
import { sdgColors } from '~/utils/consts'

export default Vue.extend({
  mixins: [Pie],

  props: {
    dataset: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      chartData: {
        labels: Object.keys(this.dataset),
        datasets: [
          {
            backgroundColor: Object.values(sdgColors),
            data: Object.values(this.dataset),
            borderWidth: 0,
          },
        ],
      },

      options: {
        plugins: {
          deferred: {
            yOffset: '0%',
          },
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
          custom(tooltip) {
            let tooltipEl = document.querySelector('#tooltip')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'tooltip'
              tooltipEl.innerHTML = '<div></div>'
              document.body.appendChild(tooltipEl)
            }

            const tooltipModel = tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0'
              return
            }

            if (tooltipModel.body) {
              const bodys = tooltipModel.body.map((bodyItem) => bodyItem.lines)
              if (bodys.length > 0) {
                const body = bodys[0][0]
                const str = body.split(':')
                const sdg = str[0].trim()
                const percentage = str[1].trim()
                const image1x = require(`assets/images/sdg_${String(sdg).padStart(2, '0')}.png`)
                const image2x = require(`assets/images/sdg_${String(sdg).padStart(2, '0')}@2x.png`)
                tooltipEl.innerHTML = `<img src="${image1x}" srcset="${image1x} 1x, ${image2x} 2x"><span>${percentage}%</span>`
              }
            }

            const position = this._chart.canvas.getBoundingClientRect()

            tooltipEl.style.opacity = '1'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.pointerEvents = 'none'
          },
        },
      },
    }
  },

  mounted() {
    this.renderChart(this.chartData, this.options)
  },
})
</script>

<style lang="scss">
#tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 70px;
  background: #fff;
  border: 1px solid $base;

  img {
    width: auto;
    height: 100%;
  }

  span {
    width: 100%;
    font-size: 2.4rem;
    text-align: center;
    letter-spacing: 0.05em;
  }
}
</style>
