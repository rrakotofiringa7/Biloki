/**
 * Récupère le token CSRF depuis la balise meta du document.
 * Lève une erreur explicite si la balise est absente.
 */
export function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
        throw new Error('CSRF token meta tag is missing from app.blade.php');
    }
    return meta.content;
}
