import { isUndefined } from "@/utils";
import { modelOptions } from "@/hooks";

export const config = {
  runtime: "edge",
};

const getEnvProxyUrl = () => {
  const API_PROXY = process.env.NEXT_PUBLIC_OPENAI_API_PROXY;
  if (!API_PROXY) return "";
  if (API_PROXY[API_PROXY.length - 1] === "/")
    return API_PROXY.slice(0, API_PROXY.length - 1);
  return API_PROXY;
};

const handler = async (req: Request) => {
  // first use local
  // then use env configuration
  // or empty
  const Authorization =
    req.headers.get("Authorization") ||
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    "";

  const { proxyUrl, model, temperature, max_tokens, chat_list } =
    await req.json();

  const findModel = modelOptions.find((item) => {
    return item.children.find((val) => val.value === model);
  });

  if (!findModel) {
    return new Response("Error", { status: 500, statusText: "error" });
  }

  const ENV_API_PROXY = getEnvProxyUrl();

  const proxy = proxyUrl || ENV_API_PROXY || "https://api.openai.com";

  const fetchURL = proxy + "/v1/chat/completions";

  console.log(fetchURL, "fetchURL");

  const response = await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
    },
    method: "POST",
    body: JSON.stringify({
      stream: true,
      model: model.split("-").slice(1).join("-"),
      temperature: isUndefined(temperature) ? 1 : temperature,
      max_tokens: isUndefined(max_tokens) ? 2000 : max_tokens,
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
        },
        ...chat_list,
      ],
    }),
  });

  return new Response(response.body);
};

export default handler;