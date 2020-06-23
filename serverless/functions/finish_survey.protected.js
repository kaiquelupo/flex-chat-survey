exports.handler = async function(context, event, callback) {
	const client = context.getTwilioClient();
	
	const { channelSid } = event;
	
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
    
	callback(null);
};