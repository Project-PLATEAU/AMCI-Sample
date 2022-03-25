import * as THREE from 'three'
import Core from '../Core'
import Loader from '../Loader'
import CustomModel from './CustomModel.js'
import BuildingArea from '../Data/BuildingArea.json'
import Data from '~/assets/data/data.json'

export default class Daimaruyu extends CustomModel{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
//   constructor(){
//     super()
//   }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  // init(){
  //   this.setup()
  // }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup(){
    this.object = Loader.getAsset('daimaruyu')
    Core.scene.add(this.object)

    this.all = []
    this.otemachi = []
    this.marunouchi = []
    this.yurakucho = []

    console.log('Daimaruyu', this.object)
    console.log('BuildingArea', BuildingArea)

    this.object.traverse((obj) => {
      // console.log(obj.type, obj.name)
      if(obj.isMesh) {
        const name = obj.name
        const area = BuildingArea[name].area
        // console.log(name, area)

        obj.area = area
        this.all.push(obj)

        switch (area){
          case 'otemachi':
            this.otemachi.push(obj)
          break;
          case 'marunouchi':
            this.marunouchi.push(obj)
          break;
          case 'yurakucho':
            this.yurakucho.push(obj)
          break;
        }
      }
    })

    console.log('otemachi', this.otemachi)
    console.log('marunouchi', this.marunouchi)
    console.log('yurakucho', this.yurakucho)

    this.setupAfter({
      // current: 'SDGsMaterial',
      current: 'ProjectedMaterial',
      folder: 'Daimaruyu'
    })
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy(){
  }


  /**
   * [updateObject description]
   * @return {[type]} [description]
   */
  updateObject(){
  }

  /**
   * [updateAreaMaterial description]
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  updateAreaMaterial(key, content){
    this.currentMatKey.current = key
    const material = this.materials[key]

    if(key === 'DefaultMaterial'){
      this.setDefMaterials()
    }
    else{
      this.setAreaMaterials(key, material, content)
    }

    this.material = material

    return material
  }


  /**
   * [setAreaMaterials description]
   * @param {[type]} key [description]
   * @param {[type]} material [description]
   */
  setAreaMaterials(key, material, content){
    const otemachiMat = material.clone()

    const marunouchiMat = material.clone()

    const yurakuchoMat = material.clone()

    // green
    if(content === 'co2'){
      otemachiMat.color = new THREE.Color(0x77dd00)
      marunouchiMat.color = new THREE.Color(0x55bb00)
      yurakuchoMat.color = new THREE.Color(0x339900)
    }
    // orange
    else if(content === 'walks'){
      otemachiMat.color = new THREE.Color(0xff9900)
      marunouchiMat.color = new THREE.Color(0xff6600)
      yurakuchoMat.color = new THREE.Color(0xff3300)
    }
    // blue
    else if(content === 'point'){
      otemachiMat.color = new THREE.Color(0x3366ff)
      marunouchiMat.color = new THREE.Color(0x144FFF)
      yurakuchoMat.color = new THREE.Color(0x0033ff)
    }

    this.object.traverse((obj) => {
      if(obj.isMesh) {
        let area = obj.area
        if(area == 'otemachi'){
          obj.material = otemachiMat
        }
        else if(area == 'marunouchi'){
          obj.material = marunouchiMat
        }
        else if(area == 'yurakucho'){
          obj.material = yurakuchoMat
        }
      }
    })
  }


  /**
   * [setSDGsMaterial description]
   * @param {[type]} area [description]
   */
  setSDGsMaterial(area){
    let group = this.getAreaGroup(area)
    // console.log('setSDGsMaterial', area, group)

    const material = this.sdgsMat
    // console.log(material)

    // get colors
    let data = Data.sdgData[area]
    console.log('SDGs Data', data)

    let percentAry = []
    let groupColorAry = []
    const groupLen = group.length

    for(let key in data.percents){
      let value = data.percents[key]
      for(let i = 0; i < Number(value); i++ ){
        percentAry.push(key)
      }
    }
    console.log('percentAry', percentAry)

    let step = percentAry.length / groupLen

    // attachi material
    for(let i = 0; i < groupLen; i++){
      let aryIndex = Math.round(step * i)
      let actId = Number(percentAry[aryIndex]) - 1
      let color = material.COLORS[actId]
      // console.log(i, aryIndex, actId, color)

      const mesh = group[i]
      const cmat = material.clone()
      cmat.uniforms.total.value = group.length
      cmat.uniforms.index.value = i
      cmat.uniforms.actColor.value = color
      mesh.material = cmat
    }

    this.currentMatKey.current = Core.SDGS_MAT
  }

  /**
   * [getAreaGroup description]
   * @param  {[type]} area [description]
   * @return {[type]}      [description]
   */
  getAreaGroup(area){
    let group = this.all
    if(area === 'Otemachi'){
      group = this.otemachi
    }
    else if(area === 'Marunouchi'){
      group = this.marunouchi
    }
    else if(area === 'Yurakucho'){
      group = this.yurakucho
    }
    return group
  }

}
