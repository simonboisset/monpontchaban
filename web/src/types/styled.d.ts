import { Theme } from 'const';
import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
