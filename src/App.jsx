import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      {/* <header>
        <Navbar />
      </header> */}

      <main>
          <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
