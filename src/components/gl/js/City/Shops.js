import * as THREE from 'three'
import gsap from 'gsap'
import Core from '../Core'
import Constants from '../Constants'
import ShopData from '../Data/Shops.json'
import Data from '~/assets/data/data.json'

export default class Shops {

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.object = null
    this.parameters = {
      visible: true
    }
    this.material = null

    this.INTERSECTED = null
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.defColor = new THREE.Color(Core.green)
    this.activeColor = new THREE.Color(Core.pink)
    this.lineBasePos = new THREE.Vector3()
    this.isHide = true

    this.zero = {
      lat: 35.682478,
      lng: 139.764793
    }

    this.params = {
      scalex: 1220.0,
      scalez: 1620.0,
      position: {x: -0.3, y: 0, z: -0.1},
      rotation: -133.0
    }

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

    this.object = new THREE.Group()
    Core.frontScene.add(this.object)

    const sphereSize = 0.05

    for (const i in ShopData) {
      const data = ShopData[i]

      const geometry = new THREE.SphereGeometry(sphereSize, 16, 16)
      const material = new THREE.MeshBasicMaterial({
        color: this.defColor,
        transparent: true,
        opacity: 0.7,
        // depthTest: false,
      })
      // const material = new THREE.MeshPhongMaterial({
      //   color: this.defColor,
      //   transparent: true,
      //   opacity: 0.7,
      //   // depthTest: false,
      // })
      const mesh = new THREE.Mesh(geometry, material.clone())
      this.object.add(mesh)
      mesh.index = i
      mesh.shopId = Number(data.no)
      const p = this.getWorldPosition(i)
      mesh.position.set(p.x, p.y, p.z)

      // console.log(name, diff, x, y, z)
    }
    this.hide()

    Core.renderer.domElement.addEventListener('mousemove', (e) => {
      this.onMouseMove(e)
    })
    Core.renderer.domElement.addEventListener('mousedown', (e) => {
      this.onMouseDown(e)
    })
    Core.renderer.domElement.addEventListener('mouseup', (e) => {
      this.onMouseUp(e)
    })

    this.createLine()
    this.hideLine()

    this.setupGUI('Shops')
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    Core.frontScene.remove(this.object)
    Core.frontScene.remove(this.line)
    Core.renderer.domElement.removeEventListener('mousemove')
    Core.renderer.domElement.removeEventListener('mousedown')
    Core.renderer.domElement.removeEventListener('mouseup')
  }

  /**
   * [show description]
   * @return {[type]} [description]
   */
  show() {
    this.isHide = false
    this.object.visible = true
  }

  /**
   * [hide description]
   * @return {[type]} [description]
   */
  hide() {
    this.isHide = true
    this.object.visible = false
  }

  /**
   * [getWorldPosition description]
   * @param  {[type]} i    [description]
   * @param  {[type]} mesh [description]
   * @return {[type]}      [description]
   */
  getWorldPosition(i, mesh){
    const data = ShopData[i]
    const lat = data.lat
    const lng = data.lng

    const diff = {}
    diff.lat = lat - this.zero.lat
    diff.lng = lng - this.zero.lng

    let x = -diff.lng * this.params.scalex + this.params.position.x
    let y = Number(data.height) * 0.01 + this.params.position.y
    let z = diff.lat * this.params.scalez + this.params.position.z

    x = x * Math.sin(this.params.rotation * (Math.PI / 180))
    z = z * Math.cos(this.params.rotation * (Math.PI / 180))

    let px = data.position.x
    let py = data.position.y
    let pz = data.position.z

    if(px + py + pz !== 0){
      x = px
      y = py
      z = pz
    }

    // console.log('x:'+x, 'y:'+y, 'z:'+z, lat, lng)

    return {
      x, y, z
    }
  }

  // /**
  //  * [translateGeoCoords description]
  //  * @param  {[type]} lat  [description]
  //  * @param  {[type]} lng [description]
  //  * @return {[type]}           [description]
  //  */
  // translateGeoCoords(lat, lng) {
  //   const radius = this.params.scale
  //   const phi = (lat * Math.PI) / 180.0
  //   const theta = ((lng - 180) * Math.PI) / 180.0

  //   console.log(lat, lng, phi, theta)

  //   return {
  //     x: -1 * radius * Math.cos(phi) * Math.cos(theta),
  //     y: radius * Math.sin(phi),
  //     z: radius * Math.cos(phi) * Math.sin(theta),
  //   }
  // }

  /**
   * [onMouseMove description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onMouseMove(e) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  /**
   * [onMouseDown description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onMouseDown(e) {
    // console.log('mousedown', e, this.INTERSECTED)

    if (this.INTERSECTED && !this.isHide) {
      const mesh = this.INTERSECTED
      this.moveMeshAndCamera(mesh)

      const shopId = mesh.shopId
      let venueData = null

      for(let i in Data.venues){
        let d = Data.venues[i]
        // console.log(d.id, shopId)
        if(Number(d.id) === shopId){
          venueData = d
          break
        }
      }

      // console.log('venueData', venueData)
      Core.vueContainer.setShop(venueData)
    }
  }

  /**
   * [onMouseUp description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onMouseUp(e) {}


  /**
   * [getMesh description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getMesh(id){
    let mesh = null
    for(let i = 0; i < this.object.children.length; i++){
      let obj = this.object.children[i]
      // console.log(obj.shopId, ':' ,id)
      if(obj.shopId === id){
        mesh = obj
        break
      }
    }
    return mesh
  }


  /**
   * [moveMeshAndCamera description]
   * @param  {[type]} sphereMesh [description]
   * @return {[type]}      [description]
   */
  async moveMeshAndCamera(sphereMesh){
    gsap.to(sphereMesh.scale, {
      x: 2.0,
      y: 2.0,
      z: 2.0,
      duration: 0.5,
      ease: 'circ.inOut',
      onComplete: () => {},
    })
    gsap.to(sphereMesh.scale, {
      x: 1.0,
      y: 1.0,
      z: 1.0,
      duration: 0.5,
      delay: 0.5,
      ease: 'circ.inOut',
      onComplete: () => {},
    })

    this.hideLine()

    // sphereMesh.shopId

    // const raycaster = new THREE.Raycaster()
    // raycaster.setFromCamera(sphereMesh.position, Core.camera)

    console.log('sphereMesh.shopId', sphereMesh.shopId)
    let meshPos = sphereMesh.position.clone()
    let cameraPos = meshPos.clone()
    cameraPos.x += 0.0
    cameraPos.y += 3.5
    cameraPos.z += 7.0
    let targetPos = meshPos.clone()
    targetPos.x += -4.0
    targetPos.y += 0.0
    targetPos.z += -4.0
    await Core.cameraMove(cameraPos, targetPos)

    this.setLineBase(meshPos.clone())
    this.showLine()
  }


  /**
   * [createLine description]
   * @return {[type]} [description]
   */
  createLine() {
    const material = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2.0,
      depthTest: false,
      side: THREE.DoubleSide,
      fog: false
    })
    const geometry = new THREE.BufferGeometry().setFromPoints([])
    this.line = new THREE.Line(geometry, material)
    Core.frontScene.add(this.line)
  }

  /**
   * [setLineBase description]
   * @param {[type]} pos [description]
   */
  setLineBase(pos){
    this.lineBasePos = pos
  }

  /**
   * [updateLine description]
   * @param  {[type]} pos [description]
   * @return {[type]}     [description]
   */
  updateLine() {
    let modalWidthPer = 604 / Core.size.windowW
    let glWidthPer = 1.0 - modalWidthPer
    let center = modalWidthPer + glWidthPer / 2

    const screen = new THREE.Vector3(center * 2.0 - 1.0, 0, 1.0)
    const screenVec = screen.unproject(Core.camera)

    const points = []
    points.push(this.lineBasePos)
    points.push(screenVec)

    this.line.geometry.setFromPoints(points)
    this.line.geometry.needsUpdate = true

    // visible
    if(Core.controls.isDragged){
      this.line.material.visible = false
    }
    else{
      this.line.material.visible = true
    }
  }

  /**
   * [showLine description]
   * @return {[type]} [description]
   */
  showLine(){
    this.line.visible = true
  }

  /**
   * [hideLine description]
   * @return {[type]} [description]
   */
  hideLine(){
    this.line.visible = false
  }


  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {
    // find intersections
    this.raycaster.setFromCamera(this.mouse, Core.camera)
    const intersects = this.raycaster.intersectObjects(this.object.children)
    // console.log(intersects)

    if (intersects.length > 0) {

      if (this.INTERSECTED != intersects[0].object) {

        // console.log(intersects, this.INTERSECTED)

        // before
        if (this.INTERSECTED) {
          console.log('INTERSECTED', this.INTERSECTED)
          // this.INTERSECTED.scale.set(1.0, 1.0, 1.0)
        }

        // console.log('over')

        // active
        this.INTERSECTED = intersects[0].object

        gsap.to(this.INTERSECTED.scale, {
          x: 2.0,
          y: 2.0,
          z: 2.0,
          duration: 0.10,
          ease: 'circ.inOut',
          omComplete: () => {},
        })
        Core.renderer.domElement.style.cursor = 'pointer'
      }
    } else {
      // default
      if (this.INTERSECTED) {
        // console.log('out')

        gsap.to(this.INTERSECTED.scale, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          duration: 0.5,
          ease: 'circ.inOut',
          omComplete: () => {},
        })
        Core.renderer.domElement.style.cursor = 'auto'
      }
      this.INTERSECTED = null
    }

    // line
    this.updateLine()
  }


  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI(name) {
    if(Core.debug){
      const folder = Core.gui.dat.addFolder(name)
      // folder.add(this.params, 'speed', 1.0, 100.0, 1.0)
      folder.add(this.params, 'scalex', 1.0, 2000.0, 0.1).onChange((value)=>{this.updateGUI()})
      folder.add(this.params, 'scalez', 1.0, 2000.0, 0.1).onChange((value)=>{this.updateGUI()})
      folder.add(this.params.position, 'x').min(-10.0).max(10.0).step(0.001).onChange((value)=>{this.updateGUI()})
      folder.add(this.params.position, 'y').min(-10.0).max(10.0).step(0.001).onChange((value)=>{this.updateGUI()})
      folder.add(this.params.position, 'z').min(-10.0).max(10.0).step(0.001).onChange((value)=>{this.updateGUI()})
      folder.add(this.params, 'rotation').min(-360).max(360).step(0.1).onChange((value)=>{this.updateGUI()})
    }
  }

  /**
   * [updateGUI description]
   * @return {[type]} [description]
   */
  updateGUI(){
    this.object.traverse((obj)=>{
      if(obj.isMesh){
        const p = this.getWorldPosition(obj.index)
        obj.position.set(p.x, p.y, p.z)
      }
    })
  }


}
