import { Theme } from 'src/const/theme';
import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
