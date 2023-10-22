
const dotenv = require('dotenv');
dotenv.config();
const fetch = require("node-fetch")


const project = process.env.PROJECT_ID;
const aiplatform = require('@google-cloud/aiplatform');

// Imports the Google Cloud Prediction service client
const {PredictionServiceClient} = aiplatform.v1;

// Import the helper module for converting arbitrary protobuf.Value objects.
const {helpers} = aiplatform;

// Specifies the location of the api endpoint
const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};

const publisher = 'google';
const model = 'text-bison@001';
const location = 'us'

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);



function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      console.log('dd: ', data)
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

// async function workers(user_message) {
//   const prompt = `Act like a personal assistant. You can respond to questions, translate sentences, summarize news, and give recommendations. ${user_message}`
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: prompt}],
//     model: 'text-davinci-003'
//   });

//   console.log(chatCompletion.choices);
//   return chatCompletion.choices[0]
// }


async function callPredict(user_message) {
  // Configure the parent resource
  const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

  const prompt = {
    prompt:
    `Act like a personal assistant. You can respond to questions, translate sentences, summarize news, and give recommendations: ${user_message}`,
  };
  const instanceValue = helpers.toValue(prompt);
  const instances = [instanceValue];

  const parameter = {
    temperature: 0.2,
    maxOutputTokens: 256,
    topP: 0.95,
    topK: 40,
  };
  const parameters = helpers.toValue(parameter);

  const request = {
    endpoint,
    instances,
    parameters,
  };

  // Predict request
  const response = await predictionServiceClient.predict(request);
  console.log('Get text prompt response');
  const obj = response[0]['predictions'][0]['structValue']['fields']['content']['stringValue']
  return obj
}


module.exports = {getQuote, callPredict}