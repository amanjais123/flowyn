import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as kyOptions}from "ky" ;
import Handlebars from "handlebars" ;
import { geminiChannel } from "@/inngest/channels/gemini";
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {generateText} from "ai" ;
import prisma from "@/lib/db";
Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context , null ,2) ;
    const safeString = new Handlebars.SafeString(jsonString) ;
    
    return safeString ;
})

type GeminiData = {
    variableName? : string ;
    model? : string ;
    credentialId? : string,
    systemPrompt? : string;
    userPrompt? : string ;
}
export const GeminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  userId,
  publish,
}) => {

await publish(
    geminiChannel().status({
        nodeId,
        status : "loading" ,
    }),
) ;

if(!data.variableName){
  await publish(
    geminiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Gemini node : variable name is missing")
}

if(!data.credentialId){
  await publish(
    geminiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Gemini node : credential is missing")
}


if(!data.userPrompt){
  await publish(
    geminiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Gemini node :prompt is missing")
}



if(!data.model){
  await publish(
    geminiChannel().status({
      nodeId,
      status:"error" ,
    })
  );

  throw new NonRetriableError("Gemini node :model is missing")
}



const systemPrompt = data.systemPrompt
? Handlebars.compile(data.systemPrompt)(context)
: "You are a helpful assistant" ;

const userPrompt = Handlebars.compile(data.userPrompt)(context) ;

const credential = await step.run("get-credential" , () => {
  return prisma.credential.findUnique({
where : {
  id : data.credentialId ,
  userId ,
},
  }) ;
}) ;

if(!credential){
  throw new NonRetriableError("Gemini node : credential not found") ;

}
//  const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY! ; 

const google = createGoogleGenerativeAI({
  apiKey : credential.value ,

}) ;

try{
  const {steps} = await step.ai.wrap(
    "gemini-generate-text" ,
    generateText ,
    {
       model: google(data.model || "models/gemini-2.5-flash"),
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
    geminiChannel().status({
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
  geminiChannel().status({
    nodeId ,
    status:"error" ,
  })
);
throw error ; 
}

}