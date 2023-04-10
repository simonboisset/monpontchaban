import 'styled-components';
import { Theme } from '../src/const/theme';
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
