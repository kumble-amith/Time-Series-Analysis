import { X } from "lucide-react";
import React, { PureComponent, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";

export default function Graph({ data }) {
  const [dataView, setDataView] = useState(data["points"]);

  const handleBrushChange = ({ startIndex, endIndex }) => {
    setDataView(data["points"].slice(startIndex, endIndex + 1));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart width={500} height={300} data={data["points"]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="py"
          stroke="#8884d8"
          name="Predicted Data"
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#82ca9d"
          name="Actual Data"
          activeDot={{ r: 4 }}
        />
        <Brush
          dataKey={"x"}
          height={30}
          stroke="#8884d8"
          onChange={handleBrushChange}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// export default function Graph({ data }) {
//     return (
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart width={500} height={300} data={data["points"]}>
//           <CartesianGrid />
//           <XAxis dataKey="x" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="py"
//             stroke="#8884d8"
//             activeDot={{ r: 8 }}
//           />

//           <Line type="monotone" dataKey="y" stroke="#82ca9d" />
//         </LineChart>
//       </ResponsiveContainer>
//     );
//   }
