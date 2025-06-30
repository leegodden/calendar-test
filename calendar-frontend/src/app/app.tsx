import styled from '@emotion/styled';

import { Route, Routes } from 'react-router-dom';
import { CalendarPage } from './pages/calendar/calendar.page';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
