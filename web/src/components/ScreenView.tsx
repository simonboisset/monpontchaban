import { BridgeEvent } from 'App';
import { Theme } from 'const';
import { getStatus } from 'const/getStatus';
import React from 'react';
import styled from 'styled-components';
import { BridgeEventItem } from './BridgeEventItem';
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

export const ScreenView: React.FC<ScreenViewProps> = ({ datas, children }) => {
  const status = getStatus(new Date(), datas[0].openAt, datas[0].closeAt);

  return (
    <ScreenContainer color={colorPicker[status]}>
      <Header />
      <Content>
        <StatusContainer>{children}</StatusContainer>
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
