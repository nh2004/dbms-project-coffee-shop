// import React, { useState } from "react";

// const queries = [
//     { key: "most_viewed_2010", text: "Which movie was the most viewed in 2010?" },
//     { key: "top_director", text: "Who is the top director of all time?" }
// ];

// const QuerySelector = ({ onQuerySelect }) => {
//     const [selectedQuery, setSelectedQuery] = useState("");

//     const handleChange = (e) => {
//         const query = e.target.value;
//         setSelectedQuery(query);
//         if (onQuerySelect) {
//             onQuerySelect(query);
//         } else {
//             console.error("onQuerySelect is not defined!");
//         }
//     };

//     return (
//         <div>
//             <label>Select a Query:</label>
//             <select value={selectedQuery} onChange={handleChange}>
//                 <option value="">-- Choose --</option>
//                 {queries.map((q) => (
//                     <option key={q.key} value={q.key}>{q.text}</option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// export default QuerySelector;
