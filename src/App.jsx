import { useRoute } from './utils/router';
import { useProgress } from './utils/progress';
import Layout from './components/Layout';
import Home from './pages/Home';
import DarsList from './pages/DarsList';
import DarsPage from './pages/DarsPage';
import PorboPage from './pages/PorboPage';
import QuizPage from './pages/QuizPage';
import ExamPage from './pages/ExamPage';
import DuroodPage from './pages/DuroodPage';
import BookPage from './pages/BookPage';
import NotFound from './pages/NotFound';

export default function App() {
  const path = useRoute();
  const progress = useProgress();
  const seg = path.split('/').filter(Boolean);
  const num = (s) => (/^\d+$/.test(s || '') ? Number(s) : NaN);

  let page = <NotFound />;
  if (seg.length === 0) page = <Home progress={progress} />;
  else if (seg[0] === 'quiz') page = <QuizPage />;
  else if (seg[0] === 'exam') page = <ExamPage />;
  else if (seg[0] === 'durood') page = <DuroodPage />;
  else if (seg[0] === 'book') page = <BookPage />;
  else if (seg[0] === 'dars' && seg.length === 1) page = <DarsList progress={progress} />;
  else if (seg[0] === 'dars' && seg[1] === 'deep') page = <DarsList progress={progress} mode="deep" />;
  else if (seg[0] === 'dars' && seg.length === 2 && num(seg[1])) page = <DarsPage id={num(seg[1])} progress={progress} />;
  else if (seg[0] === 'dars' && seg.length === 3 && num(seg[1]) && num(seg[2])) page = <PorboPage id={num(seg[1])} no={num(seg[2])} progress={progress} />;

  return <Layout>{page}</Layout>;
}
