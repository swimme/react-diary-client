import Layout from 'views/components/layout/index';
import Sidebar from 'views/components/sidebar';
import React from 'react';
import router from 'next/router';
import ThemeButton from 'views/components/theme-button';
import { NextPage } from 'next';
import { PagedPosts, Post } from 'share/interfaces/post';
import { GetServerSideProps } from 'next';
import { MOOD_ICONS, MoodIcon } from 'common/constant';
import Image from 'next/image';
import postAPI from 'common/api/postAPI';
import DraftViewer from 'views/components/editor-viewer';
import * as S from './styles';
import PostList from 'views/components/post-list';

interface PostViewPageProps {
  post: Post;
  initialPosts: Post[];
  total: number;
}

const PostViewPage: NextPage<PostViewPageProps> = ({ post, initialPosts, total }) => {
  const moodIcon: MoodIcon = MOOD_ICONS.find((icon) => icon.id === post.moodId);
  const bgHandler = React.useMemo(() => {
    switch (post.moodId) {
      case 1:
        return '/pastelpink.png';
      case 2:
        return '/pastelyellow.png';
      case 3:
        return '/pastelblue.png';
    }
  }, [post.moodId]);

  const deletePost = () => {
    const deleteCheck = confirm('삭제된 글은 복구가 불가능합니다.\n글을 삭제하시겠습니까?');
    if (!deleteCheck) return;
    else {
      const result = postAPI.deletePost(post.id);
      if (!result) alert('글이 삭제되지 않았습니다. 잠시 후 다시 시도해주세요 :)');
      router.replace('/');
    }
  };

  const updatePost = () => {
    router.push(`/post/${post.id}/edit`);
  };

  const goMainPage = () => {
    router.push('/');
  };

  return (
    <Layout>
      <Sidebar />
      <S.PageContentContainer>
        <S.PostContainer>
          <S.EmojiDateContainer backgroundImage={bgHandler}>
            <Image src={`/${moodIcon.src}`} width={'35px'} height={'35px'} />{' '}
            {post.createdAt.slice(0, 10)}​
          </S.EmojiDateContainer>
          <S.PostContent>
            <DraftViewer rawPostContent={post.content} />​
          </S.PostContent>
        </S.PostContainer>
        <S.ButtonContainer>
          <ThemeButton width={'150px'} text={'홈으로'} onClick={goMainPage} isBrownTheme={true} />
          <S.EditDeleteButtonContainer>
            ​<ThemeButton text={'수정하기'} onClick={updatePost} isBrownTheme={true} />
            ​<ThemeButton text={'삭제하기'} onClick={deletePost} isBrownTheme={false} />​
          </S.EditDeleteButtonContainer>
        </S.ButtonContainer>
        <S.ListContainer>
          <S.OtherPosts>목록 보기</S.OtherPosts>
          <PostList initialPosts={initialPosts} total={total} />​
        </S.ListContainer>
      </S.PageContentContainer>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  const item = await postAPI.getPostById(parseInt(id as string));
  const data: PagedPosts = await postAPI.getAllPostsByPage(1);

  if (!item)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  if (!data) {
    return { props: { total: 0, initialPosts: [], moodCounts: [] } };
  }

  const { total, posts } = data;
  return { props: { total, post: item, initialPosts: posts } };
};

export default PostViewPage;
