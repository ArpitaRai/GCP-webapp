import {PubSub} from '@google-cloud/pubsub';

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
 const topicNameOrId = 'projects/dev-gcp-414704/topics/verify_email';
// const data = JSON.stringify({foo: 'bar'});

// Imports the Google Cloud client library

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage(verificationLink, email_id) {
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const data = { verificationLink, email_id };

  const dataBuffer = Buffer.from(JSON.stringify(data));

  try {
    const messageId = await pubSubClient
      .topic(topicNameOrId)
      .publishMessage({data: dataBuffer});
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

export default publishMessage;