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

    const formData = {
        formId : body.formId ,
        formTitle : body.formTitle ,
        ResponseId : body.responseId ,
        timeStamp : body.timeStamp ,
        RespondentEmail : body.respondentEmail ,
        responses : body.responses ,
        raw : body ,
    } ;

    await sendWorkflowExecution({
        workflowId,
        initalData : {
            googleForm : formData ,
        }
    }) ;
    

    return NextResponse.json({ success: true });

    }
    catch(error){
        console.error("Google form webhook error :" , error) ;
        return NextResponse.json(
            { success : false , error : "failed to process Google form submission"} ,
            {status : 500} ,
        );
    }
}