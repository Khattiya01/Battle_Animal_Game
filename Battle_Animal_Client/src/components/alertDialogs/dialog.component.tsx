import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

type DialogComponentProps = {
  isOpen: boolean;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  content?: ReactNode;
};
export function DialogComponent({
  isOpen,
  className,
  title,
  description,
  footer,
  content,
}: DialogComponentProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        className={`${className} AlertDialogContent h-[100vh] sm:h-[90vh] `}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="AlertDialogTitle">
            <div className=" text-2xl">{title}</div>
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center  overflow-auto">{content}</div>
        {footer && (
          <AlertDialogFooter>
            {footer}
            {/* <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
