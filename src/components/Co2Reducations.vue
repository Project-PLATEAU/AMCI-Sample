<template lang="pug">
.co2-reducations
  section
    Description 大丸有SDGs ACT5を通じて実施された気候変動と資源循環に寄与するアクションの件数をもとに、独自の計算によってCO2排出削減量を算出しています。3D都市モデル上で舞い上がる葉の量は、大手町・丸の内・有楽町それぞれのエリアで算出されたCO2排出削減量の大きさによって変わります。
    DataTitle 大丸有エリア CO2排出削減量推移
    Data(:value="$amciData.co2reducations")
      span g
    DataSpan
    Co2Graph
    Caption 上記のグラフは、大丸有エリアにて行われた大丸有SDGs ACT5を通じたCO2排出削減量のポテンシャルをイノベーター曲線を用いて表しています。今は、まだ小さな取り組みも、将来的には大きな環境貢献として寄与していくことを期待しています。
  Divider(:marginTop="34" :marginBottom="32")
  section
    DataTitle 直近4ヶ月の活動割合
    .activity-graph
      ActivityGraph(:width="400" :height="300")
</template>

<style lang="scss" scoped>
.co2-reducations {
  .description {
    margin-bottom: 48px;
  }

  .data-title {
    padding-left: 16px;
  }

  .data {
    padding-left: 2px;
    margin-top: -9px;
  }

  .data-span {
    margin-top: -3px;
    margin-bottom: 37px;
  }

  .caption {
    margin-top: 19px;
  }

  section:nth-of-type(1) {
  }

  section:nth-of-type(2) {
    .data-title {
      padding-left: 2px;
      margin-bottom: 14px;
    }
  }

  .activity-graph {
    width: 400px;
    height: 300px;
    margin: 0 auto;
  }
}
</style>
