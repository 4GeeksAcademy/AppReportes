import React from "react";

const posts = [
  {
    id: 1,
    user: {
      name: "Juan Pérez",
      avatar: "https://i.pravatar.cc/50?img=10",
    },
    imageUrl: "https://placehold.co/600x400",
    title: "Bache enorme en la calle principal",
    likes: 34,
    positiveVotes: 40,
    negativeVotes: 5,
    comments: [
      { id: 1, user: "Ana", text: "¡Gracias por reportarlo!" },
      { id: 2, user: "Carlos", text: "Lo vi ayer, muy peligroso." },
    ],
  },
  {
    id: 2,
    user: {
      name: "María López",
      avatar: "https://i.pravatar.cc/50?img=20",
    },
    imageUrl: "https://placehold.co/600x400",
    title: "Luminaria rota en el parque",
    likes: 18,
    positiveVotes: 20,
    negativeVotes: 2,
    comments: [
      { id: 3, user: "Luis", text: "Hay que arreglarla rápido." },
    ],
  },
];

export const Feed = () => {
  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Feed de Reportes</h2>

      {posts.map((post) => (
        <div key={post.id} className="card mb-4 shadow-sm">
          <div className="card-header d-flex align-items-center">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="rounded-circle me-2"
              width={40}
              height={40}
            />
            <strong>{post.user.name}</strong>
          </div>

          <img
            src={post.imageUrl}
            className="card-img-top"
            alt={post.title}
            style={{ objectFit: "cover", height: 300 }}
          />

          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="me-3">
                  👍 {post.positiveVotes}
                </span>
                <span>
                  👎 {post.negativeVotes}
                </span>
              </div>

              <button className="btn btn-outline-danger btn-sm">
                ❤️ {post.likes}
              </button>
            </div>

            <div>
              <h6>Comentarios:</h6>
              {post.comments.length === 0 ? (
                <p className="text-muted">No hay comentarios aún.</p>
              ) : (
                post.comments.map((c) => (
                  <p key={c.id} className="mb-1">
                    <strong>{c.user}:</strong> {c.text}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
