import { UseStore } from "zustand";
import { TPeerConnectionManager } from "../peer/PeerConnectionManager";
import { TStore } from "../store/store";

declare global {
  interface Window {
    __moize__: any;
    __ZustandStore__: UseStore<TStore>;
    __PeerConnectionManager__: TPeerConnectionManager;
  }
}
