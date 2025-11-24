import React from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { getDetail } from '../services/api';

function Detail() {
    
const { sku } = useParams();
const { data } = useQuery({
    queryKey: [`detail-${sku}`],
    queryFn: async () => {
      const response = await getDetail(sku);
      return response;
    },
  });
  return (
    <div>
        <h1>Detail Page for SKU: {sku}</h1>

      <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "10px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      
    </div>
  )
}

export default Detail
