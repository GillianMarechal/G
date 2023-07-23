import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Icon from "@/components/icon";
import { cn } from "@/lib";
import type { ChannelModel } from "@/hooks/useChannel/types";

export interface AvatarProps {
  role: "user" | "assistant" | "system";
  model?: ChannelModel;
  user?: any;
}

function renderAssistantIcon(model?: ChannelModel) {
  if (!model?.type) return null;

  const { type, name } = model;

  if (type === "openai") {
    return (
      <div
        className={cn("rounded-full flex h-8 w-8 justify-center items-center", {
          "bg-[#20a37f]": name.startsWith("gpt-3"),
          "bg-[#a26bf7]": name.startsWith("gpt-4"),
        })}
      >
        <div className="h-8 w-8 flex justify-center items-center">
          <Icon icon="openai" size={20} className="text-white" />
        </div>
      </div>
    );
  }
  if (type === "azure") {
    return (
      <div className="rounded-full flex bg-sky-200/70 h-8 w-8 justify-center items-center">
        <div className="h-8 w-8 flex justify-center items-center">
          <Icon icon="azure" size={20} className="text-white" />
        </div>
      </div>
    );
  }

  return null;
}

export default function Avatar(props: AvatarProps) {
  const session = useSession();

  const user = session.data?.user;

  const { role, model } = props;

  if (role === "assistant") return renderAssistantIcon(model);

  if (role === "user") {
    return (
      <div
        className={cn(
          "rounded-full flex h-8 w-8 justify-center items-center",
          "bg-black/25 dark:bg-slate-50"
        )}
      >
        {user?.image ? (
          <Image
            className="rounded-full"
            src={user.image}
            alt="Avatar"
            width={32}
            height={32}
          />
        ) : (
          <Icon
            icon="user_3_fill"
            className="text-white dark:text-neutral-600"
          />
        )}
      </div>
    );
  }

  return null;
}
