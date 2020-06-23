const TokenValidator = require('twilio-flex-token-validator').functionValidator;

let path = Runtime.getFunctions()['utils'].path;
let assets = require(path);

exports.handler = TokenValidator(async (context, event, callback) => {
    
    const client = context.getTwilioClient();
     
    const { taskSid, attributes, preSurveyMessages, flowSid } = event; 
    
    const taskAttributes = JSON.parse(attributes);
    const messages = JSON.parse(preSurveyMessages);
    
    try{
	
        const updatedAttributes = {
			...taskAttributes,
			channelSid: 'CH00000000000000000000000000000000',
			proxySessionSID: 'KC00000000000000000000000000000000', 
		};

		await client.taskrouter
			.workspaces(context.FLEX_WORKSPACE)
			.tasks(taskSid)
			.update({
				attributes: JSON.stringify(updatedAttributes),
			});
			
	    
        await client.taskrouter.workspaces(context.FLEX_WORKSPACE)
             .tasks(taskSid)
             .update({
                assignmentStatus: 'wrapping'
              });
              
        
        if(flowSid) {   
            
            await client.chat.services(context.CHAT_SERVICE_SID)
               .channels(taskAttributes.channelSid)
               .webhooks
               .create({
                   type: "studio",
                   configuration:{
                       flowSid
                   }
               });
               
        }
        
        if(messages && messages.length > 0) {
           
            for(let i = 0; i < messages.length; i++){
                
                await client.chat.services(context.CHAT_SERVICE_SID)
                   .channels(taskAttributes.channelSid)
                   .messages
                   .create({
                       body: messages[i]
                   });
                   
            }
        }
          
     
    } catch(err) {
        
        console.log(err);
        
    }
                 
	callback(null, assets.response("json", {}) );
});
