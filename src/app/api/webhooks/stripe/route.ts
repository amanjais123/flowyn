import { sendWorkflowExecution } from "@/inngest/utils";
import { timeStamp } from "console";
import { type NextRequest , NextResponse } from "next/server";

export async function POST(request : NextRequest){
    try {
        const url = new URL(request.url) ;
        const workflowId = url.searchParams.get("workflowId") ;
        
        if(!workflowId){
            return NextResponse.json(
            { success : false , error : "Missing required query parameter : workflowId"} ,
            {status : 400} ,
            );
        };

    const body = await request.json() ;

    const stripeData = {
        eventId : body.id ,
        eventType : body.type ,
        timeStamp : body.created ,
        livemode : body.livemode ,
        raw : body.data?.object ,
    } ;

    await sendWorkflowExecution({
        workflowId,
        initalData : {
            stripe : stripeData ,
        }
    }) ;
    

    return NextResponse.json({ success: true });

    }
    catch(error){
        console.error("Stripe webhook error :" , error) ;
        return NextResponse.json(
            { success : false , error : "failed to process Stripe event"} ,
            {status : 500} ,
        );
    }
}