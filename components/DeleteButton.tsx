import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

type Props = { label: string; onDelete: () => void; disabled?: boolean };

const DeleteButton = ({ label, onDelete, disabled = false }: Props) => {
  const [showConfirm, setshowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="popup">
        <div className="fixed top-0 left-0 z-50 h-screen w-screen bg-black/50 backdrop-blur-sm">
          <div className="fixed top-1/2 left-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 shadow-md duration-200 dark:bg-gray-900">
            <div className="font-bold">Are you sure you want to delete ?</div>
            <div className="mx-auto mt-2 flex justify-center gap-2">
              <Button variant={"outline"} onClick={() => setshowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  if (!disabled) {
                    onDelete();
                  }
                  setshowConfirm(false);
                }}
              >
                Yes delete!
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button
        type="button"
        disabled={disabled}
        size={"sm"}
        variant={"destructive"}
        onClick={() => setshowConfirm(true)}
      >
        {label}
        <Trash2 />
      </Button>
    </div>
  );
};

export default DeleteButton;
