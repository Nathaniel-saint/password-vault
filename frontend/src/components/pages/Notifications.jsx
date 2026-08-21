// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiAlertTriangle,
//   FiClock,
//   FiCheckCircle,
//   FiX,
//   FiCheck,
// } from "react-icons/fi";
// import "../../styles/page_styles/Notifications.css";
// import { api, useAuth } from "../../context/AuthContext";

// function Notification() {
//   const { accessToken } = useAuth();
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Retrieve dismissed IDs from localStorage
//   const getDismissedIds = () => {
//     try {
//       return JSON.parse(localStorage.getItem("dismissed_notifications")) || [];
//     } catch {
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (accessToken) {
//       generateDynamicNotifications();
//     }
//   }, [accessToken]);

//   const generateDynamicNotifications = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get("domain/api/");
//       const domains = response.data.results || response.data || [];
//       const dismissedIds = getDismissedIds();
//       const generatedList = [];

//       const today = new Date();

//       domains.forEach((domain) => {
//         const domainName = domain.domain_name || domain.name || "Domain";
//         const expiryDate = new Date(domain.expiry_date || domain.expiry);
//         const createdAt = domain.created_at
//           ? new Date(domain.created_at)
//           : null;

//         const diffTime = expiryDate - today;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//         // 1. Expired Domain
//         const expiredId = `expired-${domain.id}`;
//         if (diffDays <= 0 && !dismissedIds.includes(expiredId)) {
//           generatedList.push({
//             id: expiredId,
//             domainId: domain.id,
//             type: "danger",
//             title: "Domain Expired",
//             time: expiryDate.toLocaleDateString(),
//             message: `Domain ${domainName} has EXPIRED. Renew now to avoid loss of service.`,
//             actionText: "Renew Now",
//             actionType: "renew",
//             group: "Today",
//           });
//         }
//         // 2. Expiring Soon
//         else if (
//           diffDays <= 30 &&
//           !dismissedIds.includes(`expiring-${domain.id}`)
//         ) {
//           const expiringId = `expiring-${domain.id}`;
//           generatedList.push({
//             id: expiringId,
//             domainId: domain.id,
//             type: "warning",
//             title: "Expiring Soon",
//             time: `Expires in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
//             message: `Domain ${domainName} expires on ${expiryDate.toLocaleDateString()}.`,
//             actionText: "Manage",
//             actionType: "manage",
//             group: diffDays <= 7 ? "Today" : "Yesterday",
//           });
//         }

//         // 3. Domain Added
//         const addedId = `added-${domain.id}`;
//         if (createdAt && !dismissedIds.includes(addedId)) {
//           const addedDaysAgo = Math.floor(
//             (today - createdAt) / (1000 * 60 * 60 * 24),
//           );

//           let group = "Earlier";
//           if (addedDaysAgo === 0) group = "Today";
//           else if (addedDaysAgo === 1) group = "Yesterday";

//           generatedList.push({
//             id: addedId,
//             domainId: domain.id,
//             type: "success",
//             title: "Domain Added",
//             time: createdAt.toLocaleDateString(),
//             message: `Domain ${domainName} was successfully added to your portfolio.`,
//             actionText: "View Details",
//             actionType: "view",
//             group: group,
//           });
//         }
//       });

//       setNotifications(generatedList);
//     } catch (err) {
//       console.error("Failed to fetch notification data:", err);
//       setError("Failed to load notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDismiss = (id) => {
//     const updated = notifications.filter((item) => item.id !== id);
//     setNotifications(updated);

//     const dismissedIds = getDismissedIds();
//     localStorage.setItem(
//       "dismissed_notifications",
//       JSON.stringify([...dismissedIds, id]),
//     );
//   };

//   const handleMarkAllRead = () => {
//     const allIds = notifications.map((n) => n.id);
//     const dismissedIds = getDismissedIds();
//     localStorage.setItem(
//       "dismissed_notifications",
//       JSON.stringify([...new Set([...dismissedIds, ...allIds])]),
//     );
//     setNotifications([]);
//   };

//   const handleAction = (item) => {
//     // Navigate to dashboard and optionally highlight/select the specific domain
//     navigate("/dashboard", { state: { selectedDomainId: item.domainId } });
//   };

//   return (
//     <div className="notif-container">
//       <header className="notif-header">
//         <div>
//           <h2>Notifications</h2>
//           <p className="breadcrumb">Home / Notifications</p>
//         </div>
//         {notifications.length > 0 && (
//           <button className="mark-read-btn" onClick={handleMarkAllRead}>
//             <FiCheck /> Mark all as read
//           </button>
//         )}
//       </header>

//       <div className="notif-list">
//         {loading ? (
//           <p className="notif-loading">Loading notifications...</p>
//         ) : error ? (
//           <p className="error-msg">{error}</p>
//         ) : notifications.length === 0 ? (
//           <div className="notif-empty-state">
//             <p>No new notifications at this time.</p>
//           </div>
//         ) : (
//           ["Today", "Yesterday", "Earlier"].map((group) => {
//             const groupItems = notifications.filter(
//               (item) => item.group === group,
//             );
//             if (groupItems.length === 0) return null;

//             return (
//               <div key={group} className="notif-group">
//                 <h3 className="group-title">{group}</h3>
//                 <div className="cards-wrapper">
//                   {groupItems.map((item) => (
//                     <div key={item.id} className={`notif-card ${item.type}`}>
//                       <div className="notif-icon-wrapper">
//                         {item.type === "danger" && (
//                           <FiAlertTriangle className="icon-danger" />
//                         )}
//                         {item.type === "warning" && (
//                           <FiClock className="icon-warning" />
//                         )}
//                         {item.type === "success" && (
//                           <FiCheckCircle className="icon-success" />
//                         )}
//                       </div>

//                       <div className="notif-content">
//                         <div className="notif-top">
//                           <span className="notif-card-title">{item.title}</span>
//                           <span className="notif-time">{item.time}</span>
//                         </div>
//                         <p className="notif-message">{item.message}</p>
//                         {item.actionText && (
//                           <button
//                             className="notif-action-btn"
//                             onClick={() => handleAction(item)}
//                           >
//                             {item.actionText}
//                           </button>
//                         )}
//                       </div>

//                       <button
//                         className="close-btn"
//                         onClick={() => handleDismiss(item.id)}
//                         aria-label="Dismiss notification"
//                       >
//                         <FiX />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// export default Notification;
