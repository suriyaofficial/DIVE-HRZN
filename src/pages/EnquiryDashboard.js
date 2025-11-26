import React from "react";
import {
  Table,
  Input,
  Segmented,
  Space,
  Typography,
  InputNumber,
  DatePicker,
  Checkbox,
  Select,
  Tag,
  Button,
  Tooltip,
} from "antd";
import {
  CopyOutlined,
  WhatsAppOutlined,
  LinkOutlined,
  SaveOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getallENQ, updateEnquiry } from "../services/api"; // adjust path

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

// Status colors
const STATUS_COLORS = {
  "Created": "default",
  "Assigned": "blue",
  "Discussed": "cyan",
  "Quote Sent": "orange",
  "Invoiced": "purple",
  "Service Provided": "green",
  "Service Canceled": "red",
};

const PAYMENT_COLORS = {
  "Payment Pending": "orange",
  "Paid": "green",
  "Refund Pending": "purple",
  "Refund Issued": "magenta",
  "Null": "default",
  "": "default",
};

const STATUS_OPTIONS = [
  "Created",
  "Assigned",
  "Discussed",
  "Quote Sent",
  "Invoiced",
  "Service Provided",
  "Service Canceled",
];

const PAYMENT_OPTIONS = [
  "Payment Pending",
  "Paid",
  "Refund Pending",
  "Refund Issued",
  "Null",
];

// ---------- component ----------

const EnquiryDashboard = () => {
  const [dealFilter, setDealFilter] = React.useState("all"); // "all" | "open"
  const [emailQuery, setEmailQuery] = React.useState("");
  const [editedRows, setEditedRows] = React.useState({}); // { [enqId]: { field: value } }

  const queryClient = useQueryClient();

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

  // Mutation to save an enquiry's edits
  const updateMutation = useMutation({
    mutationFn: ({ enqId, updates }) => updateEnquiry(enqId, updates),
    onSuccess: (_, variables) => {
      // Clear edited state for that row
      setEditedRows((prev) => {
        const copy = { ...prev };
        delete copy[variables.enqId];
        return copy;
      });
      // Refetch all enquiries
      queryClient.invalidateQueries({ queryKey: ["allENQ"] });
    },
  });

  const handleFieldChange = (enqId, field, value) => {
    setEditedRows((prev) => ({
      ...prev,
      [enqId]: {
        ...(prev[enqId] || {}),
        [field]: value,
      },
    }));
  };

  const getFieldValue = (record, field) =>
    editedRows[record.id]?.[field] !== undefined
      ? editedRows[record.id][field]
      : record[field];

  const isRowDirty = (record) => {
    const edits = editedRows[record.id];
    if (!edits) return false;
    return Object.entries(edits).some(([field, value]) => {
      return value !== record[field];
    });
  };

  const handleSaveRow = (record) => {
    const edits = editedRows[record.id] || {};
    const changed = {};

    Object.entries(edits).forEach(([field, value]) => {
      if (value !== record[field]) {
        changed[field] = value;
      }
    });

    if (Object.keys(changed).length === 0) return;

    updateMutation.mutate({
      enqId: record.id,
      updates: changed,
    });
  };

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
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        filters: getUniqueValues(enquiries, "sku"),
        onFilter: (value, record) => String(record.sku).indexOf(value) === 0,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        filters: getUniqueValues(enquiries, "email"),
        onFilter: (value, record) => String(record.email).indexOf(value) === 0,
        render: (_, record) => {
          const email = record.email;
          const masked = maskEmail(email);
          const phone = record.phoneNo || "";
          const cleanPhone = phone.replace(/[^\d]/g, ""); // remove + and spaces

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
              <Text type="secondary" style={{ fontSize: 12 }}>
                {masked}
              </Text>
              <Tooltip title="Copy email">
                <Button
                  size="small"
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                />
              </Tooltip>
              <Tooltip title="WhatsApp">
                <Button
                  size="small"
                  type="text"
                  icon={<WhatsAppOutlined />}
                  onClick={handleWhatsApp}
                  disabled={!cleanPhone}
                />
              </Tooltip>
            </Space>
          );
        },
      },
      {
        title: "Group Size",
        dataIndex: "groupSize",
        key: "groupSize",
        render: (_, record) => {
          const value = getFieldValue(record, "groupSize") ?? 0;
          return (
            <InputNumber
              min={0}
              max={99}
              value={value}
              size="small"
              onChange={(val) => handleFieldChange(record.id, "groupSize", val)}
              // style={{ width: "100%" }}
            />
          );
        },
      },
      {
        title: "Preferred Date",
        dataIndex: "preferredDate",
        key: "preferredDate",
        sorter: (a, b) =>
          String(a.preferredDate || "").localeCompare(
            String(b.preferredDate || "")
          ),
        render: (_, record) => {
          const value = getFieldValue(record, "preferredDate");
          const dateValue = value ? dayjs(value) : null;
          return (
            <DatePicker
              size="small"
              value={dateValue}
              format="YYYY-MM-DD"
              onChange={(_, dateString) =>
                handleFieldChange(record.id, "preferredDate", dateString || "")
              }
            />
          );
        },
      },
      
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: getUniqueValues(enquiries, "status"),
        onFilter: (value, record) => String(record.status).indexOf(value) === 0,
        render: (_, record) => {
          const status = getFieldValue(record, "status") || "Created";
          return (
            <Select
            variant="borderless"
              size="small"
              value={status}
              onChange={(val) => handleFieldChange(record.id, "status", val)}
              style={{ width: "100%" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <Select.Option key={s} value={s}>
                  <Tag color={STATUS_COLORS[s] || "default"}>{s}</Tag>
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: "Payment Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        filters: getUniqueValues(enquiries, "paymentStatus"),
        onFilter: (value, record) =>
          String(record.paymentStatus).indexOf(value) === 0,
        render: (_, record) => {
          const currentStatus =
            getFieldValue(record, "status") || record.status || "Created";
          const canEditPayment = !["Created", "Assigned", "Discussed"].includes(
            currentStatus
          );

          let payment = getFieldValue(record, "paymentStatus");
          if (!payment) payment = "Null";

          return (
            <Select
              size="small"
              variant="borderless"
              value={payment}
              disabled={!canEditPayment}
              onChange={(val) =>
                handleFieldChange(
                  record.id,
                  "paymentStatus",
                  val === "Null" ? "" : val
                )
              }
              style={{ width: "100%" }}
            >
              {PAYMENT_OPTIONS.map((s) => (
                <Select.Option key={s} value={s}>
                  <Tag color={PAYMENT_COLORS[s] || "default"}>{s}</Tag>
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: "Quote / Invoice",
        dataIndex: "link",
        key: "link",
        render: (_, record) => {
          const value = getFieldValue(record, "link") || "";
          const hasValue = !!value;
          const openLink = () => {
            if (!hasValue) return;
            window.open(value, "_blank", "noopener,noreferrer");
          };
          return (
            <Space.Compact style={{ width: "100%" }}>
              <Input
                size="small"
                value={value}
                placeholder="link"
                onChange={(e) =>
                  handleFieldChange(record.id, "link", e.target.value)
                }
              />
              <Tooltip title="Open link">
                <Button
                  size="small"
                  icon={<LinkOutlined />}
                  onClick={openLink}
                  disabled={!hasValue}
                />
              </Tooltip>
            </Space.Compact>
          );
        },
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
      },{
        title: "Swimming",
        dataIndex: "knowSwimming",
        key: "knowSwimming",
        filters: getUniqueValues(enquiries, "knowSwimming"),
                onFilter: (value, record) => String(record.knowSwimming).indexOf(value) === 0,

        render: (_, record) => {
          const raw = getFieldValue(record, "knowSwimming");
          const checked = raw === true || raw === "Yes";
          return (
            <Checkbox
              checked={checked}
              onChange={(e) =>
                handleFieldChange(
                  record.id,
                  "knowSwimming",
                  e.target.checked ? "Yes" : ""
                )
              }
            >
              Yes
            </Checkbox>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        render: (_, record) => {
          const dirty = isRowDirty(record);
          const loading =
            updateMutation.isPending &&
            updateMutation.variables?.enqId === record.id;

          return (
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              disabled={!dirty || updateMutation.isPending}
              loading={loading}
              onClick={() => handleSaveRow(record)}
            >
              Save
            </Button>
          );
        },
      },
    ];
  }, [enquiries, editedRows, updateMutation.isPending]);

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
        rowKey="id"
        scroll={{ x: "max-content" }}
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
