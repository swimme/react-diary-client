import Layout from 'views/components/layout/index';
import { NextPage } from 'next';
import * as S from './styles';
import Sidebar from 'views/components/sidebar';
import postAPI from 'common/api/postAPI';
import { PagedPosts, Post } from 'share/interfaces/post';
import MoodCalendar from './mood-calendar';
import DiaryBox from 'views/components/post-list/diary-box';
import { usePagedPosts } from 'views/components/post-list/hooks';
import ReactPaginate from 'react-paginate';
import EmptyBox from 'views/components/post-list/empty-box';

interface IndexPageProps {
  initialPosts: Post[];
  total: number;
}

const IndexPage: NextPage<IndexPageProps> = ({ initialPosts, total }) => {
  const { pageCount, changePage, pagedPosts } = usePagedPosts({ initialPosts, total });

  return (
    <Layout>
      <Sidebar />
      <S.Mainpage>
        <S.CalendarContainer>
          <MoodCalendar />
        </S.CalendarContainer>

        <S.DiaryListContainer>
          <S.Diaryinfo>목록 보기</S.Diaryinfo>
          <S.DiaryListContainer>
            <S.DiaryBoxContainer>
              {pagedPosts.length ? (
                pagedPosts.map((post) => {
                  return <DiaryBox key={post.id} post={post} />;
                })
              ) : (
                <EmptyBox />
              )}
            </S.DiaryBoxContainer>
            <S.Pgbox>
              {pageCount > 0 && (
                <ReactPaginate
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={3}
                  previousLabel={'이전'}
                  nextLabel={'다음'}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={'pagebtn'}
                  activeClassName={'page_active_btn'}
                />
              )}
            </S.Pgbox>
          </S.DiaryListContainer>
        </S.DiaryListContainer>
      </S.Mainpage>
    </Layout>
  );
};

export default IndexPage;

export async function getServerSideProps() {
  const data: PagedPosts = await postAPI.getAllPostsByPage(1);

  if (!data) {
    return { props: { total: 0, initialPosts: [] } };
  }

  const { total, posts } = data;

  return {
    props: { total, initialPosts: posts },
  };
}
