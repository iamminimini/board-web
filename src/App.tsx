import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useLocation,
  Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Posts from './pages/Post/Posts';
import Todos from './pages/Todos';
import Users from './pages/Users';
import PostDetail from './pages/Post/PostDetail';

import styled from 'styled-components';
import {
  Content,
  Main,
  PageLayout,
  TopNavigation,
} from '@atlaskit/page-layout';
import {
  AtlassianNavigation,
  PrimaryButton,
  ProductHome,
} from '@atlaskit/atlassian-navigation';
import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/logo';
import Button from '@atlaskit/button/new';
import '@atlaskit/css-reset';

function App() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const lang = location.pathname.split('/')[1];
  const navigationItems = [
    { key: 'posts', label: t('navigation.posts') },
    { key: 'users', label: t('navigation.users') },
    { key: 'todos', label: t('navigation.todos') },
  ];

  // URL에서 lang을 추출하여 언어 설정
  useEffect(() => {
    const lang = location.pathname.split('/')[1]; // ko || en 추출
    if (lang && lang !== i18n.language) {
      // lang 값에 따라 i18n 언어 설정
      i18n.changeLanguage(lang);
    }
  }, [location.pathname, i18n.language]);

  // 언어 코드만 변경하고, 나머지 경로는 그대로 유지
  const changeLanguage = (lang: string) => {
    // 현재 경로에서 언어 코드 부분을 교체하고, 쿼리 파라미터를 유지
    const path = location.pathname.replace(/^\/[a-z]{2}\//, `/${lang}/`);
    const search = location.search;
    history.push(`${path}${search}`);
  };

  // 언어 코드가 없으면 기본 언어인 'ko'로 /posts 페이지로 리다이렉트
  useEffect(() => {
    if (
      !location.pathname.startsWith('/ko') &&
      !location.pathname.startsWith('/en')
    ) {
      history.push('/ko/posts');
    }
  }, [location, history]);

  // 언어 선택 버튼
  const LanguageSettingComponent = () => (
    <LanguageButtonGroup>
      <Button onClick={() => changeLanguage('en')} isSelected={lang === 'en'}>
        {t('language_en')}
      </Button>
      <Button onClick={() => changeLanguage('ko')} isSelected={lang === 'ko'}>
        {t('language_ko')}
      </Button>
    </LanguageButtonGroup>
  );

  // 로고
  const HomeComponent = () => (
    <ProductHome
      icon={ConfluenceIcon}
      logo={ConfluenceLogo}
      siteTitle={t('title')}
    />
  );

  const NavigationListItem = navigationItems.map((item) => (
    <StyledLink to={`/${i18n.language}/${item.key}`} key={item.key}>
      <PrimaryButton>{item.label}</PrimaryButton>
    </StyledLink>
  ));

  return (
    <Router>
      <PageLayout>
        {/* Atlassian Navigation */}
        <TopNavigation>
          <AtlassianNavigation
            label={''}
            primaryItems={NavigationListItem}
            renderProductHome={HomeComponent}
          />
          <LanguageSettingComponent />
        </TopNavigation>
        {/* Main Content Area */}
        <Content testId='content'>
          <FullWidthMain id='main-content' skipLinkTitle='Main Content'>
            <div
              style={{
                padding: '10px 20px',
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Switch>
                <Route path='/:lang/post/:id' component={PostDetail} />
                <Route exact path='/:lang/todos' component={Todos} />
                <Route path='/:lang/posts' component={Posts} />
                <Route path='/:lang/users' component={Users} />
              </Switch>
            </div>
          </FullWidthMain>
        </Content>
      </PageLayout>
    </Router>
  );
}

export default App;

const FullWidthMain = styled(Main)`
  width: 100%;
  max-width: none;
  margin: 0 auto;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    color: #333;
  }
`;

// 언어 선택 버튼 (오른쪽 상단 위치 고정)
const LanguageButtonGroup = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  gap: 3px;
`;
