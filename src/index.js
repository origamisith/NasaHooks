import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";


const queryClient = new QueryClient();
console.log(process.env.NASA_KEY);
ReactDOM.render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <App/>
          <ReactQueryDevtools initialIsOpen={true}/>
      </QueryClientProvider>

  </React.StrictMode>,
  document.getElementById('root')
);
