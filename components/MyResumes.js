"use client";

import {
  useEffect,
  useState,
} from "react";

import { getUserResumes } from "../lib/getResumes";

import {
  deleteResume,
  duplicateResume,
} from "../lib/resumeActions";

export default function MyResumes({
  user,
  onOpen,
}) {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData =
    async () => {
      setLoading(true);

      const data =
        await getUserResumes(
          user
        );

      setItems(data);

      setLoading(false);
    };

  const removeItem =
    async (id) => {
      await deleteResume(
        id
      );

      loadData();
    };

  const copyItem =
    async (
      item
    ) => {
      await duplicateResume(
        item
      );

      loadData();
    };

  if (!user)
    return null;

  return (
    <div
      className="cvp-dashboard-card"
      style={
        styles.card
      }
    >
      <div style={styles.header}>
        <div>
          <span style={styles.kicker}>Cloud dashboard</span>
          <h3 style={{ margin: 0 }}>My Resumes</h3>
        </div>
        <span style={styles.count}>{items.length} saved</span>
      </div>

      {loading && (
        <p>
          Loading...
        </p>
      )}

      {!loading &&
        items.length ===
          0 && (
          <p>
            No resumes saved yet.
          </p>
        )}

      {!loading &&
        items.map(
          (
            item
          ) => (
            <div
              className="cvp-dashboard-item"
              key={
                item.id
              }
              style={
                styles.item
              }
            >
              <strong>
                {
                  item
                    .form
                    ?.name
                }
              </strong>

              <p>
                {
                  item.template
                }
              </p>

              <p>
                ATS:{" "}
                {
                  item.ats
                }
                %
              </p>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  onClick={() =>
                    onOpen(
                      item
                    )
                  }
                  style={
                    styles.greenBtn
                  }
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    copyItem(
                      item
                    )
                  }
                  style={
                    styles.blueBtn
                  }
                >
                  Duplicate
                </button>

                <button
                  onClick={() =>
                    removeItem(
                      item.id
                    )
                  }
                  style={
                    styles.redBtn
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
    </div>
  );
}

const styles = {
  card: {
    padding: 22,
    borderRadius: 14,
    background:
      "#ffffff",
    marginBottom: 18,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },

  kicker: {
    display: "inline-block",
    marginBottom: 6,
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },

  count: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 900,
    fontSize: 12,
  },

  item: {
    padding: 14,
    borderRadius: 14,
    border:
      "1px solid #e2e8f0",
    marginTop: 12,
  },

  greenBtn: {
    padding: 10,
    borderRadius: 12,
    border: "none",
    background:
      "#059669",
    color: "#fff",
    fontWeight: 700,
  },

  blueBtn: {
    padding: 10,
    borderRadius: 12,
    border: "none",
    background:
      "#2563eb",
    color: "#fff",
    fontWeight: 700,
  },

  redBtn: {
    padding: 10,
    borderRadius: 12,
    border: "none",
    background:
      "#dc2626",
    color: "#fff",
    fontWeight: 700,
  },
};
