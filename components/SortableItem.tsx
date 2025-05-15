import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

export function SortableItem(props: { id: string; imageUrl: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="relative flex h-24 w-24 items-center justify-center rounded-sm bg-white p-4 shadow-sm">
        <Image
          src={props.imageUrl}
          alt=""
          className="rounded-lg"
          fill
          objectFit="cover"
        />
      </div>
    </div>
  );
}
