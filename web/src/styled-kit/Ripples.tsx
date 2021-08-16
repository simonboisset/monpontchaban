import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const RIPPLE_START_SIZE = 10;

const ripple = keyframes`
0% {
  transform: scale(1);
  opacity: 0.2;
}
100% {
  transform: scale(200);
  opacity: 0;
}
`;

export const RippleContainer = styled.div`
  position: relative;
  overflow: hidden;
`;
type RippleDivProps = {
  left: number;
  top: number;
  duration?: number;
  dark?: boolean;
};
const RippleDiv = styled.div<RippleDivProps>`
  width: ${RIPPLE_START_SIZE}px;
  height: ${RIPPLE_START_SIZE}px;
  position: absolute;
  background: ${({ dark }) => (dark ? '#1f1f1f' : '#e0e0e0')};
  top: ${({ top }) => top - RIPPLE_START_SIZE / 2}px;
  left: ${({ left }) => left - RIPPLE_START_SIZE / 2}px;
  border-radius: ${RIPPLE_START_SIZE}px;
  animation: ${ripple} ${({ duration }) => duration || 1.5}s ease 1 forwards;
`;

type Ripple = { left: number; top: number; id: number };

export const useRipples = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const createRipple = (left: number, top: number) => {
    setRipples((prev) => [...prev, { left, top, id: new Date().getTime() }]);
    setTimeout(() => setRipples((prev) => prev.slice(1)), 1500);
  };
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    createRipple(e.clientX - rect.left, e.clientY - rect.top);
  };
  return { ripples, onMouseDown };
};

type RipplesProps = { ripples: Ripple[]; dark?: boolean; duration?: number };
export const Ripples: React.FC<RipplesProps> = ({ ripples, ...other }) => (
  <>
    {ripples.map((ripple) => (
      <RippleDiv {...other} key={ripple.id} left={ripple.left} top={ripple.top} />
    ))}
  </>
);
