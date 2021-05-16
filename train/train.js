const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')

const IMAGE_SIZE = 128
const LATENT_SPACE = 3

const optimizer = tf.train.adam()


const model = tf.sequential()
model.add(tf.layers.conv2d({
  inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3],
  kernelSize: 5,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}))
// model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}))
model.add(tf.layers.conv2d({
  kernelSize: 5,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}))
// model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}))
model.add(tf.layers.flatten())

model.add(tf.layers.dense({
  units: LATENT_SPACE,
  kernelInitializer: 'varianceScaling',
  activation: 'softmax'
}))


model.weights.forEach(w => {
  console.log(w.name, w.shape)
})

const train = () => {
  for (let epoch = 0; epoch < 10; epoch++) {
    
  }
}

train()

// model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}))
// model.add(tf.layers.dense({units: 1, activation: 'linear'}))
// model.compile({optimizer: 'sgd', loss: 'meanSquaredError'})

// const xs = tf.randomNormal([100, 10])
// const ys = tf.randomNormal([100, 1])

// model.fit(xs, ys, {
//   epochs: 100,
//   callbacks: {
//     onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
//   }
// })