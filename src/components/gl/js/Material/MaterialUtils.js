
export default new class MaterialUtils{

  /**
   * [constructor description]
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
//   constructor(){
//   }

  /**
   * [handleColorChange description]
   * @param  {[type]} color [description]
   * @return {[type]}       [description]
   */
  handleColorChange(color) {
    return function(value) {
      if(typeof value === 'string') {
        value = value.replace('#', '0x')
      }
      color.setHex(value)
    }
  }

  /**
   * [needsUpdate description]
   * @param  {[type]}this.phongMat [description]
   * @param  {[type]} object [description]
   * @return {[type]}          [description]
   */
  needsUpdate(material, object) {
    return function() {
      // material.vertexColors = material.vertexColors
      material.side = parseInt(material.side) // Ensure number
      material.needsUpdate = true

      object.traverse((obj) => {
        if(obj.isMesh) {
          obj.geometry.attributes.position.needsUpdate = true
          obj.geometry.attributes.normal.needsUpdate = true
          if(obj.geometry.attributes.color){
            obj.geometry.attributes.color.needsUpdate = true
          }
        }
      })
    }
  }

  /**
   * [updateCombine description]
   * @param  {[type]}this.phongMat [description]
   * @return {[type]}          [description]
   */
  updateCombine(material) {
    return function(combine) {
      material.combine = parseInt(combine)
      material.needsUpdate = true
    }
  }

  /**
   * [updateTexture description]
   * @param  {[type]}this.phongMat    [description]
   * @param  {[type]}this.phongMat [description]
   * @param  {[type]} textures    [description]
   * @return {[type]}             [description]
   */
  updateTexture(material, materialKey, textures) {
    return function(key) {
     material[materialKey] = textures[key]
      material.needsUpdate = true
    }
  }

}
