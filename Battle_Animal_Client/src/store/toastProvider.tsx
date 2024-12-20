import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import useToastStore, { typeStatusTaost } from "@/hooks/useToastStore";
import "./styles.css";
import { IoMdClose } from "react-icons/io";

const ToastProvider: React.FC = () => {
  const { open, title, message, hide, status, duration } = useToastStore();

  return (
    <Toast.Provider swipeDirection={"up"} duration={duration ?? 3000}>
      <Toast.Root
        className={`  
          ${status === typeStatusTaost.success ? "ToastRoot" : ""} 
          ${status === typeStatusTaost.error ? "ToastRoot-error" : ""} 
          ${
            status === typeStatusTaost["notification-cookies"]
              ? "ToastRoot-notification-cookies"
              : ""
          } 
         `}
        open={open}
        onOpenChange={hide}
      >
        <Toast.Title className="ToastTitle">
          <div>{title}</div>
        </Toast.Title>
        <Toast.Description asChild>
          {/* <time className="ToastDescription" dateTime={eventDate.toISOString()}>
            {prettyDate(eventDate)}
          </time> */}
          <div>
            {message}
            {/* {status === typeStatusTaost["notification-cookies"]} */}
          </div>
        </Toast.Description>
        {status === typeStatusTaost["notification-cookies"] ? null : (
          <Toast.Action
            className="ToastAction cursor-pointer"
            asChild
            altText="Undo action"
          >
            <IoMdClose />
          </Toast.Action>
        )}
      </Toast.Root>
      <Toast.Viewport
        className={
          status === typeStatusTaost["notification-cookies"]
            ? "ToastViewport-noti"
            : "ToastViewport"
        }
      />
    </Toast.Provider>
  );
};

export default ToastProvider;
