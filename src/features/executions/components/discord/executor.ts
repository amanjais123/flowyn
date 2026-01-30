import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { DiscordChannel } from "@/inngest/channels/Discord";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const DiscordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  publish,
}) => {
  await publish(
    DiscordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Discord node : content is missing");
  }

  if (!data.webhookUrl) {
    await publish(
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Discord node : webhook url is missing");
  }

  if (!data.variableName) {
    await publish(
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Discord node : variable name is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent).slice(0, 2000);

  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    await ky.post(data.webhookUrl, {
      json: {
        content,
        username,
      },
      timeout: false,          
      throwHttpErrors: false,  
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Flowyn-Workflow-Bot/1.0",
      },
    });

    await publish(
      DiscordChannel().status({
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
      DiscordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
