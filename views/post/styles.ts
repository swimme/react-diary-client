import styled from 'styled-components';

interface EmojiDateContainerProps {
  backgroundImage?: string;
}

export const PostContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const PostContent = styled.div`
  width: 100%;
  padding: 15px 25px;
  margin-top: 15px;
  background-color: white;
  color: black;
  line-height: 200%;

  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  min-height: 100px;
`;

export const EmojiDateContainer = styled.div<EmojiDateContainerProps>`
  background-image: url(${(props) => props.backgroundImage});
  background-size: 180px 60px;
  background-repeat: no-repeat;
  background-position: center center;
  width: 180px;
  height: 50px;
  padding-right: 15px;
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  font-weight: bolder;
  color: #453e3e;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
`;

export const EditDeleteButtonContainer = styled.div`
  width: 300px;
  display: flex;
  flex-direction: row;
`;

export const PageContentContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const OtherPosts = styled.div`
  width: 100%;
  margin-bottom: 10px;

  color: #7b6d6c;
  font-weight: 600;
  font-size: 15px;
`;

export const ListContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  padding: 15px;
  background-color: white;
  color: black;
`;
