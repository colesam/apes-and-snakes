import { isFunction } from "lodash";
import { useState } from "react";

type MergeFn<T> = (updates: Partial<T> | ((s: T) => T)) => void;

export function useMergeState<T extends object>(
  initialState: T
): [T, MergeFn<T>] {
  const [state, setState] = useState<T>(initialState);

  const mergeState: MergeFn<T> = updates => {
    if (isFunction(updates)) {
      setState(updates);
    } else {
      setState(s => ({ ...s, ...updates }));
    }
  };

  return [state, mergeState];
}
