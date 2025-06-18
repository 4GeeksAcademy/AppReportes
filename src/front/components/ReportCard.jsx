// import { useState, useEffect } from 'react'

// export default function ReportCard({ report, currentUserId }) {
//   const [likes, setLikes] = useState(report.likes || 0)
//   const [likedByUser, setLikedByUser] = useState(false)
//   const [comments, setComments] = useState(report.comments || [])
//   const [newComment, setNewComment] = useState('')
//   const [usersWhoLiked, setUsersWhoLiked] = useState(report.usersWhoLiked || [])

//   useEffect(() => {
//     setLikedByUser(usersWhoLiked.includes(currentUserId))
//   }, [usersWhoLiked, currentUserId])

//   const handleLike = () => {
//     if (likedByUser) return
//     setLikes(likes + 1)
//     setLikedByUser(true)
//     setUsersWhoLiked([...usersWhoLiked, currentUserId])
//   }

//   const handleAddComment = (e) => {
//     e.preventDefault()
//     const trimmed = newComment.trim()
//     if (!trimmed) return
//     setComments([...comments, trimmed])
//     setNewComment('')
//   }

//   return (
//     <div className="d-flex justify-content-center my-4">
//       <div className="card w-100" style={{ maxWidth: '24rem' }}>
//         <div className="card-header d-flex align-items-center">
//           <div className="rounded-circle bg-secondary me-2" style={{ width: '36px', height: '36px' }} />
//           <div className="fw-semibold">Usuario Anónimo</div>
//         </div>
//         {report.image && (
//           <div className="ratio ratio-1x1 bg-dark overflow-hidden">
//             <img src={report.image} alt="Reporte" className="card-img-top object-fit-cover" />
//           </div>
//         )}
//         <div className="card-body">
//           <button onClick={handleLike} disabled={likedByUser} className="btn btn-link p-0 mb-2">
//             {likedByUser ? '❤️' : '🤍'} Me gusta
//           </button>
//           <p className="mb-2 fw-medium">{likes} me gusta</p>
//           <p className="card-text mb-3">{report.text}</p>
//           <ul className="list-unstyled mb-3">
//             {comments.map((comment, idx) => (
//               <li key={idx} className="mb-1">
//                 <span className="fw-semibold">Usuario:</span> {comment}
//               </li>
//             ))}
//           </ul>
//           <form onSubmit={handleAddComment} className="d-flex">
//             <input
//               type="text"
//               placeholder="Agrega un comentario..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               className="form-control me-2"
//             />
//             <button type="submit" className="btn btn-primary">
//               Publicar
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }