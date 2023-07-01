import { memo } from 'react';
import { Routes, Route } from 'react-router-dom';

import ErrorPage from '/routes/common/ErrorPage';
import Container from '/components/Container';
import Home from './pages/Home';
import DetailedImage from '/routes/pages/DetailedImage';

const Routing = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />

      <Route path='/images/${imageId}' element={<DetailedImage />} />

      {/* Fallback */}
      <Route
        path='*'
        element={
          <Container showErrorPage>
            <ErrorPage statusCode={404} />
          </Container>
        }
      />
    </Routes>
  );
};

export default memo(Routing);
