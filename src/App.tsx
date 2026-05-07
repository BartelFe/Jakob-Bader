import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { Landing } from './pages/Landing';

const ProjektDetail = lazy(() =>
  import('./pages/ProjektDetail').then((m) => ({ default: m.ProjektDetail })),
);
const Akademie = lazy(() => import('./pages/Akademie').then((m) => ({ default: m.Akademie })));
const AkademieEvent = lazy(() =>
  import('./pages/AkademieEvent').then((m) => ({ default: m.AkademieEvent })),
);
const Impressum = lazy(() => import('./pages/Impressum').then((m) => ({ default: m.Impressum })));
const Datenschutz = lazy(() =>
  import('./pages/Datenschutz').then((m) => ({ default: m.Datenschutz })),
);
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route
          path="werk/:slug"
          element={
            <Suspense fallback={null}>
              <ProjektDetail />
            </Suspense>
          }
        />
        <Route
          path="akademie"
          element={
            <Suspense fallback={null}>
              <Akademie />
            </Suspense>
          }
        />
        <Route
          path="akademie/:slug"
          element={
            <Suspense fallback={null}>
              <AkademieEvent />
            </Suspense>
          }
        />
        <Route
          path="impressum"
          element={
            <Suspense fallback={null}>
              <Impressum />
            </Suspense>
          }
        />
        <Route
          path="datenschutz"
          element={
            <Suspense fallback={null}>
              <Datenschutz />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
