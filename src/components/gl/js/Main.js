import Stats from 'stats-js'
import Core from './Core'
import Loader from './Loader'
import Scene from './Scene'
import City from './City'

export default class MainGL {
  /**
   * [constructor description]
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
  constructor(props) {
    this.props = props
    this.animation = null
    this.progressFunc = null
    this.completeFunc = null
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  async init() {
    // Setup
    if(this.props.debug) this.setupStats()
    this.addEvent()

    // Progress
    Loader.addProgress((loaded, total) => {
      if (typeof this.progressFunc === 'function') this.progressFunc(loaded, total)
    })

    // Complete
    Loader.addComplete(() => {
      // Callback
      if (typeof this.completeFunc === 'function') {
        this.completeFunc()
      }
    })

    await Loader.init()
  }

  start() {
    // Core
    Core.init(this.props)

    // Objects
    this.city = new City()

    // Animation
    this.loop()
  }

  // ContentType = 'AreaActivity' | 'Venues' | 'SDGsActions'
  // AreaActivityTab = 'Co2Reducations' | 'Walks' | 'Points'
  // SDGsActionsTab = 'All' | 'Yurakucho' | 'Marunouchi' | 'Otemachi'
  /**
   * [changeScene description]
   * @param  {[type]} contentType [description]
   * @param  {[type]} tabName     [description]
   * @return {[type]}             [description]
   */
  changeScene(contentType, tabName) {
    Scene.change(contentType, tabName, this.city)
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    cancelAnimationFrame(this.animation)
    this.removeEvent()

    // Core, Loader
    Core.destroy()
    Loader.destroy()

    // Objects
    this.city.destroy()
  }

  /**
   * [resize description]
   * @return {[type]} [description]
   */
  resize() {
    Core.resize()
  }

  /**
   * [loop description]
   * @return {[type]} [description]
   */
  loop() {
    if(this.props.debug) this.stats.begin()
    this.render()
    if(this.props.debug) this.stats.end()
    this.animation = requestAnimationFrame(this.loop.bind(this))
  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {
    this.city.update()
    Core.render()
  }

  /**
   * [addEvent description]
   */
  addEvent() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  /**
   * [removeEvent description]
   * @return {[type]} [description]
   */
  removeEvent() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  /**
   * [setupStats description]
   * @return {[type]} [description]
   */
  setupStats() {
    // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.getElementById('gl_container').appendChild(this.stats.dom)
    // console.log(this.stats.dom.style.top)
    this.stats.dom.style.top = 'auto'
    this.stats.dom.style.bottom = '0'
  }

  /**
   * [addLoaderProgress description]
   * @param {[type]} func [description]
   */
  addLoaderProgress(func) {
    this.progressFunc = func
  }

  /**
   * [removeLoaderProgress description]
   * @return {[type]} [description]
   */
  removeLoaderProgress() {
    this.progressFunc = null
  }

  /**
   * [addLoaderComplete description]
   * @param {[type]} func [description]
   */
  addLoaderComplete(func) {
    this.completeFunc = func
  }

  /**
   * [removeLoaderComplete description]
   * @return {[type]} [description]
   */
  removeLoaderComplete() {
    this.completeFunc = null
  }
}
