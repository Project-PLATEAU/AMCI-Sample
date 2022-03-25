import Core from './Core'
import Daimaruyu from './City/Daimaruyu'
import Buildings from './City/Buildings'
import Ground from './City/Ground'
// import Bridge from './City/Bridge'
// import Water from './City/Water'
import Shops from './City/Shops'
import Particles from './City/Particles'
import LeafParticles from './City/LeafParticles'
import Trail from './City/Trail'
// import Texts from './City/TextsTexture'
import RingTexts from './City/RingTexts'

export default class City {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.daimaruyu = null
    this.blds = null
    this.ground = null
    // this.bridge = null
    // this.water = null
    this.shops = null
    this.particle = null
    this.leafParticles = null
    this.trail = null
    // this.texts = null
    this.ringTexts = null

    this.init()
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init() {
    this.setup()
  }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    this.daimaruyu = new Daimaruyu()
    this.blds = new Buildings()
    this.ground = new Ground()
    // this.bridge = new Bridge()
    // this.water = new Water()
    this.shops = new Shops()
    this.particle = new Particles()
    this.leafParticles = new LeafParticles()
    this.trail = new Trail()
    // this.texts = new Texts()
    this.ringTexts = new RingTexts()
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    this.daimaruyu.destroy()
    this.blds.destroy()
    this.ground.destroy()
    // this.bridge.destroy()
    // this.water.destroy()
    this.shops.destroy()
    this.particle.destroy()
    this.leafParticles.destroy()
    this.trail.destroy()
    // this.texts.destroy()
    this.ringTexts.destroy()
  }

  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {
    this.daimaruyu.update()
    this.blds.update()
    this.ground.update()
    // this.bridge.update()
    // this.water.update()
    this.shops.update()
    this.particle.update()
    this.leafParticles.update()
    this.trail.update()
    // this.texts.update()
    this.ringTexts.update()
  }

  /**
   * [startDefault description]
   * @return {[type]} [description]
   */
  openDefault() {
    console.log('startDefault')
    this.daimaruyu.updateMaterial(Core.PROJ_MAT)
    this.changeBackground('home')
  }

  /**
   * [openCo2Reducations description]
   * @return {[type]} [description]
   */
  openCo2Reducations() {
    console.log('open Co2Reducations')
    const material = this.daimaruyu.updateAreaMaterial(Core.STANDARD_MAT, 'co2')
    // material.setGreen()
    this.leafParticles.show()
    this.changeBackground('co2')
  }

  /**
   * [closeCo2Reducations description]
   * @return {[type]} [description]
   */
  closeCo2Reducations() {
    console.log('close Co2Reducations')
    this.daimaruyu.updateMaterial(Core.PHONG_MAT)
    this.leafParticles.hide()
    this.changeBackground('home')
  }

  /**
   * [openWalks description]
   * @return {[type]} [description]
   */
  openWalks() {
    console.log('open Walk')
    const material = this.daimaruyu.updateAreaMaterial(Core.STANDARD_MAT, 'walks')
    // material.setOrange()
    this.trail.show()
    this.changeBackground('walk')
  }

  /**
   * [closeWalks description]
   * @return {[type]} [description]
   */
  closeWalks() {
    console.log('close Walk')
    this.daimaruyu.updateMaterial(Core.PHONG_MAT)
    this.trail.hide()
    this.changeBackground('home')
  }

  /**
   * [openPoints description]
   * @return {[type]} [description]
   */
  openPoints() {
    console.log('open Points')
    const material = this.daimaruyu.updateAreaMaterial(Core.STANDARD_MAT, 'point')
    // material.setBlue()
    this.particle.show()
    this.changeBackground('point')
  }

  /**
   * [closePoints description]
   * @return {[type]} [description]
   */
  closePoints() {
    console.log('close Points')
    this.daimaruyu.updateMaterial(Core.PHONG_MAT)
    this.particle.hide()
    this.changeBackground('home')
  }

  /**
   * [openVenues description]
   * @return {[type]} [description]
   */
  openVenues(param) {
    console.log('open Venues', param)
    const material = this.daimaruyu.updateMaterial(Core.STANDARD_MAT)
    material.setTransparent()
    this.ground.setDark()
    this.shops.show()

    Core.controls.toRotateSlow()

    if(param !== ''){
      const mesh = this.shops.getMesh(param)
      this.shops.moveMeshAndCamera(mesh)
    }
    else{
      this.shops.hideLine()
    }
  }

  /**
   * [closeVenues description]
   * @return {[type]} [description]
   */
  closeVenues() {
    console.log('close Venues')
    this.daimaruyu.updateMaterial(Core.PHONG_MAT)
    this.ground.setDefault()
    this.shops.hide()
    this.shops.hideLine()

    Core.controls.toRotateNormal()
  }

  /**
   * [openSDGs description]
   * @param  {[type]} area [description]
   * @return {[type]}         [description]
   */
  openSDGs(area) {
    console.log('open SDGs', area)
    this.daimaruyu.setSDGsMaterial(area)
    this.ground.setNight()
    this.blds.setNight()
    this.ringTexts.toVeryThin()
    this.changeBackground('sdgs')
  }

  /**
   * [closeSDGs description]
   * @return {[type]} [description]
   */
  closeSDGs() {
    console.log('close SDGs')
    this.daimaruyu.updateMaterial(Core.PHONG_MAT)
    this.ground.setDefault()
    this.blds.setDefault()
    this.ringTexts.toThin()
    this.changeBackground('home')
  }

  /**
   * [changeBackground description]
   * @param  {[type]} className [description]
   * @return {[type]}           [description]
   */
  changeBackground(className){
    const element = document.getElementById('canvas_container')
    element.classList.remove('home', 'co2', 'walk', 'point', 'sdgs')
    element.classList.add(className)
  }
}
