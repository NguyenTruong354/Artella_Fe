import ServiceCard from "./ServiceCard"; // Import the new component

const ServiceSection = () => {
  const services = [
    {
      icon: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527208/icon_1_p0wx61.png",
      title: "Atelier Collection",
      subtitle: "Curated Masterpieces",
      description: "Discover authentic artworks with NFT provenance — each piece a window into the artist's soul, preserved eternally on blockchain.",
      buttonText: "Enter Gallery",
      bgColor: "from-[#e2eff7] to-[#f0f7ff]",
      textColor: "text-[#3a5269]",
    },
    {
      icon: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527209/icon_2_e5hotf.png", 
      title: "Auction House",
      subtitle: "Live Auction Experience",
      description: "Immerse in the theatrical dance of live bidding — where passion meets art in moments of breathtaking anticipation.",
      buttonText: "Join Auction",
      bgColor: "from-[#f7efd9] to-[#fff8e7]",
      textColor: "text-[#6c6344]",
    },
    {
      icon: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527213/icon_3_nhggmt.webp",
      title: "Heritage Exchange",
      subtitle: "Provenance & Legacy",
      description: "Transfer art with its complete story — each transaction a new chapter in the artwork's immortal journey through time.",
      buttonText: "Explore Legacy",
      bgColor: "from-[#f7e5e5] to-[#fff0f0]",
      textColor: "text-[#8e5a5a]",
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#f8ede3] to-[#f0e6d8] py-8 md:py-12 relative overflow-hidden min-h-screen flex items-center">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-serif text-[#46594f] relative z-10 tracking-wider mb-2"
                style={{ 
                  textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '0.02em'
                }}>
              Our Services
            </h2>
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full" />
          </div>
          <p className="text-lg md:text-xl font-light italic text-[#6d7f75] mt-6 max-w-2xl mx-auto leading-relaxed">
            "Where artistic expression merges with blockchain innovation"
            <br />
            <span className="text-base text-[#8a9690] not-italic mt-2 block">
              Bridging traditional art with digital transformation
            </span>
          </p>
        </div>
          {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
