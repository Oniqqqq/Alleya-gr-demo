// Central helper for locally stored visual materials (public/img).
// All images are local placeholders generated in the site's visual style;
// swap the files (keeping names) or update paths here when real materials arrive.
export const img = (file: string): string => `${import.meta.env.BASE_URL}img/${file}`;
