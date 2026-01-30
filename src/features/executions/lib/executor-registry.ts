import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import {manualTriggerExecutor} from "@/features/triggers/components/manual-trigger/executor"
import { HttpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { GeminiExecutor } from "../components/gemini/executor";
import { OpenAiExecutor } from "../components/openai/executor";
import { AnthropicExecutor } from "../components/anthropic/executor";
import { DiscordExecutor } from "../components/discord/executor";
import { SlackExecutor } from "../components/slack/executor";
import { TelegramExecutor } from "../components/telegram/executor";

export const executorRegistry : Record<NodeType , NodeExecutor<any>> ={
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor ,
    [NodeType.HTTP_REQUEST] : HttpRequestExecutor,
    [NodeType.INITIAL] : manualTriggerExecutor ,
    [NodeType.GOOGLE_FORM_TRIGGER] : googleFormTriggerExecutor ,
     [NodeType.STRIPE_TRIGGER] : stripeTriggerExecutor ,
     [NodeType.GEMINI] : GeminiExecutor ,
          [NodeType.ANTHROPIC] : AnthropicExecutor ,
  [NodeType.OPENAI] : OpenAiExecutor ,
    [NodeType.DISCORD] : DiscordExecutor ,
     [NodeType.SLACK] : SlackExecutor ,
          [NodeType.TELEGRAM] : TelegramExecutor ,






    
} ;


export const getExecutor = (type : NodeType) : NodeExecutor => {
    const executor = executorRegistry[type] ;
    if(!executor){
        throw new Error(`No Executor found for node type : ${type}`) ;
    }

    return executor ;
};