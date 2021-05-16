const { readdirSync, readFileSync, writeFileSync, mkdir } = require('fs')
const tf = require('@tensorflow/tfjs-node')
// require('@tensorflow/tfjs-node')

const blazeface = require('@tensorflow-models/blazeface');
const RESIZE_IMG = 128

const createFolders = async () => {
  const model = await blazeface.load()

  const soloImage = readdirSync("lfw")
    .filter(dirent => readdirSync("lfw/" + dirent).length === 1)
  const multiImage = readdirSync("lfw")
    .filter(dirent => readdirSync("lfw/" + dirent).length > 1)

  for (let folder of soloImage) {
    const photo = readdirSync("lfw/" + folder)
    await storeImage(model, folder, photo, "solo")
  }
  for (let folder of multiImage) {
    const personImages = readdirSync("lfw/" + folder)
    mkdir("facesSorted/multi/" + folder, err => { })
    for (let photo of personImages) {
      await storeImage(model, folder, photo, "multi")
    }
  }
}

const storeImage = async (model, folder, namePhoto, type) => {
  const image = readFileSync("lfw/" + folder + "/" + namePhoto);
  const decodedImage = tf.node.decodeImage(image, 3);
  const predictions = await model.estimateFaces(decodedImage, returnTensors = false)
  if (predictions.length > 0) {
    const start = predictions[0].topLeft.map(elem => elem / 250)
    const end = predictions[0].bottomRight.map(elem => elem / 250)
    const croped = tf.image.cropAndResize(
      tf.expandDims(decodedImage),
      tf.tensor2d([start[1], start[0], end[1], end[0]], [1, 4]),
      [0],
      [RESIZE_IMG, RESIZE_IMG]
    )
    const encoded = await tf.node.encodeJpeg(
      croped.reshape([RESIZE_IMG, RESIZE_IMG, 3]),
      'rgb',
    )
    output = type === "multi"
      ? "facesSorted/" + type + "/" + folder + "/" + namePhoto + ".jpg"
      : "facesSorted/" + type + "/" + namePhoto + ".jpg"
    writeFileSync(output, encoded)
  }
}

createFolders()