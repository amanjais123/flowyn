import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as kyOptions}from "ky" ;
import Handlebars from "handlebars" ;
import { geminiChannel } from "@/inngest/channels/gemini";
import {createOpenAI} from "@ai-sdk/openai"
import {generateText} from "ai" ;
import { OpenAiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context , null ,2) ;
    const safeString = new Handlebars.SafeString(jsonString) ;
    
    return safeString ;
})

type OpenAiData = {
    variableName? : string ;
    credentialid? : string ; 
    model? : string ;
    systemPrompt? : string;
    userPrompt? : string ;
}
export const OpenAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  userId ,
  step,
  publish,
}) => {

await publish(
    OpenAiChannel().status({
        nodeId,
        status : "loading" ,
    }),
) ;

if(!data.variableName){
  await publish(
    OpenAiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("openAI node : variable name is missing")
}

if(!data.credentialid){
  await publish(
    OpenAiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("openAI node : credential is missing")
}


if(!data.userPrompt){
  await publish(
    OpenAiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("openAI node :prompt is missing")
}



if(!data.model){
  await publish(
    OpenAiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("openAI node :model is missing")
}



const systemPrompt = data.systemPrompt
? Handlebars.compile(data.systemPrompt)(context)
: "You are a helpful assistant" ;

const userPrompt = Handlebars.compile(data.userPrompt)(context) ;


const credential = await step.run("get-credential" , () => {
  return prisma.credential.findUnique({
where : {
  id : data.credentialid ,
  userId ,
},
  }) ;
}) ;

if(!credential){
  throw new NonRetriableError("Gemini node : credential not found") ;

}
//const credentialValue = process.env.OPENAI_API_KEY! ; 

const openai = createOpenAI({
  apiKey : credential.value ,

}) ;

try{
  const {steps} = await step.ai.wrap(
    "openai-generate-text" ,
    generateText ,
    {
       model: openai(data.model || "models/gpt-4.1"),
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
    OpenAiChannel().status({
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
  OpenAiChannel().status({
    nodeId ,
    status:"error" ,
  })
);
throw error ; 
}

}