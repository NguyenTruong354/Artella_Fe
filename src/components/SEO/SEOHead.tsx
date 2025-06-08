import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  canonical?: string;
}

const SEOHead: React.FC<SEOProps> = ({
  title = "NFT Collections - Smart Market | Discover Premium Digital Art",
  description = "Explore extraordinary NFT collections from world-class creators. Discover, trade, and collect premium digital art, rare collectibles, and exclusive digital assets on Smart Market.",
  keywords = "NFT, NFT collections, digital art, blockchain, crypto art, collectibles, ethereum, smart contracts, digital marketplace, rare NFTs",
  image = "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
  url = "https://smart-market.netlify.app/collections",
  type = "website",
  author = "Smart Market Team",
  publishedTime,
  modifiedTime,
  structuredData,
  noIndex = false,
  canonical
}) => {
  const siteName = "Smart Market";
  const twitterHandle = "@smartmarket";
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="generator" content="Vite + React" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:site" content={twitterHandle} />
      
      {/* DNS Prefetch & Preconnect */}
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* iOS Safari specific */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
    </Helmet>
  );
};

export default SEOHead;
