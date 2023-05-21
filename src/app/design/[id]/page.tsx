import { prisma } from "@/lib/prisma";

import Editor from "@/components/Editor";

type Props = {
  params: { id: string };
};

export default async function Design({ params }: Props) {
  const { flow } = await prisma.conversationTemplate.findUniqueOrThrow({
    where: { id: parseInt(params.id) },
  });

  return (
    <div className="flex" style={{ height: "75vh" }}>
      <Editor
        initialNodes={(flow as any).nodes}
        initialEdges={(flow as any).edges}
      />
    </div>
  );
}
