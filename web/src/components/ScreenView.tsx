import { BridgeEvent } from 'App';
import { getStatus } from 'const/getStatus';
import { Theme } from 'const/theme';
import useCurrentStatus from 'hooks/useCurrentStatus';
import React from 'react';
import styled from 'styled-components';
import { BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { Header } from './Header';
type ScreenContainerProps = {
  color?: keyof Theme['colors'];
};
const ScreenContainer = styled.div<ScreenContainerProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ color = 'success', theme }) => theme.colors[color].main};
`;
const Content = styled.div`
  display: flex;
`;
const StatusContainer = styled.div`
  display: flex;
  flex: 6;
  padding: 20px 10px 20px 20px;
`;
const EnventsContainer = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  overflow: scroll;
  height: 100vh;
  padding: 0px 20px 0px 10px;
`;
const EnventsPadding = styled.div`
  margin-top: 84px;
`;

type ScreenViewProps = { datas: BridgeEvent[] };

const colorPicker: Record<ReturnType<typeof getStatus>, keyof Theme['colors']> = {
  OPEN: 'success',
  WILL_CLOSE: 'warning',
  CLOSED: 'error',
};

export const ScreenView: React.FC<ScreenViewProps> = ({ datas }) => {
  const status = useCurrentStatus(datas[0]?.closeAt, datas[0]?.openAt);

  return (
    <ScreenContainer color={colorPicker[status]}>
      <Header />
      <Content>
        <StatusContainer>
          <BridgeStatus event={datas[0]} />
        </StatusContainer>
        <EnventsContainer>
          <EnventsPadding>
            {datas.map((data) => (
              <BridgeEventItem key={data.closeAt.getTime()} {...data} />
            ))}
          </EnventsPadding>
        </EnventsContainer>
      </Content>
    </ScreenContainer>
  );
};
