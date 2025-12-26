import i18n from '../localization/i18n';

export const getLocalizedValue = (item, field) => {
  if (!item) return '';

  const lang = i18n.language || 'en';

  return lang.startsWith('fr')
    ? item?.[`${field}_fr`] || item?.[`${field}_en`] || ''
    : item?.[`${field}_en`] || item?.[`${field}_fr`] || '';
};
