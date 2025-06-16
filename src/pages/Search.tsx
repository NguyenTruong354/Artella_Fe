import React from 'react';
import { Helmet } from 'react-helmet-async';
import NFTSearchComponent from '../components/NFTSearch';
import MainLayout from '../layouts/MainLayout';

const SearchPage: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Search NFTs | Smart Market</title>
        <meta name="description" content="Search for digital art NFTs on Smart Market" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Search Digital Art NFTs
        </h1>
        <NFTSearchComponent />
      </div>
    </MainLayout>
  );
};

export default SearchPage;
