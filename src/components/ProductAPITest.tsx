import React, { useState } from 'react';
import { productService } from '../api/services/productService';

const ProductAPITest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Testing Product API...');
      
      // Test với các params khác nhau
      const tests = [
        // Test 1: Basic call
        {
          name: 'Basic getAllProducts',
          call: () => productService.getAllProducts()
        },
        // Test 2: With name sort (như backend expect)
        {
          name: 'With name sort',
          call: () => productService.getAllProducts({
            page: 0,
            size: 12,
            sortBy: 'name',
            sortDir: 'desc'
          })
        },
        // Test 3: With price sort (như Postman test)
        {
          name: 'With price sort (Postman working)',
          call: () => productService.getAllProducts({
            page: 0,
            size: 20,
            sortBy: 'price',
            sortDir: 'desc'
          })
        }
      ];

      const results = [];
      
      for (const test of tests) {
        try {
          console.log(`🧪 Testing: ${test.name}`);
          const response = await test.call();
          console.log(`✅ ${test.name} - Success:`, response);
          results.push({
            test: test.name,
            success: true,
            data: response
          });
        } catch (err) {
          console.error(`❌ ${test.name} - Error:`, err);
          results.push({
            test: test.name,
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }
      
      setResult(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Product API Test</h2>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Product API'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-4">
            <h3 className="font-semibold">API Test Results:</h3>
            {result.map((item: any, index: number) => (
              <div 
                key={index} 
                className={`p-4 border rounded ${
                  item.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <h4 className="font-medium">
                  {item.success ? '✅' : '❌'} {item.test}
                </h4>
                {item.success ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Success! Got {item.data?.data?.content?.length || 0} items
                    </p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600">
                        View Response
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(item.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <p className="text-sm text-red-600 mt-2">{item.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAPITest;
