"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function createConversationTemplate(data: FormData) {
  const title = data.get("name") as string;
  const description = data.get("description") as string;

  const newObj = await prisma.conversationTemplate.create({
    data: {
      title,
      description,
      flow: { nodes: [], edges: [] },
    },
    select: { id: true },
  });

  redirect(`/design/${newObj.id}`);
}

export async function updateConversationTemplate(
  id: number,
  data: { nodes: any[]; edges: any[] }
) {
  await prisma.conversationTemplate.update({
    where: { id },
    data: {
      flow: data,
    },
    select: { id: true },
  });
}
