export const u = (path) =>
  process.env.NODE_ENV === "production" ? "" : "http://localhost:2000" + path;

export const authFetch = async (url, options) => {
  const token = localStorage.getItem("token");
  const res = await fetch(u(url), {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // if (res.status === 401) {
  //   localStorage.removeItem("token");
  //   window.location.href = "/auth/login";
  // }

  return res;
};
