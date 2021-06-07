import styled from 'styled-components';

export const Toolbar = styled.div`
  /* background-color: white; */
  display: flex;
  background-color: white;
  border: 1px solid black;

  padding-left: 15px;

  width: 100%;
`;

export const ToolButton = styled.div<{ active: boolean }>`
  color: ${(props) => (props.active ? '#de6287' : 'gray')};
  font-size: 20px;
  padding-top: 6px;
  height: 34px;
  width: 36px;

  cursor: pointer;

  :hover,
  :focus {
    color: #de6287;
  }
`;

export const Separator = styled.hr`
  margin-right: 15px;
`;