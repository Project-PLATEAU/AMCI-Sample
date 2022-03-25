<script>
import Vue from 'vue'
import { Pie } from 'vue-chartjs'

function getSuitableY(y, yArray = [], direction) {
  let result = y
  yArray.forEach((existedY) => {
    if (existedY - 14 < result && existedY + 14 > result) {
      result = direction === 'right' ? existedY - 14 : existedY - 14
    }
  })

  return result
}

export default Vue.extend({
  mixins: [Pie],

  data() {
    return {
      chartData: {
        labels: Object.keys(this.$amciData.recentActivities),
        datasets: [
          {
            backgroundColor: ['#463c64', '#eaf000', '#00bebd', '#ef5285'],
            data: Object.values(this.$amciData.recentActivities),
            borderWidth: 5,
          },
        ],
      },

      options: {
        plugins: {
          deferred: {
            yOffset: '0%',
          },
        },
        responsive: true,
        animation: {
          duration: 500,
        },
        layout: {
          padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        },
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
      afterDraw: (chart) => {
        chart.radiusLength = 120
        chart.outerRadius = 120

        const ctx = chart.ctx
        ctx.save()
        ctx.font = "16px 'A+mfCv-東京シティフォント コンプレス M StdN'"

        const leftLabelCoordinates = []
        const rightLabelCoordinates = []
        const chartCenterPoint = {
          x: (chart.chartArea.right - chart.chartArea.left) / 2 + chart.chartArea.left,
          y: (chart.chartArea.bottom - chart.chartArea.top) / 2 + chart.chartArea.top,
        }

        chart.config.data.labels.forEach((label, i) => {
          const meta = chart.getDatasetMeta(0)
          const arc = meta.data[i]
          const dataset = chart.config.data.datasets[0]
          const centerPoint = arc.getCenterPoint()
          const model = arc._model

          model.outerRadius = Math.min(140, 90 + 100 * (dataset.data[i] / 100))

          const angle = Math.atan2(centerPoint.y - chartCenterPoint.y, centerPoint.x - chartCenterPoint.x)

          const targetPoint = {
            x: chartCenterPoint.x + Math.cos(angle) * (model.outerRadius + 15),
            y: chartCenterPoint.y + Math.sin(angle) * (model.outerRadius + 15),
          }

          targetPoint.y =
            targetPoint.x < chartCenterPoint.x
              ? getSuitableY(targetPoint.y, leftLabelCoordinates, 'left')
              : getSuitableY(targetPoint.y, rightLabelCoordinates, 'right')

          const value = `${label} ${dataset.data[i]}%`
          const edgePointX = targetPoint.x < chartCenterPoint.x ? 10 : chart.width - 10

          targetPoint.x < chartCenterPoint.x
            ? leftLabelCoordinates.push(targetPoint.y)
            : rightLabelCoordinates.push(targetPoint.y)

          const color = '#444'

          // draw line
          ctx.strokeStyle = color
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(centerPoint.x, centerPoint.y, 3, 0, 2 * Math.PI, false)
          ctx.fill()
          ctx.moveTo(centerPoint.x, centerPoint.y)
          ctx.lineTo(targetPoint.x, targetPoint.y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(targetPoint.x, targetPoint.y)
          ctx.lineTo(edgePointX, targetPoint.y)
          ctx.stroke()

          // draw text
          const labelAlignStyle = edgePointX < chartCenterPoint.x ? 'left' : 'right'
          const labelX = edgePointX
          const labelY = targetPoint.y - 5
          ctx.textAlign = labelAlignStyle
          ctx.textBaseline = 'bottom'
          ctx.fillStyle = color
          ctx.fillText(value, labelX, labelY)
        })
        ctx.restore()
      },
    })
    this.renderChart(this.chartData, this.options)
  },
})
</script>
