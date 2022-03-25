import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { AreaActivityTab, ContentType, SDGsActionsTab } from '~/types'

@Module({
  name: 'event',
  stateFactory: true,
  namespaced: true,
})
export default class EventStore extends VuexModule {
  isSoundEnabled: Boolean | null = null
  isModalAboutActive: Boolean = false
  isSideBarActive: boolean = true
  currentContent: ContentType = 'Home'
  currentAreaActivityTab: AreaActivityTab | null = null
  currentVenue: any = {}
  currentAct: string = ''
  currentSDGsActionsTab: SDGsActionsTab | null = null

  @Mutation
  private SET_MODAL_ABOUT(isActive: boolean) {
    this.isModalAboutActive = isActive
  }

  @Action({ rawError: true })
  showModalAbout() {
    this.SET_MODAL_ABOUT(true)
  }

  @Action({ rawError: true })
  hideModalAbout() {
    this.SET_MODAL_ABOUT(false)
  }

  @Mutation
  private SET_CURRENT_CONTENT(contentType: ContentType) {
    this.currentContent = contentType
  }

  @Mutation
  private SET_SDGS_ACTIONS_TAB(sdgsActionsTab: SDGsActionsTab | null) {
    this.currentSDGsActionsTab = sdgsActionsTab
  }

  @Mutation
  private SET_VENUE(venue: any) {
    this.currentVenue = venue
  }

  @Mutation
  private SET_CURRENT_ACT(act: string) {
    this.currentAct = act
  }

  @Mutation
  private SET_AREA_ACTIVITY_TAB(areaActivityTab: AreaActivityTab | null) {
    this.currentAreaActivityTab = areaActivityTab
  }

  @Mutation
  private SET_SOUND_ENABLED(isSoundEnabled: Boolean) {
    this.isSoundEnabled = isSoundEnabled
  }

  @Mutation
  private SET_SIDE_BAR_ACTIVE(isSideBarActive: boolean) {
    this.isSideBarActive = isSideBarActive
  }

  @Action({ rawError: true })
  showContent(contentType: ContentType) {
    this.SET_CURRENT_CONTENT(contentType)
  }

  @Action({ rawError: true })
  hideContent() {
    this.SET_CURRENT_CONTENT('Home')
  }

  @Action({ rawError: true })
  setAreaActivityTab(areaActivityTab: AreaActivityTab | null) {
    this.SET_AREA_ACTIVITY_TAB(areaActivityTab)
  }

  @Action({ rawError: true })
  setVenue(venue: any) {
    this.SET_VENUE(venue)
  }

  @Action({ rawError: true })
  setCurrentAct(act: string) {
    this.SET_CURRENT_ACT(act)
  }

  @Action({ rawError: true })
  setSDGsActionsTab(sdgsActionsTab: SDGsActionsTab | null) {
    this.SET_SDGS_ACTIONS_TAB(sdgsActionsTab)
  }

  @Action({ rawError: true })
  toggleSound() {
    this.SET_SOUND_ENABLED(!this.isSoundEnabled)
  }

  @Action({ rawError: true })
  setSoundEnabled(isSoundEnabled: Boolean) {
    this.SET_SOUND_ENABLED(isSoundEnabled)
  }

  @Action({ rawError: true })
  toggleSideBar() {
    this.SET_SIDE_BAR_ACTIVE(!this.isSideBarActive)
  }

  @Action({ rawError: true })
  setSideBarActive(isSideBarActive: boolean) {
    this.SET_SIDE_BAR_ACTIVE(isSideBarActive)
  }
}
