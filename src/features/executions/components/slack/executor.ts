import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const SlackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  publish,
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Slack node : content is missing");
  }

  if (!data.webhookUrl) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Slack node : webhook url is missing");
  }

  if (!data.variableName) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Slack node : variable name is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent).slice(0, 2000);


  try {
    await ky.post(data.webhookUrl, {
      json: {
       text :  content
            },
      timeout: false,          
      throwHttpErrors: false,  
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Flowyn-Workflow-Bot/1.0",
      },
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        messageContent: content,
      },
    };
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
