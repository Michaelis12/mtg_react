/**
 * Décode les entités HTML dans le chemin d'image et retourne l'URL complète
 * @param {string} imagePath - Le chemin de l'image (peut contenir des entités HTML)
 * @returns {string} - L'URL complète de l'image
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Décoder les entités HTML
    const decodedPath = imagePath.replace(/&#x2F;/g, '/');
    
    // Vérifier si c'est un chemin uploads
    if (decodedPath.startsWith('/uploads/')) {
        return `http://54.77.12.209:8081${decodedPath}`;
    }
    
    // Sinon retourner le chemin tel quel (pour les images locales ou base64)
    return imagePath;
};

/**
 * Retourne l'URL complète pour l'avatar d'un utilisateur
 * @param {string} avatarPath - Le chemin de l'avatar
 * @returns {string} - L'URL complète de l'avatar
 */
export const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    
    // Vérifier si c'est un chemin uploads
    if (avatarPath.startsWith('/uploads/')) {
        return `http://54.77.12.209:8081${avatarPath}`;
    }
    
    // Sinon retourner le chemin tel quel (pour les images locales ou base64)
    return avatarPath;
}; 

/**
 * Retourne l'URL complète pour l'image d'un deck
 * @param {string} deckImagePath - Le chemin de l'image du deck
 * @returns {string} - L'URL complète de l'image du deck
 */
export const getDeckImageUrl = (deckImagePath) => {
    if (!deckImagePath) return '';
    
    // Vérifier si c'est un chemin uploads
    if (deckImagePath.startsWith('/uploads/')) {
        return `http://54.77.12.209:8081${deckImagePath}`;
    }
    
    // Sinon retourner le chemin tel quel (pour les images locales ou base64)
    return deckImagePath;
}; 
