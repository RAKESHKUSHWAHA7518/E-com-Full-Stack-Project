const imagetobase64 =  async(image)=>{
    const reader = new FileReader();
    reader.readAsDataURL(image);

    const data= await new Promise((resolve ,reject)=>{
        reader.onload= ()=> resolve(reader.result)

        reader.onerror= error=> reject(error)

    })

    return data
}

export default imagetobase64