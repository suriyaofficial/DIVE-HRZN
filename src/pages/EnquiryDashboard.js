// EnquiryDashboard.jsx
import React from "react";
import {
  Table,
  Input,
  Segmented,
  Space,
  Typography,
  Tag,
  Button,
  Tooltip,
} from "antd";
import {
  CopyOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getallENQ } from "../services/api"; // adjust path

const { Search } = Input;
const { Text } = Typography;

// ---------- helpers ----------

// Convert Firestore timestamp to JS Date
const toDate = (ts) => {
  if (!ts || !ts.seconds) return null;
  const ms = ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return new Date(ms);
};

// Mask email for display
const maskEmail = (email = "") => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user.slice(0, 2)}***@${domain}`;
};

// Unique values for filters
const getUniqueValues = (data = [], key) => {
  const set = new Set();
  data.forEach((item) => {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== "") {
      set.add(value);
    }
  });
  return Array.from(set).map((value) => ({
    text: String(value),
    value,
  }));
};

// Normalize API data for table
const normalizeEnquiries = (enquiries = []) =>
  enquiries.map((e) => {
    const createdAtDate = toDate(e.createdAt);
    return {
      key: e.id || e.enqNo,
      ...e,
      createdAtDate,
      createdAtDateStr: createdAtDate
        ? createdAtDate.toISOString().split("T")[0]
        : "",
    };
  });

// Status & payment colors
const STATUS_COLORS = {
  Created: "blue",
  Assigned: "geekblue",
  Discussed: "magenta",
  "Quote Sent": "orange",
  Invoiced: "purple",
  "Service Provided": "green",
  "Service Canceled": "red",
};

const PAYMENT_COLORS = {
  "Payment Pending": "orange",
  Paid: "green",
  "Refund Pending": "purple",
  "Refund Issued": "magenta",
  "": "default",
  Null: "default",
};

const EnquiryDashboard = () => {
  const [dealFilter, setDealFilter] = React.useState("open"); // "all" | "open"
  const [emailQuery, setEmailQuery] = React.useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch enquiries with filters (deal + email)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allENQ", { dealFilter, emailQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dealFilter === "open") params.append("deal", "open");
      if (emailQuery) params.append("q", emailQuery);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await getallENQ(queryString);
      return response;
    },
    keepPreviousData: true,
  });

  const enquiries = normalizeEnquiries(data?.enquiries || []);

  const columns = React.useMemo(() => {
    return [
      {
        title: "ENQ No",
        dataIndex: "enqNo",
        key: "enqNo",
        width: 100,
        filters: getUniqueValues(enquiries, "enqNo"),
        onFilter: (value, record) => String(record.enqNo).indexOf(value) === 0,
        render: (text) => (
          <Text style={{ fontSize: 12 }} ellipsis>
            {text}
          </Text>
        ),
      },
      {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        // width: 120,
        filters: getUniqueValues(enquiries, "sku"),
        onFilter: (value, record) => String(record.sku).indexOf(value) === 0,
        render: (text) => (
          <Text style={{ fontSize: 12 }} ellipsis>
            {text}
          </Text>
        ),
      },
      {
        title: "Deal",
        dataIndex: "deal",
        key: "deal",
        width: 100,
        filters: [
          { text: "Open", value: "open" },
          { text: "Closed", value: "closed" },
        ],
        onFilter: (value, record) =>
          (record.deal || "open").toLowerCase() === value.toLowerCase(),
        render: (deal) => (
          <Tag color={deal === "closed" ? "green" : "orange"}>
            {deal === "closed" ? "Closed" : "Open"}
          </Tag>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        // width: 120,
        filters: getUniqueValues(enquiries, "email"),
        onFilter: (value, record) => String(record.email).indexOf(value) === 0,
        render: (_, record) => {
          const email = record.email;
          const masked = maskEmail(email);
          const phone = record.phoneNo || "";
          const cleanPhone = phone.replace(/[^\d]/g, "");

          const handleCopy = async () => {
            try {
              await navigator.clipboard.writeText(email);
            } catch (err) {
              console.error("Clipboard error", err);
            }
          };

          const handleWhatsApp = () => {
            if (!cleanPhone) return;
            const url = `https://wa.me/${cleanPhone}`;
            window.open(url, "_blank", "noopener,noreferrer");
          };

          return (
            <Space size="small">
              <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                {masked}
              </Text>
              <Tooltip title="Copy email">
                <Button
                  size="small"
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                />
              </Tooltip>
              <Tooltip title="WhatsApp">
                <Button
                  size="small"
                  type="text"
                  icon={<WhatsAppOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsApp();
                  }}
                  disabled={!cleanPhone}
                />
              </Tooltip>
            </Space>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        // width: 150,
        filters: getUniqueValues(enquiries, "status"),
        onFilter: (value, record) => String(record.status).indexOf(value) === 0,
        render: (status) => (
          <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
        ),
      },
      {
        title: "Payment Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        // width: 150,
        filters: getUniqueValues(enquiries, "paymentStatus"),
        onFilter: (value, record) =>
          String(record.paymentStatus).indexOf(value) === 0,
        render: (payment) => {
          const val = payment || "";
          return (
            <Tag color={PAYMENT_COLORS[val] || "default"}>
              {val || ""}
            </Tag>
          );
        },
      },
      {
        title: "Created",
        dataIndex: "createdAtDate",
        key: "createdAtDate",
        width: 120,
        sorter: (a, b) => {
          const da = a.createdAtDate ? a.createdAtDate.getTime() : 0;
          const db = b.createdAtDate ? b.createdAtDate.getTime() : 0;
          return da - db;
        },
        defaultSortOrder: "descend",
        filters: getUniqueValues(
          enquiries.map((e) => ({
            createdAtDateStr: e.createdAtDateStr,
          })),
          "createdAtDateStr"
        ),
        onFilter: (value, record) =>
          record.createdAtDateStr &&
          record.createdAtDateStr.indexOf(value) === 0,
        render: (_, record) =>
          record.createdAtDate
            ? dayjs(record.createdAtDate).format("DD/MM/YYYY")
            : "-",
      },
    ];
  }, [enquiries]);

  return (
    <div style={{ padding: 12 }}>
      <Space
        direction="vertical"
        size="small"
        // style={{ width: "100%", marginBottom: 8 }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Enquiry Dashboard
        </Text>

        {/* Top filters: email search + open/all toggle */}
        <Space
          wrap
          style={{
            // width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Search
            allowClear
            placeholder="Search by email"
            style={{ maxWidth: 280 }}
            size="small"
            onSearch={(value) => setEmailQuery(value.trim())}
            onChange={(e) => {
              if (!e.target.value) setEmailQuery("");
            }}
          />

          <Segmented
            size="small"
            options={[
              { label: "All Enquiries", value: "all" },
              { label: "Open Deals", value: "open" },
            ]}
            value={dealFilter}
            onChange={(val) => setDealFilter(val)}
          />
        </Space>
      </Space>

      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        dataSource={enquiries}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} enquiries`,
        }}
        rowKey="id"
        tableLayout="fixed"
        onRow={(record) => ({
          onClick: () => {
            navigate(`/admin/enquiries/${record.enqNo}`);
          },
        })}
      />

      {isError && (
        <Text type="danger" style={{ marginTop: 8, display: "block" }}>
          Failed to load enquiries.
        </Text>
      )}
    </div>
  );
};

export default EnquiryDashboard;
