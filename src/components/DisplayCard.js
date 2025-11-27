import { Card, Button, Tag, Badge, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

export default function DisplayCard({ item }) {
  const navigate = useNavigate();

  const status = (item.status || "").toLowerCase();
  const tagProps = {
    available: { color: "green", text: "Available" },
    "coming soon": { color: "orange", text: "Coming soon" },
    "sold out": { color: "red", text: "Sold out" },
  };

  const tag = tagProps[status] || { color: "default", text: item.status || "" };

  const cardStyle =
    status === "sold out" ? { filter: "grayscale(1) opacity(0.7)" } : {};

  const handleMore = () => {
    navigate(`/scuba/${encodeURIComponent(item.SKU)}`);
  };

  const coverImg = item.photos && item.photos.length ? item.photos[0] : "";

  return (
    // <Badge.Ribbon text={tag.text} color={tag.color}>
    <Card
      onClick={handleMore}
      hoverable
      style={{
        width: 300,
        margin: "12px",
        ...cardStyle,
        position: "relative",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
      }}
      cover={
        coverImg ? (
          <img
            alt={item.title}
            src={coverImg}
            style={{ height: 180, objectFit: "cover" }}
          />
        ) : null
      }
    >
      {/* Remove absolute tag from this position */}
      <div style={{ position: "absolute", top: 12, right: 2 }}>
        <Tag key={tag.color} variant="filled" color={tag.color}>
          {tag.text}
        </Tag>
      </div>

      <Meta size="small" title={item.title} description={item.SKU} />

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
        }}
      >
        <Button type="default" size="middle" onClick={handleMore}>
          More details
        </Button>
      </div>
    </Card>
    // </Badge.Ribbon>
  );
}
