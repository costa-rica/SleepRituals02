import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const CustomizeAudioIcon: React.FC<IconProps> = ({
  width = 25,
  height = 25,
  color = '#C3B5D2',
}) => (
  <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
    <Path
      d="M5.80002 19.6281V5.37212H8.44002V19.6281H5.80002ZM11.08 24.3801V0.620117H13.72V24.3801H11.08ZM0.52002 14.8761V10.1241H3.16002V14.8761H0.52002ZM16.36 19.6281V5.37212H19V19.6281H16.36ZM21.64 14.8761V10.1241H24.28V14.8761H21.64Z"
      fill={color}
    />
  </Svg>
);

export const PauseButtonIcon: React.FC<IconProps> = ({
  width = 33,
  height = 39,
  color = '#E5D6F5',
}) => (
  <Svg width={width} height={height} viewBox="0 0 33 39" fill="none">
    <Rect
      x="2.26904"
      y="3.15186"
      width="10.4359"
      height="35.1025"
      rx="2.84615"
      fill={color}
      fillOpacity="0.7"
    />
    <Rect
      x="20.2944"
      y="3.15186"
      width="10.4359"
      height="35.1025"
      rx="2.84615"
      fill={color}
      fillOpacity="0.7"
    />
  </Svg>
);

export const ControlsButtonIcon: React.FC<IconProps> = ({
  width = 27,
  height = 25,
  color = '#C3B5D2',
}) => (
  <Svg width={width} height={height} viewBox="0 0 27 25" fill="none">
    <Path
      d="M15.976 12.5005H1.71997"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M25.4798 12.5005H20.7278"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M25.4799 4.18408H11.2239"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.47197 4.18408H1.71997"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M25.4799 20.8169H11.2239"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.47197 20.8169H1.71997"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.3518 14.8765C19.6641 14.8765 20.7278 13.8127 20.7278 12.5005C20.7278 11.1883 19.6641 10.1245 18.3518 10.1245C17.0396 10.1245 15.9758 11.1883 15.9758 12.5005C15.9758 13.8127 17.0396 14.8765 18.3518 14.8765Z"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.84792 6.56011C10.1602 6.56011 11.2239 5.49633 11.2239 4.18411C11.2239 2.87188 10.1602 1.80811 8.84792 1.80811C7.5357 1.80811 6.47192 2.87188 6.47192 4.18411C6.47192 5.49633 7.5357 6.56011 8.84792 6.56011Z"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.84792 23.1929C10.1602 23.1929 11.2239 22.1291 11.2239 20.8169C11.2239 19.5047 10.1602 18.4409 8.84792 18.4409C7.5357 18.4409 6.47192 19.5047 6.47192 20.8169C6.47192 22.1291 7.5357 23.1929 8.84792 23.1929Z"
      stroke={color}
      strokeWidth="1.782"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
