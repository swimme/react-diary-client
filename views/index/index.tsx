import Layout from 'views/components/layout/index';
import { NextPage } from 'next';
import * as S from './styles';
import Sidebar from 'views/components/sidebar';
import { Post } from 'share/interfaces/post';
import MoodCalendar from './mood-calendar';

interface IndexPageProps {
  initialPosts: Post[];
  total: number;
}

const IndexPage: NextPage<IndexPageProps> = () => {
  return (
    <Layout>
      <Sidebar />
      <S.Mainpage>
        <S.CalendarContainer>
          <MoodCalendar />
        </S.CalendarContainer>
      </S.Mainpage>
    </Layout>
  );
};

export default IndexPage;
