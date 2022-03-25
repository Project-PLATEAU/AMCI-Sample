import * as THREE from 'three'
import gsap from 'gsap'
import Core from '../Core'

export default class AnimationRender {

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    const canvas = document.getElementById('texture')
    this.texture = new THREE.CanvasTexture(canvas)

    const width = 960
    const height = 540

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeeeeee)

    // Render
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // Camera
    const camera = new THREE.OrthographicCamera(-width / 2, +width / 2, height / 2, -height / 2, 1, 1000)
    // camera.position.set(0, 0, 5)
    // camera.lookAt(scene.position)

    // Object
    const planes = new THREE.Object3D()
    scene.add(planes)

    this.length = 50
    this.loopCount = 0

    this.width = width
    this.height = height
    this.scene = scene
    this.canvas = canvas
    this.renderer = renderer
    this.camera = camera
    this.planes = planes

    this.materialY = new THREE.MeshBasicMaterial({color: 0xf3cf3f, side: THREE.DoubleSide, transparent: true, opacity: 1.0})
    this.materialB = new THREE.MeshBasicMaterial({color: 0x3498db, side: THREE.DoubleSide, transparent: true, opacity: 1.0})
    this.materialW = new THREE.MeshBasicMaterial({color: 0xeeeeee, side: THREE.DoubleSide, transparent: true, opacity: 1.0})
    this.data = {
      geoWidth: 20,
      geoHeight: 400,
      distance: 400,
      duration: 2.0,
      delay: 2.0,
    }

    this.setupGUI()
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy(){
    this.renderer.domElement.addEventListener('dblclick', null, false)
    this.scene = null
    this.camera = null
    empty(this.planes)
  }

  /**
   * [empty description]
   * @param  {[type]} elem [description]
   * @return {[type]}      [description]
   */
  empty(elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
  }

  /**
   * [update description]
   * @return {[type]}      [description]
   */
  update(){
    // const total = time.total

    // this.planes.traverse((obj) => {
    //   if(obj.isMesh) {
    //   }
    // })

    if(this.loopCount % 12 === 0){
      this.addLine()
    }

    if(this.loopCount % (60 * 5) === 0){
      this.addCircle()
    }

    this.renderer.render(this.scene, this.camera)

    this.loopCount++
    this.texture.needsUpdate = true
  }

  /**
   * [addLine description]
   */
  addLine(){
    if(this.planes.children.length > this.length) return false

    const splitLen = 30
    const splitSize = this.width / splitLen
    const splitRan = Math.floor(Math.random() * 30)

    const rand = Math.random()
    // const w = Math.ceil(rand * 4) * 5
    const w = rand * this.data.geoWidth
    const h = this.data.geoHeight
    const distance = this.data.distance
    const duration = this.data.duration
    const delay = this.data.delay

    const geometry = new THREE.PlaneGeometry(w, h)
    let material = null
    if(Math.random() < 0.5){
      material = this.materialY
    }
    else{
      material = this.materialB
    }
    const mesh = new THREE.Mesh(geometry, material)
    // mesh.rotation.x = 160 * Math.PI / 180
    mesh.rotation.z = -45 * Math.PI / 180
    const x = splitRan * splitSize - (this.width / 2)
    const y = 0
    const z = -100 - rand * 100
    const beforeX = x + distance * Math.sin(-mesh.rotation.z)
    const beforeY = y + distance * Math.cos(-mesh.rotation.z)
    const afterX = x - distance * Math.sin(-mesh.rotation.z)
    const afterY = y - distance * Math.cos(-mesh.rotation.z)
    // mesh.position.set(fx, fy, fz)
    mesh.position.set(beforeX, beforeY, z)
    this.planes.add(mesh)

    gsap.to(mesh.position, {
      x,
      y,
      duration: duration,
      delay: 0.0,
      ease: 'circ.inOut',
      repeat: 0,
    })

    gsap.to(mesh.position, {
      x: afterX,
      y: afterY,
      duration: duration,
      delay: duration + delay,
      ease: 'circ.inOut',
      repeat: 0,
      onComplete: ()=>{
        this.planes.remove(mesh)
        // console.log(mesh, this.planes.children.length)
      }
    })
  }

  /**
   * [addCircle description]
   */
  addCircle(){
    console.log('addCircle')
    const duration = 2.0
    const delay = 2.0
    const circleLen = 8

    const group = new THREE.Group()
    group.position.x = this.width * Math.random() - (this.width / 2)
    group.position.y = 0
    group.position.z = -50
    // group.scale.set(0, 0, 0)
    this.planes.add(group)

    for(let i = 0; i < circleLen; i++){
      const size = (circleLen - i) * 10
      const geometry = new THREE.CircleGeometry(size, 32)
      const material = null

      if(i === 0) material = this.materialW
      else if(i === 1) material = this.materialY
      else if(i === 2) material = this.materialW
      else if(i === 3) material = this.materialB
      else if(i === 4) material = this.materialW
      else if(i === 5) material = this.materialY
      else if(i === 6) material = this.materialW
      else if(i === 7) material = this.materialB

      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)

      // console.log(i % 3, material)

      mesh.scale.x = 0
      mesh.scale.y = 0

      gsap.to(mesh.scale, {
        x: 1.0,
        y: 1.0,
        duration: 0.5,
        delay: 0.1 * i,
        ease: 'circ.inOut',
        repeat: 0,
        onComplete: ()=>{
          if(i >= circleLen - 1){
            console.log('close')
            this.removeCircle(group)
          }
        }
      })
    }

  }

  /**
   * [removeCircle description]
   * @param  {[type]} group [description]
   * @return {[type]}       [description]
   */
  removeCircle(group){
    gsap.to(group.scale, {
      x: 0.0,
      y: 0.0,
      duration: 2.0,
      delay: 0.0,
      ease: 'circ.inOut',
      repeat: 0,
      onComplete: ()=>{
        for(let i = group.children.length; i > 0; i--){
          group.remove(group.children[i])
        }
        this.planes.remove(group)
      }
    })
  }

  /**
   * [setupGUI description]
   * @return {[type]}        [description]
   */
  setupGUI(){
    if(Core.debug){
      // console.log('setupGUI')
      const f = Core.gui.dat.addFolder('AnimationRender')
      f.add(this.data, 'geoWidth', 1, 1000)
      f.add(this.data, 'geoHeight', 1, 1000)
      f.add(this.data, 'distance', 1, 1000)
      f.add(this.data, 'duration', 0.0, 5.0)
      f.add(this.data, 'delay', 0.0, 5.0)
    }
  }

}
