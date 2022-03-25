import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import Core from '../Core'
import Loader from '../Loader'
import Util from '../Utils/Util'
import LeafParticleMaterial from '../Material/LeafParticleMaterial'
import Data from '~/assets/data/data.json'

export default class LeafParticles {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.num = 300
    this.radius = 3.5

    this.vertices = []
    this.defaultPos = []
    this.speeds = []
    this.colors = []

    this.geometry = null
    this.material = null
    this.particles = null

    this.setup()
    this.hide()
  }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    const yurakucho = Data.areaData.yurakucho.co2reducations
    const marunouchi = Data.areaData.marunouchi.co2reducations
    const otemachi = Data.areaData.otemachi.co2reducations
    const total = yurakucho + marunouchi + otemachi

    this.co2 = {
      yurakucho: yurakucho,
      marunouchi: marunouchi,
      otemachi: otemachi,
      total: total
    }

    this.co2Per = {
      yurakucho: this.co2.yurakucho / this.co2.total,
      marunouchi: this.co2.marunouchi / this.co2.total,
      otemachi: this.co2.otemachi / this.co2.total
    }

    console.log('co2:', this.co2)
    console.log('co2Per:', this.co2Per)

    this.co2Per = Util.calcAverage(this.co2Per, 0.8)

    console.log('co2Per(ave):', this.co2Per)

    // パーティクルを作成
    this.geometry = this.createGeometry()
    this.material = new LeafParticleMaterial()
    this.particles = new THREE.Mesh(this.geometry, this.material)
    Core.scene.add(this.particles)
  }


  /**
   * [createGeometry description]
   * @return {[type]} [description]
   */
  createGeometry(){
    const data = Loader.getAsset('leafsvg')
    const paths = data.paths
    const path = paths[0]
    const shapes = SVGLoader.createShapes(path)
    const shape = shapes[0]
    const scale = 0.01
    const tmpGeometry = new THREE.ShapeGeometry(shape)

    const mat = new THREE.Matrix4()
    mat.makeScale(scale, scale, scale)
    tmpGeometry.applyMatrix4(mat)

    const geometry = new THREE.InstancedBufferGeometry()

    let vertice = tmpGeometry.attributes.position.clone()
    geometry.setAttribute('position', vertice)

    let normal = tmpGeometry.attributes.normal.clone()
    geometry.setAttribute('normals', normal)

    let uv = tmpGeometry.attributes.normal.clone()
    geometry.setAttribute('uv', uv)

    let indices = tmpGeometry.index.clone()
    geometry.setIndex(indices)

    this.vertices = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3 )
    this.color = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3 )
    this.offsetPos = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3 )
    this.aNum = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1 )

    for (let i = 0; i < this.num; i++) {

      let center = null
      let color = {
        r: Math.random() * 0.1 + 0.2,
        g: Math.random() * 0.1 + 0.7,
        b: Math.random() * 0.1 + 0.2,
      }
      if(i < this.num * this.co2Per.otemachi){
        center = Core.centers.otemachi
        color.r = Math.random() * 0.1 + 0.1
      }
      else if(i < this.num * (this.co2Per.otemachi + this.co2Per.marunouchi)){
        center = Core.centers.marunouchi
        color.b = Math.random() * 0.1 + 0.1
      }
      else{
        center = Core.centers.yurakucho
      }

      // offset pos
      let range = 5
      let x = Math.random() * range - range / 2
      let y = Math.random() * range - range / 2
      let z = Math.random() * range - range / 2
      this.offsetPos.setXYZ(i, x, y, z)
      this.aNum.setX(i, i)

      // speed
      const sx = 0.01 * (Math.random() - 0.5)
      const sy = 0.05 * Math.random()
      const sz = 0.01 * (Math.random() - 0.5)
      this.speeds.push(sx, sy, sz)

      // position
      const vx = center.x + this.radius * (Math.random() - 0.5)
      const vy = center.y + 0.0
      const vz = center.z + this.radius * (Math.random() - 0.5)
      this.vertices.setXYZ(i, vx, vy, vz)
      this.defaultPos.push(vx, vy, vz)

      // color
      this.color.setXYZ(i, color.r, color.g, color.b)
    }

    // console.log('offsetPos', this.offsetPos.count)
    // console.log('aNum', this.aNum.count)
    // console.log('speeds', this.speeds.length)
    // console.log('defaultPos', this.defaultPos.length)
    // console.log('vertices', this.vertices.count)
    // console.log('color', this.color.count)

    geometry.setAttribute('vertices', this.vertices)
    geometry.setAttribute('color', this.color)
    geometry.setAttribute('offsetPos', this.offsetPos)
    geometry.setAttribute('num', this.aNum)

    return geometry
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {}

  show() {
    this.particles.visible = true
  }

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
    // this.aNumが生成されていたら実行
    if (this.aNum.count >= this.num) {
      // 頂点を移動
      for (let i = 0; i < this.num; i++) {
        const index = i * 3
        let x = this.vertices.getX(i) + this.speeds[index + 0]
        let y = this.vertices.getY(i) + this.speeds[index + 1]
        let z = this.vertices.getZ(i) + this.speeds[index + 2]
        // しきい値を超えたら頂点をリセット
        if (y >= 8) {
          x = this.defaultPos[index + 0]
          y = this.defaultPos[index + 1]
          z = this.defaultPos[index + 2]
        }
        this.vertices.setXYZ(i, x, y, z)
      }

      // 頂点のバッファを更新
      this.geometry.setAttribute('vertices', this.vertices)
      this.vertices.needsUpdate = true
    }

    this.material.uniforms.time.value = Core.time.total
  }
}
