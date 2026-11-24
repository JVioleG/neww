"use client";
import { useState } from "react";

const bulan = [
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember",
];

function formatTanggal(d) {
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()} | ${jam}.${menit}`;
}

// deadline disimpan sebagai string "YYYY-MM-DDTHH:mm", atau "" jika belum diisi
function formatDeadline(value) {
  return value ? formatTanggal(new Date(value)) : "-";
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const judul = text.trim();
    if (!judul) return;

    setTasks([
      { id: Date.now(), judul, waktu: formatTanggal(new Date()), deadline: "" },
      ...tasks,
    ]);
    setText("");
  }

  function handleDelete(id) {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingId === id) cancelEdit();
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditText(task.judul);
    setEditDeadline(task.deadline);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setEditDeadline("");
  }

  function saveEdit(id) {
    const judul = editText.trim();
    if (!judul) return;
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, judul, deadline: editDeadline } : t
      )
    );
    cancelEdit();
  }

  function handleKeyDown(e, id) {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  }

  return (
    <main className="card">
      <h1>Planner.ig</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write here to (hopefully) remember"
          required
        />
        <button className="add">Add</button>
      </form>

      <ul>
        {tasks.map((t) => {
          const isEditing = editingId === t.id;

          return (
            <li key={t.id}>
              <div className="info">
                {isEditing ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, t.id)}
                    autoFocus
                  />
                ) : (
                  <b>{t.judul}</b>
                )}
                <small>Waktu penambahan</small>
                <small>{t.waktu}</small>
               

                {isEditing ? (
                  <div className="deadline-edit">
                    <small>Deadline:</small>
                    <input
                      type="datetime-local"
                      className="edit-input"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, t.id)}
                    />
                    {editDeadline && (
                      <button
                        type="button"
                        className="clear-deadline"
                        onClick={() => setEditDeadline("")}
                      >
                        Hapus deadline
                      </button>
                    )}
                  </div>
                ) : (
                  <small>Deadline: {formatDeadline(t.deadline)}</small>
                )}
              </div>

              <div className="actions">
                {isEditing ? (
                  <>
                    <button className="save" onClick={() => saveEdit(t.id)} title="Simpan">✔</button>
                    <button className="cancel" onClick={cancelEdit} title="Batal">✖</button>
                  </>
                ) : (
                  <>
                    <button className="del" onClick={() => handleDelete(t.id)} title="Hapus">Delete</button>
                    <button className="edit" onClick={() => startEdit(t)} title="Edit">Edit</button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}