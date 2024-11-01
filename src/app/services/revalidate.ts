export const revalidate = async (path: string) => {
  return fetch("/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.REVALIDATE_SECRET,
      path,
    }),
  }).then((res) => res.json());
};
