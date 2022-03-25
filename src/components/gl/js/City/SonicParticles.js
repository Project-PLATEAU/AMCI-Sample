import * as THREE from 'three'
import Core from '../Core'
import Loader from '../Loader'
import Util from '../Utils/Util'
import SonicParticleMaterial from '../Material/SonicParticleMaterial'
import Data from '~/assets/data/data.json'

export default class Particles {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.radius = 3.5
    this.size = 15.0
    this.length = 500

    this.defaultPos = []
    this.speeds = []

    this.vertices = []
    this.colors = []
    this.scales = []

    this.geometry = null
    this.material = null
    this.setup()

    this.hide()
  }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    const yurakucho = Data.areaData.yurakucho.point
    const marunouchi = Data.areaData.marunouchi.point
    const otemachi = Data.areaData.otemachi.point
    const total = yurakucho + marunouchi + otemachi

    this.points = {
      yurakucho: yurakucho,
      marunouchi: marunouchi,
      otemachi: otemachi,
      total: total
    }

    this.pointsPer = {
      yurakucho: this.points.yurakucho / this.points.total,
      marunouchi: this.points.marunouchi / this.points.total,
      otemachi: this.points.otemachi / this.points.total
    }

    console.log('points:', this.points)
    console.log('pointsPer:', this.pointsPer)

    this.pointsPer = Util.calcAverage(this.pointsPer, 0.8)

    console.log('pointsPer(ave):', this.pointsPer)

    this.geometry = this.createGeometry()
    this.material = new SonicParticleMaterial({})
    this.particles = new THREE.Mesh(this.geometry, this.material)
    Core.scene.add(this.particles)
  }

  /**
   * [createGeometry description]
   * @return {[type]} [description]
   */
  createGeometry(){
    let origin = new THREE.TorusGeometry(0.1, 0.02, 8, 16)
    let geo = new THREE.InstancedBufferGeometry()

    geo.index = origin.index
    geo.attributes = origin.attributes

    // let offsetPos = new THREE.InstancedBufferAttribute(new Float32Array(this.length * 3), 3, false, 1)
    // let num = new THREE.InstancedBufferAttribute(new Float32Array(this.length * 1), 1, false, 1)

    this.vertices = new THREE.InstancedBufferAttribute(new Float32Array(this.length * 3), 3, false, 1)
    this.colors = new THREE.InstancedBufferAttribute(new Float32Array(this.length * 3), 3, false, 1)
    this.scales = new THREE.InstancedBufferAttribute(new Float32Array(this.length * 1), 1, false, 1)


    // for (let i = 0; i < this.length; i++) {
    //   let range = 5
    //   let x = Math.random() * range - range / 2
    //   let y = Math.random() * range - range / 2
    //   let z = Math.random() * range - range / 2
    //   offsetPos.setXYZ(i, x, y, z)
    //   num.setX(i, i)
    // }

    for (let i = 0; i < this.length; i++) {

      let center = null
      let color = {
        r: Math.random() * 0.1 + 0.9,
        g: Math.random() * 0.2 + 0.8,
        b: 0.0,
      }
      if(i < this.length * this.pointsPer.otemachi){
        center = Core.centers.otemachi
      }
      else if(i < this.length * (this.pointsPer.otemachi + this.pointsPer.marunouchi)){
        center = Core.centers.marunouchi
        color.r = Math.random() * 0.1 + 0.9
        color.g = Math.random() * 0.2 + 0.7
      }
      else{
        center = Core.centers.yurakucho
        color.r = Math.random() * 0.1 + 0.9
        color.g = Math.random() * 0.2 + 0.6
      }

      // speed
      const sx = 0.01 * (Math.random() - 0.5)
      const sy = 0.05 * Math.random()
      const sz = 0.01 * (Math.random() - 0.5)
      this.speeds.push(sx, sy, sz)

      // position
      const vx = center.x + this.radius * (Math.random() - 0.5)
      const vy = center.y + 0.0
      const vz = center.z + this.radius * (Math.random() - 0.5)
      this.defaultPos.push(vx, vy, vz)
      this.vertices.setXYZ(i, vx, vy, vz)

      // color
      this.colors.setXYZ(i, color.r, color.g, color.b)

      // scales
      this.scales.setX(i, Math.random() * 1.0 + 1.0)
    }

    geo.setAttribute('vertices', this.vertices)
    geo.setAttribute('colors', this.colors)
    geo.setAttribute('scales', this.scales)
    // geo.setAttribute('offsetPos', offsetPos)
    // geo.setAttribute('num', num)

    return geo
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {}

  /**
   * [show description]
   * @return {[type]} [description]
   */
  show() {
    this.particles.visible = true
  }

  /**
   * [hide description]
   * @return {[type]} [description]
   */
  hide() {
    this.particles.visible = false
  }

  /**
   * [addParticle description]
   */
  addParticle() {}

  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {
    // console.log(this.vertices.count)
    if (this.vertices.count >= this.length) {

      for (let i = 0; i < this.length; i++) {
        let x = this.vertices.getX(i) + this.speeds[i * 3 + 0]
        let y = this.vertices.getY(i) + this.speeds[i * 3 + 1]
        let z = this.vertices.getZ(i) + this.speeds[i * 3 + 2]
        if (y >= 8) {
          x = this.defaultPos[i * 3 + 0]
          y = this.defaultPos[i * 3 + 1]
          z = this.defaultPos[i * 3 + 2]
        }
        this.vertices.setXYZ(i, x, y, z)
        // if(i == 0) console.log( this.vertices.getY(i) )
      }

      this.geometry.setAttribute('vertices', this.vertices)
    }

    this.vertices.needsUpdate = true

    if (this.material.type === 'ShaderMaterial') {
      this.material.uniforms.time.value = Core.time.total
    }

  }
}
