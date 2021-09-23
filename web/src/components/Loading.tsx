import styled from 'styled-components';
export const Loading = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background-color: ${({ theme }) => theme.colors.success.main};
`;
