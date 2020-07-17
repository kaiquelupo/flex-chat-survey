exports.handler = async function(context, event, callback) {
	const client = context.getTwilioClient();
	
	const { channelSid, from, answer1, worker } = event;
	
	const channel = await client.chat.services(context.CHAT_SERVICE_SID)
          .channels(channelSid)
          .fetch();  
          
    const attributes = JSON.parse(channel.attributes);
    const { proxySession } = attributes;
           
    await client.chat.services(context.CHAT_SERVICE_SID)
      .channels(channelSid)
      .update({
          attributes: JSON.stringify({ ...attributes, status: "INACTIVE" }) 
      });
      
    if(proxySession){
        await client.proxy.services(context.FLEX_PROXY_SERVICE_SID)
            .sessions(proxySession)
            .remove(); 
    }

    if(worker !== "") {

        await client.taskrouter.workspaces(context.FLEX_WORKSPACE)
            .tasks
            .create({
                attributes: JSON.stringify({
                    conversations: {
                        conversation_id: channelSid,
                        conversation_attribute_1: from,
                        conversation_attribute_2: answer1,
                        conversation_attribute_3: worker,
                        conversation_attribute_7: "chat_survey",
                        virtual: "Yes"
                    }
                }), 
            workflowSid: context.REPORTING_WORKFLOW, 
            timeout: 1
        });
    }
    
	callback(null);
};