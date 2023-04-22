import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { theme } from '../const/theme';

function GoBackIcon({ dark, ...props }: SvgProps & { dark: boolean }) {
  return (
    <Svg
      height='24px'
      width='24px'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke={dark ? theme.colors.background.main : 'white'}
      {...props}>
      <Path strokeLinecap='round' strokeLinejoin='round' d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' />
    </Svg>
  );
}

export default GoBackIcon;
