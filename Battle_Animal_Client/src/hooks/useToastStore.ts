import { ReactNode } from "react";
import { create } from "zustand";

export enum typeStatusTaost {
  "success",
  "error",
  "notification-cookies",
}
interface ToastState {
  open: boolean;
  message: ReactNode;
  title: string;
  eventDate: Date;
  status: typeStatusTaost;
  show: (
    title: string,
    message: ReactNode,
    eventDate: Date,
    status: typeStatusTaost,
    duration?: number
  ) => void;
  hide: () => void;
  duration?: number;
}

const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: "",
  title: "",
  eventDate: new Date(),
  status: typeStatusTaost.success,
  show: (
    title: string,
    message: ReactNode,
    eventDate: Date,
    status: typeStatusTaost,
    duration?: number
  ) => set({ open: true, title, message, eventDate, status, duration }),
  hide: () => set({ open: false }),
  duration: 3000,
}));

export default useToastStore;
