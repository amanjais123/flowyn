import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as kyOptions}from "ky" ;
import Handlebars from "handlebars" ;
import { geminiChannel } from "@/inngest/channels/gemini";
import {createAnthropic} from "@ai-sdk/anthropic"
import {generateText} from "ai" ;
import { OpenAiChannel } from "@/inngest/channels/openai";
import { AnthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context , null ,2) ;
    const safeString = new Handlebars.SafeString(jsonString) ;
    
    return safeString ;
})

type AnthropicData = {
      credentialId? : string,
    variableName? : string ;
    model? : string ;
    systemPrompt? : string;
    userPrompt? : string ;
}
export const AnthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  userId ,
  step,
  publish,
}) => {

await publish(
    AnthropicChannel().status({
        nodeId,
        status : "loading" ,
    }),
) ;

if(!data.variableName){
  await publish(
    AnthropicChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Anthropic node : variable name is missing")
}


if(!data.credentialId){
  await publish(
    AnthropicChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Anthropic node : credential is missing")
}

if(!data.userPrompt){
  await publish(
    AnthropicChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Anthropic node :prompt is missing")
}



if(!data.model){
  await publish(
    AnthropicChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Anthropic node :model is missing")
}



const systemPrompt = data.systemPrompt
? Handlebars.compile(data.systemPrompt)(context)
: "You are a helpful assistant" ;

const userPrompt = Handlebars.compile(data.userPrompt)(context) ;

const credential = await step.run("get-credential" , () => {
  return prisma.credential.findUnique({
where : {
  id : data.credentialId ,
  userId,
},
  }) ;
}) ;

if(!credential){
  throw new NonRetriableError("Anthropic node : credential not found") ;

}
//const credentialValue = process.env.ANTHROPIC_API_KEY! ; 

const anthropic = createAnthropic({
  apiKey : credential.value ,

}) ;

try{
  const {steps} = await step.ai.wrap(
    "anthropic-generate-text" ,
    generateText ,
    {
       model: anthropic(data.model || "claude-3-5-opus-20240620"),
      system : systemPrompt ,
      prompt : userPrompt ,
      experimental_telemetry : {
        isEnabled : true ,
        recordInputs: true ,
        recordOutputs : true ,
      },
    },
  );

  const text  = 
  steps[0].content[0].type === "text"
  ? steps[0].content[0].text 
  : "" ;

  await publish(
    AnthropicChannel().status({
      nodeId ,
      status : "success"
    }) ,
  ) ;


  return {
    ...context ,
    [data.variableName] : {
      aiResponse : text ,
    } ,

  }
}catch(error){

await publish(
  AnthropicChannel().status({
    nodeId ,
    status:"error" ,
  })
);
throw error ; 
}

}