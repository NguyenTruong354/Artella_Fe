import React from 'react';
import TrendingNFTs from '../components/Home/TrendingNFTs';

const TrendingNFTsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Component sử dụng API trending NFTs */}
        <TrendingNFTs limit={12} className="mb-8" />
        
        {/* Thông tin về API */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            📋 Thông tin API được sử dụng
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Endpoint: GET /api/nfts/trending
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <div><strong>Tham số:</strong> limit (mặc định: 10)</div>
              <div><strong>Phương thức:</strong> GET</div>
              <div><strong>Response:</strong> List&lt;DigitalArtNFT&gt;</div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              🔧 Cách sử dụng
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <div>1. Import hook: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">useTrendingNFTs</code></div>
              <div>2. Sử dụng trong component: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">const &#123;nfts, loading, error&#125; = useTrendingNFTs(10)</code></div>
              <div>3. Render dữ liệu hoặc loading/error states</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNFTsDemo;
