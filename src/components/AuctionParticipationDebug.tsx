// Test component để debug routing
import { useParams } from "react-router-dom";

const AuctionParticipationDebug = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  
  return (
    <div className="p-8">
      <h1>Auction Participation Debug</h1>
      <p>Auction ID from URL: {auctionId}</p>
      <p>Current URL: {window.location.href}</p>
      <p>Current pathname: {window.location.pathname}</p>
    </div>
  );
};

export default AuctionParticipationDebug;
