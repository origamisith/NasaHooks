import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import { ThemeProvider} from "styled-components";
import { theme} from "cdk-radial";
import dotenv from "dotenv";


const queryClient = new QueryClient();
console.log(process.env.NASA_KEY);
ReactDOM.render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme} >
              <App/>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={true}/>
      </QueryClientProvider>

  </React.StrictMode>,
  document.getElementById('root')
);
