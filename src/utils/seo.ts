// filepath: d:\Project_Nodejs\Smart_Market\src\utils\seo.ts

export interface Collection {
  id: number;
  name: string;
  description: string;
  items: number;
  floorPrice: string;
  volume: string;
  image: string;
  verified: boolean;
  trending: boolean;
  category: string;
  creator: string;
  createdDate: string;
  likes: number;
  views: number;
  tags: string[];
  salesVolume: string;
  totalOwners: number;
}

export const generateCollectionsStructuredData = (
  collections: Collection[],
  searchTerm?: string,
  activeFilter?: string
) => {
  const baseUrl = "https://smart-market.netlify.app";
  
  // WebSite Schema with Search Action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Smart Market",
    "description": "Premium NFT marketplace for digital art and collectibles",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/collections?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Smart Market",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Smart Market",
    "description": "Leading NFT marketplace for premium digital art and collectibles",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo.png`
    },
    "sameAs": [
      "https://twitter.com/smartmarket",
      "https://discord.gg/smartmarket",
      "https://instagram.com/smartmarket"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@smartmarket.com"
    }
  };

  // CollectionPage Schema
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": searchTerm 
      ? `NFT Collections matching "${searchTerm}"` 
      : activeFilter && activeFilter !== "all"
        ? `${activeFilter} NFT Collections`
        : "NFT Collections - Smart Market",
    "description": `Discover ${collections.length} premium NFT collections featuring digital art, collectibles, and exclusive digital assets.`,
    "url": `${baseUrl}/collections`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": collections.length,
      "itemListElement": collections.slice(0, 10).map((collection, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "@id": `${baseUrl}/collection/${collection.id}`,
          "name": collection.name,
          "description": collection.description,
          "image": collection.image,
          "creator": {
            "@type": "Person",
            "name": collection.creator
          },
          "dateCreated": collection.createdDate,
          "genre": collection.category,
          "keywords": collection.tags.join(", "),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "ratingCount": collection.likes,
            "bestRating": "5",
            "worstRating": "1"
          },
          "offers": {
            "@type": "Offer",
            "price": collection.floorPrice.replace(" ETH", ""),
            "priceCurrency": "ETH",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Collections",
          "item": `${baseUrl}/collections`
        }
      ]
    }
  };

  return {
    website: websiteSchema,
    organization: organizationSchema,
    collectionPage: collectionPageSchema
  };
};

export const generateSEOTitle = (
  searchTerm?: string,
  activeFilter?: string
) => {
  if (searchTerm && activeFilter && activeFilter !== "all") {
    return `"${searchTerm}" in ${activeFilter} - NFT Collections | Smart Market`;
  }
  
  if (searchTerm) {
    return `"${searchTerm}" NFT Collections - Search Results | Smart Market`;
  }
  
  if (activeFilter && activeFilter !== "all") {
    return `${activeFilter} NFT Collections - Premium Digital Art | Smart Market`;
  }
  
  return "NFT Collections - Discover Premium Digital Art | Smart Market";
};

export const generateSEODescription = (
  searchTerm?: string,
  activeFilter?: string,
  collectionCount?: number
) => {
  if (searchTerm && activeFilter && activeFilter !== "all") {
    return `Found ${collectionCount} ${activeFilter.toLowerCase()} NFT collections matching "${searchTerm}". Explore premium digital art, rare collectibles, and exclusive NFTs on Smart Market.`;
  }
  
  if (searchTerm) {
    return `Search results for "${searchTerm}" - ${collectionCount} NFT collections found. Discover premium digital art and rare collectibles from top creators.`;
  }
  
  if (activeFilter && activeFilter !== "all") {
    return `Explore ${collectionCount} premium ${activeFilter.toLowerCase()} NFT collections. Discover digital art, rare collectibles, and exclusive assets from verified creators.`;
  }
  
  return `Discover ${collectionCount} extraordinary NFT collections from world-class creators. Trade premium digital art, rare collectibles, and exclusive digital assets on Smart Market.`;
};

export const generateKeywords = (
  activeFilter?: string,
  searchTerm?: string,
  topCollections?: Collection[]
) => {
  const baseKeywords = [
    "NFT collections",
    "digital art",
    "blockchain art",
    "crypto collectibles",
    "ethereum NFT",
    "smart contracts",
    "digital marketplace",
    "rare NFTs",
    "collectible art",
    "digital assets"
  ];

  if (activeFilter && activeFilter !== "all") {
    baseKeywords.unshift(`${activeFilter.toLowerCase()} NFT`, `${activeFilter.toLowerCase()} digital art`);
  }

  if (searchTerm) {
    baseKeywords.unshift(`${searchTerm} NFT`, `${searchTerm} collection`);
  }

  if (topCollections && topCollections.length > 0) {
    const topCreators = topCollections.slice(0, 3).map(c => c.creator);
    const topTags = topCollections.flatMap(c => c.tags).slice(0, 5);
    baseKeywords.push(...topCreators, ...topTags);
  }

  return baseKeywords.slice(0, 15).join(", ");
};

export const getCanonicalUrl = (searchTerm?: string, activeFilter?: string) => {
  const baseUrl = "https://smart-market.netlify.app/collections";
  
  const params = new URLSearchParams();
  if (searchTerm) params.set('search', searchTerm);
  if (activeFilter && activeFilter !== 'all') params.set('category', activeFilter);
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
