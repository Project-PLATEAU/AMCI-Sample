import data from '@/assets/data/data.json'

export type ContentType = 'Home' | 'AreaActivity' | 'Venues' | 'SDGsActions'
export type AreaActivityTab = 'Co2Reducations' | 'Walks' | 'Points'
export type Area = 'Otemachi' | 'Marunouchi' | 'Yurakucho'
export type SDGsActionsTab = 'All' | Area

export type SoundType = 'click' | 'hover' | 'clickSub' | 'hoverSub' | 'opening' | 'contentChange'

// plugins
declare module 'vue/types/vue' {
  interface Vue {
    $amciData: typeof data
    $playSound: (soundType: SoundType) => {}
    $playBgm: () => {}
    $pauseBgm: () => {}
    $gtag: Function
  }
}
