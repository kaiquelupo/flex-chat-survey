# Chat Survey

This plugin redirects a chat to a survey after an agent inside Flex finishes the conversation. 

## Serverless (Functions)

### Setup

You will need the Twilio CLI and the serverless plugin to deploy the functions inside the serverless folder of this project. You can install the necessary dependencies with the following commands:

`npm install twilio-cli -g`

and then

`twilio plugins:install @twilio-labs/plugin-serverless`

## How to use

1. Setup all dependencies above: the Studio Flow and Twilio CLI packages.

2. Clone this repository

3. Copy `public/appConfig.example.js` to `public/appConfig.js`

4. Copy `.env.example` to `.env` and set the following variables:

    - REACT_APP_SERVICE_BASE_URL: Your functions base url (it needs to start with `https://`)
    - REACT_APP_FLOW_SID: the Studio Flow Sid to redirect the chat to

  **Note**: Remember that the .env file is for front-end use so do not add any type of key/secret variable to them. Just variables starting with the name *REACT_APP_* will work.
  

5. Change the pre survey messages as you wish updating the `src/preSurveyMessages.json` file.

6.  run `npm install`

7. copy ./serverless/.env.example to ./serverless/.env and populate the appropriate environment variables.

8.  cd into ./serverless/ then run `npm install` and then `twilio serverless:deploy` (optionally you can run locally with `twilio serverless:start --ngrok=""`

9. cd back to the root folder and run `npm start` to run locally or `npm run-script build` and deploy the generated ./build/plugin-dialpad.js to [twilio assests](https://www.twilio.com/console/assets/public) to include plugin with hosted Flex. Also, you want to use Twilio Serverless, just run `npm run deploy` to send your plugin directly to your Flex.
