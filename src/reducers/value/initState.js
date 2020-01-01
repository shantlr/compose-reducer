import { branch } from '../flow/branch';
import { setValue } from './setValue';

export const initState = valueResolver =>
  branch(state => state === undefined, setValue(null, valueResolver));
