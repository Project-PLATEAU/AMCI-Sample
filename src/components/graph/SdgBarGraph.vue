<script>
import Vue from 'vue'
import { HorizontalBar } from 'vue-chartjs'
import { sdgColors } from '~/utils/consts'

export default Vue.extend({
  mixins: [HorizontalBar],

  props: {
    dataset: {
      type: Object,
      default: null,
    },
  },

  data() {
    const colors = { ...sdgColors }
    // @ts-ignore
    const dataset = { ...this.dataset }

    Object.entries(dataset).forEach((data) => {
      if (data[1] === 0) {
        delete dataset[`${data[0]}`]
        delete colors[`${data[0]}`]
      }
    })

    return {
      chartData: {
        labels: Object.keys(dataset),
        datasets: [
          {
            backgroundColor: Object.values(colors),
            data: Object.values(dataset),
            barThickness: 30,
          },
        ],
      },

      options: {
        plugins: {
          deferred: {
            yOffset: '50%',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        layout: {
          padding: {
            left: 23,
            right: 100,
            bottom: 0,
          },
        },
        tooltips: {
          enabled: false,
        },
        hover: {
          mode: null,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    }
  },

  mounted() {
    const images = []
    for (let i = 1; i <= 17; i++) {
      const image = new Image()
      image.src = require(`assets/images/sdg_${String(i).padStart(2, '0')}.png`)
      images.push(image)
    }

    this.addPlugin({
      beforeDraw(chart) {
        const ctx = chart.ctx
        const width = chart.width
        const padding = chart.options.layout.padding
        const xAxis = chart.scales['x-axis-0']
        const yAxis = chart.scales['y-axis-0']
        const imageSize = 30
        yAxis.ticks.forEach((value, index) => {
          const y = yAxis.getPixelForTick(index)
          ctx.drawImage(images[value - 1], xAxis.left - padding.left - 10, y - imageSize * 0.5, imageSize, imageSize)

          ctx.fillStyle = '#e5e5e5'
          ctx.beginPath()
          ctx.rect(xAxis.left, y - 15, width - imageSize - 3, imageSize)
          ctx.fill()

          ctx.textAlign = 'right'
          ctx.fillStyle = '#444'
          ctx.font = "14px 'A+mfCv-東京シティフォント コンプレス M StdN'"
          const data = chart.config.data.datasets[0].data[index]
          ctx.fillText(`${data.toLocaleString()}pt`, xAxis.right + padding.right - 6, y + 5)
        })
      },
    })
    this.renderChart(this.chartData, this.options)
  },
})
</script>
