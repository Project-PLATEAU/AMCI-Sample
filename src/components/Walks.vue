<template lang="pug">
.walks
  Description 総歩数は、一日8000歩以上を歩いた方々の総歩数です。総歩数をもとに医療費抑制効果を算出します。総歩数の増加にともなって3D都市モデル上で躍動する光の道筋がよりダイナミックに変化していきます。
  section
    DataTitle 参加者 総歩数
    Data(:value="$amciData.totalWalks")
      span 歩
    DataSpan
  Divider(:marginTop="36" :marginBottom="34")
  section
    DataTitle 抑制された医療費
    Data(:value="$amciData.medicalExpensesReducations")
      span 円
    Caption 抑制された医療費は、国土交通省策定の健康・医療・福祉のまちづくりの推進ガイドラインにおける1日1歩当たりの医療費抑制効果をもとに算定しています。
  Divider(:marginTop="33" :marginBottom="35")
  section
    DataTitle 地球から月までの往復距離
    Data(:value="$amciData.totalWalksDistance" :base="100")
      span 往復
    EarthMoon
    Caption 上記は、平均的な成人の歩幅を70cmとして算定しています。
</template>

<style lang="scss" scoped>
.walks {
  .description {
    margin-bottom: 48px;
  }

  .data-title {
    margin-bottom: 1px;
  }

  .data {
    margin-bottom: -3px;
  }

  section:nth-of-type(1) {
  }

  section:nth-of-type(2) {
    .data {
      margin-bottom: -4px;
    }
  }

  section:nth-of-type(3) {
    .caption {
      margin-top: 13px;
      text-align: center;

      &::before {
        position: inherit;
      }
    }
  }

  .divider {
    position: relative;

    &::after {
      position: absolute;
      top: -6px;
      left: 50%;
      content: '';
      border-color: $base transparent transparent transparent;
      border-style: solid;
      border-width: 17.3px 10px 0 10px;
      transform: translateX(-50%);
    }
  }
}
</style>
