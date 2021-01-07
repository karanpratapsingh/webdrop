import { useSnackbar } from 'react-simple-snackbar';

export function useNotification(): [Function, Function] {
  return useSnackbar({ position: 'bottom-center' });
}
