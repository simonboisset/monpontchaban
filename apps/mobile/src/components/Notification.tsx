import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { theme } from '../const/theme';

function Notification({ dark, ...props }: SvgProps & { dark: boolean }) {
  return (
    <Svg height='24px' width='24px' viewBox='0 0 24 24' fill='none' {...props}>
      <Path
        d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'
        fill={dark ? theme.colors.background.main : 'white'}
      />
    </Svg>
  );
}

export default Notification;
