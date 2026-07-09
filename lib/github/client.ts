const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN!;

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "casa-do-pastel-admin",
};

export async function getFile(path: string): Promise<{ content: string; sha: string }> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

export async function commitFile(
  path: string,
  content: string,
  message: string,
): Promise<void> {
  let sha: string | undefined;
  try {
    const existing = await getFile(path);
    sha = existing.sha;
  } catch {}

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed: ${res.status} — ${err}`);
  }
}

export async function uploadImage(
  filename: string,
  base64: string,
): Promise<string> {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const path = `public/images/products/${safe}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  let sha: string | undefined;
  try {
    const existing = await getFile(path);
    sha = existing.sha;
  } catch {}

  const body: Record<string, unknown> = {
    message: `Upload ${filename}`,
    content: base64,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Image upload failed: ${res.status}`);

  return `/images/products/${safe}`;
}
