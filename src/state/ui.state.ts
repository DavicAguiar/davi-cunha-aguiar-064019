import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const initialState: Notification = {
  message: '',
  type: 'info',
  visible: false
};

export const notification$ = new BehaviorSubject<Notification>(initialState);

export const uiActions = {
  notify: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    notification$.next({ message, type, visible: true });
    setTimeout(() => notification$.next({ ...notification$.getValue(), visible: false }), 4000);
  },
  hide: () => notification$.next({ ...notification$.getValue(), visible: false })
};