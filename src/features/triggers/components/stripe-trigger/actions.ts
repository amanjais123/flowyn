"use server" ;

import { getSubscriptionToken , type Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export type GoogleFormTriggerToken = Realtime.Token<
  typeof stripeTriggerChannel,
  ["status"]
>;


export async function fetchStripeTriggerRealtimeToken():
Promise<GoogleFormTriggerToken>{

    const token = await getSubscriptionToken(inngest , {
        channel : stripeTriggerChannel() ,
        topics : ["status"] ,
    });

    
    return token ;
};