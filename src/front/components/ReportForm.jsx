// import { useState } from 'react'

// export default function ReportForm({ onSubmit }) {
//   const [text, setText] = useState("")
//   const [image, setImage] = useState(null)

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (!text.trim()) return

//     const newReport = {
//       id: crypto.randomUUID(),
//       text,
//       image,
//       createdAt: new Date().toISOString(),
//       currentUserId: undefined
//     }

//     onSubmit(newReport)
//     setText("")
//     setImage(null)
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => setImage(reader.result)
//       reader.readAsDataURL(file)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="mb-4">
//       <div className="mb-3">
//         <textarea
//           className="form-control"
//           rows={3}
//           placeholder="¿Qué problema quieres reportar?"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="form-control"
//         />
//       </div>

//       <button type="submit" className="btn btn-primary w-100">
//         Publicar Reporte #sdsdcddvdsvdsgit
//       </button>
//     </form>
//   ) 
// }
