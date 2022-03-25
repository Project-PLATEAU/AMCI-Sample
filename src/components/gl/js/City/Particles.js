import * as THREE from 'three'
import Core from '../Core'
import Loader from '../Loader'
import ParticleMaterial from '../Material/ParticleMaterial'
import Data from '~/assets/data/data.json'

export default class Particles {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.radius = 3.5
    this.size = 15.0
    this.length = 1000

    this.vertices = []
    this.defaultPos = []
    this.speeds = []
    this.colors = []

    this.geometry = null
    this.material = null
    this.setup()

    // console.log('Data', Data)
  }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {

    for (let i = 0; i < this.length; i++) {

      let center = null
      let color = {
        r: Math.random() * 0.2 + 0.133,
        g: Math.random() * 0.5 + 0.133,
        b: 1.0,
      }
      if(i < this.length / 3){
        center = Core.centers.otemachi
      }
      else if(i < this.length / 3 * 2){
        center = Core.centers.marunouchi
        color.r = Math.random() * 0.0 + 0.133
        color.g = Math.random() * 0.3 + 0.133
      }
      else{
        center = Core.centers.yurakucho
        color.r = Math.random() * 0.1 + 0.033
        color.g = Math.random() * 0.2 + 0.133
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
      this.vertices.push(vx, vy, vz)

      // color
      this.colors.push(color.r, color.g, color.b)
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3))
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3))
    this.material = new ParticleMaterial({ tex: Loader.getAsset('particle'), size: this.size })
    const mesh = new THREE.Points(this.geometry, this.material)
    Core.scene.add(mesh)

    this.particles = mesh
    this.hide()
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
    if (this.vertices.length >= this.length) {
      const nVertices = []

      for (let i = 0; i < this.vertices.length; i += 3) {
        let x = this.vertices[i + 0] + this.speeds[i + 0]
        let y = this.vertices[i + 1] + this.speeds[i + 1]
        let z = this.vertices[i + 2] + this.speeds[i + 2]
        if (y >= 8) {
          x = this.defaultPos[i + 0]
          y = this.defaultPos[i + 1]
          z = this.defaultPos[i + 2]
        }
        // if(i == 0) console.log(x, y, z)
        nVertices.push(x, y, z)
      }

      this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(nVertices, 3))
      this.vertices = nVertices
    }

    if (this.material.type === 'ShaderMaterial') {
      this.material.uniforms.time = Core.time.total
    }

    // this.particles.
  }
}
