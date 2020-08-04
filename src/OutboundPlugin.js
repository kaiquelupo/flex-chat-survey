import React from 'react';
import { FlexPlugin } from 'flex-plugin';

import { request } from './utils';
import preSurveyMessages from './preSurveyMessages.json';

const PLUGIN_NAME = 'OutboundPlugin';

export default class OutboundPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    flex.Actions.addListener("beforeWrapupTask", async (payload, abortFunction) => {

      if(payload.task.channelType === "whatsapp" || payload.task.channelType === "web"){

        await request("send_to_survey", manager, { 
          taskSid: payload.task.taskSid,
          attributes: JSON.stringify(payload.task.attributes),
          preSurveyMessages: JSON.stringify(preSurveyMessages),
          flowSid: process.env.REACT_APP_FLOW_SID,
          worker: manager.workerClient.attributes.full_name || manager.workerClient.attributes.contact_uri
        });

        abortFunction();

      } 
      
    });

    flex.Actions.addListener("afterCompleteTask", async (payload) => {

      if(payload.task.channelType === "whatsapp" || payload.task.channelType === "web") { 

        const { oldChannelSid } = payload.task.attributes;

        await payload.task.setAttributes({
          ...payload.task.attributes,
          channelSid: oldChannelSid,
        })

      }

    });

  }
}
