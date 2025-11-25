import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Input, Segmented, Space, Typography } from "antd";
import { getallENQ } from "../services/api"; // adjust path
import { getUniqueValues } from "../components/utils"; // adjust path

const { Search } = Input;
const { Text } = Typography;

// Convert Firestore timestamp to JS Date
const toDate = (ts) => {
  if (!ts || !ts.seconds) return null;
  const ms = ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return new Date(ms);
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
        ? createdAtDate.toISOString().slice(0, 10) // YYYY-MM-DD
        : "",
    };
  });

const EnquiryDashboard = () => {
  const [dealFilter, setDealFilter] = React.useState("all"); // "all" | "open"
  const [emailQuery, setEmailQuery] = React.useState("");

  // Fetch enquiries with filters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allENQ", { dealFilter, emailQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dealFilter === "open") params.append("deal", "open");
      if (emailQuery) params.append("q", emailQuery);

      // Example: getallENQ handles query string
      // e.g. getallENQ("?deal=open&q=...")
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
        sorter: (a, b) => String(a.enqNo).localeCompare(String(b.enqNo)),
        filters: getUniqueValues(enquiries, "enqNo"),
        onFilter: (value, record) => String(record.enqNo).indexOf(value) === 0,
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => String(a.title).localeCompare(String(b.title)),
        filters: getUniqueValues(enquiries, "title"),
        onFilter: (value, record) => String(record.title).indexOf(value) === 0,
      },
      {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        sorter: (a, b) => String(a.sku).localeCompare(String(b.sku)),
        filters: getUniqueValues(enquiries, "sku"),
        onFilter: (value, record) => String(record.sku).indexOf(value) === 0,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
        filters: getUniqueValues(enquiries, "name"),
        onFilter: (value, record) => String(record.name).indexOf(value) === 0,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => String(a.email).localeCompare(String(b.email)),
        filters: getUniqueValues(enquiries, "email"),
        onFilter: (value, record) => String(record.email).indexOf(value) === 0,
      },
      {
        title: "Phone",
        dataIndex: "phoneNo",
        key: "phoneNo",
        sorter: (a, b) => String(a.phoneNo).localeCompare(String(b.phoneNo)),
        filters: getUniqueValues(enquiries, "phoneNo"),
        onFilter: (value, record) => String(record.phoneNo).indexOf(value) === 0,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => String(a.status).localeCompare(String(b.status)),
        filters: getUniqueValues(enquiries, "status"),
        onFilter: (value, record) => String(record.status).indexOf(value) === 0,
      },
      {
        title: "Payment Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        sorter: (a, b) =>
          String(a.paymentStatus).localeCompare(String(b.paymentStatus)),
        filters: getUniqueValues(enquiries, "paymentStatus"),
        onFilter: (value, record) =>
          String(record.paymentStatus).indexOf(value) === 0,
      },
      {
        title: "Created At",
        dataIndex: "createdAtDate",
        key: "createdAtDate",
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
            ? record.createdAtDate.toLocaleString()
            : "-",
      },
    ];
  }, [enquiries]);

  return (
    <div style={{ padding: 16 }}>
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Text strong style={{ fontSize: 18 }}>
          Enquiry Dashboard
        </Text>

        {/* Top filters: email search + open/all toggle */}
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Search
            allowClear
            placeholder="Search by email"
            style={{ maxWidth: 320 }}
            onSearch={(value) => setEmailQuery(value.trim())}
            onChange={(e) => {
              if (!e.target.value) setEmailQuery("");
            }}
          />

          <Segmented
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
        rowKey="key"
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
