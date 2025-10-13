export const buildQuery = (
  nameFilter,
  textFilter,
  manaCostMin,
  manaCostMax,
  colorsFilter,
  formatsFilter,
  raritiesFilter,
  typesFilter,
  legendaryFilter,
  editionsFilter
) => {
  let queryParts = [];

  if (nameFilter && nameFilter.trim() !== '') {
    queryParts.push(`name:${nameFilter.trim()}`);
  }

  if (textFilter && textFilter.trim() !== '') {
    queryParts.push(`oracle:${textFilter.trim()}`);
  }


  // Filtre CMC min
  if (manaCostMin && manaCostMin.trim() !== '') {
    queryParts.push(`cmc>=${manaCostMin.trim()}`);
  }

  // Filtre CMC max
  if (manaCostMax && manaCostMax.trim() !== '') {
    queryParts.push(`cmc<=${manaCostMax.trim()}`);
  }

  // Filtre couleur exact (ci=ub)
  if (colorsFilter && colorsFilter.length > 0) {
    const colorStr = colorsFilter.join(''); // ['U','B'] => 'ub'
    queryParts.push(`ci=${colorStr}`);
  }

  // Filtre format
  if (formatsFilter && formatsFilter.length > 0) {
    const formatQueries = formatsFilter.map(format => `legal:${format}`);
    queryParts.push(`(${formatQueries.join(' OR ')})`);
  }

  // Filtre rareté
  if (raritiesFilter && raritiesFilter.length > 0) {
    const rarityQueries = raritiesFilter.map(r => `r:${r}`);
    queryParts.push(`(${rarityQueries.join(' OR ')})`);
  }

  // Filtre type
  if (typesFilter && typesFilter.length > 0) {
    const typeQueries = typesFilter.map(type =>
      type.includes(' ') ? `type:"${type}"` : `type:${type}`
    );
    queryParts.push(`(${typeQueries.join(' OR ')})`);
  }

  // Filtre légendaire
  if (legendaryFilter) {
    queryParts.push(`type:legendary`);
  }

  // ✅ Filtre éditions
  if (editionsFilter && editionsFilter.length > 0) {
    const editionQueries = editionsFilter.map(setCode => `set:${setCode}`);
    queryParts.push(`(${editionQueries.join(' OR ')})`);
  }

  // Si aucun filtre n’est actif, on retourne "*"
  if (queryParts.length === 0) {
    return '*';
  }

  return queryParts.join(' ');
};
