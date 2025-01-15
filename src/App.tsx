import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
} from 'react-router-dom';
import Users from './pages/Users';
import Todos from './pages/Todos';
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
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Button from '@atlaskit/button/new';
import PostDetail from './pages/Post/PostDetail';
import Posts from './pages/Post/Posts';

function App() {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  // 언어 변경 함수
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // URL에 lang 파라미터 추가
    history.push(`${location.pathname}?lang=${lang}`);
    console.log('요기');
  };

  // URL에서 lang 파라미터를 가져와서 언어 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lang = params.get('lang');
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [location.search, i18n]);

  const HomeComponent = () => (
    <ProductHome
      onClick={() => console.log('home click')}
      icon={ConfluenceIcon}
      logo={ConfluenceLogo}
      siteTitle={t('title')}
    />
  );

  const LanguageSettingComponent = () => (
    <LanguageSelector key='language-selector'>
      <Button onClick={() => changeLanguage('en')}>English</Button>
      <Button onClick={() => changeLanguage('ko')}>한국어</Button>
    </LanguageSelector>
  );

  return (
    <Router>
      <PageLayout>
        {/* Atlassian Navigation */}
        <TopNavigation>
          <AtlassianNavigation
            label={''}
            primaryItems={[
              <StyledLink to='/posts' key='posts'>
                <PrimaryButton>{t('navigation.board')}</PrimaryButton>
              </StyledLink>,
              <StyledLink to='/users' key='users'>
                <PrimaryButton>{t('navigation.users')}</PrimaryButton>
              </StyledLink>,
              <StyledLink to='/todos' key='todo-list'>
                <PrimaryButton>{t('navigation.todo')}</PrimaryButton>
              </StyledLink>,
            ]}
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
                height: 'calc(100vh - 100px)',
              }}
            >
              <Switch>
                <Route exact path='/posts' component={Posts} />
                <Route exact path='/post/:id' component={PostDetail} />
                <Route path='/users' component={Users} />
                <Route path='/todos' component={Todos} />
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
  max-width: none; /* 기본 제한 해제 */
  margin: 0 auto; /* 중앙 정렬 */
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 링크의 기본 색상 상속 */
  &:hover {
    color: #333;
  }
`;

const LanguageSelector = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
`;
