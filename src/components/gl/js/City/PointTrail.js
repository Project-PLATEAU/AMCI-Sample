import * as THREE from 'three'
import gsap from 'gsap'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
// import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineMaterial } from '../Material/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import Core from '../Core'
import Loader from '../Loader'
import Util from '../Utils/Util'
import Data from '~/assets/data/data.json'

export default class Particles {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {

    this.num = 150
    this.pointLength = 50
    this.radius = 6
    this.height = 4
    this.randomX = 2
    this.randomY = 2
    this.randomZ = 2
    this.curveRadius = 1.0
    this.baseWidth = 5.0
    this.randomWidth = 10.0

    this.pointsData = []
    this.colorsData = []
    this.movePoses = []

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

    this.createGeoDatas()

    this.lines = new THREE.Group()
    Core.scene.add(this.lines)

    this.material = new LineMaterial({
      color: new THREE.Color(0xffffff),
      linewidth: 1.0,
      // worldUnits: false,
      vertexColors: true,
      // dashed: false,
      // dashScale: 1.0,
      // dashSize: 1.0,
      // gapSize: 1.0,
      drawStart: 0.0,
      drawEnd: 0.0,
      // alphaToCoverage: false,
    })
    this.material.resolution.set(Core.size.windowW, Core.size.windowH)

    for (let i = 0; i < this.num; i++) {
      let center = null
      if(i < this.num * this.pointsPer.otemachi){
        center = Core.centers.otemachi
      }
      else if(i < this.num * (this.pointsPer.otemachi + this.pointsPer.marunouchi)){
        center = Core.centers.marunouchi
      }
      else{
        center = Core.centers.yurakucho
      }

      const pos = center.clone()
      pos.x += Math.random() * this.radius - this.radius / 2
      pos.y = 0
      pos.z += Math.random() * this.radius - this.radius / 2

      const geometry = this.createGeometry(i, 0, this.pointLength)
      const material = this.material.clone()

      material.linewidth = Math.floor(this.randomWidth * Math.random()) + this.baseWidth

      const line = new Line2(geometry, material)
      line.computeLineDistances()
      line.scale.set( 1, 1, 1 )
      line.position.set(pos.x, pos.y, pos.z)
      this.lines.add(line)
    }


    for(let i = 0; i < this.lines.children.length; i++){
      const line = this.lines.children[i]
      const delay = Math.random() * 10

      const tl = gsap.timeline({
        delay: 0 + delay,
        repeat: -1,
        repeatDelay: 0.0,
        defaults: {
          duration: 5.0,
          ease: 'power3.inOut'
        }
      })

      tl.from(line.material, {
        drawStart: 0
      })
      .to(line.material, {
        drawStart: this.height
      })

      const tl2 = gsap.timeline({
        delay: 1.0 + delay,
        repeat: -1,
        repeatDelay: 0.0,
        defaults: {
          duration: 5.0,
          ease: 'power3.inOut'
        }
      })

      tl2.from(line.material, {
        drawEnd: 0
      })
      .to(line.material, {
        drawEnd: this.height
      })

      const tl3 = gsap.timeline({
        delay: 0 + delay,
        repeat: -1,
        repeatDelay: 0.0,
        defaults: {
          duration: 5.0,
          ease: 'power3.inOut'
        }
      })

      const defX = Math.random() * this.randomX - (this.randomX / 2)
      const defY = Math.random() * this.randomY
      const defZ = Math.random() * this.randomZ - (this.randomZ / 2)

      tl3.from(line.position, {
        x: line.position.x,
        y: line.position.y + defY,
        z: line.position.z
      })
      .to(line.position, {
        x: line.position.x + defX,
        y: line.position.y + defY + 0.5,
        z: line.position.z + defZ
      })

    }
  }

  /**
   * [createGeoDatas description]
   * @return {[type]} [description]
   */
  createGeoDatas(){
    for (let i = 0; i < this.num; i++) {
      const data = this.createGeoData(i)
      this.pointsData[i] = data.points
      this.colorsData[i] = data.colors

      this.movePoses[i] = Math.random()
    }

    console.log(this.pointsData)
    console.log(this.colorsData)
  }

  /**
   * [createGeoData description]
   * @return {[type]} [description]
   */
  createGeoData(index){
    const points = []
    const colors = []
    const keyPoints = []
    let curveVecs = []
    let color = new THREE.Color()

    for (let i = 0; i < this.height; i++) {
      let x = Math.random() * this.curveRadius - this.curveRadius / 2
      let y = i
      let z = Math.random() * this.curveRadius - this.curveRadius / 2
      keyPoints.push(new THREE.Vector3(x, y, z))
    }

    curveVecs = new THREE.CatmullRomCurve3(keyPoints).getPoints(this.pointLength)

    const randomColor = Math.random() * 4

    for(let i = 0; i < curveVecs.length; i++){
      points.push(curveVecs[i].x, curveVecs[i].y, curveVecs[i].z)

      const numT = index / this.num
      const t = i / curveVecs.length
      const rt = 1 - i / curveVecs.length
      const c = this.getRandomColor(randomColor, numT, t, rt)
      color.setRGB(c.r, c.g, c.b)
      colors.push( color.r, color.g, color.b )
    }

    return {points, colors}
  }

  /**
   * [getGeoData description]
   * @param  {[type]} index [description]
   * @param  {[type]} head  [description]
   * @param  {[type]} last  [description]
   * @return {[type]}       [description]
   */
  getGeoData(index, head, last){
    head = Math.floor(head)
    last = Math.floor(last)
    const points = this.pointsData[index].slice(head * 3, last * 3)
    const colors = this.colorsData[index].slice(head * 3, last * 3)
    return {points, colors}
  }

  /**
   * [createGeometry description]
   * @return {[type]} [description]
   */
  createGeometry(index, head, last) {
    const geometry = new LineGeometry()
    const data = this.getGeoData(index, head, last)
    if(data.points.length > 0) geometry.setPositions(data.points)
    if(data.colors.length > 0) geometry.setColors(data.colors)
    return geometry
  }

  /**
   * [getRandomColor description]
   * @param  {[type]} numT [description]
   * @param  {[type]} t    [description]
   * @param  {[type]} rt   [description]
   * @return {[type]}      [description]
   */
  getRandomColor(randomColor, numT, t, rt){
    let c = {}
    // const randomColor = Math.random() * 4
    // Yellow
    if(randomColor < 1){
      c.r = 0.2 + 0.8 * t * numT
      c.g = 0.5 + 0.5 * rt
      c.b = 0.0
    }
    // Green
    else if(randomColor < 2){
      c.r = 0.0
      c.g = 0.5 + 0.5 * rt
      c.b = 0.2 + 0.8 * t * numT
    }
    // Blue
    else if(randomColor < 3){
      c.r = 0.0
      c.g = 0.2 + 0.8 * t * numT
      c.b = 0.5 + 0.5 * rt
    }
    // Red
    else{
      c.r = 0.5 + 0.5 * rt
      c.g = 0.2 + 0.8 * t * numT
      c.b = 0.0
    }
    return c
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
    this.lines.visible = true
  }

  /**
   * [hide description]
   * @return {[type]} [description]
   */
  hide() {
    this.lines.visible = false
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
  }

}
