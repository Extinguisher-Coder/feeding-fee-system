
import React from 'react'

const CashierReconciliationPage = () => {
  return (
    <div>
      <h1> This page is currently under development</h1>
    </div>
  )
}

export default CashierReconciliationPage



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CashierReconciliationPage.css';

// const CashierReconciliationPage = () => {
//   const [data, setData] = useState([]);
//   const [termName, setTermName] = useState('');
//   const [terms, setTerms] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

//   const fetchTerms = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/terms`);
//       if (res.data && Array.isArray(res.data)) {
//         setTerms(res.data.map(term => term.termName));
//       }
//     } catch (error) {
//       console.error('Error fetching terms:', error);
//     }
//   };

//   const fetchCurrentTerm = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/terms/current`);
//       if (res.data && res.data.termName) {
//         setTermName(res.data.termName);
//       }
//     } catch (error) {
//       console.error('Error fetching current term:', error);
//     }
//   };

//   const fetchReconciliation = async () => {
//     if (!termName) return;

//     const url = `${API_BASE_URL}/reports/cashier-reconciliation?termName=${encodeURIComponent(termName)}`;
//     try {
//       setLoading(true);
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to fetch reconciliation data');

//       const result = await response.json();
//       const processed = result.summary.map((week) => {
//         const cashiers = Object.entries(week.cashierSummary || {}).map(([cashier, totalAmount]) => ({
//           cashier,
//           totalAmount: totalAmount ?? 0,
//           accounted: 0, // Placeholder to be replaced by API data in future
//         }));
//         return { ...week, cashiers };
//       });

//       setData(processed);
//     } catch (error) {
//       console.error('Error fetching cashier reconciliation data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTerms();
//     fetchCurrentTerm();
//   }, []);

//   useEffect(() => {
//     fetchReconciliation();
//   }, [termName]);

//   const calculateGrandTotal = () => {
//     return data.reduce((total, week) => total + (week.totalAmount || 0), 0);
//   };

//   return (
//     <div className="cashier-page">
//       <h1 className="title">Cashier Reconciliation Report</h1>

//       <div className="term-input">
//         <label className="label">Select Term:</label>
//         <select
//           value={termName}
//           onChange={(e) => setTermName(e.target.value)}
//           className="input-box"
//         >
//           <option value="">-- Select Term --</option>
//           {terms.map((term, index) => (
//             <option key={index} value={term}>{term}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="loading-container">
//           <div className="loader-icon"></div> Loading...
//         </div>
//       ) : (
//         <div className="table-container">
//           <table className="reconciliation-table">
//             <thead>
//               <tr>
//                 <th>Week</th>
//                 <th>Date Range</th>
//                 <th>Amount Collected (GHS)</th>
//                 <th>Cashier Breakdown</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="text-center">No data available</td>
//                 </tr>
//               ) : (
//                 data.map((week, index) => (
//                   <tr key={index}>
//                     <td>{week.week}</td>
//                     <td>{week.range}</td>
//                     <td className="text-right">GHS {Number(week.totalAmount || 0).toFixed(2)}</td>
//                     <td>
//                       {week.cashiers.length > 0 ? (
//                         <table className="nested-table">
//                           <thead>
//                             <tr>
//                               <th>Cashier</th>
//                               <th>Amount</th>
//                               <th>Accounted</th>
//                               <th>Difference</th>
//                               <th>Status</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {week.cashiers.map((cashier, i) => {
//                               const amount = Number(cashier.totalAmount ?? 0);
//                               const accounted = Number(cashier.accounted ?? 0);
//                               const difference = amount - accounted;

//                               let status = 'Balanced';
//                               if (difference > 0) status = 'Unbalanced';
//                               else if (difference < 0) status = 'Overbalanced';

//                               return (
//                                 <tr key={i}>
//                                   <td>{cashier.cashier}</td>
//                                   <td className="text-right">GHS {amount.toFixed(2)}</td>
//                                   <td className="text-right">GHS {accounted.toFixed(2)}</td>
//                                   <td className="text-right">GHS {difference.toFixed(2)}</td>
//                                   <td className={`status ${status.toLowerCase()}`}>{status}</td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       ) : (
//                         <span className="text-muted">No payments recorded</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan="2"><strong>Grand Total</strong></td>
//                 <td className="text-right"><strong>GHS {calculateGrandTotal().toFixed(2)}</strong></td>
//                 <td colSpan="2"></td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CashierReconciliationPage;
