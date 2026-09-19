const slugify = (id, title) => {
  return `${id}-${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+$/, "")}`;
};

export default slugify;
