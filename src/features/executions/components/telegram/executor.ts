import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { telegramChannel } from "@/inngest/channels/telegram";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type TelegramData = {
  variableName?: string;
  botToken?: string;
  chatId?: string;
  content?: string;
};

export const TelegramExecutor: NodeExecutor<TelegramData> = async ({
  data,
  nodeId,
  context,
  publish,
}) => {
  await publish(
    telegramChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    throw new NonRetriableError("Telegram node: content is missing");
  }

  if (!data.botToken) {
    throw new NonRetriableError("Telegram node: bot token is missing");
  }

  if (!data.chatId) {
    throw new NonRetriableError("Telegram node: chat id is missing");
  }

  if (!data.variableName) {
    throw new NonRetriableError("Telegram node: variable name is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const text = decode(rawContent).slice(0, 4096); // Telegram limit

  try {
    const response = await ky
      .post(`https://api.telegram.org/bot${data.botToken}/sendMessage`, {
        json: {
          chat_id: data.chatId,
          text,
          parse_mode: "Markdown",
        },
        timeout: 10000,
      })
      .json<{
        ok: boolean;
        description?: string;
      }>();

    // ✅ IMPORTANT: Validate Telegram response
    if (!response.ok) {
      throw new NonRetriableError(
        response.description || "Telegram API error"
      );
    }

    await publish(
      telegramChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        messageContent: text,
      },
    };
  } catch (error) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
