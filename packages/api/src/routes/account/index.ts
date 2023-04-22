import { createRouter } from '../../config/api';
import { addDevice } from './addDevice';
import { confirmUserDeletion } from './confirmUserDeletion';
import { deleteDevice } from './deleteDevice';
import { getDevices } from './getDevices';
import { requestUserDeletion } from './requestUserDeletion';

export const devices = createRouter({
  getDevices,
  addDevice,
  deleteDevice,
});

export const deleteUser = createRouter({
  requestUserDeletion,
  confirmUserDeletion,
});
