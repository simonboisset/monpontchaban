// Inspired by react-hot-toast library
import * as React from 'react';
import { Theme } from './Theme';

const TOAST_LIMIT = 1;
const TOAST_DISMISS_DELAY = 3_000;
const TOAST_REMOVE_DELAY = 4_0000;

type ToasterToast = {
  id: string;
  title: string;
  message?: string;
  color?: Theme.Color;
  open?: boolean;
  duration?: number;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type Action =
  | {
      type: 'ADD_TOAST';
      toast: ToasterToast;
    }
  | {
      type: 'OPEN_TOAST';
      toastId?: ToasterToast['id'];
    }
  | {
      type: 'DISMISS_TOAST';
      toastId?: ToasterToast['id'];
    }
  | {
      type: 'REMOVE_TOAST';
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST': {
      const { toast } = action;
      setTimeout(() => {
        dispatch({
          type: 'OPEN_TOAST',
          toastId: toast.id,
        });
      }, 100);
      setTimeout(() => {
        dispatch({
          type: 'DISMISS_TOAST',
          toastId: toast.id,
        });
      }, toast.duration || TOAST_DISMISS_DELAY);

      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    }
    case 'DISMISS_TOAST': {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t)),
      };
    }
    case 'REMOVE_TOAST': {
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
    }
    case 'OPEN_TOAST': {
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: true } : t)),
      };
    }
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  dispatch({
    type: 'ADD_TOAST',
    toast: { ...props, id, open: false },
  });

  return { id };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return { ...state, toast };
}

export { toast, useToast };
