import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="grid min-h-screen content-center place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-aha-green-light text-white">
        <img className="w-40 h-40" alt="carbon track" src="/png/logo.png" />
        <h2 className="self-center font-bold text-white text-3xl">Oops!</h2>
        <p className="text-xl p-2 mb-2">Sorry, an unexpected error has occurred.</p>
        <p className="text-xl p-2 mb-2">{error.statusText || error.data}</p>
      </main>
    );
  } else {
    return (
      <main className="grid min-h-screen content-center place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-aha-green-light text-white">
        <img className="w-40 h-40" alt="carbon track" src="/png/logo.png" />
        <h2 className="self-center font-bold text-white text-3xl">Oops!</h2>
        <p className="text-xl p-2 mb-2">Sorry, an unexpected error has occurred.</p>
        <p className="text-xl p-2 mb-2"><i>{(error as Error).message}</i></p>
      </main>
    );
  }
};

export default ErrorPage;
